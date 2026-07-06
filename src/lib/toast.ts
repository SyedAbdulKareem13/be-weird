"use client";

/**
 * Tiny event-bus toast. Any component fires `toast("COORDINATES COPIED")`;
 * the <Toaster/> in the archive chrome renders it. No context needed.
 */

export type ArchiveToast = {
  message: string;
  id: number;
};

export const TOAST_EVENT = "archive-toast";

let nextId = 0;

export function toast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ArchiveToast>(TOAST_EVENT, {
      detail: { message, id: nextId++ },
    })
  );
}
