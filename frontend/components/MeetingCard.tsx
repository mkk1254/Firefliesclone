"use client";
import Link from "next/link";
import { MeetingListItem } from "@/lib/api";
import { formatDuration, formatRelativeDate, getInitials } from "@/lib/utils";
import { Clock, Calendar, ChevronRight } from "lucide-react";

export default function MeetingCard({ meeting }: { meeting: MeetingListItem }) {
  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate group-hover:text-purple-700 transition-colors">
              {meeting.title}
            </h3>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatRelativeDate(meeting.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {formatDuration(meeting.duration_seconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Participant avatars */}
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  title={p.name}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: p.color_hex, zIndex: meeting.participants.length - i }}
                >
                  {getInitials(p.name)}
                </div>
              ))}
              {meeting.participants.length > 4 && (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{meeting.participants.length - 4}
                </div>
              )}
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
          </div>
        </div>

        {meeting.participants.length > 0 && (
          <div className="mt-2 text-xs text-gray-400 truncate">
            {meeting.participants.map(p => p.name).join(", ")}
          </div>
        )}
      </div>
    </Link>
  );
}
