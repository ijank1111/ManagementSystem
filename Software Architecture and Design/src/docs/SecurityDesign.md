# ResolvePro CMS - Security Design Specification

The ResolvePro CMS is designed with a "Security-in-Depth" approach, ensuring that data is protected at the application, API, and database layers.

## 1. Authentication (Identity Management)
We leverage **Supabase Auth** (built on GoTrue) for robust identity management.

- **JWT-Based Sessions**: Upon login, users receive a JSON Web Token (JWT) that securely encodes their identity and claims.
- **Multi-Factor Authentication (MFA)**: The architecture is ready for MFA (TOTP), which can be enabled via Supabase settings to provide an extra layer of security for administrative accounts.
- **Single Sign-On (SSO)**: Support for SAML and OIDC is architecturally possible through Supabase, allowing enterprise clients to use their existing identity providers (e.g., Azure AD, Okta).

## 2. Authorisation (Access Control)
We implement a strict **Role-Based Access Control (RBAC)** model combined with **Row Level Security (RLS)**.

### RBAC Roles:
- **CONSUMER**: Can only create and view their own complaints.
- **AGENT/SUPPORT**: Can manage complaints within their assigned tenant.
- **MANAGER**: Full access to tenant data, reports, and team management.
- **ADMIN**: System-wide configuration and cross-tenant oversight.

### Row Level Security (RLS):
Unlike traditional applications that rely solely on application-level checks, ResolvePro enforces isolation at the **database level**. Every query is automatically scoped by the user's `tenant_id` and `role` stored in the JWT. This prevents "Broken Object Level Authorization" (BOLA) attacks.

## 3. Data Encryption
- **In Transit**: All communication between the client and the server is encrypted using **TLS 1.3**, ensuring that data cannot be intercepted.
- **At Rest**: The PostgreSQL database uses **AES-256 encryption** for all data stored on disk.
- **Sensitive Fields**: Highly sensitive data (like PII) can be further protected using Postgres `pgcrypto` for column-level encryption if required by specific compliance standards.

## 4. Audit & Compliance
- **Immutable Logs**: The `activity_logs` table acts as a tamper-evident audit trail. Every status change, message, or internal note is recorded with a timestamp and user ID.
- **Data Privacy**: The multi-tenant design ensures that data from one organization never leaks into another, a critical requirement for GDPR and SOC2 compliance.