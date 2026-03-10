-- HƯỚNG DẪN: Copy toàn bộ nội dung file này và paste vào mục "SQL Editor" trên trang quản trị Supabase của bạn, sau đó nhấn "Run" (Chạy).

-- Bước 1: Thêm dữ liệu vào bảng Factories (Các Xưởng/Nhà máy)
INSERT INTO factories (name)
SELECT name FROM (VALUES 
  ('Xưởng 1'), 
  ('Xưởng 2'), 
  ('Xưởng 3'), 
  ('Kho Thành Phẩm'), 
  ('Văn Phòng')
) data(name)
WHERE NOT EXISTS (SELECT 1 FROM factories f WHERE f.name = data.name);

-- Bước 2: Thêm dữ liệu vào Locations (Khu vực/Chuyền/Tầng)
DO $$ 
DECLARE 
    f1 UUID; f2 UUID; f_kho UUID;
BEGIN
    SELECT id INTO f1 FROM factories WHERE name = 'Xưởng 1' LIMIT 1;
    SELECT id INTO f2 FROM factories WHERE name = 'Xưởng 2' LIMIT 1;
    SELECT id INTO f_kho FROM factories WHERE name = 'Kho Thành Phẩm' LIMIT 1;

    IF f1 IS NOT NULL THEN
        INSERT INTO locations (factory_id, name, location_code)
        SELECT f1, data.name, data.location_code
        FROM (VALUES 
            ('Chuyền Cắt 1', 'X1-C1'),
            ('Chuyền May 2', 'X1-M2')
        ) data(name, location_code)
        WHERE NOT EXISTS (SELECT 1 FROM locations l WHERE l.location_code = data.location_code);
    END IF;

    IF f2 IS NOT NULL THEN
        INSERT INTO locations (factory_id, name, location_code)
        SELECT f2, 'Khu Đóng Gói', 'X2-DG'
        WHERE NOT EXISTS (SELECT 1 FROM locations l WHERE l.location_code = 'X2-DG');
    END IF;

    IF f_kho IS NOT NULL THEN
        INSERT INTO locations (factory_id, name, location_code)
        SELECT f_kho, 'Kho A (Cà phê)', 'KHO-A'
        WHERE NOT EXISTS (SELECT 1 FROM locations l WHERE l.location_code = 'KHO-A');
    END IF;
END $$;

-- Bước 3: Thêm Tài sản (Assets)
-- Lỗi 23502 báo thiếu 'type'. Thêm đầy đủ: location_id, name, asset_code, type.
DO $$
DECLARE 
    l1 UUID; l2 UUID;
BEGIN
    SELECT id INTO l1 FROM locations WHERE name = 'Chuyền Cắt 1' LIMIT 1;
    SELECT id INTO l2 FROM locations WHERE name = 'Khu Đóng Gói' LIMIT 1;

    IF l1 IS NOT NULL THEN
        INSERT INTO assets (location_id, name, asset_code, type)
        SELECT l1, data.name, data.asset_code, data.type
        FROM (VALUES 
            ('Bình chữa cháy bột ABC 4kg', 'BCC-X1-001', 'FIRE'),
            ('Bình chữa cháy CO2 3kg', 'BCC-X1-002', 'FIRE'),
            ('Tủ điện tổng Chuyền Cắt', 'TD-X1-001', 'ELECTRICAL')
        ) data(name, asset_code, type)
        WHERE NOT EXISTS (SELECT 1 FROM assets a WHERE a.asset_code = data.asset_code);
    END IF;
    
    IF l2 IS NOT NULL THEN
        INSERT INTO assets (location_id, name, asset_code, type)
        SELECT l2, 'Bình chữa cháy bột loại 8kg', 'BCC-X2-001', 'FIRE'
        WHERE NOT EXISTS (SELECT 1 FROM assets a WHERE a.asset_code = 'BCC-X2-001');
    END IF;
END $$;


