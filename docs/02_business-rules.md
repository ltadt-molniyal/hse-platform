# BUSINESS RULES - HSE PLATFORM

## 🎯 1. TASK MANAGEMENT RULES

### 1.1. Priority → Due Date Mapping
| Priority | Due Date | Màu hiển thị |
|----------|----------|-------------|
| Low | 4 ngày | Xanh lá |
| Medium | 3 ngày | Vàng |
| High | 2 ngày | Cam |
| Critical | 1 ngày | Đỏ |

### 1.2. Task Assignment
- **Mặc định**: Safety Officer của xưởng đó (lấy từ `factories.safety_officer_id`)
- **Custom**: Người tạo report có thể chọn tay người xử lý
- **Fallback**: Nếu không có Safety Officer → Manager xưởng

### 1.3. Auto Task Creation
- **Điều kiện**: ANY field trong report = "Lỗi" hoặc "Hết hạn"
- **Thời điểm**: Ngay khi report status = `submitted`
- **Priority**: Dựa trên mức độ lỗi (config trong form_fields)

### 1.4. Task Status Flow
pending → in_progress → resolved → verified → closed

---

## 📊 2. 6S SCORING RULES

### 2.1. Điểm số nguồn gốc
- Lấy từ `inspection_question_bank.max_score`
- Mỗi câu hỏi có thể có điểm khác nhau

### 2.2. Công thức tính điểm (configurable)
```json
// Lưu trong form_templates.config (JSONB)
{
  "scoring_formula": "sum(actual_scores) / sum(max_scores) * 100",
  "weight_by_category": {
    "6S": 0.3,
    "PCCC": 0.2,
    "DIEN": 0.15,
    "HOACHAT": 0.15,
    "MAYMOC": 0.1,
    "KHAC": 0.1
  }
}
2.3. Xếp hạng xưởng
Tiêu chí 1: Điểm trung bình tháng (60%)
Tiêu chí 2: Tỷ lệ cải thiện thành công (40%)
Cập nhật: Hàng tháng (ngày mùng 1)

📝 3. REPORT WORKFLOW RULES
3.1. Status Transition
Từ
Đến
Điều kiện
draft
submitted
User submit form
submitted
verified
Admin approve (nếu có ảnh cải thiện)
submitted
rejected
Admin reject + lý do
rejected
draft
User sửa ảnh + submit lại
verified
closed
Task hoàn thành (nếu có)
3.2. Approval Rules
Report thường: Không cần duyệt
Report có ảnh cải thiện: Admin duyệt
Report bị reject: Admin duyệt lại sau khi sửa
3.3. Delete Rules
Admin: Xóa bất kỳ report nào
Người tạo: Xóa trong 24h sau khi tạo
Audit: Mọi xóa đều lưu audit_log (soft delete)
📷 4. IMAGE UPLOAD & STORAGE RULES (OPTIMIZED)
4.1. Compression Settings (Client-side)
Max Width: 1280px
Max File Size: 500KB
Format: WebP (convert từ JPG/PNG)
Quality: 80%
Library: browser-image-compression
4.2. Bắt buộc
PCCC: Tối thiểu 1 ảnh/report
6S: Tối thiểu 1 ảnh/lỗi
Task: Ảnh before + after (khi resolve)
4.3. Giới hạn
Max count: 5 ảnh/report
Format: JPG, PNG, HEIC (convert sang WebP)
4.4. Xử lý
Auto thumbnail: Tạo thumbnail 200x200
Storage: Supabase Storage bucket report-images
Path: {factory_id}/{report_id}/{image_id}.webp
4.5. Retention Policy (Xóa tự động)
Loại ảnh
Thời gian lưu
Hành động
Ảnh report đã duyệt
5 năm
Lưu trữ dài hạn
Ảnh report draft
30 ngày
Auto xóa nếu không submit
Ảnh task đã đóng
1 năm
Archive hoặc xóa
Ảnh upload thất bại
24 giờ
Auto xóa qua Cron Job
Ảnh orphan (không có report)
24 giờ
Auto xóa qua Cron Job
4.6. Cleanup Edge Function
Chạy hàng ngày lúc 2:00 AM
Xóa ảnh trong bucket report-images không có record trong report_images table
Xóa ảnh của report có status = 'draft' và created_at > 30 ngày
🔔 5. NOTIFICATION RULES
5.1. Email Configuration
Timing: Admin config (ngay/batch cuối ngày)
Recipients: Admin config (chọn role/người cụ thể)
Template: Có sẵn trong hệ thống
5.2. In-App Notification
Realtime: Supabase Realtime
Mark as read: Click notification
Expiry: 30 ngày
5.3. Notification Types
Loại
Sự kiện
task_assigned
Task được giao
task_overdue
Task quá hạn
report_rejected
Report bị reject
report_approved
Report được duyệt
qr_damaged
QR code hỏng
monthly_reminder
Nhắc kiểm tra tháng
🔐 6. SECURITY RULES
6.1. Row Level Security (RLS)
Bảng
Policy
employees
Admin xem tất cả, staff xem mình
reports
Xem theo xưởng (manager) hoặc tất cả (admin)
tasks
Người được giao + Manager + Admin
audit_logs
Chỉ Admin
6.2. Password Rules
Admin/Manager/Safety: Email + password
Staff: Không password (QR only)
Reset: Admin xem được password trong DB (không hash cho staff)
6.3. Session Rules
Timeout: 8 giờ
Refresh: Auto refresh token
Concurrent: Cho phép nhiều session
📍 7. QR CODE RULES
7.1. QR Format
Content: location_code hoặc asset_code
Type: QR Code (không dùng barcode)
Size: Tối thiểu 3x3 cm
7.2. QR Status
Status
Ý nghĩa
Hành động
active
Bình thường
Quét → Form
damaged
Hỏng
Nhập tay → Alert
missing
Mất
Báo cáo → In mới
7.3. QR Replacement
Alert: Khi nhập tay location_code
Recipients: Admin, Safety Officer, Manager xưởng
Action: In QR mới → Update status = active
📈 8. DASHBOARD RULES (MVP)
8.1. Layout
Fixed: Không kéo thả (Phase 2 mới có)
Responsive: Mobile + Desktop
Filter: Trên cùng (xưởng, ngày, loại)
8.2. Metrics
Metric
Công thức
Tỷ lệ kiểm tra
(Số vị trí đã kiểm / Tổng vị trí) * 100
Số lỗi
COUNT(reports WHERE any_field = "Lỗi")
Tỷ lệ cải thiện
(Task closed / Total task) * 100
Điểm 6S
SUM(scores) / COUNT(scores)

8.3. Export
Format: Excel (.xlsx)
Columns: Tất cả field trong report_data
Filter: Theo filter hiện tại trên dashboard