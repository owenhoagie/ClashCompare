# ClashCompare

A community-driven website where players rank the most annoying cards and emotes in Clash Royale using an Elo-based voting system.

## Features

- 🎯 **Voting System**: Vote between two random cards or emotes to determine which is more annoying
- 📊 **Elo-Based Rankings**: Automatic Elo rating updates after each vote (handled by Supabase triggers)
- 🏆 **Leaderboards**: View rankings with tier classifications (S+, S, A, B, C, D, F)
- 🔍 **Search**: Search through cards and emotes on leaderboards
- 📈 **Detailed Stats**: View individual card/emote statistics including rank, Elo, wins/losses/draws
- 🔐 **Authentication**: Optional login/signup (voting works without login)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + API)
- **Authentication**: Supabase Auth

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 3. Database Setup

Your Supabase database should already have the following tables:

- **cards**: `id`, `name`, `elixir_cost`, `image_url`, `elo`, `wins`, `losses`, `draws`, `created_at`
- **emotes**: `id`, `name`, `image_url`, `elo`, `wins`, `losses`, `draws`, `created_at`
- **votes**: `id`, `winner_id`, `loser_id`, `is_draw`, `category`, `created_at`
- **users**: `id`, `total_votes`, `created_at`

Make sure you have PostgreSQL triggers set up to automatically update Elo, wins, losses, and draws when votes are inserted.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ClashCompare/
├── app/
│   ├── api/
│   │   └── vote/
│   │       └── route.ts          # Vote submission API endpoint
│   ├── auth/
│   │   └── page.tsx               # Login/signup page
│   ├── details/
│   │   └── [category]/
│   │       └── [id]/
│   │           └── page.tsx       # Individual item detail page
│   ├── leaderboard/
│   │   └── [category]/
│   │       └── page.tsx           # Leaderboard page
│   ├── vote/
│   │   └── [category]/
│   │       └── page.tsx           # Voting interface
│   ├── layout.tsx                 # Root layout with navigation
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   ├── LoadingSpinner.tsx         # Loading animation component
│   └── VoteCard.tsx               # Card component for voting
├── lib/
│   ├── supabase.ts                # Supabase client configuration
│   └── utils.ts                   # Utility functions (tier calculation, etc.)
├── types/
│   └── index.ts                   # TypeScript type definitions
└── package.json
```

## Pages

- `/` - Home page with mode selector (Cards/Emotes)
- `/vote/[category]` - Voting interface (cards or emotes)
- `/leaderboard/[category]` - Leaderboard with search functionality
- `/details/[category]/[id]` - Detailed stats for a specific card/emote
- `/auth` - Authentication page (login/signup)

## Features Explained

### Elo System

The Elo rating system works automatically via PostgreSQL triggers in Supabase:
- Each vote updates the winner's and loser's Elo ratings
- Wins, losses, and draws are tracked automatically
- The system uses standard Elo calculations

### Tiers

Tiers are automatically calculated based on Elo:
- **S+**: ≥ 1300 Elo
- **S**: ≥ 1200 Elo
- **A**: ≥ 1100 Elo
- **B**: ≥ 1000 Elo
- **C**: ≥ 900 Elo
- **D**: ≥ 800 Elo
- **F**: < 800 Elo

### Voting

- Users can vote without logging in
- Each vote updates both items' Elo ratings
- After voting, a new random pair is loaded automatically
- Users can skip pairs if desired

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Notes

- The comment system exists in the database but is not implemented in the UI at launch
- Admin features are not included in this version
- Image URLs should point to valid Clash Royale card/emote images
- Make sure your Supabase RLS (Row-Level Security) policies allow public read access to cards and emotes, and authenticated insert access to votes

## License

MIT
