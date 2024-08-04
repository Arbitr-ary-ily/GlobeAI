import Link from "next/link"
import { Globe } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white shadow-sm ">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Globe className="h-6 w-6 text-gray-900 dark:text-gray-50" />
          <span className="text-lg font-bold text-gray-900 -ml-1">Globe AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/saved"
            className="text-gray-600 hover:text-gray-900"
            prefetch={false}
          >
            Saved Countries
          </Link>
        </nav>
      </div>
    </header>
  )
}
