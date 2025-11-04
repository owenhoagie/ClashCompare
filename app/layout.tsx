import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ClashCompare - Rank the Most Annoying Cards & Emotes',
  description: 'Community-driven ranking of Clash Royale cards and emotes using Elo-based voting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                  ClashCompare
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link
                    href="/leaderboard/cards"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Cards Leaderboard
                  </Link>
                  <Link
                    href="/leaderboard/emotes"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Emotes Leaderboard
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href="/auth"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}

