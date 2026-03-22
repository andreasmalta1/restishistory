import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft, Mic2, ExternalLink } from "lucide-react"

export default async function BookPage({ params }) {
  // FIX: Await the params to get the ID
  const resolvedParams = await params
  const { id } = resolvedParams

  const { data: book, error } = await supabase
    .from("books")
    .select(`*, mentions(context_note, episodes(ep_number, title))`)
    .eq("id", id)
    .single()

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-serif p-20">
        <h1 className="text-2xl mb-4">
          The archives are silent on this one...
        </h1>
        <Link href="/" className="text-amber-700 underline">
          Return to Library
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-amber-800 transition-colors mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Library
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Sticky Book Cover */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full rounded-lg shadow-2xl border border-slate-200"
                />
              ) : (
                /* Fallback UI if no cover exists */
                <div className="w-full aspect-[2/3] bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300">
                  <span className="text-slate-400 font-serif italic text-sm text-center px-4">
                    No Cover Image In Archives
                  </span>
                </div>
              )}
              <button className="w-full mt-6 bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2">
                Buy on Amazon <ExternalLink size={16} />
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2">
            <span className="text-amber-700 font-bold tracking-widest uppercase text-xs">
              {book.era}
            </span>
            <h1 className="text-5xl font-serif font-bold text-slate-900 mt-2 mb-4">
              {book.title}
            </h1>
            <p className="text-2xl text-slate-600 italic mb-8">
              by {book.author}
            </p>

            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-lg leading-relaxed text-slate-700">
                {book.description || "No description available yet."}
              </p>
            </div>

            <h2 className="text-2xl font-serif font-bold border-b border-slate-200 pb-4 mb-6 flex items-center gap-2">
              <Mic2 className="text-amber-600" /> Mentioned In
            </h2>

            <div className="space-y-6">
              {book.mentions?.map((m, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900">
                      Ep {m.episodes.ep_number}: {m.episodes.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 italic">"{m.context_note}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
