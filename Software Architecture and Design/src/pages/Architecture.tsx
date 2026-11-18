import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cpu, 
  Layers, 
  Box,
  ArrowRight,
  Users,
  Globe,
  Database,
  ShieldCheck,
  Copy,
  Check,
  Code2,
  Activity,
  Table as TableIcon,
  Key,
  Lock,
  ShieldAlert,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess } from '../utils/toast';

const Architecture = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    showSuccess("Diagram code copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const mermaidStructural = `classDiagram
    class UserRole { <<enumeration>> CONSUMER, AGENT, SUPPORT, MANAGER, ADMIN }
    class ComplaintStatus { <<enumeration>> LOGGED, ASSIGNED_AGENT, ASSIGNED_SUPPORT, IN_PROGRESS, RESOLVED, AWAITING_CONFIRMATION, CLOSED }
    class User { +string id, +string name, +string email, +UserRole role, +string tenantId }
    class Tenant { +string id, +string name, +string logo, +string primaryColor }
    class Complaint { +string id, +string title, +string description, +ComplaintStatus status, +string priority, +string category, +string customer_id, +string tenant_id, +string created_at, +string updated_at }
    class ActivityLog { +string id, +string complaint_id, +string user_id, +string action, +string timestamp, +string note }
    class useStore { +CMSState state, +selectAccount(tenantId), +joinOrganization(tenantId, role), +logout(), +addComplaint(data), +updateComplaintStatus(id, status, note), +addMessage(complaintId, note, isInternal), +clearNotification(complaintId) }
    useStore ..> User
    useStore ..> Complaint
    useStore ..> Tenant
    useStore ..> ActivityLog`;

  const mermaidBehavioural = `sequenceDiagram
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
    P->>P: navigate('/complaints')`;

  const plantUmlErd = `@startuml Data_Design_ERD
!theme plain
hide circle
skinparam linetype ortho

entity "Tenant" as tenant {
  *id : TEXT <<PK>>
  --
  name : TEXT
  logo : TEXT
  primaryColor : TEXT
}

entity "Profile" as profile {
  *id : UUID <<PK>> <<FK>>
  --
  email : TEXT
  name : TEXT
  role : TEXT
  tenant_id : TEXT <<FK>>
  updated_at : TIMESTAMP
}

entity "Complaint" as complaint {
  *id : TEXT <<PK>>
  --
  title : TEXT
  description : TEXT
  status : TEXT
  priority : TEXT
  category : TEXT
  customer_id : UUID <<FK>>
  tenant_id : TEXT <<FK>>
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}

entity "ActivityLog" as log {
  *id : UUID <<PK>>
  --
  complaint_id : TEXT <<FK>>
  user_id : UUID <<FK>>
  action : TEXT
  note : TEXT
  timestamp : TIMESTAMP
}

tenant ||--o{ profile : "has many"
profile ||--o{ complaint : "logs"
complaint ||--o{ log : "has history"
profile ||--o{ log : "performs"
@enduml`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Architecture & Design</h1>
          <p className="text-slate-500 mt-1">Technical documentation and C4 model representation for ResolvePro CMS.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => window.open('https://mermaid.live', '_blank')}>
          <Globe size={16} />
          Open Mermaid Live Editor
        </Button>
      </div>

      <Tabs defaultValue="stack" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="stack">Tech Stack</TabsTrigger>
          <TabsTrigger value="c4">C4 Model</TabsTrigger>
          <TabsTrigger value="mermaid">Diagram Source</TabsTrigger>
          <TabsTrigger value="data">Data Design</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="stack">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Cpu size={20} /> Frontend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>React 18:</strong> Component-based UI library.</p>
                <p><strong>TypeScript:</strong> Type-safe development.</p>
                <p><strong>Tailwind CSS:</strong> Utility-first styling.</p>
                <p><strong>Shadcn/UI:</strong> Accessible component primitives.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  <Layers size={20} /> State & Logic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Custom Store:</strong> Observer-pattern state management.</p>
                <p><strong>React Router 6:</strong> Client-side navigation.</p>
                <p><strong>Recharts:</strong> Data visualization engine.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Box size={20} /> Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Vite:</strong> Next-generation frontend tooling.</p>
                <p><strong>Multi-tenant:</strong> Logical data isolation.</p>
                <p><strong>RBAC:</strong> Role-based access control system.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="c4" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code2 size={18} /> Level 4: Structural</CardTitle>
                <CardDescription>Code-level class and type relationships.</CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                <div className="text-center space-y-2">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 font-mono text-[10px]">
                    useStore -> [User, Complaint, Tenant, ActivityLog]
                  </div>
                  <ArrowRight className="mx-auto text-slate-300 rotate-90" />
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 font-mono text-[10px]">
                    Pages -> useStore
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity size={18} /> Level 4: Behavioural</CardTitle>
                <CardDescription>Execution flow for core business logic.</CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                <div className="space-y-2 w-full max-w-[200px]">
                  <div className="h-2 bg-primary/20 rounded w-full" />
                  <div className="h-2 bg-primary/40 rounded w-3/4" />
                  <div className="h-2 bg-primary/60 rounded w-1/2" />
                  <div className="h-2 bg-primary/80 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mermaid" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Mermaid: Structural (Level 4)</CardTitle>
                <Button variant="outline" size="sm" className="h-8" onClick={() => copyToClipboard(mermaidStructural, 'structural')}>
                  {copied === 'structural' ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg text-[10px] overflow-x-auto font-mono">
                  {mermaidStructural}
                </pre>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Mermaid: Behavioural (Level 4)</CardTitle>
                <Button variant="outline" size="sm" className="h-8" onClick={() => copyToClipboard(mermaidBehavioural, 'behavioural')}>
                  {copied === 'behavioural' ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg text-[10px] overflow-x-auto font-mono">
                  {mermaidBehavioural}
                </pre>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">PlantUML: Data Design (ERD)</CardTitle>
                <Button variant="outline" size="sm" className="h-8" onClick={() => copyToClipboard(plantUmlErd, 'plantuml')}>
                  {copied === 'plantuml' ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg text-[10px] overflow-x-auto font-mono">
                  {plantUmlErd}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database size={20} className="text-primary" /> Database Schema</CardTitle>
                <CardDescription>Relational structure and multi-tenant isolation model.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <TableIcon size={14} /> Profiles
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">id</span>
                        <Key size={12} className="text-amber-500" />
                      </div>
                      <p className="text-[10px] text-slate-500">UUID (PK) - Auth Link</p>
                      <div className="h-px bg-slate-200 my-2" />
                      <p className="text-[10px] font-medium text-slate-600">email, name, role, tenant_id</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <TableIcon size={14} /> Complaints
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">id</span>
                        <Key size={12} className="text-amber-500" />
                      </div>
                      <p className="text-[10px] text-slate-500">TEXT (PK) - Short ID</p>
                      <div className="h-px bg-slate-200 my-2" />
                      <p className="text-[10px] font-medium text-slate-600">title, status, priority, customer_id, tenant_id</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <TableIcon size={14} /> Activity Logs
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">id</span>
                        <Key size={12} className="text-amber-500" />
                      </div>
                      <p className="text-[10px] text-slate-500">UUID (PK)</p>
                      <div className="h-px bg-slate-200 my-2" />
                      <p className="text-[10px] font-medium text-slate-600">complaint_id, user_id, action, note, timestamp</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader>
                <CardTitle className="text-sm">Entity Relationships</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p>• <strong>Tenant (1:N) Profiles:</strong> Users are scoped to a single organization.</p>
                <p>• <strong>Profile (1:N) Complaints:</strong> Customers can log multiple issues.</p>
                <p>• <strong>Complaint (1:N) ActivityLogs:</strong> Full audit trail for every status change or message.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="text-emerald-400" /> Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-emerald-400">Supabase Auth (GoTrue)</p>
                  <p className="text-xs opacity-70">JWT-based identity management with secure session handling.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-emerald-400">MFA & SSO Ready</p>
                  <p className="text-xs opacity-70">Architectural support for Multi-Factor Authentication and Enterprise SSO (SAML/OIDC).</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="text-amber-400" /> Authorisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-amber-400">RBAC Model</p>
                  <p className="text-xs opacity-70">Granular roles: Consumer, Agent, Support, Manager, Admin.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-amber-400">Row Level Security (RLS)</p>
                  <p className="text-xs opacity-70">Database-level enforcement of multi-tenant isolation and data ownership.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="text-blue-400" /> Encryption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-blue-400">In Transit (TLS 1.3)</p>
                  <p className="text-xs opacity-70">All client-server communication is encrypted via modern TLS standards.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-blue-400">At Rest (AES-256)</p>
                  <p className="text-xs opacity-70">Database storage is encrypted using industry-standard AES-256.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="text-purple-400" /> Audit & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-purple-400">Immutable Audit Trail</p>
                  <p className="text-xs opacity-70">Every transactional change is logged in `activity_logs` for compliance reporting.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="font-bold text-purple-400">GDPR Compliance</p>
                  <p className="text-xs opacity-70">Strict data isolation ensures privacy and prevents cross-tenant data leakage.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Architecture;