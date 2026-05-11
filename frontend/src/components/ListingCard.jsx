import React from "react";
import { Heart, Clock, Box } from "lucide-react";
import RatingStars from "./RatingStars";
import ConditionBadge from "./ConditionBadge";
import Avatar from "./Avatar";
import { CATEGORIES, fmtPrice, timeAgo } from "../data";

export default function ListingCard({ item, onClick, savedIds, onToggleSave }) {
  const saved = savedIds.includes(item.id);
  const CatIcon = CATEGORIES.find((c) => c.label === item.category)?.icon || Box;
  const discount =
    item.mrp > 0 && item.mrp !== item.price
      ? Math.round((1 - item.price / item.mrp) * 100)
      : 0;

  return (
    <div
      className="lift bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden" style={{ height: 180, background: "#F8F7F5" }}>
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CatIcon size={48} color="#ccc" />
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(item.id);
          }}
          className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white shadow"
          style={{
            width: 32,
            height: 32,
            border: "none",
            cursor: "pointer",
            transition: "transform .18s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Heart
            size={13}
            fill={saved ? "#FF3300" : "none"}
            color={saved ? "#FF3300" : "#ccc"}
          />
        </button>

        <div className="absolute top-3 left-3">
          <ConditionBadge c={item.condition} />
        </div>

        {discount > 0 && (
          <div
            className="pp absolute bottom-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#FF3300", color: "#fff" }}
          >
            {discount}% off
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="pp text-sm font-semibold text-gray-900 leading-snug mb-3 line-clamp-2">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="pp font-extrabold text-lg" style={{ color: "#FF3300" }}>
              {fmtPrice(item.price)}
            </span>
            {item.mrp > 0 && item.mrp !== item.price && (
              <span className="text-xs text-gray-400 line-through">{fmtPrice(item.mrp)}</span>
            )}
          </div>
          <RatingStars rating={item.seller.avgRating} />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <Avatar name={item.seller.name} size={24} fontSize={9} />
            <span className="text-xs text-gray-500">{item.seller.name}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={10} />
            {timeAgo(item.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
