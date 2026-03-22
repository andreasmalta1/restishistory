"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { PlusCircle, BookPlus, ListMusic, Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [view, setView] = useState("book") // 'book' or 'episode'
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAddBook = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 1. Find or Create Episode
    const { data: ep, error: epError } = await supabase
      .from("episodes")
      .upsert(
        {
          ep_number: parseInt(form.ep_num),
          title: form.ep_title || `Episode ${form.ep_num}`,
        },
        { onConflict: "ep_number" },
      )
      .select()
      .single()

    // 2. Insert Book
    const { data: book, error: bkError } = await supabase
      .from("books")
      .insert({
        title: form.title,
        author: form.author,
        cover_url: form.cover,
        era: form.era,
        description: form.description, // Add a longer description field
      })
      .select()
      .single()
    // 3. Create Mention Link
    if (book && ep) {
      await supabase.from("mentions").insert({
        book_id: book.id,
        episode_id: ep.id,
        context_note: form.note,
      })
      alert("Book logged successfully!")
      setForm({ title: "", author: "", ep_num: "", note: "", cover: "" })
    }
    setLoading(false)
  }

  const fetchEps = async () => {
    const { data } = await supabase
      .from("episodes")
      .select("*")
      .order("ep_number", { ascending: false })
    setEpisodes(data || [])
  }

  useEffect(() => {
    fetchEps()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-serif italic mb-10 text-amber-500">
          Curator Tools
        </h2>
        <nav className="space-y-4">
          <button
            onClick={() => setView("book")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === "book" ? "bg-amber-600" : "hover:bg-slate-800"}`}
          >
            <BookPlus size={20} /> Add Book
          </button>
          <button
            onClick={() => setView("episode")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === "episode" ? "bg-amber-600" : "hover:bg-slate-800"}`}
          >
            <ListMusic size={20} /> Manage Episodes
          </button>
        </nav>
      </aside>

      {/* Main Form Area */}
      <main className="flex-1 p-12">
        {view === "book" ? (
          <BookForm episodes={episodes} />
        ) : (
          <EpisodeForm onRefresh={fetchEps} />
        )}
      </main>
    </div>
  )
}

function EpisodeForm({ onRefresh }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)

    const { error } = await supabase.from("episodes").insert([
      {
        ep_number: parseInt(formData.get("num")),
        title: formData.get("title"),
        air_date: formData.get("date"),
      },
    ])

    if (!error) {
      alert("Episode logged!")
      e.target.reset()
      onRefresh() // Updates the sidebar/list
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl bg-white p-8 rounded-2xl shadow-sm border">
      <h3 className="text-2xl font-serif font-bold mb-6">
        Log New Podcast Episode
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <input
            name="num"
            type="number"
            placeholder="Ep #"
            className="col-span-1 p-3 border rounded-xl"
            required
          />
          <input
            name="date"
            type="date"
            className="col-span-2 p-3 border rounded-xl"
          />
        </div>
        <input
          name="title"
          placeholder="Episode Title (e.g. The Fall of Rome)"
          className="w-full p-3 border rounded-xl"
          required
        />
        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-amber-700 transition-all"
        >
          {loading ? "Archiving..." : "Add Episode"}
        </button>
      </form>
    </div>
  )
}

function BookForm({ episodes }) {
  // Use your previous Google Books logic here
  // But for the Episode part, use this:
  return (
    <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border">
      <h3 className="text-2xl font-serif font-bold mb-6">Add Mentioned Book</h3>
      {/* ... Google Books Search Input ... */}

      <div className="mt-8 space-y-4">
        <label className="block text-sm font-bold text-slate-400 uppercase">
          Link to Episode
        </label>
        <select className="w-full p-4 bg-slate-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500">
          <option>Select an episode...</option>
          {episodes.map((ep) => (
            <option key={ep.id} value={ep.id}>
              Ep {ep.ep_number}: {ep.title}
            </option>
          ))}
        </select>

        {/* ... Context Note & Save Button ... */}
      </div>
    </div>
  )
}

//   return (
//     <div className="min-h-screen bg-slate-100 p-12">
//       <form
//         onSubmit={handleAddBook}
//         className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
//       >
//         <h2 className="text-2xl font-serif font-bold mb-6">Log New Entry</h2>

//         <div className="space-y-4">
//           <input
//             placeholder="Book Title"
//             className="w-full p-3 bg-slate-50 rounded border"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//           />

//           <input
//             placeholder="Author"
//             className="w-full p-3 bg-slate-50 rounded border"
//             value={form.author}
//             onChange={(e) => setForm({ ...form, author: e.target.value })}
//           />

//           <input
//             placeholder="Cover Image URL"
//             className="w-full p-3 bg-slate-50 rounded border"
//             value={form.cover}
//             onChange={(e) => setForm({ ...form, cover: e.target.value })}
//           />

//           <textarea
//             placeholder="Context (e.g. Dominic hates this one)"
//             className="w-full p-3 bg-slate-50 rounded border"
//             value={form.note}
//             onChange={(e) => setForm({ ...form, note: e.target.value })}
//           />

//           <select
//             className="w-full p-3 border rounded-lg bg-slate-50"
//             value={form.era}
//             onChange={(e) => setForm({ ...form, era: e.target.value })}
//           >
//             <option value="">Select Era</option>
//             {ERAS.filter((e) => e !== "All").map((e) => (
//               <option key={e} value={e}>
//                 {e}
//               </option>
//             ))}
//           </select>

//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
//             <label className="block text-xs font-bold mb-2 uppercase text-slate-400">
//               Link to Episode
//             </label>
//             <select
//               className="w-full p-3 border rounded-lg mb-4"
//               value={selectedEp}
//               onChange={(e) => setSelectedEp(e.target.value)}
//             >
//               <option value="">Select an existing episode...</option>
//               {episodes.map((ep) => (
//                 <option key={ep.id} value={ep.id}>
//                   #{ep.ep_number} - {ep.title}
//                 </option>
//               ))}
//             </select>

//             <button
//               type="button"
//               onClick={() => setIsNewEp(!isNewEp)}
//               className="text-amber-700 text-sm font-bold underline"
//             >
//               + Add a new episode to the archive
//             </button>

//             {isNewEp && (
//               <div className="mt-4 space-y-2 border-t pt-4">
//                 <input
//                   placeholder="New Ep Number"
//                   className="w-full p-2 border"
//                   name="new_ep_num"
//                 />
//                 <input
//                   placeholder="New Ep Title"
//                   className="w-full p-2 border"
//                   name="new_ep_title"
//                 />
//               </div>
//             )}
//           </div>

//           <button
//             disabled={loading}
//             className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition-colors"
//           >
//             {loading ? "Saving..." : "Add to Collection"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
