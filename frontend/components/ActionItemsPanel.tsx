"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionItem, createActionItem, updateActionItem, deleteActionItem } from "@/lib/api";
import { Plus, Trash2, Check, User, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface Props { meetingId: number; items: ActionItem[]; }

export default function ActionItemsPanel({ meetingId, items }: Props) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["meeting", meetingId] });

  const [newText, setNewText] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [adding, setAdding] = useState(false);

  const createMut = useMutation({
    mutationFn: () => createActionItem(meetingId, newText.trim(), newAssignee.trim() || undefined),
    onSuccess: () => { invalidate(); setNewText(""); setNewAssignee(""); setAdding(false); toast.success("Action item added"); },
    onError: () => toast.error("Failed to add item"),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, val }: { id: number; val: boolean }) => updateActionItem(id, { is_completed: val }),
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteActionItem(id),
    onSuccess: () => { invalidate(); toast.success("Item removed"); },
  });

  const pending = items.filter(i => !i.is_completed);
  const done = items.filter(i => i.is_completed);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Action Items</h3>
            <p className="text-xs text-gray-400 mt-0.5">{pending.length} open · {done.length} completed</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            <Plus size={13} /> Add item
          </button>
        </div>

        {/* Add form */}
        {adding && (
          <div className="mb-5 p-4 border border-purple-200 rounded-xl bg-purple-50 space-y-3">
            <input
              autoFocus
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && newText.trim()) createMut.mutate(); if (e.key === "Escape") setAdding(false); }}
              placeholder="Describe the action item..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            />
            <input
              value={newAssignee}
              onChange={e => setNewAssignee(e.target.value)}
              placeholder="Assignee (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => createMut.mutate()}
                disabled={!newText.trim() || createMut.isPending}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                style={{ background: "var(--accent)" }}
              >
                {createMut.isPending ? "Adding..." : "Add"}
              </button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {items.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Check size={20} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No action items yet</p>
            <button onClick={() => setAdding(true)} className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium">
              Add the first one
            </button>
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <div className="space-y-2 mb-6">
            {pending.map(item => (
              <ActionRow key={item.id} item={item}
                onToggle={val => toggleMut.mutate({ id: item.id, val })}
                onDelete={() => deleteMut.mutate(item.id)}
              />
            ))}
          </div>
        )}

        {/* Completed */}
        {done.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Completed</p>
            <div className="space-y-2">
              {done.map(item => (
                <ActionRow key={item.id} item={item}
                  onToggle={val => toggleMut.mutate({ id: item.id, val })}
                  onDelete={() => deleteMut.mutate(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionRow({ item, onToggle, onDelete }: { item: ActionItem; onToggle: (v: boolean) => void; onDelete: () => void }) {
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group ${item.is_completed ? "border-gray-100 bg-gray-50 opacity-70" : "border-gray-200 bg-white hover:border-purple-200"}`}>
      <button
        onClick={() => onToggle(!item.is_completed)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
          item.is_completed ? "border-green-500 bg-green-500" : "border-gray-300 hover:border-purple-500"
        }`}
      >
        {item.is_completed && <Check size={10} className="text-white" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${item.is_completed ? "line-through text-gray-400" : "text-gray-800"}`}>{item.text}</p>
        <div className="flex items-center gap-3 mt-1">
          {item.assignee && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <User size={11} /> {item.assignee}
            </span>
          )}
          {item.due_date && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} /> {item.due_date}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
