"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-outline col-span-2 w-full !py-3">
      Print card
    </button>
  );
}
