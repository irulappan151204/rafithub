"use client";

export function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary px-5 py-2 text-xs print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
