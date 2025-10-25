# Chat Components Structure

## Tổng quan
Thư mục `chat/` chứa các component con được tách ra từ `AIWaiterChat.tsx` để dễ quản lý và bảo trì.

## Cấu trúc Components

### 1. RestaurantHeader.tsx
- **Chức năng**: Hiển thị header của nhà hàng với logo, tên, và các nút điều khiển
- **Props**:
  - `showMenuOverlay`: boolean - trạng thái hiển thị menu overlay
  - `onToggleMenu`: function - xử lý chuyển đổi giữa menu và AI waiter
  - `onViewCart`: function - xử lý xem giỏ hàng
  - `cartItemCount`: number - số lượng items trong giỏ hàng

### 2. GuestCountSelector.tsx
- **Chức năng**: Cho phép người dùng chọn số lượng khách (adults, children, seniors)
- **Props**:
  - `guestCount`: object - số lượng khách hiện tại
  - `onUpdateGuestCount`: function - cập nhật số lượng khách

### 3. QuickActions.tsx
- **Chức năng**: Hiển thị các hành động nhanh và guest count selector
- **Props**:
  - `showQuickActions`: boolean - trạng thái hiển thị quick actions
  - `onToggleQuickActions`: function - chuyển đổi hiển thị quick actions
  - `onQuickReply`: function - xử lý quick reply
  - `usedActions`: Set<string> - các hành động đã sử dụng
  - `specialNotes`: string[] - các ghi chú đặc biệt
  - `recommendations`: string[] - các gợi ý
  - `guestCount`: object - số lượng khách
  - `onUpdateGuestCount`: function - cập nhật số lượng khách

### 4. MessageList.tsx
- **Chức năng**: Hiển thị danh sách tin nhắn, typing indicator, và suggested items
- **Props**:
  - `messages`: ChatMessage[] - danh sách tin nhắn
  - `isTyping`: boolean - trạng thái đang gõ
  - `suggestedItems`: MenuItem[] - các món ăn được gợi ý
  - `onAddItemToCart`: function - thêm món vào giỏ
  - `onIncrementQuantity`: function - tăng số lượng
  - `onDecrementQuantity`: function - giảm số lượng
  - `getItemQuantity`: function - lấy số lượng item
  - `cart`: any[] - giỏ hàng
  - `renderHTML`: function - render HTML content

### 5. MenuOverlay.tsx
- **Chức năng**: Hiển thị menu overlay với các tab và danh sách món ăn
- **Props**:
  - `showMenuOverlay`: boolean - trạng thái hiển thị menu
  - `onClose`: function - đóng menu
  - `activeMenuTab`: string - tab menu hiện tại
  - `onTabChange`: function - chuyển đổi tab
  - `menuItems`: MenuItem[] - danh sách món ăn
  - `getItemQuantity`: function - lấy số lượng item
  - `onIncrementQuantity`: function - tăng số lượng
  - `onDecrementQuantity`: function - giảm số lượng
  - `isDragging`: boolean - trạng thái kéo
  - `menuDragY`: number - vị trí kéo theo trục Y
  - `onDragStart`: function - bắt đầu kéo
  - `onDragMove`: function - di chuyển khi kéo
  - `onDragEnd`: function - kết thúc kéo

### 6. InputBar.tsx
- **Chức năng**: Hiển thị thanh nhập liệu với textarea, nút voice và send
- **Props**:
  - `inputValue`: string - giá trị input
  - `onInputChange`: function - xử lý thay đổi input
  - `onSendMessage`: function - gửi tin nhắn
  - `onVoiceInput`: function - xử lý voice input
  - `isSpeaking`: boolean - trạng thái đang nói
  - `isTyping`: boolean - trạng thái đang gõ
  - `inputHighlight`: boolean - hiệu ứng highlight
  - `flyingText`: object - hiệu ứng text bay
  - `inputContainerRef`: RefObject - ref đến container input

## Utilities và Hooks

### chatUtils.ts
- `renderHTML()`: Render HTML content an toàn
- `getTimeBasedGreeting()`: Lấy lời chào theo thời gian
- `getWelcomeMessage()`: Tạo tin nhắn chào mừng
- `getContext()`: Lấy context dựa trên trạng thái giỏ hàng

### useMenuDrag.ts
- Hook quản lý chức năng kéo menu overlay
- Trả về: `isDragging`, `menuDragY`, `handleDragStart`, `handleDragMove`, `handleDragEnd`

## Lợi ích của cấu trúc mới

1. **Dễ bảo trì**: Mỗi component có trách nhiệm riêng biệt
2. **Tái sử dụng**: Các component có thể được sử dụng ở nơi khác
3. **Dễ test**: Có thể test từng component độc lập
4. **Dễ đọc**: Code ngắn gọn và dễ hiểu hơn
5. **Performance**: Chỉ re-render component cần thiết
6. **Scalability**: Dễ dàng thêm tính năng mới

## Cách sử dụng

```tsx
import { AIWaiterChat } from './AIWaiterChat';

// Component chính sử dụng tất cả các component con
<AIWaiterChat
  onBack={handleBack}
  cart={cart}
  onAddToCart={handleAddToCart}
  // ... other props
/>
```
