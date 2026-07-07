"use client";

/** Boring-mode masthead action: the page itself is the resume — print it. */
export default function PrintButton() {
  return (
    <button
      type="button"
      data-cursor="INSPECT"
      data-print-hidden
      onClick={() => window.print()}
      className="text-[0.8125rem] font-medium text-[#1F4FD8] underline-offset-4 hover:underline"
    >
      Print / Save PDF ⎙
    </button>
  );
}
