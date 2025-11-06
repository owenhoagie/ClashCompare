'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '../../../lib/supabase'
import { Card, Emote, Category } from '../../../types'
import { getTier, getTierColor, formatElo } from '../../../lib/utils'
import LoadingSpinner from '../../../components/LoadingSpinner'

export default function LeaderboardPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const category = params.category as Category
  
  const [items, setItems] = useState<(Card | Emote)[]>([])
  const [filteredItems, setFilteredItems] = useState<(Card | Emote)[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (category !== 'cards' && category !== 'emotes') {
      router.push('/')
      return
    }
    loadLeaderboard()
  }, [category, router])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredItems(
        items.filter(item => item.name.toLowerCase().includes(query))
      )
    }
  }, [searchQuery, items])

  async function loadLeaderboard() {
    setIsLoading(true)
    setError(null)
    
    try {
      const tableName = category
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('elo', { ascending: false })

      if (error) throw error
      
      setItems(data || [])
      setFilteredItems(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight drop-shadow font-grotesk">
          {category === 'cards' ? 'Cards' : 'Emotes'} Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
          See the most annoying {category} as voted by the community. Click a row for details!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-stretch">
          <input
            type="text"
            placeholder={`Search ${category}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            autoComplete="off"
          />
          <Link
            href={`/vote/${category}`}
            className="inline-flex items-center justify-center px-6 py-2 rounded-lg font-semibold bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-400 transition-all"
          >
            <span className="mr-2">Vote Now</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block align-middle"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No items found matching your search.' : 'No items found.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <thead className="sticky top-0 z-10 bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{category === 'cards' ? 'Card' : 'Emote'}</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tier</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Elo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">W/L/D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredItems.map((item, index) => {
                const rank = items.findIndex(i => i.id === item.id) + 1
                const tier = getTier(item.elo)
                const tierColor = getTierColor(tier)
                const isCard = category === 'cards'
                const card = isCard ? (item as Card) : null
                const totalVotes = item.wins + item.losses + item.draws
                return (
                  <tr
                    key={item.id}
                    className="group hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer bg-white/80 dark:bg-gray-900/70 hover:bg-blue-50/60 dark:hover:bg-blue-950/40"
                    onClick={() => router.push(`/details/${category}/${item.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="text-base font-extrabold text-gray-900 dark:text-white">#{rank}</div>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 mr-4 flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900 dark:text-white">{item.name}</div>
                          {card && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{card.elixir_cost} Elixir</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColor}`}>{tier}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="text-base font-bold text-gray-900 dark:text-white">{formatElo(item.elo)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="text-base text-gray-900 dark:text-white flex flex-row items-center gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">{item.wins}</span>
                        <span className="text-gray-400 dark:text-gray-500">/</span>
                        <span className="text-red-600 dark:text-red-400 font-bold">{item.losses}</span>
                        <span className="text-gray-400 dark:text-gray-500">/</span>
                        <span className="text-gray-600 dark:text-gray-400 font-bold">{item.draws}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 hidden md:inline">{totalVotes} total</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

