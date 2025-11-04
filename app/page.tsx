import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          ClashCompare
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Vote on the most annoying cards and emotes in Clash Royale. 
          Help build the ultimate community ranking!
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/vote/cards"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Cards</h2>
              <p className="text-blue-100">
                Vote on which cards are more annoying. Your votes help determine the community ranking!
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link
            href="/vote/emotes"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white hover:from-purple-600 hover:to-purple-800 transition-all transform hover:scale-105"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Emotes</h2>
              <p className="text-purple-100">
                Rank the most annoying emotes. Which ones make you tilt?
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/leaderboard/cards"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            View Cards Leaderboard →
          </Link>
          <Link
            href="/leaderboard/emotes"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            View Emotes Leaderboard →
          </Link>
        </div>
      </div>
    </div>
  )
}

