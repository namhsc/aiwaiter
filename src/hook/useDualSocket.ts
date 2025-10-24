import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// 🔧 Config endpoint
const SOCKET_CS_ENDPOINT = "https://dev.dxconnect.lifesup.ai";
const SOCKET_MESSAGE_ENDPOINT = "https://dev.dx-socket.lifesup.ai";

// 🔧 Thông tin kết nối
const AI_ID = "656f52e6-ddf0-467e-beaf-59e4850f82c1";
const DOMAIN = "lifesup.vn";

// 🧩 Interface định nghĩa kiểu dữ liệu
export interface UserInfo {
  id?: string;
  name?: string;
  [key: string]: any;
}

export interface PartitionResponse {
  conversation_id: string;
  partition_ordinal: string;
}

export interface ChatMessageAI {
  conversation_id: string;
  data_reply: {
    id: string;
    conversation_id: string;
    author: string;
    content: string;
    agent_id: boolean;
    created_at: string;
    creator: boolean;
    message_state: boolean;
    ai_id: string;
    cost: number;
  };
  content: {
    id: string;
    conversation_id: string;
    author: string;
    content: string;
    agent_id: boolean;
    created_at: string;
    creator: boolean;
    message_state: boolean;
    ai_id: string;
    cost: number;
  };
}

export interface IncomingMessage {
  type: string;
  content: ChatMessageAI;
}

export interface OutgoingMessage {
  author: {
    type: "user";
    data_info: string | null;
  };
  content: string;
  interactive: boolean;
  action_id: string | null;
  internal: boolean;
  debug: boolean;
  preview: boolean;
  partition_ordinal: string | number | null;
}

// 🧠 Hook chính
export default function useDualSocket() {
  const [partitionOrdinal, setPartitionOrdinal] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessageAI[]>([]);
  const socketCs = useRef<Socket | null>(null);
  const [isConnectSocketCs, setIsConectSocketCs] = useState(false);
  const socketMessage = useRef<Socket | null>(null);
  const [typing, setTyping] = useState(false);
  const stompClientRef = useRef<any>(null);
  const [messMngtCard, setMessMngtCard] = useState<any[]>([]);
  const [dataSocketPlus, setDataSocketPlus] = useState<any>({});

  useEffect(() => {
    // 🔍 Kiểm tra nếu đã có trong localStorage
    let savedId = localStorage.getItem("conversationId");

    if (!savedId) {
      // 🚀 Nếu chưa có → tạo mới và lưu lại
      savedId = uuidv4();
      localStorage.setItem("conversationId", savedId);
      console.log("🆕 Created new conversationId:", savedId);
    } else {
      console.log("♻️ Loaded existing conversationId:", savedId);
    }

    setConversationId(savedId);
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://123.30.149.66:8800/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Kết nối thành công tới Spring WebSocket");
        // const mesTMP = {
        //   sender: "System-add-card",
        //   content: `"{'num_people': 1, 'selected_dishes': [{'id_dish': 'mn5', 'quantity': 3}], 'notes': None}"`,
        // };
        // console.log("mesTMP", mesTMP);
        // setMessMngtCard([mesTMP]);

        client.subscribe("/topic/messages", (msg) => {
          console.log("📩 Nhận:", JSON.parse(msg.body));
          setMessMngtCard((prev) => [JSON.parse(msg.body), ...prev]);
        });

        // // gửi thử tin nhắn
        // client.publish({
        //   destination: "/app/send",
        //   body: JSON.stringify({ sender: "Boss", content: "Hello Spring!" }),
        // });
      },
    });

    client.activate();
    stompClientRef.current = client;

    // 🧹 Cleanup khi unmount
    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    const query = {
      ai_id: AI_ID,
      domain: DOMAIN,
      user: null,
    };

    socketCs.current = io(SOCKET_CS_ENDPOINT, { query });
    socketMessage.current = io(SOCKET_MESSAGE_ENDPOINT, { query });

    // 5️⃣ Lắng nghe partition_ordinal
    socketMessage.current.on("partition_ordinal", (data: PartitionResponse) => {
      setPartitionOrdinal(data.partition_ordinal);
    });

    // 6️⃣ Lắng nghe message
    socketCs.current.on("message", (msg: IncomingMessage) => {
      handleIncomingMessage(msg);
    });

    // 6️⃣ Lắng nghe message
    socketMessage.current.on("message", (msg: IncomingMessage) => {
      handleCheckDone(msg);
    });

    // 3️⃣ Khi CS socket connect
    socketCs.current.on("connect", () => {
      console.log("✅ Connected to CS Socket");
      setIsConectSocketCs(true);
      socketCs.current?.emit("join_room_conversation", {
        prevConversationId: null,
        conversationId,
      });
    });

    // 4️⃣ Khi Message socket connect
    socketMessage.current.on("connect", () => {
      console.log("✅ Connected to Message Socket");
      socketMessage.current?.emit("join_room_conversation", {
        prevConversationId: null,
        conversationId,
      });
    });

    // 🧹 Cleanup khi unmount
    return () => {
      socketCs.current?.disconnect();
      socketMessage.current?.disconnect();
    };
  }, [conversationId]);

  const handleCheckDone = (dataMess: IncomingMessage) => {
    if (!dataMess) return;
    const content = dataMess?.content;
    const conversation_id = content?.conversation_id;
    const innerContent = content?.content;

    const isDone = innerContent?.content === "DONE";

    if (conversation_id === conversationId && isDone) {
      setTyping(false);
    }
  };

  // 🧩 Hàm xử lý tin nhắn nhận được
  const handleIncomingMessage = (msg: IncomingMessage) => {
    const { type, content } = msg;
    if (!msg) return;
    if (!type || !content) return;
    const { conversation_id } = content;

    switch (type) {
      case "NEW_MESSAGE_CS_CHAT_PAUSE":
        console.log("⏸️ AI paused response");
        break;

      case "message/new_for_query_chat":
        if (conversation_id === conversationId) {
          setMessages((prev) => [...prev, content]);
        }
        break;

      default:
        console.log("⚙️ Unknown message type:", msg);
        break;
    }
  };

  // 💬 Gửi tin nhắn đến AI
  const sendMessage = (text: string) => {
    if (!socketCs.current) {
      console.warn("⛔ Cannot send message: socket not ready");
      return;
    }

    const message_chat: OutgoingMessage = {
      author: {
        type: "user",
        data_info: null,
      },
      content: text,
      interactive: false,
      action_id: null,
      internal: false,
      debug: false,
      preview: false,
      partition_ordinal: partitionOrdinal,
      ...dataSocketPlus,
    };

    socketCs.current.emit("query_chat_message", message_chat, {
      conversationId,
    });
  };

  return {
    messages,
    sendMessage,
    partitionOrdinal,
    conversationId,
    typing,
    setTyping,
    messMngtCard,
    isConnectSocketCs,
    setDataSocketPlus,
  };
}
