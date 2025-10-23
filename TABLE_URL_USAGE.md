# Hướng dẫn sử dụng URL Parameter cho số bàn

## Cách sử dụng

Ứng dụng AI Waiter hiện đã hỗ trợ tham số số bàn trong URL. Bạn có thể sử dụng các URL sau:

### 1. URL với số bàn cụ thể

```
http://localhost:5173/?table=5
```

- Số bàn sẽ hiển thị là "Table 5" trong giao diện

### 2. URL với số bàn khác

```
http://localhost:5173/?table=12
```

- Số bàn sẽ hiển thị là "Table 12" trong giao diện

### 3. URL không có tham số table

```
http://localhost:5173/
```

- Số bàn sẽ được tạo ngẫu nhiên từ 1-20

## Cách hoạt động

1. Ứng dụng sử dụng React Router để đọc URL parameters
2. Tham số `table` được đọc từ URL query string
3. Nếu không có tham số `table`, hệ thống sẽ tạo số bàn ngẫu nhiên
4. Số bàn được hiển thị trong:
   - Màn hình chào mừng (AIWelcomeScreen)
   - Màn hình chat AI
   - Màn hình hoàn thành đơn hàng

## Ví dụ thực tế

Để test với bàn số 8:

```
http://localhost:5173/?table=8
```

Để test với bàn số 15:

```
http://localhost:5173/?table=15
```

## Lưu ý

- Số bàn có thể là bất kỳ chuỗi nào (text hoặc số)
- Nếu không có tham số `table`, số bàn sẽ được tạo ngẫu nhiên
- Số bàn được lưu trong state và không thay đổi trong suốt phiên làm việc
