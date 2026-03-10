# HSE PLATFORM - PROJECT MEMORY

## 🎯 Tổng quan dự án
- **Tên**: HSE Platform (Health, Safety, Environment)
- **Mục tiêu**: Hệ thống quản lý an toàn lao động đa module, quét QR code, dynamic form
- **Phiên bản thiết kế**: 1.0 (09/03/2026)
- **Trạng thái**: Ready for Development

## 🏗️ Kiến trúc hệ thống
Frontend (React + TailwindCSS) → Supabase Client → Supabase Backend (Postgres + Auth + Storage)

### Tech Stack
| Layer | Công nghệ |
|-------|----------|
| Frontend | React + TypeScript + TailwindCSS |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Hosting | GitHub Pages (Frontend) + Supabase (Backend) |
| AI Assistant | Cursor AI |

## 📊 Core Tables (13 bảng)
1. `employees` - Nhân viên & phân quyền
2. `factories` - Danh sách xưởng (11 xưởng)
3. `locations` - Vị trí trong xưởng (có QR code)
4. `assets` - Thiết bị/tài sản (BCC, TCC, ELECTRICAL...)
5. `form_templates` - Mẫu form động
6. `form_fields` - Cấu hình trường trong form
7. `reports` - Báo cáo kiểm tra
8. `report_images` - Ảnh đính kèm báo cáo
9. `tasks` - Công việc khắc phục lỗi
10. `notifications` - Thông báo
11. `audit_logs` - Nhật ký kiểm toán
12. `inspection_question_bank` - Ngân hàng câu hỏi kiểm tra
13. `inspection_scores` - Điểm chi tiết từng lần kiểm

## 🔐 Authentication & Authorization
- **Staff**: Quét QR → Form (không password)
- **Admin/Manager/Safety Officer**: Email + Password
- **Forgot password**: Admin reset (xem được password trong DB)
- **RLS**: Bật cho tất cả bảng
- **Roles**: admin, manager, supervisor, safety_officer, staff

## 📋 Module Priority
| Priority | Module | Code | Trạng thái |
|----------|--------|------|-----------|
| 1 | PCCC | `FIRE` | ✅ Thiết kế chi tiết |
| 2 | Kiểm tra nội bộ (6S) | `INSPECT` | ✅ Thiết kế chi tiết |
| 3 | An toàn điện | `ELEC` | 📝 Draft (có Permit-to-Work) |
| 4 | Audit khách hàng | `AUDIT` | 📝 Draft |
| 5 | Hoá chất | `CHEM` | 📝 Draft |
| 6 | Nước thải | `WATER` | 📝 Draft |
| 7 | Khí thải | `AIR` | 📝 Draft |

## 🎯 Business Rules quan trọng
- **Task Due Date**: Low=4 ngày, Medium=3, High=2, Critical=1
- **Task Assignment**: Mặc định Safety Officer xưởng, có thể chọn tay
- **Auto Task**: ANY field = "Lỗi" → Tạo task
- **Approval**: Report bình thường không duyệt. Report có ảnh cải thiện → Admin duyệt
- **QR Damaged**: Nhập tay location → Alert admin in QR mới
- **6S Scoring**: Điểm từ `inspection_question_bank`, công thức config trong `form_templates`
- **Xếp hạng**: Điểm tháng + Tỷ lệ cải thiện

## 📁 Cấu trúc thư mục
hse-platform/
├── CLAUDE.md
├── docs/
│ ├── user-flows.md
│ ├── business-rules.md
│ ├── permission-matrix.md
│ └── modules/
│ ├── pccc-spec.md
│ └── inspection-6s-spec.md
├── supabase/migrations/
└── src/
├── modules/
├── core/
└── ...

## ⚠️ Quy tắc khi code
1. Luôn kiểm tra RLS policies trước khi query
2. Dùng TypeScript cho tất cả code
3. Validate input ở cả frontend và database
4. Audit log cho mọi hành động CREATE/UPDATE/DELETE
5. Ưu tiên mobile-first cho trang quét QR
6. Offline-first: Lưu local → retry khi có mạng
7. Progress bar hiển thị nhỏ trên form
8. Dashboard MVP: Layout cố định (không kéo thả)
9. **IMAGE OPTIMIZATION**: Nén ảnh xuống max 500KB trước khi upload (WebP)
10. **STORAGE**: Xóa ảnh draft sau 30 ngày, ảnh orphan sau 24h

## 🚀 Lộ trình hiện tại
- **Giai đoạn 1**: Nền tảng (Database + Auth + Dynamic Form Core)
- **Giai đoạn 2**: Module PCCC (MVP)
- **Giai đoạn 3**: Module 6S/Kiểm tra nội bộ
- **Giai đoạn 4**: Task Management + Audit
- **Giai đoạn 5**: Dashboard + Export + Module khác

"Always refer to docs/ folder for detailed specifications before coding."