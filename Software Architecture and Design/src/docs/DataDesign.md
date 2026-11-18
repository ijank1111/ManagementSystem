# ResolvePro CMS - Data Design Specification

## 1. Entity Relationship Diagram (ERD) Concept
The system follows a star-schema approach centered around the `Tenant` to ensure strict data isolation.

- **Tenant**: The root organization.
- **Profile**: Users belonging to a tenant with specific roles.
- **Complaint**: The core transactional entity.
- **ActivityLog**: The audit trail for complaints.

## 2. Database Schema (PostgreSQL)

### Table: `profiles`
Stores user identity and role within a specific tenant.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | References `auth.users.id` |
| `email` | TEXT | User email address |
| `name` | TEXT | Display name |
| `role` | TEXT | Enum: CONSUMER, AGENT, SUPPORT, MANAGER, ADMIN |
| `tenant_id` | TEXT (FK) | Logical link to organization |
| `updated_at` | TIMESTAMP | Last modification time |

### Table: `complaints`
The primary record for customer issues.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT (PK) | Human-readable short ID (e.g., ABC123XY) |
| `title` | TEXT | Brief summary |
| `description`| TEXT | Detailed issue description |
| `status` | TEXT | Enum: LOGGED, IN_PROGRESS, RESOLVED, etc. |
| `priority` | TEXT | Enum: LOW, MEDIUM, HIGH, URGENT |
| `category` | TEXT | Tenant-specific category |
| `customer_id`| UUID (FK) | References `profiles.id` |
| `tenant_id` | TEXT | Multi-tenant isolation key |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last status or content update |

### Table: `activity_logs`
Immutable audit trail and communication history.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique log identifier |
| `complaint_id`| TEXT (FK) | References `complaints.id` |
| `user_id` | UUID (FK) | Author of the action/message |
| `action` | TEXT | Type of activity (e.g., 'Status Change') |
| `note` | TEXT | Content of the message or internal note |
| `timestamp` | TIMESTAMP | When the activity occurred |

## 3. Multi-Tenancy & Security (RLS)
Data isolation is enforced at the database level using PostgreSQL Row Level Security (RLS).

### Isolation Logic:
1. **Tenant Scope**: Every query includes a `WHERE tenant_id = '...'` clause.
2. **Role Scope**: 
   - `CONSUMER`: Can only see complaints where `customer_id = auth.uid()`.
   - `AGENT/SUPPORT`: Can see all complaints within their `tenant_id`.
   - `MANAGER`: Can see all data and reports for their `tenant_id`.

### Example RLS Policy:
```sql
CREATE POLICY "Users can view authorized complaints" 
ON complaints FOR SELECT 
USING (
  (customer_id = auth.uid()) OR 
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.tenant_id = complaints.tenant_id 
    AND profiles.role IN ('AGENT', 'SUPPORT', 'MANAGER', 'ADMIN')
  ))
);