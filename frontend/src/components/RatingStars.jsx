import React, { useState, useEffect, useRef } from "react";
import {
  Star
} from "lucide-react";

export default function RatingStars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={11} fill="#FBBF24" color="#FBBF24" />
      <span className="pp text-xs font-semibold text-gray-600">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
