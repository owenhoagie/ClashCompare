'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '../../../../lib/supabase'
import { Card, Emote, Category } from '../../../../types'
import { getTier, getTierColor, formatElo } from '../../../../lib/utils'
import LoadingSpinner from '../../../../components/LoadingSpinner'

export default function DetailsPage({ 
  params 
}: { 
  params: { category: string; id: string } 
}) {
  const router = useRouter()
  const category = params.category as Category
  const id = parseInt(params.id)
  
  const [item, setItem] = useState<Card | Emote | null>(null)
  const [rank, setRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (category !== 'cards' && category !== 'emotes') {
      router.push('/')
      return
    }
    if (isNaN(id)) {
      router.push(`/leaderboard/${category}`)
      return
    }
    loadItemDetails()
  }, [category, id, router])

  async function loadItemDetails() {
    setIsLoading(true)
    setError(null)
    
    try {
      const tableName = category
      
      // Load the item
      const { data: itemData, error: itemError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (itemError) throw itemError
      if (!itemData) {
        setError('Item not found')
        setIsLoading(false)
        return
      }

      setItem(itemData)

      // Calculate rank by counting items with higher Elo
      const { data: allItems, error: rankError } = await supabase
        .from(tableName)
        .select('id, elo')
        .gt('elo', itemData.elo)
        .order('elo', { ascending: false })

      if (rankError) throw rankError
      setRank((allItems?.length || 0) + 1)
    } catch (err: any) {
      setError(err.message || 'Failed to load item details')
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

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Item not found'}
          </p>
          <Link
            href={`/leaderboard/${category}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Leaderboard
          </Link>
        </div>
      </div>
    )
  }

  const tier = getTier(item.elo)
  const tierColor = getTierColor(tier)
  const isCard = category === 'cards'
  const card = isCard ? (item as Card) : null
  const totalVotes = item.wins + item.losses + item.draws
  const winRate = totalVotes > 0 ? ((item.wins / totalVotes) * 100).toFixed(1) : '0.0'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/leaderboard/${category}`}
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
      >
        ← Back to Leaderboard
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="relative w-48 h-48 flex-shrink-0">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {item.name}
            </h1>
            
            {card && (
              <div className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {card.elixir_cost} Elixir
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Rank</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{rank}
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Elo</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatElo(item.elo)}
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${tierColor}`}>
                <div className="text-sm opacity-90">Tier</div>
                <div className="text-2xl font-bold">{tier}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">Wins</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {item.wins}
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-sm text-red-600 dark:text-red-400 mb-1">Losses</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {item.losses}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Draws</div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {item.draws}
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Win Rate</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {winRate}%
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Votes</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalVotes}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={`/vote/${category}`}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
          >
            Vote on {category === 'cards' ? 'Cards' : 'Emotes'}
          </Link>
        </div>
      </div>
    </div>
  )
}

