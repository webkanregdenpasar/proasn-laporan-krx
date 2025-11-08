// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

type Minutes = {
  id: string;
  date: string;
  agency: string;
  venue: string;
};

export default function HomePage() {
  const [items, setItems] = useState<Minutes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "minutes"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      const result: Minutes[] = [];
      snap.forEach((doc) => {
        const d = doc.data() as any;
        result.push({
          id: doc.id,
          date: d.date,
          agency: d.agency,
          venue: d.venue,
        });
      });
      setItems(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">ProASN Minutes</h1>
        <Link
          href="/minutes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded no-print"
        >
          + New Minutes
        </Link>
      </div>

      <table className="w-full bg-white border rounded">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Agency</th>
            <th className="p-2 border">Venue</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center">
                No data yet.
              </td>
            </tr>
          )}
          {items.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border">{m.date}</td>
              <td className="p-2 border">{m.agency}</td>
              <td className="p-2 border">{m.venue}</td>
              <td className="p-2 border">
                <Link href={`/minutes/${m.id}`} className="text-blue-600 underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
