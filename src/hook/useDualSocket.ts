import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

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
  content: string;
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
export default function useDualSocket(user: UserInfo | null) {
  const [partitionOrdinal, setPartitionOrdinal] = useState<string | null>(null);
  const [conversationId] = useState<string>(uuidv4());
  const [messages, setMessages] = useState<ChatMessageAI[]>([]);
  const socketCs = useRef<Socket | null>(null);
  const socketMessage = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;
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
      console.log("meg socketMessage", msg);
    });

    // 3️⃣ Khi CS socket connect
    socketCs.current.on("connect", () => {
      console.log("✅ Connected to CS Socket");
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

  // 🧩 Hàm xử lý tin nhắn nhận được
  const handleIncomingMessage = (msg: IncomingMessage) => {
    const { type, content } = msg;
    console.log("msg handleIncomingMessage", content);
    console.log("msg type", type);
    if (!type) return;
    const { conversation_id } = content;

    switch (type) {
      case "NEW_MESSAGE_CS_CHAT":
        if (content?.content?.includes("DONE")) {
          console.log("✅ AI finished response");
          return;
        }
        break;

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
    };

    console.log("📤 Sending message:", message_chat);
    console.log("socketCs.current", socketCs.current);
    socketCs.current.emit("query_chat_message", message_chat, {
      conversationId,
    });
  };

  return {
    messages,
    sendMessage,
    partitionOrdinal,
    conversationId,
  };
}
