"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { PlayCircle, Calendar } from "lucide-react"

export default function EpisodeIndex() {
  const [episodes, setEpisodes] = useState([])

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data } = await supabase
        .from("episodes")
        .select(`*, mentions(count)`)
        .order("ep_number", { ascending: false })
      setEpisodes(data || [])
    }
    fetchEpisodes()
  }, [])

  return (
    <main className="min-h-screen bg-[#fdfcf8] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-8 text-slate-900">
          Podcast Archive
        </h1>
        <div className="space-y-4">
          {episodes.map((ep) => (
            <Link href={`/episodes/${ep.id}`} key={ep.id}>
              <div className="bg-white border border-slate-200 p-6 rounded-xl hover:border-amber-500 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-serif italic text-slate-300 group-hover:text-amber-200">
                    #{ep.ep_number}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {ep.title}
                    </h2>
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                      <Calendar size={14} /> {ep.air_date || "Date TBD"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {ep.mentions[0]?.count || 0} Books
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
