
### 📄 FILE 4: `docs/03_permission-matrix.md`

```markdown
# PERMISSION MATRIX - HSE PLATFORM

## 📋 1. ROLE DEFINITIONS

| Role | Mô tả | Scope |
|------|-------|-------|
| `admin` | Team quản lý hệ thống | Toàn hệ thống |
| `manager` | Quản lý xưởng | Xưởng được phân công |
| `supervisor` | Giám sát viên | Xưởng được phân công |
| `safety_officer` | Cán bộ an toàn | Xưởng được phân công |
| `staff` | Nhân viên kiểm tra | Không giới hạn (có thể luân chuyển) |

---

## 🔐 2. PERMISSION TABLE

### 2.1. Report Permissions
| Action | admin | manager | supervisor | safety_officer | staff |
|--------|-------|---------|------------|----------------|-------|
| Create report | ✅ | ✅ | ✅ | ✅ | ✅ |
| View own report | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all reports | ✅ | ❌ (chỉ xưởng) | ❌ (chỉ xưởng) | ❌ (chỉ xưởng) | ✅ (tất cả) |
| Edit own report (24h) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete own report (24h) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete any report | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve report | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reject report | ✅ | ❌ | ❌ | ❌ | ❌ |
| Export Excel | ✅ | ✅ | ✅ | ✅ | ❌ |

### 2.2. Task Permissions
| Action | admin | manager | supervisor | safety_officer | staff |
|--------|-------|---------|------------|----------------|-------|
| Create task | ✅ | ✅ | ✅ | ✅ | ❌ |
| View assigned task | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all tasks | ✅ | ❌ (chỉ xưởng) | ❌ (chỉ xưởng) | ❌ (chỉ xưởng) | ✅ (tất cả) |
| Update task | ✅ | ✅ | ✅ | ✅ (chỉ task được giao) | ❌ |
| Assign task | ✅ | ✅ | ✅ | ✅ | ❌ |
| Verify task | ✅ | ✅ | ✅ | ❌ | ❌ |
| Close task | ✅ | ✅ | ✅ | ✅ (chỉ task được giao) | ❌ |
| Delete task | ✅ | ❌ | ❌ | ❌ | ❌ |

### 2.3. Dashboard Permissions
| Action | admin | manager | supervisor | safety_officer | staff |
|--------|-------|---------|------------|----------------|-------|
| View dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all factories | ✅ | ❌ (chỉ xưởng) | ❌ (chỉ xưởng) | ❌ (chỉ xưởng) | ✅ (tất cả) |
| Filter by factory | ✅ | ✅ (chỉ xưởng) | ✅ (chỉ xưởng) | ✅ (chỉ xưởng) | ✅ |
| Export from dashboard | ✅ | ✅ | ✅ | ✅ | ❌ |

### 2.4. QR Scanner Permissions
| Action | admin | manager | supervisor | safety_officer | staff |
|--------|-------|---------|------------|----------------|-------|
| Scan QR | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manual location input | ✅ | ✅ | ✅ | ✅ | ✅ |
| View asset info | ✅ | ✅ | ✅ | ✅ | ✅ |

### 2.5. Admin-Only Permissions
| Action | admin | Others |
|--------|-------|--------|
| Manage employees | ✅ | ❌ |
| Manage factories | ✅ | ❌ |
| Manage form templates | ✅ | ❌ |
| View audit logs | ✅ | ❌ |
| Reset passwords | ✅ | ❌ |
| Configure notifications | ✅ | ❌ |
| Manage QR codes | ✅ | ❌ |
| System settings | ✅ | ❌ |

---

## 🏭 3. FACTORY SCOPE RULES

### 3.1. Manager/Supervisor/Safety Officer
- **Scope**: Chỉ xưởng được phân công (`factories.manager_id`, `safety_officer_id`)
- **Reports**: Chỉ xem report của xưởng mình
- **Tasks**: Chỉ xem task của xưởng mình
- **Dashboard**: Chỉ số liệu của xưởng mình

### 3.2. Admin
- **Scope**: Toàn hệ thống
- **Reports**: Tất cả report
- **Tasks**: Tất cả task
- **Dashboard**: Tất cả xưởng

### 3.3. Staff
- **Scope**: Không giới hạn xưởng (có thể luân chuyển)
- **Reports**: Xem tất cả (để tham khảo)
- **Tasks**: Xem tất cả (để tham khảo)
- **Dashboard**: Xem tất cả (read-only)

---

## 🔒 4. ROW LEVEL SECURITY (RLS) POLICIES

### 4.1. Employees Table
```sql
-- Admin xem tất cả
CREATE POLICY admin_view_employees ON employees FOR SELECT
  USING (EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'));

-- User xem mình
CREATE POLICY user_view_own ON employees FOR SELECT
  USING (auth.uid() = id);

-- Manager xem nhân viên xưởng mình
CREATE POLICY manager_view_factory ON employees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.id = auth.uid() 
      AND e.role IN ('manager', 'supervisor', 'safety_officer')
      AND e.factory_id = employees.factory_id
    )
  );

4.2. Reports Table
-- Staff xem tất cả
CREATE POLICY staff_view_all_reports ON reports FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'staff')
  );

-- Manager xem report xưởng mình
CREATE POLICY manager_view_factory_reports ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      JOIN factories f ON e.factory_id = f.id
      WHERE e.id = auth.uid()
      AND e.role IN ('manager', 'supervisor', 'safety_officer')
      AND f.id = reports.factory_id
    )
  );
4.3. Tasks Table
-- Người được giao xem task
CREATE POLICY assignee_view_tasks ON tasks FOR SELECT
  USING (assigned_to = auth.uid());

-- Manager xem task xưởng mình
CREATE POLICY manager_view_factory_tasks ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      JOIN factories f ON e.factory_id = f.id
      WHERE e.id = auth.uid()
      AND e.role IN ('manager', 'supervisor', 'safety_officer')
      AND f.id = tasks.factory_id
    )
  );


📝 5. AUDIT LOG RULES
Action
Logged
Who can view
CREATE report
✅
Admin
UPDATE report
✅
Admin
DELETE report
✅
Admin
APPROVE report
✅
Admin
REJECT report
✅
Admin
CREATE task
✅
Admin
UPDATE task
✅
Admin
CLOSE task
✅
Admin
LOGIN
✅
Admin
QR scan
❌
-