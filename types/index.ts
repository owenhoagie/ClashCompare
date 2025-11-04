export type Category = 'cards' | 'emotes'

export interface Card {
  id: number
  name: string
  elixir_cost: number
  image_url: string
  elo: number
  wins: number
  losses: number
  draws: number
  created_at: string
}

export interface Emote {
  id: number
  name: string
  image_url: string
  elo: number
  wins: number
  losses: number
  draws: number
  created_at: string
}

export interface Vote {
  id: string
  winner_id: number
  loser_id: number
  is_draw: boolean
  entity_type: Category // Database column name is 'entity_type'
  created_at: string
}

export interface VoteSubmission {
  winner_id: number
  loser_id: number
  is_draw: boolean
  category: Category
}

