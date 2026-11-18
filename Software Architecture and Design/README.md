# ResolvePro CMS

ResolvePro is an enterprise-grade multi-tenant Complaint Management System (CMS) built for high-compliance industries such as banking and telecommunications.

## Project Overview

This application provides a robust framework for managing customer complaints across multiple organizations (tenants) with strict data isolation and role-based access control (RBAC).

### Key Features

- **Multi-tenant Architecture**: Logical data isolation ensures that users only see data relevant to their organization.
- **Role-Based Access Control (RBAC)**: Granular permissions for Consumers, Agents, Support Staff, and Managers.
- **Real-time Activity Tracking**: Full audit trail for every complaint, including status changes and internal notes.
- **Responsive Dashboard**: Data visualizations for monitoring complaint volume and resolution performance.

## Technology Stack

### Frontend
- **React 18**: Core UI framework using functional components and hooks.
- **TypeScript**: Ensures type safety and improves developer productivity.
- **Vite**: Next-generation frontend tooling for fast development and builds.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn/UI**: High-quality, accessible component primitives.
- **Lucide React**: Consistent and clean enterprise iconography.

### State & Data
- **Custom Observer Store**: Lightweight, multi-tenant aware state management.
- **TanStack Query**: Efficient data fetching, caching, and synchronization.
- **React Router 6**: Handles client-side navigation and route guards.
- **Recharts**: Responsive SVG-based data visualization.

### Backend (Supabase)
- **PostgreSQL**: Robust relational database for structured data.
- **Supabase Auth**: Secure authentication using JWT and GoTrue.
- **Row Level Security (RLS)**: Database-level enforcement of multi-tenant isolation.
- **Edge Functions**: Serverless Deno runtime for complex business logic and integrations.

### Tooling & Validation
- **React Hook Form**: Performant and flexible form management.
- **Zod**: TypeScript-first schema declaration and validation.
- **Sonner**: Elegant toast notifications for user feedback.

## Security & Compliance

The system is designed with security-first principles:
- **Row Level Security (RLS)**: Enforced at the database level to prevent unauthorized data access.
- **Audit Logging**: Every action is logged with a timestamp and user ID for compliance reporting.
- **Data Privacy**: Built to support GDPR requirements for data portability and the right to erasure.

---
*Developed by the ResolvePro Engineering Team.*