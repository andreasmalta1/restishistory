import "./globals.css"
import Link from "next/link"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#fdfcf8] antialiased">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link
              href="/"
              className="font-serif italic text-2xl font-black text-slate-900 tracking-tighter"
            >
              The Rest is <span className="text-amber-700">Bibliography</span>
            </Link>

            <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-600">
              <Link href="/" className="hover:text-amber-700 transition-colors">
                Books
              </Link>
              <Link
                href="/episodes"
                className="hover:text-amber-700 transition-colors"
              >
                Episodes
              </Link>
              <Link
                href="/admin"
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-amber-800 transition-all"
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
