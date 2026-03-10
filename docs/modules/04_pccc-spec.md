---

### 📄 FILE 5: `docs/modules/04_pccc-spec.md`

```markdown
# MODULE SPEC: PCCC (PHÒNG CHÁY CHỮA CHÁY)

## 🎯 1. TỔNG QUAN

- **Module Code**: `FIRE`
- **Đối tượng**: BCC (Bình chữa cháy), TCC (Tủ chữa cháy)
- **Tần suất**: Hàng tháng
- **Người kiểm tra**: Staff, Safety Officer
- **QR Code**: Dán theo location (vị trí)

---

## 📦 2. ASSET TYPES

### 2.1. BCC (Bình chữa cháy xách tay)
| Field | Type | Options | Required |
|-------|------|---------|----------|
| Ngoại quan | radio | Đạt, Lỗi | ✅ |
| Áp suất | radio | Đạt, Lỗi | ✅ |
| Hạn sử dụng | radio | Còn hạn, Hết hạn | ✅ |
| Hình ảnh | image | 1-2 ảnh | ✅ (tối thiểu 1) |
| Ghi chú | text | Free text | ❌ |

### 2.2. TCC (Tủ chữa cháy)
| Field | Type | Options | Required |
|-------|------|---------|----------|
| Ngoại quan (tủ) | radio | Đạt, Lỗi | ✅ |
| Vòi chữa cháy | radio | Đạt, Lỗi | ✅ |
| Lăng phun | radio | Đạt, Lỗi | ✅ |
| Van nước | radio | Đạt, Lỗi | ✅ |
| Hình ảnh | image | 1-2 ảnh | ✅ (tối thiểu 1) |
| Ghi chú | text | Free text | ❌ |

---

## 🔄 3. WORKFLOW

### 3.1. Kiểm tra bình thường
Quét QR tại vị trí
Hệ thống hiển thị form (dựa trên asset_type)
Điền dữ liệu + chụp ảnh
Submit
Status = submitted (không cần duyệt)

### 3.2. Phát hiện lỗi
ANY field = "Lỗi" hoặc "Hết hạn"
Submit
Auto tạo task (pending)
Assign: Safety Officer (mặc định) hoặc chọn tay
Due date: Theo priority mapping
Email notification: Manager + Safety Officer

### 3.3. Xử lý task
Safety Officer nhận task
Upload ảnh before
Xử lý lỗi
Upload ảnh after
Resolve task
Admin verify → Closed

---

## 📊 4. DASHBOARD METRICS

| Metric | Công thức | Hiển thị |
|--------|----------|----------|
| Tỷ lệ kiểm tra | (Vị trí đã kiểm / Tổng vị trí) * 100 | Pie chart |
| Số lỗi theo loại | COUNT by field type | Bar chart |
| Xu hướng kiểm tra | COUNT by date | Line chart |
| Lỗi theo xưởng | COUNT by factory | Bar chart |
| Task chưa đóng | COUNT tasks WHERE status != closed | KPI card |

---

## 🔔 5. NOTIFICATIONS

### 5.1. Trigger Events
| Event | Recipients | Timing |
|-------|-----------|--------|
| Report có lỗi | Manager xưởng, Safety Officer | Ngay khi submit |
| Task được giao | Người được assign | Ngay khi tạo |
| Task quá hạn | Người được assign + Manager | Hàng ngày (batch) |
| Chưa kiểm tra tháng | Manager xưởng, Safety Officer | Ngày mùng 6 |

### 5.2. Email Template
Subject: [HSE] Lỗi PCCC tại {factory_name} - {asset_code}
Nội dung:
Vị trí: {location_code}
Thiết bị: {asset_code}
Lỗi: {error_fields}
Hạn xử lý: {due_date}
Link: {task_url}

---

## 🗄️ 6. DATABASE MAPPING

### 6.1. Form Template
```json
{
  "module_code": "FIRE",
  "asset_type": "BCC",
  "template_name": "Kiểm tra BCC",
  "version": "1.0",
  "config": {
    "priority_mapping": {
      "Áp suất": "high",
      "Hạn sử dụng": "critical",
      "Ngoại quan": "medium"
    }
  }
}
6.2. Report Data Structure
{
  "ngoai_quan": "Đạt",
  "ap_suat": "Lỗi",
  "han_su_dung": "Còn hạn",
  "ghi_chu": "Đồng hồ áp suất bị vỡ"
}
6.3. Task Auto-Creation Logic
if (report_data.any_field === "Lỗi" || report_data.any_field === "Hết hạn") {
  createTask({
    report_id: report.id,
    asset_id: report.asset_id,
    location_id: report.location_id,
    assigned_to: factory.safety_officer_id,
    priority: getPriorityFromField(error_field),
    due_date: calculateDueDate(priority),
    description: generateDescription(report_data)
  });
}
📱 7. UI SPECIFICATIONS
7.1. QR Scanner Page
Camera full màn hình
Nút chụp ở dưới
Flash toggle: Không cần
Kết quả: Chuyển trang form ngay
7.2. Form Page
Layout: Dọc (scroll)
Progress bar: Hiển thị nhỏ trên cùng
Submit button: Cuối form
Image upload: Preview + retake option
Image Compression: Max 500KB, WebP format
7.3. Task List Page
Layout: Table (desktop) / Card (mobile)
Filter: Priority, Status, Due date
Actions: View, Update, Resolve
⚠️ 8. EDGE CASES
Tình huống
Xử lý
QR code hỏng
Nhập tay location_code + Alert admin
Mất mạng khi submit
Lưu local → Retry khi có mạng
Upload ảnh fail
Retry 3 lần → Cho chụp lại
Asset không tồn tại
Báo lỗi → Tạo asset mới (admin only)
Form validation lỗi
Scroll tự động đến field lỗi