import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useTheme } from '../context/themeContext'; // Import theme context

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const ImageStyle = [
    'Realistic', 'Ghibli style', 'Anime style', 'Cartoon style', 'Fantasy style',
    'Realistic style', '3D style', 'Portrait style'
  ];

  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();
  const { darkMode } = useTheme(); // Get dark mode state from theme context

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || 'Failed to generate image');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to generate image');
    }
    setLoading(false);
  };

  return (
    <div className={`h-full overflow-y-scroll p-6 flex flex-col lg:flex-row gap-4 ${
      darkMode ? 'text-gray-300' : 'text-slate-700'
    }`}>
      
      {/* Left Column */}
      <form onSubmit={onSubmitHandler} className={`w-full lg:w-1/2 p-4 rounded-lg border ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            AI Image Generator
          </h1>
        </div>

        <p className={`mt-6 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Describe Your Images
        </p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder='Describe what you want to see in this image ...'
          required
        />

        <p className={`mt-4 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Style
        </p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {ImageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors ${
                selectedStyle === item
                  ? 'bg-green-50 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-600'
                  : darkMode 
                    ? 'text-gray-300 border-gray-600 hover:bg-gray-800' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer inline-block w-9 h-5'>
            <input
              type='checkbox'
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className='sr-only peer'
            />
            
            <div className={`w-full h-full rounded-full transition-colors ${
              darkMode 
                ? 'bg-gray-600 peer-checked:bg-green-500' 
                : 'bg-slate-300 peer-checked:bg-green-500'
            }`}></div>

            <span className='absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4'></span>
          </label>

          <p className={`text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Make this image Public
          </p>
        </div>

        <button 
          disabled={loading} 
          className={`w-full flex justify-center items-center gap-2 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#00AD25] to-[#04FF50] hover:from-[#009922] hover:to-[#03e047]'
          }`}
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Image className='w-5' />
          )}
          Generate image
        </button>
      </form>

      {/* Right Column */}
      <div className={`w-full lg:w-1/2 p-4 rounded-lg flex flex-col border min-h-96 ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Generated image
          </h1>
        </div>
        
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className={`text-sm flex flex-col items-center gap-5 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <Image className='w-9 h-9' />
              <p>Enter a topic and click "Generate image" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full flex justify-center items-center'>
            <img 
              src={content} 
              alt='Generated' 
              className='max-w-full max-h-full object-contain rounded-lg shadow-lg' 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;