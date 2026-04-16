"use client";

import { useEffect } from "react";

import { clearStoredSessions } from "@/lib/session-storage";

export function ClearSessionsOnMount() {
  useEffect(() => {
    clearStoredSessions("all");
  }, []);

  return null;
}
