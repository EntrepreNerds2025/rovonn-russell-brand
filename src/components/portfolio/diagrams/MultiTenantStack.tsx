/**
 * Multi-tenant - defense-in-depth security stack diagram.
 */
const layers = [
  { label: "UI route guards", body: "Client-side: route components check role + tenant before render. First defense, easily bypassed by determined attackers - never sole.", color: "hsl(var(--accent))" },
  { label: "Edge function role checks", body: "Every tenant-scoped function calls resolveTenant + role guard at the top. 401 returned before any work happens.", color: "hsl(var(--accent-deep))" },
  { label: "Postgres Row-Level Security", body: "RLS policies on every tenant-scoped table. Even if app-level checks are bypassed, the database refuses cross-tenant reads.", color: "hsl(28 60% 30%)" },
  { label: "Audit trail", body: "agent_feed, action_queue, autopilot_actions, all tenant-scoped. Every action is queryable, attributable, reversible.", color: "hsl(30 30% 20%)" },
];

export const MultiTenantStack = () => (
  <div className="bg-secondary border border-border rounded-md p-6 md:p-10 my-10">
    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-2">
      Defense in Depth
    </p>
    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
      Four security layers. Each one is the last line of defense.
    </h3>

    <div className="space-y-3">
      {layers.map((l, idx) => (
        <div
          key={l.label}
          className="bg-card border border-border rounded-md p-5 flex items-stretch gap-5"
        >
          <div
            className="w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: l.color }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-2xl font-serif font-bold opacity-30">0{idx + 1}</span>
              <h4 className="font-serif text-lg font-bold">{l.label}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-10">{l.body}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 grid md:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-md p-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">Provisioning</p>
        <p className="text-2xl font-serif font-bold mb-1">{`<30s`}</p>
        <p className="text-xs text-muted-foreground">end-to-end new tenant setup, atomic rollback on failure</p>
      </div>
      <div className="bg-card border border-border rounded-md p-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">Roles</p>
        <p className="text-2xl font-serif font-bold mb-1">5</p>
        <p className="text-xs text-muted-foreground">owner / admin / advisor / contractor / client_portal</p>
      </div>
      <div className="bg-card border border-border rounded-md p-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-deep mb-2">Stripe</p>
        <p className="text-2xl font-serif font-bold mb-1">Connect</p>
        <p className="text-xs text-muted-foreground">cross-tenant payment routing built in from day one</p>
      </div>
    </div>
  </div>
);

export default MultiTenantStack;
