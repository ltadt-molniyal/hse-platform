# Hướng Dẫn Đẩy Code Lên GitHub (Không Dùng Lệnh Command)

Vì máy của sếp chưa cài đặt Git Command Line, cách nhanh nhất và an toàn nhất để lưu trữ toàn bộ source code này lên GitHub là **Tải lên qua giao diện Web (Kéo & Thả)**.

Dưới đây là các bước cực kỳ đơn giản:

## Bước 1: Tạo Nơi Lưu Trữ (Repository) trên GitHub
1. Sếp đăng nhập vào tài khoản [GitHub.com](https://github.com/).
2. Nhấn nút **New** (màu xanh lá) ở góc trái màn hình hoặc dấu `+` ở góc phải trên cùng $\rightarrow$ chọn **New repository**.
3. Tại ô **Repository name**, sếp điền tên dự án (VD: `hse-platform`). 
4. Phần **Public / Private**: Sếp chọn **Private** (Chỉ mình sếp xem được code) để bảo mật.
5. Nhấn nút **Create repository** ở dưới cùng.

## Bước 2: Chuẩn bị Thư Mục Code
Sếp mở thư mục `dat/HSE Platform` trên máy tính bằng File Explorer bình thường.
Tại đây, hệ thống có rất nhiều file và folder, nhưng **SẾP TUYỆT ĐỐI KHÔNG ĐƯỢC TẢI LÊN** 2 thứ sau:
1. Thư mục `node_modules` (Chứa hàng ngàn file thư viện nặng, đưa lên sẽ treo máy và không cần thiết).
2. File `.env` (Chứa API Key bảo mật Supabase của sếp, tuyệt đối không đưa lên mạng).

## Bước 3: Kéo & Thả Code Lên GitHub
1. Quay lại trang GitHub cái Repository sếp vừa tạo ở Bước 1.
2. Sếp sẽ thấy dòng chữ: **"...or uploading an existing file"** $\rightarrow$ Sếp click vào chữ **uploading an existing file** đó.
3. Giao diện GitHub chuyển sang trang **Kéo & Thả (Drag and drop)**.
4. Sếp quay lại thư mục `HSE Platform` trên máy mình, **bôi đen toàn bộ các file & thư mục ngoại trừ `node_modules` và `.env`**.
   - Cụ thể sếp sẽ nắm kéo thả các file sau: `src`, `public`, `docs`, `package.json`, `package-lock.json`, `tailwind.config.js`, `vite.config.ts`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `mock_data_supabase.sql`, `mock_reports_tasks.sql`, `README.md`.
5. Sau khi kéo thả vào trình duyệt, chờ vạch xanh chạy trọn vẹn (khoảng 1-2 phút).
6. Cuộn xuống cuối trang, ở ô **Commit changes**, sếp điền nội dung (ví dụ: "Initial commit phiên bản 1.0").
7. Nhấn nút **Commit changes** (màu xanh lá) để hoàn tất.

--- 
🎉 **Xong!** Toàn bộ chất xám của dự án đã được lưu trữ an toàn trên GitHub. Nếu sau này sếp muốn 배 deploy thành một trang web thực thụ có link (như Vercel/Netlify), chỉ cần truy cập vào Repo GitHub này là hệ thống kia nó tự động hiểu.
