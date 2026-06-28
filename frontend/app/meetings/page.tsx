"use client";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMeetings } from "@/lib/api";
import MeetingCard from "@/components/MeetingCard";
import NewMeetingModal from "@/components/NewMeetingModal";
import { Search, Plus, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function MeetingsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [showNew, setShowNew] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings", debouncedSearch, sort],
    queryFn: () => getMeetings({ search: debouncedSearch || undefined, sort }),
  });

  return (
    <div className="min-h-full">
      {/* Topbar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Meetings</h1>
          <p className="text-sm text-gray-500">{meetings.length} meeting{meetings.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 max-w-md ml-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search meetings..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400"
              style={{ "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            <Plus size={16} />
            New Meeting
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="grid gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--accent-light)" }}>
              <Search size={24} style={{ color: "var(--accent)" }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No meetings found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {search ? `No results for "${search}"` : "Create your first meeting to get started"}
            </p>
            {!search && (
              <button
                onClick={() => setShowNew(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: "var(--accent)" }}
              >
                Create meeting
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {meetings.map(m => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        )}
      </div>

      {showNew && <NewMeetingModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
