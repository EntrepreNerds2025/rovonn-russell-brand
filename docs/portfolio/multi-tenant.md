# Multi-Tenant SaaS Architecture for an Agency CRM

**Built for:** EntrepreNerds Agency (entre-nerd-dash)
**Role:** Architected and built end-to-end
**Stack:** Supabase (Postgres + Edge Functions + Row-Level Security), Deno, Stripe Connect, custom tenant provisioning, role-scoped access control

---

## The problem

Most agency CRMs are single-tenant. The agency uses one. If they want to give a client read access to their own portal, the workaround is usually shared logins, screen-shares, or manual exports. Each of those breaks down at the second client.

The EntrepreNerds dashboard had to be different from the start. The same code base needed to serve:
- The agency's own internal operations (leads, pipeline, invoices, contracts, content production, agent runs)
- Each client's portal (their messages, their invoices, their proposals, their delivered work)
- Contractors and team members with role-scoped access
- Eventually, the platform itself as a multi-tenant SaaS for other agencies

Doing that as one-tenant-and-then-figure-it-out is the move that paints you into a corner. The system needed to be tenant-aware in every layer - every database row, every edge function, every UI route - from day one.

That's the architecture documented here. Provisioning, role scoping, tenant-aware edge functions, and Stripe Connect for payment routing.

## Architecture

**provision-tenant.** Single edge function that bootstraps a new tenant: creates the tenant row, creates the default admin user, seeds the default agent_config (James thresholds, Yaaba slot schedule, Truesight cooldowns, Kwesi categorization rules), creates the default content folders, fires the welcome flow. End-to-end provisioning runs in under 30 seconds.

**manage-tenant-user.** Role-scoped user management. Every user belongs to a tenant and has a role (owner, admin, advisor, contractor, client_portal). Role checks happen at the edge function level, not just in the UI - even if a client portal user reverse-engineered an admin endpoint, the function would reject them.

**Row-Level Security (RLS) at the database layer.** Postgres RLS policies on every tenant-scoped table enforce that a user can only read/write rows where the tenant_id matches their session's tenant. RLS isn't a substitute for application-level checks - it's the second layer. Application code checks first, RLS catches anything that slipped through.

**Tenant resolution in every edge function.** A shared utility (`_shared/yaaba-pipeline.ts` exposes `resolveTenant`) takes the request and returns the tenant_id from either the JWT, an explicit header, or the request body - depending on the auth pattern of the caller. Every tenant-scoped function calls resolveTenant first. If resolution fails, the function returns 401 before any work happens.

**Function-level enable/disable per tenant.** A tenant can have specific functions disabled (compliance, plan tier, custom request). The shared utility `isFunctionEnabled` checks the tenant's feature flags before doing work. If a tenant doesn't have access to Yaaba sourcing, calling yaaba-spec-generator returns 403 with a clear error.

**Stripe Connect for payment routing.**
- stripe-connect-onboard initiates the Connect onboarding flow for a new tenant
- stripe-connect-status returns the current onboarding state
- stripe-connect-create-payment routes payments through the tenant's Stripe Connect account, with platform fees configured at provisioning time
- stripe-connect-webhook handles Stripe events (payment success, payout, dispute, etc.) and routes them to the right tenant
- stripe-connect-disconnect cleanly tears down the Connect account when a tenant churns

This is the architectural call that lets the platform support multiple agency tenants who each take payments directly through their own Stripe accounts, with the platform taking an explicit fee - instead of routing all payments through one Stripe account and reconciling manually.

**Tenant-scoped agent runs.** Every agent function (James, Yaaba, Truesight, Kwesi, Denise, Amara, Zara, Soren) reads its config from agent_config WHERE tenant_id = current_tenant. This means James's archive thresholds for tenant A can be 0.65 and for tenant B can be 0.85, and the same code runs both correctly.

**Audit trail per tenant.** agent_feed, action_queue, james_autopilot_actions, and every other audit table is tenant-scoped. Tenant A's owner sees only tenant A's audit trail. The platform admin can query across tenants for system-level diagnostics, but that requires platform-admin role, not tenant-admin.

## What makes the architecture work

**Tenant context resolved once per request, then carried.** resolveTenant returns the tenant_id at the top of every function. From there, every database query filters by tenant_id explicitly (don't trust RLS alone), and every downstream peer-call passes the tenant_id forward. No "global" mode that bypasses tenant scoping.

**Role checks at the function level, RLS at the database level.** Defense in depth. The application enforces "this user has access to this function." RLS enforces "even if you got past the application, you can't see other tenants' data."

**Feature flags at the tenant level, not the user level.** Whole functions can be enabled/disabled per tenant, which is the right granularity for compliance, plan tier, or custom client setups. Per-user feature flags would explode the matrix.

**Stripe Connect from the start.** Refactoring single-tenant Stripe to Stripe Connect is a multi-month migration. Building it Connect-first costs one extra week of setup. Build it right early.

**Provisioning as a single function, not a workflow.** New tenant onboarding is a single edge function call. Everything that needs to happen happens. Failure is atomic - if any step fails, the function rolls back and the tenant doesn't exist in a partial state.

## Result

A CRM platform that runs internal agency operations and external client portals from the same code base, with clean separation of data and clean separation of payments. Adding a new tenant is a single function call. Adding a new role is a config change. Adding a new agent is a new edge function with `resolveTenant` at the top.

Same architecture would carry the platform into multi-agency SaaS distribution without rewriting the foundation.

## What this proves

System-architecture thinking, not just feature-level thinking. Production multi-tenancy with row-level security, role-scoping, and feature flags. Real Stripe Connect integration for payment routing across tenants. Defense-in-depth security design. Pattern is portable to any platform that needs to serve multiple buyers from one product.
