import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/themeContext' // Import theme context

const ThemeToggle = ({ darkMode, toggleTheme }) => (
  <div className="px-1">
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-2 rounded-lg hover:shadow-sm transition-all duration-200 ${
        darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-50"
      }`}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="flex items-center gap-2">
        {darkMode ? <Sun className="text-yellow-400" size={18} /> : <Moon className="text-indigo-400" size={18} />}
        <div className={`w-10 h-5 rounded-full flex items-center ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'} px-0.5`}>
          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
      </span>
    </button>
  </div>
)

export default ThemeToggle