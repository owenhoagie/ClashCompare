"use client"
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { isVotingOrDetails } from './navUtils'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const highlight = !isVotingOrDetails(pathname)
  return (
    <nav className="navbar sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className={
              `flex items-center group cursor-pointer relative ` +
              (highlight && pathname === '/' ? 'text-blue-600 dark:text-blue-400' : '')
            }
          >
            <span
              className={
                `text-2xl font-extrabold tracking-tight select-none relative transition-colors ` +
                (highlight && pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400')
              }
            >
              ClashCompare
              <span
                className={
                  `absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform origin-left ` +
                  (highlight && pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')
                }
              />
            </span>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/leaderboard/cards" active={highlight && pathname.startsWith('/leaderboard/cards')}>Cards Leaderboard</NavLink>
            <NavLink href="/leaderboard/emotes" active={highlight && pathname.startsWith('/leaderboard/emotes')}>Emotes Leaderboard</NavLink>
            {/* <NavLink href="/auth" active={highlight && pathname.startsWith('/auth')}>Login</NavLink> */}
          </div>
          {/* Mobile Hamburger */}
          {/* Animated Hamburger Button */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 relative group"
            aria-label="Open menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            <span
              className={`absolute left-2 right-2 top-3 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`absolute left-2 right-2 top-5 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`absolute left-2 right-2 top-7 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>
      </div>
      {/* Mobile Dropdown Menu - Modern Glassmorphism Redesign */}
      <div className="md:hidden relative">
        <div
          className={`absolute right-4 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-200 origin-top-right ${menuOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' : 'scale-95 opacity-0 pointer-events-none -translate-y-2'}`}
        >
          <ul className="flex flex-col py-1 gap-0.5">
            <li>
              <NavLink href="/leaderboard/cards" onClick={() => setMenuOpen(false)} active={highlight && pathname.startsWith('/leaderboard/cards')}>
                <span className="block px-4 py-0 text-sm font-medium relative transition-colors group">
                  Cards Leaderboard
                  <span className={`absolute left-4 right-4 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform origin-left ${highlight && pathname.startsWith('/leaderboard/cards') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink href="/leaderboard/emotes" onClick={() => setMenuOpen(false)} active={highlight && pathname.startsWith('/leaderboard/emotes')}>
                <span className="block px-4 py-0 text-sm font-medium relative transition-colors group">
                  Emotes Leaderboard
                  <span className={`absolute left-4 right-4 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform origin-left ${highlight && pathname.startsWith('/leaderboard/emotes') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </span>
              </NavLink>
            </li>

            {/*
            <li>
              <NavLink href="/auth" onClick={() => setMenuOpen(false)} active={highlight && pathname.startsWith('/auth')}>
                <span className="block px-4 py-0 text-sm font-medium relative transition-colors group">
                  Login
                  <span className={`absolute left-4 right-4 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform origin-left ${highlight && pathname.startsWith('/auth') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </span>
              </NavLink>
            </li>
            */}

          </ul>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children, onClick, active }: { href: string, children: React.ReactNode, onClick?: () => void, active?: boolean }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        `relative px-4 py-2 rounded font-medium transition-colors focus:outline-none group ` +
        (active
          ? 'text-blue-600 dark:text-blue-400 ' // highlighted color
          : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 ')
      }
    >
      <span className="relative z-10">{children}</span>
      <span className={
        `absolute left-4 right-4 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ` +
        (active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100') +
        ' transition-transform origin-left'
      } />
    </Link>
  )
}