# ResolvePro CMS - C4 Architecture Diagrams

## Level 1: System Context Diagram
... (existing content)

## Level 2: Container Diagram
... (existing content)

## Level 3: Component Diagram (Web Application)
... (existing content)

## Level 4: Code Structural Diagram
This diagram details the full domain model and the state store API.

```mermaid
classDiagram
    class UserRole {
        <<enumeration>>
        CONSUMER
        AGENT
        SUPPORT
        MANAGER
        ADMIN
    }
    class ComplaintStatus {
        <<enumeration>>
        LOGGED
        ASSIGNED_AGENT
        ASSIGNED_SUPPORT
        IN_PROGRESS
        RESOLVED
        AWAITING_CONFIRMATION
        CLOSED
    }
    class User {
        +string id
        +string name
        +string email
        +UserRole role
        +string tenantId
    }
    class Tenant {
        +string id
        +string name
        +string logo
        +string primaryColor
    }
    class Complaint {
        +string id
        +string title
        +string description
        +ComplaintStatus status
        +string priority
        +string category
        +string customerId
        +string tenantId
        +string createdAt
        +string updatedAt
    }
    class ActivityLog {
        +string id
        +string complaintId
        +string userId
        +string action
        +string timestamp
        +string note
    }
    class useStore {
        +CMSState state
        +selectAccount(tenantId)
        +joinOrganization(tenantId, role)
        +logout()
        +addComplaint(data)
        +updateComplaintStatus(id, status, note)
        +addMessage(complaintId, note, isInternal)
        +clearNotification(complaintId)
    }
    useStore ..> User
    useStore ..> Complaint
    useStore ..> Tenant
    useStore ..> ActivityLog
```

## Level 4: Code Behavioural Diagram
This diagram illustrates the detailed execution flow for logging a new complaint.

```mermaid
sequenceDiagram
    participant U as User
    participant P as NewComplaint Page
    participant S as useStore
    participant L as Internal Logic
    participant D as Supabase DB
    participant T as Toast Utility

    U->>P: Submit Form
    P->>P: Set Loading(true)
    P->>S: addComplaint(data)
    S->>L: generateShortId()
    L-->>S: "ABC123XY"
    S->>D: INSERT complaint
    D-->>S: Success
    S->>S: fetchData(tenantId)
    S->>D: SELECT complaints & logs
    D-->>S: Data Arrays
    S->>S: setState(newArrays)
    S-->>P: Done
    P->>T: showSuccess()
    P->>P: navigate('/complaints')