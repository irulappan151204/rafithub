"use client";

import { useState } from "react";

interface MemberPassCardProps {
  memberCode: string;
  memberName: string;
  status: string;
}

function buildDeterministicMatrix(seed: string, size = 11): boolean[][] {
  const grid: boolean[][] = [];
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 3 && c < 3;
      const inTopRight = r < 3 && c >= size - 3;
      const inBottomLeft = r >= size - 3 && c < 3;
      if (inTopLeft || inTopRight || inBottomLeft) {
        const isBorder =
          r === 0 ||
          c === 0 ||
          r === size - 1 ||
          c === size - 1 ||
          r === 2 ||
          c === 2 ||
          r === size - 3 ||
          c === size - 3;
        row.push(isBorder);
        continue;
      }
      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      row.push((hash >>> 24) % 2 === 0);
    }
    grid.push(row);
  }
  return grid;
}

export function MemberPassCard({ memberCode, memberName, status }: MemberPassCardProps) {
  const [copied, setCopied] = useState(false);
  const payload = `RAFITHUB:${memberCode}`;
  const matrix = buildDeterministicMatrix(payload);

  async function copyPayload() {
    await navigator.clipboard?.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 flex items-center gap-4">
      <div className="rounded-lg bg-white p-2 shrink-0" aria-label={`QR Pass for ${memberCode}`}>
        <svg width="68" height="68" viewBox="0 0 11 11" shapeRendering="crispEdges">
          <rect width="11" height="11" fill="#ffffff" />
          {matrix.map((row, r) =>
            row.map((filled, c) =>
              filled ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#09090b" /> : null
            )
          )}
        </svg>
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold">
          Member Check-in Pass ({status})
        </p>
        <p className="font-mono text-sm font-bold truncate">{payload}</p>
        <p className="text-xs text-[var(--muted-foreground)] truncate">{memberName}</p>
        <button
          type="button"
          onClick={copyPayload}
          className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
        >
          {copied ? "Copied QR code payload" : "Copy QR payload"}
        </button>
      </div>
    </div>
  );
}
