-- HƯỚNG DẪN: Chạy nội dung này sau khi đã chạy thành công file mock_data_supabase.sql trước đó.
-- Script này sẽ tạo dữ liệu giả cho bảng REPOSTS (Báo cáo) và TASKS (Nhiệm vụ) để hiển thị lên Dashboard.

-- 1. Thêm dữ liệu Báo Cáo (Reports)
DO $$
DECLARE 
    f1 UUID; l1 UUID; emp_admin UUID;
BEGIN
    -- Lấy ID của xưởng 1 và vị trí chuyền cắt 1
    SELECT id INTO f1 FROM factories WHERE name = 'Xưởng 1' LIMIT 1;
    SELECT id INTO l1 FROM locations WHERE name = 'Chuyền Cắt 1' LIMIT 1;
    
    -- Lấy tạm 1 employee bất kỳ (thường là admin bạn vừa tạo)
    SELECT id INTO emp_admin FROM employees LIMIT 1;

    IF f1 IS NOT NULL AND emp_admin IS NOT NULL THEN
        -- Báo cáo 1: PCCC (Đang chờ duyệt)
        INSERT INTO reports (factory_id, created_by, location_id, status, report_data)
        SELECT f1, emp_admin, l1, 'submitted', '{"module": "FIRE", "notes": "Ghi chú: Bình chữa cháy ABC xịt thử thấy ổn.", "vo_binh": "Đạt", "chot_an_toan": "Đạt", "ap_suat": "Đạt"}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM reports WHERE report_data->>'notes' = 'Ghi chú: Bình chữa cháy ABC xịt thử thấy ổn.');

        -- Báo cáo 2: 6S (Đã duyệt)
        INSERT INTO reports (factory_id, created_by, location_id, status, report_data)
        SELECT f1, emp_admin, l1, 'verified', '{"module": "6S", "notes": "Nền nhà xưởng sạch sẽ.", "ve_sinh": "Đạt", "sap_xep": "Đạt"}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM reports WHERE report_data->>'notes' = 'Nền nhà xưởng sạch sẽ.');

        -- Báo cáo 3: Điện (Từ chối)
        INSERT INTO reports (factory_id, created_by, location_id, status, report_data)
        SELECT f1, emp_admin, l1, 'rejected', '{"module": "ELEC", "notes": "Phát hiện rò rỉ điện tủ tổng.\nLý do từ chối: Cần chụp ảnh rõ hơn vết nứt vỏ bọc.", "vo_ngoai": "Đạt", "cap_dien": "Lỗi", "bien_bao": "Đạt"}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM reports WHERE report_data->>'notes' = 'Phát hiện rò rỉ điện tủ tổng.\nLý do từ chối: Cần chụp ảnh rõ hơn vết nứt vỏ bọc.');

        -- 2. Thêm dữ liệu Công việc (Tasks)
        -- Task 1: Khắc phục lỗi rò điện (High Priority)
        INSERT INTO tasks (factory_id, description, priority, status, due_date, assigned_to)
        SELECT f1, 'Khắc phục rò rỉ điện tủ tổng: Thay cáp điện bị đứt vỏ bọc ở vị trí X1-C1', 'High', 'pending', (NOW() + INTERVAL '2 days'), emp_admin
        WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE description LIKE 'Khắc phục rò rỉ điện tủ tổng%');

        -- Task 2: Vệ sinh định kỳ (Low Priority)
        INSERT INTO tasks (factory_id, description, priority, status, due_date, assigned_to)
        SELECT f1, 'Vệ sinh định kỳ: Lưới lọc bụi khu vực chuyền cắt 1 đang có dấu hiệu đóng cặn', 'Low', 'in_progress', (NOW() + INTERVAL '5 days'), emp_admin
        WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE description LIKE 'Vệ sinh định kỳ: %');
    END IF;
END $$;
