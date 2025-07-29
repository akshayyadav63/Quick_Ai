import React from 'react'
import { useUser, useClerk, Protect } from '@clerk/clerk-react'
import {
  Hash,
  House,
  SquarePen,
  Image,
  Eraser,
  Scissors,
  FileText,
  Users,
  LogOut,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/themeContext' // Import theme context

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const { darkMode } = useTheme() // Get dark mode state from theme context

  if (!user) return null

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebar && (
        <div
          className={`fixed inset-0 z-30 sm:hidden ${
            darkMode ? 'bg-black/50' : 'bg-black/30'
          }`}
          onClick={() => setSidebar(false)}
        />
      )}

      <div
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-60 border-r
          flex flex-col justify-between items-center
          transform transition-transform duration-300 ease-in-out
          ${sidebar ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:static sm:z-auto
          ${darkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
          }
        `}
      >
        <div className='mt-14 sm:mt-7 w-full'>
          <img src={user.imageUrl} alt="user avatar" className='w-14 rounded-full mx-auto' />
          <h1 className={`mt-1 text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {user.fullName}
          </h1>
          <div className={`px-6 mt-5 text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors
                   ${isActive 
                     ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' 
                     : darkMode 
                       ? 'hover:bg-gray-800 text-gray-300' 
                       : 'hover:bg-gray-100 text-gray-600'
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-white' 
                        : darkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-600'
                    }`} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className={`w-full border-t p-4 px-7 flex items-center justify-between ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
            <img src={user.imageUrl} className='w-8 h-8 rounded-full object-cover' alt="img" />
            <div>
              <h1 className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user.fullName}
              </h1>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Protect plan='premium' fallback="Free">Premium</Protect> Plan
              </p>
            </div>
          </div>
          <LogOut
            className={`w-5 h-5 transition cursor-pointer ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-400 hover:text-gray-700'
            }`}
            onClick={() => signOut()}
          />
        </div>
      </div>
    </>
  )
}

export default Sidebar