import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/grazu-navigation";
import { adminActivity, useAdminUsers } from "@/lib/admin-users";

export const Route = createFileRoute("/admin/")({
  head: () => pageHead("Admin Dashboard", "Ringkasan administrasi pengguna dan organisasi platform GRAZU-AI."),
  component: AdminDashboard,
});

const statusTone: Record<string, string> = { Berhasil: "text-primary", Menunggu: "text-muted-foreground", Gagal: "text-destructive" };

function AdminDashboard() {
  const users = useAdminUsers();
  const kpis = [
    ["Total pengguna", users.length],
    ["Organisasi terdaftar", new Set(users.map((u) => u.org)).size],
    ["Client aktif", users.filter((u) => u.role === "Client" && u.status === "Aktif").length],
    ["Admin / Customer Service", users.filter((u) => u.role === "Admin / Customer Service").length],
  ] as const;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ringkasan administrasi platform. Data merupakan simulasi demo.</p>
        </div>
        <Button asChild><Link to="/admin/users">Kelola Pengguna</Link></Button>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border lg:grid-cols-4">
        {kpis.map(([label, value]) => (
          <div key={label} className="bg-card p-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-3 text-sm font-semibold">Aktivitas Administrasi</h2>
        <div className="overflow-x-auto rounded-md border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>{["User", "Action", "Target", "Timestamp", "Status"].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {adminActivity.map((a, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{a.user}</td>
                  <td className="px-4 py-3">{a.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.target}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{a.time}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${statusTone[a.status]}`}>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
