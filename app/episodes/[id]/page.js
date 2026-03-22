import { supabase } from "@/lib/supabase"
import BookCard from "@/app/components/BookCard"
import Link from "next/link"
import { ArrowLeft, Mic2, Calendar } from "lucide-react"

export default async function EpisodePage({ params }) {
  // 1. Await the params (Crucial for Next.js 15)
  const resolvedParams = await params
  const { id } = resolvedParams

  // 2. Fetch episode and link the books through the mentions table
  const { data: episode, error } = await supabase
    .from("episodes")
    .select(
      `
      *,
      mentions (
        books (*)
      )
    `,
    )
    .eq("id", id)
    .single()

  // 3. Guard against null or errors
  if (error || !episode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-serif">
        <h1 className="text-2xl mb-4">
          This episode hasn't been archived yet.
        </h1>
        <Link href="/episodes" className="text-amber-700 underline">
          Back to Archives
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#fdfcf8] pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/episodes"
          className="flex items-center gap-2 text-slate-500 hover:text-amber-800 mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Episodes
        </Link>

        <header className="mb-12 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-3 text-amber-600 font-bold tracking-widest text-sm uppercase">
            <Mic2 size={16} />
            Episode {episode.ep_number}
          </div>
          <h1 className="text-5xl font-serif font-bold mt-4 text-slate-900 leading-tight">
            {episode.title}
          </h1>
          {episode.air_date && (
            <p className="text-slate-500 mt-4 flex items-center gap-2 font-medium">
              <Calendar size={16} /> Released:{" "}
              {new Date(episode.air_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </header>

        <div className="space-y-8">
          <h2 className="text-2xl font-serif italic text-slate-800 border-l-4 border-amber-500 pl-4">
            Books mentioned in this broadcast:
          </h2>

          {episode.mentions && episode.mentions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {episode.mentions.map((mention) => (
                <BookCard key={mention.books.id} book={mention.books} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
              <p className="text-slate-400 italic font-serif">
                No specific books were logged for this episode yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
