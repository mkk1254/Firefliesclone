"use client";
import { use, useRef, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeeting, deleteMeeting, updateMeeting, generateSummary } from "@/lib/api";
import { formatDuration, formatDate, formatTimestamp, getInitials } from "@/lib/utils";
import TranscriptPanel from "@/components/TranscriptPanel";
import SummaryPanel from "@/components/SummaryPanel";
import ActionItemsPanel from "@/components/ActionItemsPanel";
import MediaPlayer from "@/components/MediaPlayer";
import { ArrowLeft, Pencil, Trash2, Sparkles, Clock, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const TABS = ["Transcript", "Summary", "Action Items"] as const;
type Tab = typeof TABS[number];

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const meetingId = parseInt(id);
  const router = useRouter();
  const qc = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>("Transcript");
  const [currentTime, setCurrentTime] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: meeting, isLoading } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => getMeeting(meetingId),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteMeeting(meetingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      toast.success("Meeting deleted");
      router.push("/meetings");
    },
  });

  const updateMut = useMutation({
    mutationFn: (title: string) => updateMeeting(meetingId, { title }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meeting", meetingId] });
      qc.invalidateQueries({ queryKey: ["meetings"] });
      toast.success("Title updated");
      setEditingTitle(false);
    },
  });

  const generateMut = useMutation({
    mutationFn: () => generateSummary(meetingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meeting", meetingId] });
      toast.success("Summary generated!");
      setActiveTab("Summary");
    },
    onError: () => toast.error("Failed to generate summary"),
  });

  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
    setCurrentTime(seconds);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-96 bg-white rounded-xl animate-pulse mt-6" />
      </div>
    );
  }

  if (!meeting) return <div className="p-6 text-gray-500">Meeting not found</div>;

  return (
    <div className="min-h-full flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start gap-4">
          <Link href="/meetings" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors mt-0.5">
            <ArrowLeft size={18} className="text-gray-500" />
          </Link>
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={e => setTitleDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") updateMut.mutate(titleDraft);
                    if (e.key === "Escape") setEditingTitle(false);
                  }}
                  className="text-xl font-semibold text-gray-900 border-b-2 border-purple-500 focus:outline-none bg-transparent flex-1"
                />
                <button onClick={() => updateMut.mutate(titleDraft)} className="text-sm text-purple-600 font-medium hover:text-purple-700">Save</button>
                <button onClick={() => setEditingTitle(false)} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-xl font-semibold text-gray-900 truncate">{meeting.title}</h1>
                <button
                  onClick={() => { setTitleDraft(meeting.title); setEditingTitle(true); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-all"
                >
                  <Pencil size={14} className="text-gray-400" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(meeting.date)}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} />{formatDuration(meeting.duration_seconds)}</span>
              <span className="flex items-center gap-1.5"><Users size={13} />{meeting.participants.length} participants</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => generateMut.mutate()}
              disabled={generateMut.isPending}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors disabled:opacity-50"
            >
              <Sparkles size={14} />
              {generateMut.isPending ? "Generating..." : "Re-generate AI Summary"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Participants */}
        {meeting.participants.length > 0 && (
          <div className="flex items-center gap-2 mt-3 ml-10">
            <div className="flex -space-x-1.5">
              {meeting.participants.slice(0, 6).map(p => (
                <div key={p.id} title={p.name}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: p.color_hex }}>
                  {getInitials(p.name)}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-400">{meeting.participants.map(p => p.name).join(", ")}</span>
          </div>
        )}
      </header>

      {/* Media player */}
      <MediaPlayer audioRef={audioRef} onTimeUpdate={setCurrentTime} duration={meeting.duration_seconds} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {tab}
              {tab === "Action Items" && meeting.action_items.length > 0 && (
                <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {meeting.action_items.filter(a => !a.is_completed).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "Transcript" && (
          <TranscriptPanel
            segments={meeting.transcript_segments}
            participants={meeting.participants}
            currentTime={currentTime}
            onSeek={seekTo}
          />
        )}
        {activeTab === "Summary" && (
          <SummaryPanel summary={meeting.summary} onGenerate={() => generateMut.mutate()} generating={generateMut.isPending} />
        )}
        {activeTab === "Action Items" && (
          <ActionItemsPanel meetingId={meetingId} items={meeting.action_items} />
        )}
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete meeting?</h3>
            <p className="text-sm text-gray-500 mb-5">
              "{meeting.title}" and all its transcripts, summaries and action items will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
              <button
                onClick={() => deleteMut.mutate()}
                disabled={deleteMut.isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMut.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
