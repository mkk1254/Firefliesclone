"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Search as SearchIcon, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { formatTimestamp } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => globalSearch(debounced),
    enabled: debounced.length >= 1,
  });

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">Search</h1>
        <div className="relative max-w-2xl">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all meetings and transcripts..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
          />
        </div>
      </header>

      <div className="p-6 max-w-3xl">
        {!debounced && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <SearchIcon size={22} className="text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm">Search meetings by title, participant, or transcript content</p>
          </div>
        )}

        {isLoading && debounced && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-gray-100" />)}
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {data.meetings.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Meetings</h3>
                <div className="space-y-2">
                  {data.meetings.map((m: { id: number; title: string; date: string; participants: string[] }) => (
                    <Link key={m.id} href={`/meetings/${m.id}`}>
                      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.title}</p>
                          <p className="text-xs text-gray-400">{m.participants.join(", ")}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data.transcript_hits.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Transcript Matches</h3>
                <div className="space-y-2">
                  {data.transcript_hits.map((h: { meeting_id: number; segment_id: number; speaker: string; text: string; start_time: number }) => (
                    <Link key={h.segment_id} href={`/meetings/${h.meeting_id}`}>
                      <div className="p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-purple-600">{h.speaker}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                            <Clock size={11} />{formatTimestamp(h.start_time)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{h.text}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data.meetings.length === 0 && data.transcript_hits.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                No results found for "{debounced}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
