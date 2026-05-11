import React, { useState, useEffect, useRef } from "react";
import {
  Shield
} from "lucide-react";

export default function TrustBadge({ score }) {
  const c =
    score >= 90
      ? "#15803d"
      : score >= 75
        ? "#1d4ed8"
        : score >= 60
          ? "#b45309"
          : "#dc2626";
  return (
    <span
      className="pp inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c + "18", color: c }}
    >
      <Shield size={10} /> {score}
    </span>
  );
}
