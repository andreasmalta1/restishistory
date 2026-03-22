"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, BookOpen } from "lucide-react"
import BookCard from "@/app/components/BookCard"
import Link from "next/link"

const ERAS = [
  "All",
  "Antiquity",
  "Medieval",
  "Early Modern",
  "19th Century",
  "World Wars",
  "Modern",
]

export default function Library() {
  const [books, setBooks] = useState([])
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase
        .from("books")
        .select(`*, mentions(episodes(ep_number))`)
      setBooks(data || [])
    }
    fetchBooks()
  }, [])

  const filtered = books.filter(
    (b) =>
      (filter === "All" || b.era === filter) &&
      (b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <main className="min-h-screen bg-[#fdfcf8] pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-16 px-6 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-serif italic text-slate-900 mb-6"
          >
            The Rest is Bibliography
          </motion.h1>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-4 top-3.5 text-slate-400"
                size={18}
              />
              <input
                placeholder="Search the archives..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Era Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {ERAS.map((era) => (
              <button
                key={era}
                onClick={() => setFilter(era)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === era
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-amber-500"
                }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                className="group flex flex-col"
              >
                <BookCard key={book.id} book={book} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
