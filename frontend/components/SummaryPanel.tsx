"use client";
import { Summary } from "@/lib/api";
import { Sparkles, BookOpen, Tag, List } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface Props {
  summary: Summary | null;
  onGenerate: () => void;
  generating: boolean;
}

export default function SummaryPanel({ summary, onGenerate, generating }: Props) {
  if (!summary) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--accent-light)" }}>
          <Sparkles size={22} style={{ color: "var(--accent)" }} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">No summary yet</h3>
        <p className="text-sm text-gray-500 mb-5 max-w-xs">
          Generate an AI summary to get an overview, key topics, and chapters for this meeting.
        </p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-opacity hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          <Sparkles size={14} />
          {generating ? "Generating..." : "Generate Summary"}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Overview */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Overview</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-purple-50 rounded-xl px-4 py-3">
            {summary.overview}
          </p>
        </section>

        {/* Key Topics */}
        {summary.key_topics?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Key Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.key_topics.map((topic: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium text-purple-700 border border-purple-200 bg-purple-50">
                  {topic}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Chapters */}
        {summary.chapters?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <List size={16} className="text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Chapters</h3>
            </div>
            <div className="space-y-2">
              {summary.chapters.map((ch: { title: string; start_time_hint: number }, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer group">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-purple-600 bg-purple-100 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-800 flex-1">{ch.title}</span>
                  <span className="text-xs font-mono text-gray-400 group-hover:text-purple-500 transition-colors">
                    {formatTimestamp(ch.start_time_hint)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
