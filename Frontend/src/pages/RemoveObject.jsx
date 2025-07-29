import { Eraser, Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/themeContext'; // Import theme context

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const [content, setContent] = useState('');
  const { darkMode } = useTheme(); // Get dark mode state from theme context

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
    <div className={`h-full overflow-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 ${
      darkMode ? 'text-gray-300' : 'text-slate-700'
    }`}>
      
      {/* Left Column - Upload Form */}
      <form
        onSubmit={onSubmitHandler}
        className={`w-full lg:w-1/2 p-4 rounded-lg border shadow-sm ${
          darkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
      >
        <div className='flex items-center gap-2'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Object Removal
          </h1>
        </div>

        <p className={`mt-6 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Upload Image
        </p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          accept='image/*'
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white file:bg-gray-700 file:text-gray-300 file:border-gray-600' 
              : 'bg-white border-gray-300 text-gray-600 file:bg-gray-50 file:text-gray-700 file:border-gray-300'
          } file:mr-4 file:py-1 file:px-3 file:rounded file:border file:text-sm file:font-medium cursor-pointer`}
          required
        />

        <p className={`mt-6 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Describe object name to remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={3}
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder='e.g., watch or spoon. Only single object name...'
          required
        />

        <button
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 text-white px-4 py-2 mt-6 text-sm rounded-lg transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#417DF6] to-[#8E37EB] hover:from-[#3a6edc] hover:to-[#7d32d4]'
          }`}
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
      <div className={`w-full lg:w-1/2 p-4 rounded-lg border shadow-sm min-h-96 flex flex-col ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className='flex items-center gap-2'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Processed Image
          </h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className={`text-sm flex flex-col items-center gap-4 mt-10 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 w-full flex justify-center'>
            <img
              src={content}
              alt='Processed'
              className='w-full max-w-full max-h-[30rem] object-contain rounded-md shadow-lg'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;