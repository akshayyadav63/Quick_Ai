import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
import { useTheme } from '../context/themeContext' // Import theme context

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const { darkMode } = useTheme() // Get dark mode state from theme context

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch dashboard data')
    }
    setLoading(false)
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <div className={`h-full overflow-y-scroll p-6 ${
      darkMode ? 'bg-gray-950' : 'bg-white'
    }`}>
      <div className='flex justify-start gap-4 flex-wrap'>
        {/* Total Creation Card */}
        <div className={`flex justify-between items-center w-72 p-4 rounded-xl border ${
          darkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
            <p className='text-sm'>Total Creation</p>
            <h2 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {creations.length}
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white'/>
          </div>
        </div>

        {/* Active Plan Card */}
        <div className={`flex justify-between items-center w-72 p-4 rounded-xl border ${
          darkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
            <p className='text-sm'>Active Plan</p>
            <h2 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Protect plan='premium' fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white'/>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-3/4'>
          <div className={`animate-spin rounded-full h-11 w-11 border-3 border-t-transparent ${
            darkMode 
              ? 'border-purple-400 border-t-transparent' 
              : 'border-purple-500 border-t-transparent'
          }`}></div>
        </div>
      ) : (
        <div className='space-y-3'>
          <p className={`mt-6 mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Recent Creations
          </p>
          {creations.map((item) => 
            <CreationItem key={item.id} item={item}/>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard