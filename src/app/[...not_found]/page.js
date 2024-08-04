import Link from "next/link"
import { FrownIcon } from "lucide-react"
import Footer from "@/components/Footer"

export default function NotFoundCatchAll() {
  return (
    <div>
          <div className="flex flex-col items-center justify-center min-h-dvh gap-6 px-4 md:px-6">
            <FrownIcon className="h-20 w-20 text-gray-500 dark:text-gray-400" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Page Not Found</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
              There are only 195 recognized countries in the world.
            </p>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              Go to Homepage
            </Link>
          </div>
          <Footer />
          </div>

  )
}
