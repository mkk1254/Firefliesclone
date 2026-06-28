"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeeting } from "@/lib/api";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props { onClose: () => void; }

export default function NewMeetingModal({ onClose }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [transcript, setTranscript] = useState("");
  const [participants, setParticipants] = useState([{ name: "", email: "" }]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => createMeeting({
      title,
      date: new Date(date).toISOString(),
      participants: participants.filter(p => p.name.trim()),
      transcript_text: transcript || undefined,
    }),
    onSuccess: (meeting) => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      toast.success("Meeting created!");
      onClose();
      router.push(`/meetings/${meeting.id}`);
    },
    onError: () => toast.error("Failed to create meeting"),
  });

  const addParticipant = () => setParticipants(p => [...p, { name: "", email: "" }]);
  const removeParticipant = (i: number) => setParticipants(p => p.filter((_, idx) => idx !== i));
  const updateParticipant = (i: number, field: "name" | "email", val: string) =>
    setParticipants(p => p.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">New Meeting</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Q2 Planning Session"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time *</label>
            <input
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Participants</label>
              <button onClick={addParticipant} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium">
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {participants.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={p.name}
                    onChange={e => updateParticipant(i, "name", e.target.value)}
                    placeholder="Name"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                  <input
                    value={p.email}
                    onChange={e => updateParticipant(i, "email", e.target.value)}
                    placeholder="Email (optional)"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                  {participants.length > 1 && (
                    <button onClick={() => removeParticipant(i)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Transcript (optional)</label>
            <p className="text-xs text-gray-400 mb-2">Paste transcript text. Format each line as "Speaker Name: text"</p>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder={"Alice: Good morning everyone...\nBob: Thanks for joining..."}
              rows={6}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={!title.trim() || isPending}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            {isPending ? "Creating..." : "Create Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}
