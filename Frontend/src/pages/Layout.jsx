import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'
import { useTheme } from '../context/themeContext'
import ThemeToggle from '../pages/ThemeToggel'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()
  const { darkMode, toggleTheme } = useTheme()

  return user ? (
    <div className={`flex flex-col items-start justify-start h-screen ${
      darkMode ? 'bg-gray-950' : 'bg-white'
    }`}>
      <nav className={`w-full px-8 min-h-14 flex items-center justify-between border-b ${
        darkMode
          ? 'border-gray-700 bg-gray-900'
          : 'border-gray-200 bg-white'
      }`}>
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => navigate('/')}
          className="cursor-pointer w-32 sm:w-44"
        />
        
        {/* Right side of navbar with theme toggle and menu */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
          
          {/* Mobile menu toggle */}
          {sidebar ? (
            <X
              onClick={() => setSidebar(false)}
              className={`w-6 h-6 sm:hidden cursor-pointer ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            />
          ) : (
            <Menu
              onClick={() => setSidebar(true)}
              className={`w-6 h-6 sm:hidden cursor-pointer ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            />
          )}
        </div>
      </nav>
      
      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className={`flex-1 p-4 ${
          darkMode ? 'bg-gray-950' : 'bg-[#F4F7FB]'
        }`}>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className={`flex items-center justify-center h-screen ${
      darkMode ? 'bg-gray-950' : 'bg-white'
    }`}>
      <div className={darkMode ? 'bg-gray-900 rounded-lg p-8' : ''}>
        <SignIn
          appearance={{
            elements: {
              card: darkMode ? "bg-gray-900 border-gray-700" : "",
              headerTitle: darkMode ? "text-white" : "",
              headerSubtitle: darkMode ? "text-gray-300" : "",
              socialButtonsBlockButton: darkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : "",
              formFieldInput: darkMode ? "bg-gray-800 border-gray-700 text-white" : "",
              formFieldLabel: darkMode ? "text-gray-300" : "",
              identityPreviewText: darkMode ? "text-gray-300" : "",
              identityPreviewEditButton: darkMode ? "text-blue-400" : "",
              footerActionText: darkMode ? "text-gray-400" : "",
              footerActionLink: darkMode ? "text-blue-400" : "",
              dividerLine: darkMode ? "bg-gray-700" : "",
              dividerText: darkMode ? "text-gray-400" : "",
              formButtonPrimary: darkMode ? "bg-blue-600 hover:bg-blue-700" : "",
              otpCodeFieldInput: darkMode ? "bg-gray-800 border-gray-700 text-white" : "",
              alternativeMethodsBlockButton: darkMode ? "text-blue-400 hover:bg-gray-800" : "",
            }
          }}
        />
      </div>
    </div>
  )
}

export default Layout