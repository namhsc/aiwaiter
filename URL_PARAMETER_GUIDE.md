# Hướng dẫn sử dụng URL Parameter cho Table Number

## Tổng quan

Ứng dụng AI Waiter hiện đã hỗ trợ truyền table number qua URL parameter. Điều này cho phép khách hàng truy cập trực tiếp vào bàn cụ thể mà không cần phải chọn bàn sau khi vào ứng dụng.

## Cách sử dụng

### 1. URL với Table Parameter

```
http://localhost:5173/?table=5
```

- `table=5`: Chỉ định bàn số 5
- Có thể thay đổi số bàn thành bất kỳ số nào (1, 2, 3, 10, 15, v.v.)

### 2. URL không có Table Parameter

```
http://localhost:5173/
```

- Nếu không có parameter `table`, hệ thống sẽ tự động tạo một số bàn ngẫu nhiên từ 1-20

## Ví dụ thực tế

### Nhà hàng có thể tạo QR Code cho từng bàn:

- Bàn 1: `https://yourdomain.com/?table=1`
- Bàn 2: `https://yourdomain.com/?table=2`
- Bàn 10: `https://yourdomain.com/?table=10`

### Khách hàng quét QR Code:

- QR Code sẽ dẫn khách đến URL với table number tương ứng
- Ứng dụng sẽ tự động nhận diện bàn và hiển thị thông tin phù hợp

## Lưu ý kỹ thuật

### Cách hoạt động:

1. Ứng dụng sử dụng `useSearchParams()` từ React Router để đọc URL parameters
2. Nếu có parameter `table`, sử dụng giá trị đó
3. Nếu không có, tạo số bàn ngẫu nhiên như trước đây

### Code implementation:

```typescript
const [searchParams] = useSearchParams();

const getTableNumber = () => {
	const tableFromUrl = searchParams.get('table');
	if (tableFromUrl) {
		return tableFromUrl;
	}
	return String(Math.floor(Math.random() * 20) + 1);
};

const [tableNumber] = useState(getTableNumber());
```

## Testing

Để test chức năng:

1. Chạy `npm run dev`
2. Truy cập `http://localhost:5173/?table=5`
3. Kiểm tra xem ứng dụng có hiển thị bàn số 5 không
4. Thử với các số bàn khác nhau
5. Thử truy cập không có parameter để xem số bàn ngẫu nhiên
