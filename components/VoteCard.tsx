'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, Emote } from '../types'

interface VoteCardProps {
  item: Card | Emote
  category: 'cards' | 'emotes'
  onClick: () => void
  isSelected?: boolean
  isLoading?: boolean
  showElo?: boolean // Whether to show Elo section
  eloRevealed?: boolean // Whether actual Elo is revealed (not blurred)
  eloChange?: number | null // Elo change value (null means show original, number means show change)
  originalElo?: number | null // Original Elo before vote (for display)
  isTransitioning?: boolean // Whether card is transitioning
  madeDecision?: boolean // Whether a decision has been made (disable hover)
}

export default function VoteCard({ item, category, onClick, isSelected, isLoading, showElo = false, eloRevealed = false, eloChange = null, originalElo: propOriginalElo = null, isTransitioning = false, madeDecision = false }: VoteCardProps) {
  const isCard = category === 'cards'
  const card = isCard ? (item as Card) : null
  const [showRipple, setShowRipple] = useState(false)
  
  // Use prop original Elo if provided, otherwise use current Elo
  const displayElo = propOriginalElo !== null ? Math.round(propOriginalElo) : Math.round(item.elo)
  const hasChange = eloChange !== null && eloChange !== 0

  // Handle ripple animation - show when selected, hide after animation completes
  useEffect(() => {
    if (isSelected) {
      setShowRipple(true)
      // Remove ripple from DOM after animation completes (0.6s)
      const timer = setTimeout(() => {
        setShowRipple(false)
      }, 600)
      return () => clearTimeout(timer)
    } else {
      setShowRipple(false)
    }
  }, [isSelected])

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={
        [
          'relative flex flex-col items-center justify-center p-8 rounded-2xl',
          'bg-white dark:bg-gray-800 border-4 transform',
          'transition-all duration-300 ease-out',
          isTransitioning
            ? 'opacity-0 scale-95 translate-y-4'
            : 'opacity-100 scale-100 translate-y-0',
          isSelected
            ? 'border-blue-500 scale-[1.03] shadow-xl shadow-blue-500/30 z-10'
            : [
                'border-gray-300 dark:border-gray-700',
                !madeDecision && !isLoading ? 'hover:border-blue-300 hover:scale-[1.02]' : '',
              ].join(' '),
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          'min-h-[400px] w-full',
        ].join(' ')
      }
    >
      <div className="relative w-48 h-48 mb-6">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {item.name}
      </h3>
      
      {card && (
        <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {card.elixir_cost} Elixir
        </div>
      )}
      
      {showElo && (
        <div className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
          {eloRevealed ? (
            <>
              <span>Elo: {displayElo}</span>
              {hasChange && (
                <span className={`font-bold ${
                  eloChange! > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                } animate-fade-in`}>
                  {eloChange! > 0 ? '+' : ''}{Math.round(eloChange!)}
                </span>
              )}
            </>
          ) : (
            <span className="relative inline-block">
              <span className="blur-sm select-none font-mono">Elo: ???</span>
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              </span>
            </span>
          )}
        </div>
      )}
      
      {isSelected && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-selection-badge">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Selected!
          </span>
        </div>
      )}
      
      {/* Selection ripple effect - removed from DOM after animation */}
      {showRipple && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-selection-ripple"></div>
        </div>
      )}
    </button>
  )
}

