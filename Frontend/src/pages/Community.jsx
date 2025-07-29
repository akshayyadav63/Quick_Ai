import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useTheme } from '../context/themeContext' // Import theme context

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const { user } = useUser()
  const [Creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const { darkMode } = useTheme() // Get dark mode state from theme context
  
  const fetchCreation = async () => {
    try {
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message || 'Failed to fetch creations')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch creations')
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post('/api/user/toggle-like-creations', { id }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      
      if (data.success) {
        toast.success(data.message || 'Creation liked/unliked successfully')
        await fetchCreation()
      } else {
        toast.error(data.message || 'Failed to like/unlike creation')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to like/unlike creation')
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreation()
    }
  }, [user])

  return !loading ? (
    <div className={`flex-1 h-full flex flex-col gap-4 p-6 ${
      darkMode ? 'bg-gray-950' : 'bg-white'
    }`}>
      <h1 className={`text-xl font-semibold ${
        darkMode ? 'text-white' : 'text-slate-700'
      }`}>
        Creations
      </h1>

      <div className={`h-full w-full rounded-xl overflow-y-scroll p-4 flex flex-wrap gap-4 ${
        darkMode 
          ? 'bg-gray-900 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {Creations.map((creation, index) => (
          <div
            key={index}
            className='relative group w-full sm:w-[48%] lg:w-[32%] aspect-square'
          >
            <img
              src={creation.content}
              alt=""
              className='w-full h-full object-cover rounded-lg'
            />
            <div className={`absolute inset-0 flex gap-2 items-end justify-end group-hover:justify-between p-3 text-white rounded-lg transition-all duration-300 ${
              darkMode 
                ? 'group-hover:bg-gradient-to-b from-transparent to-gray-900/90' 
                : 'group-hover:bg-gradient-to-b from-transparent to-black/80'
            }`}>
              <p className={`text-sm hidden group-hover:block transition-opacity duration-300 ${
                darkMode ? 'text-gray-200' : 'text-white'
              }`}>
                {creation.prompt}
              </p>
              <div className='flex gap-1 items-center'>
                <p className={`${darkMode ? 'text-gray-200' : 'text-white'}`}>
                  {creation.likes.length}
                </p>
                <Heart  
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                    creation.likes.includes(user?.id)
                      ? 'fill-red-600 text-red-600'
                      : darkMode 
                        ? 'text-gray-200 hover:text-red-400' 
                        : 'text-white hover:text-red-400'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {Creations.length === 0 && (
          <div className={`flex-1 flex justify-center items-center ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p className='text-lg'>No creations found</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className={`flex justify-center items-center h-full ${
      darkMode ? 'bg-gray-950' : 'bg-white'
    }`}>
      <span className={`w-10 h-10 rounded-full border-3 border-t-transparent animate-spin ${
        darkMode 
          ? 'border-purple-400 border-t-transparent' 
          : 'border-primary border-t-transparent'
      }`}></span>
    </div>
  )
}

export default Community