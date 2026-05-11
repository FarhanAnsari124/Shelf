import React from "react";

export default function Avatar({ name, src, size = 36, fontSize }) {
  if (!name && !src) return null;
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const fSize = fontSize || Math.max(10, size * 0.4);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full text-white pp font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #818CF8, #4F46E5)",
        fontSize: fSize,
      }}
    >
      {initial}
    </div>
  );
}
