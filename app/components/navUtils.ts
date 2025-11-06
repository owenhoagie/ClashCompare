// Utility to determine if a path is a voting or details page
export function isVotingOrDetails(path: string) {
  return (
    /^\/vote(\/|$)/.test(path) ||
    /^\/details(\/|$)/.test(path)
  )
}
