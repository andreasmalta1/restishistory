import Link from "next/link"

export default function BookCard({ book }) {
  // Guard clause in case book data is missing
  if (!book) return null

  return (
    <Link href={`/book/${book.id}`}>
      <div className="group cursor-pointer flex flex-col h-full">
        <div className="relative aspect-[2/3] rounded-lg shadow-md overflow-hidden bg-slate-200 mb-4 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
          <img
            src={
              book.cover_url ||
              "https://via.placeholder.com/400x600?text=No+Cover"
            }
            alt={book.title}
            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              View Archives
            </span>
          </div>
        </div>
        <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight group-hover:text-amber-800 transition-colors">
          {book.title}
        </h3>
        <p className="text-slate-500 text-sm italic mb-2">{book.author}</p>

        <div className="mt-auto flex gap-1 flex-wrap">
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
            {book.era || "History"}
          </span>
        </div>
      </div>
    </Link>
  )
}
