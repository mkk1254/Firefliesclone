"use client";
import { useState, useRef, useEffect } from "react";
import { TranscriptSegment, Participant } from "@/lib/api";
import { formatTimestamp, getInitials } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface Props {
  segments: TranscriptSegment[];
  participants: Participant[];
  currentTime: number;
  onSeek: (t: number) => void;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <span>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{p}</mark>
          : p
      )}
    </span>
  );
}

export default function TranscriptPanel({ segments, participants, currentTime, onSeek }: Props) {
  const [search, setSearch] = useState("");
  const activeRef = useRef<HTMLDivElement>(null);

  const colorMap = Object.fromEntries(participants.map(p => [p.name, p.color_hex]));

  const filtered = search.trim()
    ? segments.filter(s => s.text.toLowerCase().includes(search.toLowerCase()) || s.speaker_name.toLowerCase().includes(search.toLowerCase()))
    : segments;

  const activeIdx = segments.reduce((best, seg, i) => {
    if (currentTime >= seg.start_time_seconds && currentTime < seg.end_time_seconds) return i;
    return best;
  }, -1);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIdx]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search bar */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transcript..."
            className="w-full pl-9 pr-9 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-gray-400 mt-1.5">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Segments */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
        {segments.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No transcript available for this meeting.
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No results for "{search}"
          </div>
        ) : (
          filtered.map((seg) => {
            const isActive = seg.sequence_order === activeIdx;
            const color = colorMap[seg.speaker_name] || "#7c3aed";
            return (
              <div
                key={seg.id}
                ref={isActive ? activeRef : null}
                onClick={() => onSeek(seg.start_time_seconds)}
                className={`flex gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${
                  isActive ? "bg-purple-50 ring-1 ring-purple-200" : "hover:bg-gray-50"
                }`}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: color }}
                >
                  {getInitials(seg.speaker_name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color }}>{seg.speaker_name}</span>
                    <button
                      onClick={e => { e.stopPropagation(); onSeek(seg.start_time_seconds); }}
                      className="text-xs text-gray-400 hover:text-purple-600 font-mono transition-colors"
                    >
                      {formatTimestamp(seg.start_time_seconds)}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {highlight(seg.text, search)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
