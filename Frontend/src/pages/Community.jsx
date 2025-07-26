import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'

const Community = () => {
  const { user } = useUser()
  const [Creations, setCreations] = useState([])

  useEffect(() => {
    const fetchCreation = async () => {
      setCreations(dummyPublishedCreationData)
    }

    if (user) {
      fetchCreation()
    }
  }, [user])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h1 className='text-xl font-semibold text-slate-700'>Creations</h1>

      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll p-4 flex flex-wrap gap-4'>
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
            <div className='absolute inset-0 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg transition'>
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes.includes(user?.id)
                      ? 'fill-red text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
