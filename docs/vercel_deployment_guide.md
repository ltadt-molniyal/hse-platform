# Hướng dẫn đưa App lên web (Deploy) bằng Vercel

Vercel là một trong những nền tảng tốt nhất và hoàn toàn miễn phí để đưa các ứng dụng React/Vite lên mạng cho mọi người cùng sử dụng. 

Dưới đây là các bước đơn giản nhất để Sếp có thể tự deploy App này lên Vercel.

## 🌟 CÁCH 1: DEPLOY MIỄN PHÍ QUA GITHUB (KHUYÊN DÙNG NHẤT)

Cách này tự động cập nhật web mỗi khi Sếp tải code mới lên GitHub.

### Bước 1: Đảm bảo code đã ở trên GitHub
*   Sếp hãy chắc chắn rằng toàn bộ code (trừ thư mục `node_modules` và file `.env`) đã được tải lên một repository trên GitHub (Sếp có thể xem lại file `github_upload_guide.md` để biết cách tải lên).

### Bước 2: Đăng nhập Vercel
1.  Truy cập vào trang web: [https://vercel.com/](https://vercel.com/)
2.  Bấm vào nút **Sign Up** (Đăng ký) ở góc trên bên phải.
3.  Chọn **Continue with GitHub** (Tiếp tục với GitHub) để liên kết thẳng tài khoản GitHub của Sếp vào Vercel.

### Bước 3: Thêm dự án vào Vercel
1.  Sau khi đăng nhập thành công vào Vercel, bấm nút **Add New...** ở góc phải màn hình -> Chọn **Project**.
2.  Vercel sẽ hiện ra danh sách các Repository trên GitHub của Sếp. 
3.  Tìm đến cái tên Repository chứa App này (ví dụ: `hse-platform`) và bấm nút **Import**.

### Bước 4: Cấu hình biến môi trường (CỰC KỲ QUAN TRỌNG)
Vì Sếp không tải file `.env` lên GitHub (để bảo mật), nên Vercel chưa biết link kết nối với Supabase. Sếp phải tự khai báo cho nó:

1.  Tại màn hình **Configure Project** (ngay sau khi bấm Import), mở mục **Environment Variables** ra.
2.  Sếp cần thêm 2 biến môi trường y hệt trong file `.env` ở máy tính của Sếp:
    *   **Biến 1**: 
        *   Tên (Key): `VITE_SUPABASE_URL`
        *   Giá trị (Value): Điền cái link Supabase thật của sếp vào đây
        *   Bấm **Add**.
    *   **Biến 2**:
        *   Tên (Key): `VITE_SUPABASE_ANON_KEY`
        *   Giá trị (Value): Điền cái mã Key Supabase thật của sếp vào đây
        *   Bấm **Add**.

*Lưu ý: Đừng copy cái chữ `placeholder_key` trong file mẫu, hãy copy cái link và key Supabase thật của sếp nhé!*

### Bước 5: Bấm Deploy
1.  Sau khi điền xong 2 biến môi trường, bấm nút **Deploy** màu đen to bự ở dưới cùng.
2.  Ngồi dợi khoảng 1-2 phút để Vercel tự động cài đặt vàビル(build) ứng dụng.
3.  Khi thấy màn hình bắn pháo hoa tung tóe 🎉, nghĩa là App của Sếp đã chính thức lên mạng!
4.  Bấm vào hình cái màn hình (hoặc nút **Continue to Dashboard**) để lấy đường link truy cập (có dạng `https://ten-du-an.vercel.app`). Sếp có thể gửi link này cho mọi người dùng thử ngay!

---

## 💻 CÁCH 2: DEPLOY TRỰC TIẾP TỪ MÁY TÍNH BẰNG VERCEL CLI

Nếu Sếp không muốn dùng GitHub mà muốn đẩy code trực tiếp từ máy tính lên Vercel, Sếp có thể dùng công cụ dòng lệnh (CLI).

**Bước 1: Cài đặt Vercel CLI**
1. Mở cửa sổ Terminal (hoặc Command Prompt / PowerShell) trong thư mục project của Sếp.
2. Gõ lệnh sau để cài đặt Vercel toàn cầu:
   ```bash
   npm i -g vercel
   ```

**Bước 2: Đăng nhập Vercel trên máy tính**
1. Gõ lệnh:
   ```bash
   vercel login
   ```
2. Dùng phím mũi tên lên/xuống chọn **Continue with GitHub** (hoặc Email), sau đó nhấn Enter. Một trang web sẽ mở ra để Sếp xác nhận đăng nhập.

**Bước 3: Đẩy code thẳng lên Vercel**
1. Đảm bảo Sếp vẫn đang ở trong thư mục project chứa code. Gõ lệnh:
   ```bash
   vercel
   ```
2. Vercel sẽ hỏi Sếp một vài câu khởi tạo, Sếp cứ đọc và trả lời (hoặc cứ bấm Enter để chọn mặc định là Y/Yes):
    *   `Set up and deploy ...?` -> Nhấn Enter (Y)
    *   `Which scope do you want to deploy to?` -> Nhấn Enter
    *   `Link to existing project?` -> Gõ `N` rồi Enter
    *   `What's your project's name?` -> Gõ tên dự án Sếp muốn (hoặc Enter lấy mặc định)
    *   `In which directory is your code located?` -> Nhấn Enter (mặc định `./`)
3. Vercel sẽ tải code của Sếp lên mây. Khi chạy xong, nó sẽ cho Sếp một cái link "Preview" (bản xem thử).

**Bước 4: Thêm biến môi trường cho Vercel**
Bản xem thử mặc định chưa có biến `.env` nên sẽ không chạy được Supabase.
1. Sếp truy cập vào trang quản lý của Vercel trên web (https://vercel.com).
2. Tìm cái Project vừa bị đẩy lên. Vào tab **Settings** -> **Environment Variables**.
3. Thêm 2 biến `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` y như **Bước 4 của Cách 1**.
4. Quay lại Terminal trên máy tính, gõ lệnh sau để xấy dựng bản chính thức (Production) với các cấu hình mới:
   ```bash
   vercel --prod
   ```
5. Chờ quá trình hoàn tất, Terminal sẽ cung cấp đường link truy cập chính thức.

---

### Mẹo nhỏ cho sếp
Khi web đã chạy trên Vercel, cái QR Code lúc quét (bằng điện thoại) sẽ hoạt động siêu mượt vì Vercel bắt buộc dùng giao thức `https` (Giao thức bảo mật) - đây là điều kiện tiên quyết để trình duyệt cho phép bật Camera trên điện thoại đó sếp ơi!
