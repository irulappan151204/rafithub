"use client";

import { useCallback, useState } from "react";
import { createRealtimeClient, type SealedLiveQuery } from "@neon/realtime/client";
import { RealtimeProvider, useLiveQuery } from "@neon/realtime-react";
import type { LiveLeadRow } from "@/lib/realtime";

interface RealtimeDashboardFeedProps {
  realtimeUrl: string | null;
  initialLeads: Array<{
    id: string;
    name: string;
    phone: string;
    interest: string | null;
    source: string;
    status: string;
    createdAt: string | Date;
  }>;
  sealedLeadsQuery: SealedLiveQuery<LiveLeadRow> | null;
}

function LiveLeadsInner({
  sealedQuery,
  initialData,
}: {
  sealedQuery: SealedLiveQuery<LiveLeadRow>;
  initialData: LiveLeadRow[];
}) {
  const [query] = useState(sealedQuery);

  const refreshQuery = useCallback(async () => {
    const res = await fetch("/api/admin/realtime/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "leads" }),
    });
    if (!res.ok) throw new Error(`Refresh failed (${res.status})`);
    return (await res.json()) as SealedLiveQuery<LiveLeadRow>;
  }, []);

  const { data, status, error } = useLiveQuery(query, {
    refreshQuery,
    initialData,
  });

  const rows = data ?? initialData;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--muted-foreground)]">
          Neon Realtime status:{" "}
          <strong className="text-[var(--primary)]">{status}</strong>
        </span>
        {error && <span className="text-red-400">{error.message}</span>}
      </div>
      <LeadsList rows={rows} />
    </div>
  );
}

function LeadsList({
  rows,
}: {
  rows: ReadonlyArray<{
    id: string;
    name: string;
    phone: string;
    interest: string | null;
    source: string;
    status: string;
    createdAt: string | Date;
  }>;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-[var(--muted-foreground)] py-4">
        No enquiries yet. Public trial and join forms appear here live.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[var(--border)]">
      {rows.map((lead) => (
        <div key={lead.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <div className="min-w-0">
            <p className="font-medium truncate">{lead.name}</p>
            <p className="text-xs text-[var(--muted-foreground)] truncate">
              {lead.phone} · {lead.interest || lead.source}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-semibold">
            {lead.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RealtimeDashboardFeed({
  realtimeUrl,
  initialLeads,
  sealedLeadsQuery,
}: RealtimeDashboardFeedProps) {
  const [client] = useState(() =>
    realtimeUrl ? createRealtimeClient({ url: realtimeUrl }) : null
  );

  const normalizedInitial: LiveLeadRow[] = initialLeads.map((l) => ({
    ...l,
    createdAt: l.createdAt instanceof Date ? l.createdAt : new Date(l.createdAt),
  }));

  if (!client || !sealedLeadsQuery) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-[var(--muted-foreground)]">
          Live WebSocket stream connects once Neon Realtime env vars are provisioned.
        </p>
        <LeadsList rows={normalizedInitial} />
      </div>
    );
  }

  return (
    <RealtimeProvider client={client}>
      <LiveLeadsInner sealedQuery={sealedLeadsQuery} initialData={normalizedInitial} />
    </RealtimeProvider>
  );
}
