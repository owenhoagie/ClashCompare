import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <section className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-8">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-gray-900 dark:text-white drop-shadow-lg animate-fade-in">
            ClashCompare
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 animate-fade-in [animation-delay:0.1s]">
            Vote on the most annoying cards and emotes in Clash Royale.<br className="hidden sm:inline" />
            Help build the ultimate community ranking!
          </p>
          <div className="flex flex-row gap-4 mt-2 animate-fade-in [animation-delay:0.2s]">
            <Link
              href="/leaderboard/cards"
              className="home-leaderboard-btn"
            >
              View Cards Leaderboard
            </Link>
            <Link
              href="/leaderboard/emotes"
              className="home-leaderboard-btn"
            >
              View Emotes Leaderboard
            </Link>
          </div>
        </div>
        {/* Voting Options Section */}
        <div className="flex-1 grid grid-cols-1 gap-8 md:gap-6 md:grid-cols-1">
          <Link
            href="/vote/cards"
            className="home-vote-btn bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg"
          >
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-2">Cards</h2>
              <p className="text-blue-100 text-lg text-center">
                Vote on which cards are more annoying.<br />Which ones make you tilt?
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link
            href="/vote/emotes"
            className="home-vote-btn bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg"
          >
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-2">Emotes</h2>
              <p className="text-purple-100 text-lg text-center">
                Rank the most annoying emotes.<br />Which ones make you tilt?
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </section>
    </main>
  )
}

