"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { BookPlus, ListMusic, Loader2 } from "lucide-react"

// Define this at the top so both forms can see it
const ERAS = [
  "Antiquity",
  "Medieval",
  "Early Modern",
  "19th Century",
  "World Wars",
  "Modern",
]

export default function AdminDashboard() {
  const [view, setView] = useState("book")
  const [episodes, setEpisodes] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(false)

  // 1. FORM STATE (Moved here so it can be passed to BookForm)
  const [form, setForm] = useState({
    title: "",
    author: "",
    cover: "",
    note: "",
    era: "",
    ep_id: "",
    existing_book_id: "",
  })

  const fetchEps = async () => {
    const { data } = await supabase
      .from("episodes")
      .select("*")
      .order("ep_number", { ascending: false })
    setEpisodes(data || [])
  }

  const fetchBooks = async () => {
    const { data } = await supabase
      .from("books")
      .select("id, title, author")
      .order("title")
    setAllBooks(data || [])
  }

  useEffect(() => {
    fetchEps()
    fetchBooks()
  }, [])

  // 2. LOGIC (Moved into the main component)
  const handleAddBook = async (e) => {
    e.preventDefault()
    setLoading(true)

    let bookId = form.existing_book_id

    if (!bookId) {
      const { data: newBook, error: bkError } = await supabase
        .from("books")
        .insert({
          title: form.title,
          author: form.author,
          cover_url: form.cover,
          era: form.era,
        })
        .select()
        .single()

      if (newBook) bookId = newBook.id
    }

    // Create Mention Link using the selected episode ID
    if (book && form.ep_id) {
      await supabase.from("mentions").insert({
        book_id: book.id,
        episode_id: form.ep_id,
        context_note: form.note,
      })
      alert("Book logged successfully!")
      setForm({
        title: "",
        author: "",
        cover: "",
        note: "",
        era: "",
        ep_id: "",
        existing_book_id: "",
      })
    } else {
      alert("Make sure you selected an episode!")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-serif italic mb-10 text-amber-500 text-center">
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

      <main className="flex-1 p-12">
        {view === "book" ? (
          <BookForm
            episodes={episodes}
            allBooks={allBooks}
            form={form}
            setForm={setForm}
            onSubmit={handleAddBook}
            loading={loading}
          />
        ) : (
          <EpisodeForm onRefresh={fetchEps} />
        )}
      </main>
    </div>
  )
}

// 3. SUB-COMPONENTS
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
      onRefresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl bg-white p-8 rounded-2xl shadow-sm border mx-auto">
      <h3 className="text-2xl font-serif font-bold mb-6 italic text-slate-800">
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
          placeholder="Episode Title..."
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
function BookForm({ episodes, allBooks, form, setForm, onSubmit, loading }) {
  return (
    <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border mx-auto">
      <h3 className="text-2xl font-serif font-bold mb-6 italic text-slate-800 text-center">
        Log a Book Mention
      </h3>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* SECTION 1: THE BOOK */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <label className="block text-xs font-bold text-amber-800 uppercase mb-2">
            Step 1: Select or Create Book
          </label>

          <select
            className="w-full p-3 border rounded-lg bg-white mb-4"
            value={form.existing_book_id}
            onChange={(e) =>
              setForm({ ...form, existing_book_id: e.target.value })
            }
          >
            <option value="">— Create New Book —</option>
            {allBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.author})
              </option>
            ))}
          </select>

          {!form.existing_book_id && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <input
                placeholder="New Book Title"
                className="w-full p-3 bg-white rounded border"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                placeholder="Author"
                className="w-full p-3 bg-white rounded border"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />
              <input
                placeholder="Cover URL"
                className="w-full p-3 bg-white rounded border"
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
              />
              <select
                className="w-full p-3 border rounded-lg bg-white"
                value={form.era}
                onChange={(e) => setForm({ ...form, era: e.target.value })}
                required={!form.existing_book_id}
              >
                <option value="">Select Era</option>
                {ERAS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* SECTION 2: THE EPISODE & CONTEXT */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
            Step 2: Episode Context
          </label>
          <select
            className="w-full p-4 bg-slate-100 rounded-xl border-none"
            value={form.ep_id}
            onChange={(e) => setForm({ ...form, ep_id: e.target.value })}
            required
          >
            <option value="">Which episode was it mentioned in?</option>
            {episodes.map((ep) => (
              <option key={ep.id} value={ep.id}>
                Ep {ep.ep_number}: {ep.title}
              </option>
            ))}
          </select>

          <textarea
            placeholder="What did they say about it this time?"
            className="w-full p-3 bg-slate-50 rounded border h-24"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition-all"
          >
            {loading ? "Linking..." : "Confirm Mention"}
          </button>
        </div>
      </form>
    </div>
  )
}
