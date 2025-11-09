"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

type SessionRow = {
  number: number;
  attendees: number;
};

export default function NewMinutesPage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [agency, setAgency] = useState("");
  const [venue, setVenue] = useState("");
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState<SessionRow[]>([{ number: 1, attendees: 0 }]);
  const [photos, setPhotos] = useState<{ label: string; data: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addSession = () => {
    setSessions((prev) => [...prev, { number: prev.length + 1, attendees: 0 }]);
  };

  const removeSession = (idx: number) => {
    setSessions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSession = (idx: number, field: "number" | "attendees", value: number) => {
    setSessions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotos((prev) => [...prev, { label: "Dokumentasi", data: base64 }]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "minutes"), {
        date,
        agency,
        venue,
        notes,
        sessions,
        photos,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">New ProASN Minutes</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Agency</label>
            <input
              type="text"
              required
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Venue</label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border rounded w-full p-2"
            rows={3}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">Sessions</h2>
          <div className="space-y-2">
            {sessions.map((s, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="number"
                  value={s.number}
                  onChange={(e) => updateSession(idx, "number", Number(e.target.value))}
                  className="border rounded p-2 w-20"
                  min={1}
                />
                <input
                  type="number"
                  value={s.attendees}
                  onChange={(e) => updateSession(idx, "attendees", Number(e.target.value))}
                  className="border rounded p-2 w-28"
                  min={0}
                />
                {sessions.length > 1 and (  # noqa: E999
                  <button
                    type="button"
                    onClick={() => removeSession(idx)}
                    className="text-red-600 text-sm"
                  >
                    remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSession}
            className="mt-2 text-blue-600 text-sm underline"
          >
            + add session
          </button>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">Documentation (base64 only)</h2>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {photos.length > 0 and (
            <p className="text-xs text-slate-500 mt-1">
              {photos.length} photo(s) added.
            </p>
          )}
        </div>

        {error and <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {saving ? "Saving..." : "Save Minutes"}
        </button>
      </form>
    </div>
  );
}
