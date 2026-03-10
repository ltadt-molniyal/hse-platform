# USER FLOWS - HSE PLATFORM

## 📱 1. LOGIN FLOW

### 1.1. Staff Login (QR-based)
[QR Scanner Page] → Quét QR → [Form Page]
- Không cần password
- Chỉ cần quét QR tại vị trí thiết bị
- Hệ thống tự động nhận diện location/asset

### 1.2. Admin/Manager/Safety Login
[Login Page] → Nhập email + password → [Dashboard]
- Email + password (được tạo từ bảng employees)
- Quên password → Admin reset (xem password trong DB)
- Responsive: Mobile + Desktop

---

## 📷 2. QR SCANNER FLOW

### 2.1. Quét QR thành công
[QR Scanner] → Quét → [Form Page ngay] (không modal trung gian)
**Lý do**: User low-tech, ít click nhất có thể
2.3: "Cập nhật xếp hạng tự động ngày mùng 1 hàng tháng."
### 2.2. QR code bị hỏng
[QR Scanner] → Quét → Lỗi "QR không hợp lệ" → Quét lại → Nhập tay nếu không được

### 2.4. Sau khi Submit Report
[Form Page] → Submit → [Popup xác nhận] → Nút "Quét tiếp" → [QR Scanner] (ở lại)

---

## 📝 3. REPORT SUBMISSION FLOW

### 3.1. Flow bình thường (không có lỗi)
[Form] → Điền dữ liệu → Upload ảnh (tối thiểu 1) → Submit → [Popup] → Done
- Status: `submitted`
- Không cần duyệt

### 3.2. Flow có lỗi (phải tạo task)
[Form] → ANY field = "Lỗi" → Submit → [Tạo task tự động] → [Popup] → DonE
- Status: `submitted`
- Task created: `pending`
- Assign to: Safety Officer (mặc định) hoặc chọn tay

### 3.3. Flow có ảnh cải thiện (cần duyệt)
[Form] → Upload ảnh cải thiện → Submit → [Chờ Admin duyệt] → verified/rejected
- Status: `submitted` → `verified` hoặc `rejected`
- Nếu rejected: Quay về `draft` + lý do + làm lại ảnh

---

## ✅ 4. APPROVAL WORKFLOW

### 4.1. Điều kiện cần duyệt
| Trường hợp | Cần duyệt? | Người duyệt |
|-----------|-----------|-------------|
| Report bình thường | ❌ Không | - |
| Report có ảnh cải thiện | ✅ Có | Admin (team) |
| Report bị reject | ✅ Có (lại) | Admin (team) |

### 4.2. Reject Flow
[Admin] → Review → Reject + lý do → [Report quay về draft] → [Người tạo làm lại ảnh] → Submit lại


### 4.3. Approve Flow
[Admin] → Review → Approve → [Report status = verified] → [Task closed nếu có]

---

## 📋 5. TASK MANAGEMENT FLOW

### 5.1. Task tự động tạo
[Report submitted] → ANY field = "Lỗi" → [Create Task] → Assign Safety Officer


### 5.2. Task xử lý
[Safety Officer] → Nhận task → Upload ảnh before → Xử lý → Upload ảnh after → Resolve


### 5.3. Task verification
[Manager/Admin] → Review ảnh after → Verify → Task closed

---

## 📊 6. DASHBOARD FLOW

### 6.1. Truy cập

[Login] → [Dashboard] → Filter (xưởng, ngày, loại) → Xem biểu đồ

### 6.2. Biểu đồ (MVP - layout cố định)
| Biểu đồ | Loại | Dữ liệu |
|--------|------|---------|
| Tỷ lệ kiểm tra | Pie | Trong tháng |
| Lỗi theo loại | Bar | Ngoại quan, áp suất, hạn... |
| Xu hướng | Line | Theo ngày |
| Lỗi theo xưởng | Bar | So sánh 11 xưởng |

### 6.3. Export
[Dashboard] → Nút Export Excel → Download file

---

## 🔔 7. NOTIFICATION FLOW

### 7.1. Email Notification
| Sự kiện | Gửi khi nào | Người nhận |
|--------|------------|-----------|
| Report có lỗi | Ngay khi submit (configurable) | Manager xưởng, Safety Officer |
| Task được giao | Ngay khi tạo | Người được assign |
| Task quá hạn | Hàng ngày (batch) | Người được assign + Manager |
| QR hỏng | Ngay khi nhập tay | Admin, Safety Officer |
| Report cần duyệt | Ngay khi submit | Admin team |

### 7.2. In-App Notification
[Notification Icon] → Dropdown danh sách → Click → Đánh dấu đã đọc

---

## ⚠️ 8. ERROR HANDLING FLOW

### 8.1. Mất mạng khi submit
[Submit] → No network → [Lưu local IndexedDB] → [Retry khi có mạng] → [Popup thông báo]

### 8.2. Upload ảnh thất bại
[Upload] → Fail → [Retry tự động 3 lần] → [Cho chụp lại] → [Vẫn submit được nếu bỏ qua ảnh]

### 8.3. Session expired
[Đang làm form] → Session expired → [Lưu tạm dữ liệu] → [Redirect login] → [Khôi phục dữ liệu]

### 8.4. Concurrent edit
[2 người cùng edit] → [Lock record] → [Người sau báo lỗi merge conflict]

---

## 📋 9. MODULE-SPECIFIC FLOWS

### 9.1. PCCC Module
[Quét QR BCC/TCC] → [Form PCCC] → [Check: Ngoại quan, Áp suất, Hạn] → [Submit]


### 9.2. 6S/Inspection Module
[Chọn xưởng] → [Chọn hạng mục (11 mục)] → [Câu hỏi từ ngân hàng] → [Chấm điểm] → [Upload ảnh lỗi] → [Submit]

### 9.3. Electrical Module (Draft)
[Chọn thiết bị điện] → [Permit-to-Work] → [Manager approve] → [Admin approve] → [Kiểm tra] → [Submit]
