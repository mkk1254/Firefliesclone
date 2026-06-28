import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: BASE });

export interface Participant {
  id: number;
  name: string;
  email: string | null;
  color_hex: string;
}

export interface TranscriptSegment {
  id: number;
  speaker_name: string;
  text: string;
  start_time_seconds: number;
  end_time_seconds: number;
  sequence_order: number;
}

export interface ActionItem {
  id: number;
  text: string;
  assignee: string | null;
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface Chapter {
  title: string;
  start_time_hint: number;
}

export interface Summary {
  id: number;
  overview: string;
  key_topics: string[];
  chapters: Chapter[];
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: Participant[];
  created_at: string;
}

export interface MeetingDetail extends MeetingListItem {
  audio_url: string | null;
  transcript_segments: TranscriptSegment[];
  summary: Summary | null;
  action_items: ActionItem[];
}

// Meetings
export const getMeetings = (params?: { search?: string; participant?: string; sort?: string }) =>
  api.get<MeetingListItem[]>("/meetings", { params }).then((r) => r.data);

export const getMeeting = (id: number) =>
  api.get<MeetingDetail>(`/meetings/${id}`).then((r) => r.data);

export const createMeeting = (data: {
  title: string;
  date: string;
  duration_seconds?: number;
  participants?: { name: string; email?: string }[];
  transcript_text?: string;
}) => api.post<MeetingDetail>("/meetings", data).then((r) => r.data);

export const updateMeeting = (
  id: number,
  data: { title?: string; date?: string; participants?: { name: string; email?: string }[] }
) => api.patch<MeetingDetail>(`/meetings/${id}`, data).then((r) => r.data);

export const deleteMeeting = (id: number) => api.delete(`/meetings/${id}`);

// Action Items
export const createActionItem = (meetingId: number, text: string, assignee?: string) =>
  api.post<ActionItem>(`/meetings/${meetingId}/action-items`, { text, assignee }).then((r) => r.data);

export const updateActionItem = (itemId: number, data: Partial<ActionItem>) =>
  api.patch<ActionItem>(`/meetings/action-items/${itemId}`, data).then((r) => r.data);

export const deleteActionItem = (itemId: number) =>
  api.delete(`/meetings/action-items/${itemId}`);

// Summary
export const generateSummary = (meetingId: number) =>
  api.post<MeetingDetail>(`/meetings/${meetingId}/summary/generate`).then((r) => r.data);

// Search
export const globalSearch = (q: string) =>
  api.get("/search", { params: { q } }).then((r) => r.data);
