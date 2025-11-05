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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {category === 'cards' ? 'Cards' : 'Emotes'} Leaderboard
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder={`Search ${category}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            href={`/vote/${category}`}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Vote Now
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
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {category === 'cards' ? 'Card' : 'Emote'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Elo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  W/L/D
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
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
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => router.push(`/details/${category}/${item.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        #{rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </div>
                          {card && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {card.elixir_cost} Elixir
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColor}`}>
                        {tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatElo(item.elo)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="text-green-600 dark:text-green-400">{item.wins}</span>
                        {' / '}
                        <span className="text-red-600 dark:text-red-400">{item.losses}</span>
                        {' / '}
                        <span className="text-gray-600 dark:text-gray-400">{item.draws}</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {totalVotes} total
                        </div>
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

