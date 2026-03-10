---

### 📄 FILE 7: `docs/06_technical-specs.md` (MỚI - Bổ sung kỹ thuật)

```markdown
# TECHNICAL SPECIFICATIONS - HSE PLATFORM

## 🖼️ 1. IMAGE OPTIMIZATION STRATEGY

### 1.1. Client-side Compression
```javascript
// Sử dụng thư viện: browser-image-compression
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 0.5,          // Max 500KB
  maxWidthOrHeight: 1280,  // Resize nếu lớn hơn
  useWebWorker: true,      // Nén ở background thread
  fileType: 'image/webp',  // Convert sang WebP
  initialQuality: 0.8      // Chất lượng 80%
};

const compressedFile = await imageCompression(file, options);


1.2. Storage Structure
supabase-storage/
└── report-images/
    ├── {factory_id}/
    │   └── {report_id}/
    │       ├── {image_id}.webp
    │       └── {image_id}_thumb.webp
    └── temp/
        └── {upload_session_id}/
            └── {image_id}.webp
1.3. Cleanup Edge Function
// Chạy hàng ngày lúc 2:00 AM
// 1. Xóa ảnh trong temp/ older than 24h
// 2. Xóa ảnh report-images của draft reports older than 30 days
// 3. Xóa orphan images (không có record trong report_images table)
📱 2. MOBILE-FIRST DESIGN
2.1. Breakpoints
Device
Width
Layout
Mobile
< 640px
Single column, full-width buttons
Tablet
640px - 1024px
2 columns
Desktop
> 1024px
3+ columns, sidebar navigation
2.2. Touch Targets
Minimum button height: 44px
Minimum touch target: 48x48px
Adequate spacing between interactive elements
🔌 3. OFFLINE-FIRST STRATEGY
3.1. Local Storage
IndexedDB: Lưu report drafts, images
LocalStorage: Lưu user session, settings
3.2. Sync Logic
123456
1. User submit → Lưu vào IndexedDB
2. Check network status
3. If online → Upload immediately
4. If offline → Queue for sync
5. When online → Process queue
6. Handle conflicts → Notify user
3.3. Conflict Resolution
Last write wins: Cho đa số trường hợp
Manual merge: Cho report đang được edit bởi 2 người
Audit log: Ghi lại mọi conflict
⚡ 4. PERFORMANCE OPTIMIZATION
4.1. Database Indexes
CREATE INDEX idx_reports_factory_date ON reports(factory_id, submitted_at);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status);
CREATE INDEX idx_locations_factory ON locations(factory_id);
CREATE INDEX idx_assets_location ON assets(location_id);
4.2. Query Optimization
Use SELECT specific columns (not SELECT *)
Pagination for large lists (LIMIT/OFFSET)
Materialized views for dashboard metrics
4.3. Frontend Optimization
Code splitting by module
Lazy loading for images
Cache API responses (React Query/SWR)
🔐 5. SECURITY BEST PRACTICES
5.1. RLS Policies
Enable RLS on ALL tables
Test policies with different roles
Document all policies in permission-matrix.md
5.2. Input Validation
Frontend validation (UX)
Database constraints (Data integrity)
Edge Function validation (Security)
5.3. Audit Logging
Log all CREATE, UPDATE, DELETE
Log all login attempts
Retain logs for 2 years

---

## 📌 HƯỚNG DẪN SỬ DỤNG BỘ TÀI LIỆU

1.  **Lưu trữ:** Tạo thư mục `hse-platform-docs` và lưu 7 file trên vào đúng cấu trúc thư mục như trong `CLAUDE.md`.
2.  **Sử dụng với Cursor AI:**
    *   Mở folder dự án trong Cursor.
    *   Khi bắt đầu code, hãy yêu cầu AI: *"Read CLAUDE.md and docs/ folder first"*.
    *   Khi code module nào, refer đến file spec của module đó (ví dụ: *"Check docs/modules/04_pccc-spec.md for form fields"*).
3.  **Bảo trì:** Khi có thay đổi nghiệp vụ, cập nhật vào file tương ứng trước khi yêu cầu AI code lại.

Bộ tài liệu này đã bao gồm cả giải pháp **Image Optimization** để tiết kiệm chi phí Supabase Free Tier. Bạn có thể yên tâm triển khai! 🚀