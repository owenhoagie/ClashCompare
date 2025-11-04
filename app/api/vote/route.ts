import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { VoteSubmission } from '@/types'

const map = {
  'cards': 'card',
  'emotes': 'emote',
}

export async function POST(request: NextRequest) {
  try {
    const body: VoteSubmission = await request.json()
    
    const { winner_id, loser_id, is_draw, category } = body

    // Validate input
    if (!winner_id || !loser_id || category !== 'cards' && category !== 'emotes') {
      return NextResponse.json(
        { message: 'Invalid vote data' },
        { status: 400 }
      )
    }

    // Insert the vote
    // Supabase automatically queries the public schema
    // Note: Database column is 'entity_type' not 'category'
    // Note: We don't use .select() here to avoid RLS SELECT policy requirements
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        winner_id,
        loser_id,
        is_draw,
        entity_type: map[category], // Map 'category' variable to 'entity_type' database column
      })

    if (voteError) {
      console.error('Vote insertion error:', voteError)
      // Provide more helpful error message
      if (voteError.code === '42501') {
        return NextResponse.json(
          { 
            message: 'Row-Level Security (RLS) policy violation. Your RLS policy needs both USING and WITH CHECK clauses. Update your policy to: CREATE POLICY "insert_vote" ON "public"."votes" FOR INSERT TO public USING (true) WITH CHECK (true);',
            error: voteError.message,
            code: voteError.code
          },
          { status: 500 }
        )
      }
      if (voteError.code === 'PGRST204' || voteError.message?.includes('entity_type')) {
        return NextResponse.json(
          { 
            message: 'Database schema error: The "entity_type" column may not exist in the votes table. Please verify your Supabase schema matches the expected structure.',
            error: voteError.message,
            code: voteError.code
          },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { message: 'Failed to record vote', error: voteError.message },
        { status: 500 }
      )
    }

    // Wait a moment for triggers to process, then fetch updated Elo values
    await new Promise(resolve => setTimeout(resolve, 100))

    const tableName = category
    const { data: winnerData, error: winnerError } = await supabase
      .from(tableName)
      .select('elo')
      .eq('id', winner_id)
      .single()

    const { data: loserData, error: loserError } = await supabase
      .from(tableName)
      .select('elo')
      .eq('id', loser_id)
      .single()

    if (winnerError || loserError) {
      console.error('Error fetching updated Elo:', winnerError || loserError)
      // Still return success since vote was recorded
      return NextResponse.json({
        success: true,
        winner_elo: null,
        loser_elo: null,
      })
    }

    return NextResponse.json({
      success: true,
      winner_elo: winnerData.elo,
      loser_elo: loserData.elo,
    })
  } catch (error: any) {
    console.error('Vote API error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

