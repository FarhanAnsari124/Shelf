import React, { useState, useEffect, useRef } from "react";


export default function ConditionBadge({ c }) {
  const map = {
    New: ["#15803d", "#dcfce7"],
    "Like New": ["#1d4ed8", "#dbeafe"],
    Good: ["#b45309", "#fef3c7"],
    Used: ["#9333ea", "#f3e8ff"],
    "For Parts": ["#dc2626", "#fee2e2"],
  };
  const [color, bg] = map[c] || ["#666", "#f5f5f5"];
  return (
    <span
      className="pp text-xs font-bold px-2.5 py-0.5 rounded-full"
      style={{ color, background: bg }}
    >
      {c}
    </span>
  );
}
