export function getTier(elo: number): string {
  if (elo >= 1300) return 'S+'
  if (elo >= 1200) return 'S'
  if (elo >= 1100) return 'A'
  if (elo >= 1000) return 'B'
  if (elo >= 900) return 'C'
  if (elo >= 800) return 'D'
  return 'F'
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    'S+': 'bg-purple-600 text-white',
    'S': 'bg-yellow-500 text-white',
    'A': 'bg-green-600 text-white',
    'B': 'bg-blue-600 text-white',
    'C': 'bg-orange-500 text-white',
    'D': 'bg-red-500 text-white',
    'F': 'bg-gray-500 text-white',
  }
  return colors[tier] || 'bg-gray-500 text-white'
}

export function formatElo(elo: number): string {
  return Math.round(elo).toString()
}

