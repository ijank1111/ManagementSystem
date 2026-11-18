# ResolvePro CMS - Technology Stack

This document outlines the core technologies employed in the ResolvePro CMS project.

## 1. Frontend Layer
| Technology | Purpose |
| :--- | :--- |
| **React 18** | UI Library (Functional Components, Hooks) |
| **TypeScript** | Static Typing & Code Quality |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling & Layout |
| **Shadcn/UI** | Component Library (Radix UI based) |
| **Lucide React** | Iconography |

## 2. Application Logic & State
| Technology | Purpose |
| :--- | :--- |
| **Custom Store** | Observer-pattern State Management |
| **React Router 6** | Routing & RBAC Guards |
| **TanStack Query** | Server State & Caching |
| **Recharts** | Data Visualization |
| **React Hook Form** | Form Handling |
| **Zod** | Schema Validation |

## 3. Backend & Infrastructure (Supabase)
| Technology | Purpose |
| :--- | :--- |
| **PostgreSQL** | Relational Database |
| **Supabase Auth** | Identity & Access Management |
| **RLS** | Row Level Security (Multi-tenancy) |
| **Edge Functions** | Serverless Logic (Deno) |

## 4. Development & Deployment
| Technology | Purpose |
| :--- | :--- |
| **ESLint** | Code Linting |
| **PostCSS** | CSS Transformation |
| **Vercel** | Hosting & Deployment |