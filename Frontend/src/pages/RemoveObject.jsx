import { Eraser, Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const [content, setContent] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (object.split(' ').length > 1) {
        toast.error('Only single object name is allowed');
        return;
      }

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || 'Failed to remove object');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to remove object');
    }
    setLoading(false);
  };

  return (
    <div className='h-full overflow-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 text-slate-700'>
      
      {/* Left Column - Upload Form */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full lg:w-1/2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm'
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          accept='image/*'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />

        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={3}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g., watch or spoon. Only single object name...'
          required
        />

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg hover:opacity-90 transition'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin'></span>
          ) : (
            <Eraser className='w-5' />
          )}
          Remove object
        </button>
      </form>

      {/* Right Column - Output Image */}
      <div className='w-full lg:w-1/2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm min-h-96 flex flex-col'>
        <div className='flex items-center gap-2'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-4 text-gray-400 mt-10'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 w-full flex justify-center'>
            <img
              src={content}
              alt='Processed'
              className='w-full max-w-full max-h-[30rem] object-contain rounded-md'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
