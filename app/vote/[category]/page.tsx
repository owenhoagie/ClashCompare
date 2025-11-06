'use client'

import { useEffect, useState } from 'react'

// Animated Skip Button
function SkipButton({ onSkip, children, madeDecision = false }: { onSkip: () => void, children: React.ReactNode, madeDecision?: boolean }) {
  const [animating, setAnimating] = useState(false)

  function handleClick() {
    if (madeDecision) return;
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
      onSkip()
    }, 180)
  }

  return (
    <button
      onClick={handleClick}
      className={[
        'px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition-colors',
        animating && !madeDecision ? 'scale-90 opacity-60' : 'scale-100 opacity-100',
        'transition-transform transition-opacity duration-150 mx-2',
        !madeDecision ? 'hover:bg-gray-300 dark:hover:bg-gray-700' : '',
      ].join(' ')}
      style={{ outline: 'none' }}
      tabIndex={madeDecision ? -1 : 0}
    >
      {children}
    </button>
  )
}

import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Card, Emote, Category, VoteSubmission } from '../../../types'
import VoteCard from '../../../components/VoteCard'
import LoadingSpinner from '../../../components/LoadingSpinner'



export default function VotePage() {
  const router = useRouter()
  const params = useParams();
  const category = params.category as Category;

  const [item1, setItem1] = useState<Card | Emote | null>(null)
  const [item2, setItem2] = useState<Card | Emote | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showElo, setShowElo] = useState(true) // Always show Elo (blurred before vote, revealed after)
  const [eloRevealed, setEloRevealed] = useState(false) // Track if actual Elo is revealed
  const [eloChange1, setEloChange1] = useState<number | null>(null) // Elo change for item1
  const [eloChange2, setEloChange2] = useState<number | null>(null) // Elo change for item2
  const [originalElo1, setOriginalElo1] = useState<number | null>(null) // Original Elo for item1
  const [originalElo2, setOriginalElo2] = useState<number | null>(null) // Original Elo for item2
  const [isTransitioning, setIsTransitioning] = useState(false) // Track card transition animation
  const [madeDecision, setMadeDecision] = useState(false) // Prevent multiple actions per round
  const [allIds, setAllIds] = useState<number[]>([])

  useEffect(() => {
    if (category !== 'cards' && category !== 'emotes') {
      router.push('/')
      return
    }
    // Fetch all IDs once on mount/category change
    (async () => {
      setIsLoading(true)
      setError(null)
      const { data: allData, error: allError } = await supabase
        .from(category)
        .select('id')
      if (allError) {
        setError('Failed to load items.');
        setIsLoading(false);
        return;
      }
      if (!allData || allData.length < 2) {
        setError('Not enough items to vote on. Please add more items to the database.');
        setIsLoading(false);
        return;
      }
      setAllIds(allData.map((row: any) => row.id));
      setIsLoading(false);
      loadRandomItems(allData.map((row: any) => row.id));
    })();
  }, [category, router])

  async function loadRandomItems(cachedIds?: number[]) {
    // Determine the correct table name based on category
    const tableName = category;
    // Don't show loading spinner if we already have items (for smooth transitions)
    if (!item1 || !item2) {
      setIsLoading(true)
    }
    
    // Start transition animation
    if (item1 && item2) {
      setIsTransitioning(true)
    }
    
    setError(null)
    setEloRevealed(false) // Hide actual Elo, show blurred version
    setEloChange1(null) // Reset Elo changes
    setEloChange2(null)
    setOriginalElo1(null) // Reset original Elo
    setOriginalElo2(null)
    
    try {
      const ids = cachedIds || allIds;
      if (!ids || ids.length < 2) {
        setError('Not enough items to vote on. Please add more items to the database.');
        setIsLoading(false);
        return;
      }
      // Randomly select two different IDs
      const shuffled = [...ids].sort(() => Math.random() - 0.5);
      let id1 = shuffled[0];
      let id2 = shuffled[1];
      // Ensure they're different and not the same as current items
      if (id1 === id2 && shuffled.length > 2) {
        id2 = shuffled[2];
      }
      // If we have current items, try to avoid showing the same pair
      if (item1 && item2) {
        let attempts = 0;
        while ((id1 === item1.id && id2 === item2.id) || (id1 === item2.id && id2 === item1.id)) {
          if (attempts++ > 10) break; // Prevent infinite loop
          const newShuffle = [...ids].sort(() => Math.random() - 0.5);
          id1 = newShuffle[0];
          id2 = newShuffle[1];
        }
      }

      // Fetch the full data for both items
      const { data: item1Data, error: item1Error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id1)
        .single()

      const { data: item2Data, error: item2Error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id2)
        .single()

      if (item1Error || item2Error) throw item1Error || item2Error

      // Small delay to allow fade-out animation
      setTimeout(() => {
        setItem1(item1Data)
        setItem2(item2Data)
        setIsTransitioning(false)
        setMadeDecision(false)
      }, 150)
    } catch (err: any) {
      setError(err.message || 'Failed to load items')
      setIsTransitioning(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate Elo change using the same formula as the database trigger
  function calculateEloChange(winnerElo: number, loserElo: number, isDraw: boolean = false): number {
    const kFactor = 32
    const expectedWin = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400.0))
    
    if (isDraw) {
      return kFactor * (0.5 - expectedWin)
    } else {
      return kFactor * (1 - expectedWin)
    }
  }

  async function handleVote(winnerId: number | null) {
    if (!item1 || !item2 || madeDecision) return;
    setMadeDecision(true)

    // Store original Elo values before updating
    const origElo1 = item1.elo;
    const origElo2 = item2.elo;
    setOriginalElo1(origElo1);
    setOriginalElo2(origElo2);

    let change1: number;
    let change2: number;
    let newElo1: number;
    let newElo2: number;
    let isDraw = false;
    let winner_id = winnerId;
    let loser_id = null;

    if (winnerId === null) {
      // Draw: use standard Elo draw formula for both sides
      isDraw = true;
      winner_id = item1.id;
      loser_id = item2.id;
      change1 = calculateEloChange(origElo1, origElo2, true);
      change2 = calculateEloChange(origElo2, origElo1, true);
      newElo1 = origElo1 + change1;
      newElo2 = origElo2 + change2;
      setSelected(null); // No highlight for draw
    } else if (item1.id === winnerId) {
      // item1 wins, item2 loses
      change1 = calculateEloChange(origElo1, origElo2, false);
      change2 = -change1;
      newElo1 = origElo1 + change1;
      newElo2 = origElo2 + change2;
      loser_id = item2.id;
      setSelected(winnerId);
    } else {
      // item2 wins, item1 loses
      change2 = calculateEloChange(origElo2, origElo1, false);
      change1 = -change2;
      newElo1 = origElo1 + change1;
      newElo2 = origElo2 + change2;
      loser_id = item1.id;
      setSelected(winnerId);
    }

    setEloChange1(change1);
    setEloChange2(change2);
    setEloRevealed(true);

    // Update local state with calculated new Elo values
    if (winnerId === null) {
      setItem1({ ...item1, elo: newElo1 });
      setItem2({ ...item2, elo: newElo2 });
    } else if (item1.id === winnerId) {
      setItem1({ ...item1, elo: newElo1, wins: item1.wins + 1 });
      setItem2({ ...item2, elo: newElo2, losses: item2.losses + 1 });
    } else {
      setItem1({ ...item1, elo: newElo1, losses: item1.losses + 1 });
      setItem2({ ...item2, elo: newElo2, wins: item2.wins + 1 });
    }

    // Submit vote in background (don't wait for response)
    fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winner_id,
        loser_id,
        is_draw: isDraw,
        category,
      }),
    }).catch((err) => {
      console.error('Vote submission error:', err);
    });

    setTimeout(() => {
      setSelected(null);
      loadRandomItems();
    }, 1000);
  }

  if (isLoading && !item1 && !item2) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error && !item1 && !item2) {
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Which {category === 'cards' ? 'Card' : 'Emote'} is More Annoying?
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Click on your choice below
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {item1 && (
          <VoteCard
            item={item1}
            category={category}
            onClick={() => !madeDecision && handleVote(item1.id)}
            isSelected={selected === item1.id}
            isLoading={false}
            showElo={showElo}
            eloRevealed={eloRevealed}
            eloChange={eloChange1}
            originalElo={originalElo1}
            isTransitioning={isTransitioning}
            madeDecision={madeDecision}
          />
        )}
        {item2 && (
          <VoteCard
            item={item2}
            category={category}
            onClick={() => !madeDecision && handleVote(item2.id)}
            isSelected={selected === item2.id}
            isLoading={false}
            showElo={showElo}
            eloRevealed={eloRevealed}
            eloChange={eloChange2}
            originalElo={originalElo2}
            isTransitioning={isTransitioning}
            madeDecision={madeDecision}
          />
        )}
      </div>


      <div className="flex justify-center gap-4 mt-2">
        <SkipButton
          onSkip={() => {
            if (!madeDecision) {
              setMadeDecision(true);
              handleVote(null);
            }
          }}
          madeDecision={madeDecision}
        >
          Draw
        </SkipButton>
        <SkipButton
          onSkip={() => {
            if (!madeDecision) {
              setMadeDecision(true);
              loadRandomItems();
            }
          }}
          madeDecision={madeDecision}
        >
          Skip
        </SkipButton>
      </div>

    </div>
  )
}

