
---

### 📄 FILE 6: `docs/modules/05_inspection-6s-spec.md`

```markdown
# MODULE SPEC: KIỂM TRA NỘI BỘ (6S)

## 🎯 1. TỔNG QUAN

- **Module Code**: `INSPECT`
- **Đối tượng**: 11 xưởng, kiểm tra hàng tháng
- **Người kiểm tra**: Ban 6S chuyên trách (Safety Officer)
- **Phạm vi**: Khu vực (location) + Bộ phận (nhập tay)
- **QR Code**: Dán theo location

---

## 📋 2. 11 HẠNG MỤC KIỂM TRA

| # | Hạng mục | Code |
|---|----------|------|
| 1 | Vệ sinh nhà xưởng 6S | `6S` |
| 2 | Thiết bị sơ cấp cứu | `FIRST_AID` |
| 3 | PCCC | `FIRE` |
| 4 | Bảo hộ lao động | `PPE` |
| 5 | An toàn máy móc | `MACHINE` |
| 6 | An toàn điện | `ELECTRICAL` |
| 7 | An toàn hóa chất | `CHEMICAL` |
| 8 | Cơ sở hạ tầng | `INFRA` |
| 9 | Kệ hàng | `RACK` |
| 10 | An toàn sản phẩm | `PRODUCT` |
| 11 | Khác | `OTHER` |

---

## 📝 3. FORM STRUCTURE

### 3.1. Thông tin chung
| Field | Type | Source | Required |
|-------|------|--------|----------|
| Thời gian kiểm tra | datetime | Auto | ✅ |
| Xưởng | select | `factories` | ✅ |
| Bộ phận | text | Manual | ✅ |
| Khu vực vi phạm | text | `locations` + Manual | ✅ |
| Hạng mục | select | 11 hạng mục | ✅ |
| Người kiểm tra | select | `employees` (Safety Officer) | Auto |

### 3.2. Chi tiết kiểm tra (từ ngân hàng câu hỏi)
| Field | Type | Source | Required |
|-------|------|--------|----------|
| Vấn đề | autocomplete | `inspection_question_bank` | ✅ |
| Yêu cầu cải thiện | text | Manual | ✅ |
| Máy móc liên quan | text | `assets` + Manual | ❌ |
| Người phụ trách | select | `employees` | ✅ |
| Ý kiến bộ phận vi phạm | text | Manual | ❌ |
| Hình ảnh vi phạm | image | Upload | ✅ (tối thiểu 1) |
| Hình ảnh cải thiện | image | Upload | Khi khắc phục |
| Kỳ hạn cải thiện | date | Manual | ✅ |
| Điểm số | number | Auto (từ câu hỏi) | ✅ |

---

## 🗄️ 4. NGÂN HÀNG CÂU HỎI

### 4.1. Bảng `inspection_question_bank`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| category | varchar | '6S', 'PCCC', 'DIEN'... |
| sub_category | varchar | 'Ve sinh', 'BCC'... |
| question_text | text | Nội dung câu hỏi |
| question_type | varchar | 'yes_no', 'score', 'text' |
| max_score | integer | Điểm tối đa |
| is_active | boolean | Còn dùng không |

### 4.2. Ví dụ câu hỏi
```json
{
  "category": "6S",
  "sub_category": "Ve sinh",
  "question_text": "Nền nhà có sạch sẽ, không dầu mỡ không?",
  "question_type": "score",
  "max_score": 5
}
4.3. Bảng inspection_scores

Field
Type
Description
id
uuid
PK
report_id
uuid
FK reports
question_id
uuid
FK question_bank
category
varchar
Hạng mục
score
numeric
Điểm thực tế
max_score
integer
Điểm tối đa
notes
text
Ghi chú
📊 5. SCORING & RANKING
5.1. Công thức tính điểm
Điểm tổng = (SUM(actual_scores) / SUM(max_scores)) * 100
Config trong form_templates.config (JSONB)
Có thể tùy chỉnh theo weight
5.2. Xếp hạng xưởng
Tiêu chí
Trọng số
Điểm trung bình tháng
60%
Tỷ lệ cải thiện thành công
40%
5.3. Cập nhật
Tần suất: Hàng tháng (ngày mùng 1)
Edge Function: Cron job tính toán tự động
🔄 6. WORKFLOW
6.1. Kiểm tra
1. Safety Officer chọn xưởng
2. Chọn hạng mục (1 trong 11)
3. Chọn vấn đề (từ ngân hàng câu hỏi)
4. Điền thông tin + chụp ảnh vi phạm
5. Submit
6. Status = submitted
6.2. Cải thiện
1. Bộ phận vi phạm nhận thông báo
2. Thực hiện cải thiện
3. Upload ảnh cải thiện
4. Submit ảnh
5. Chờ Admin duyệt
6.3. Duyệt
1. Admin review ảnh cải thiện
2. Approve → Status = verified
3. Reject → Quay về draft + lý do
4. Bộ phận làm lại ảnh
📊 7. DASHBOARD METRICS
Metric
Công thức
Hiển thị
Điểm trung bình xưởng
AVG(scores) by factory
Bar chart
Xu hướng điểm
AVG by month
Line chart
Top lỗi phổ biến
COUNT by category
Horizontal bar
Tỷ lệ cải thiện
(Closed tasks / Total) * 100
Pie chart
Xếp hạng xưởng
Score + Improvement rate
Table (Top 3)
🔔 8. NOTIFICATIONS
Event
Recipients
Timing
Report submitted
Manager xưởng, Bộ phận vi phạm
Ngay
Ảnh cải thiện cần duyệt
Admin
Ngay
Report rejected
Bộ phận vi phạm
Ngay
Kỳ hạn sắp đến
Người phụ trách
2 ngày trước hạn
Quá hạn chưa cải thiện
Manager + Admin
Hàng ngày

📱 9. UI SPECIFICATIONS
9.1. Form Page
Layout: Wizard (Next/Previous) nếu dài
Progress bar: Hiển thị nhỏ
Hạng mục: Dropdown 11 mục
Vấn đề: Autocomplete từ ngân hàng câu hỏi
9.2. Image Upload
Vi phạm: Bắt buộc tối thiểu 1
Cải thiện: Khi khắc phục xong
Preview: Có thumbnail
Compression: Max 500KB, WebP
9.3. Ranking Page
Layout: Table sortable
Columns: Xưởng, Điểm, Tỷ lệ cải thiện, Hạng
Highlight: Top 3 (vàng, bạc, đồng)
⚠️ 10. EDGE CASES
Tình huống
Xử lý
Câu hỏi không có trong ngân hàng
Cho phép nhập tay + đề xuất thêm vào ngân hàng
Điểm số âm
Validation: min = 0
Ảnh cải thiện không đúng
Admin reject + lý do cụ thể
Quá hạn chưa cải thiện
Auto escalate lên Manager
Xưởng không có Safety Officer
Alert Admin assign

---