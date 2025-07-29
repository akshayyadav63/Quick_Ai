import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { useTheme } from '../context/themeContext' // Import theme context

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)
  const { darkMode } = useTheme() // Get dark mode state from theme context

  return (
    <div  
      onClick={() => setExpanded(!expanded)} 
      className={`p-4 max-w-5xl text-sm border rounded-lg cursor-pointer transition-colors duration-200 ${
        darkMode 
          ? 'bg-gray-900 border-gray-700 hover:bg-gray-800' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.prompt}
          </h2>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button className={`px-4 py-1 rounded-full border text-xs font-medium transition-colors ${
          darkMode 
            ? 'bg-blue-900/50 border-blue-700 text-blue-300 hover:bg-blue-900/70' 
            : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF] hover:bg-blue-100'
        }`}>
          {item.type}
        </button>
      </div>
      
      {expanded && (
        <div className='mt-4'>
          {item.type === 'image' ? (
            <div>
              <img 
                src={item.content} 
                alt="generated image" 
                className='mt-3 w-full max-w-md rounded-lg shadow-sm'
              />
            </div>
          ) : (
            <div className={`mt-3 w-full overflow-y-scroll text-sm ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
              <div className={`reset-tw prose max-w-none ${
                darkMode 
                  ? 'prose-invert prose-headings:text-gray-200 prose-p:text-gray-300 prose-strong:text-gray-200 prose-code:text-gray-300 prose-pre:bg-gray-800 prose-pre:text-gray-300' 
                  : 'prose-gray'
              }`}>
                <Markdown>
                  {item.content}
                </Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreationItem