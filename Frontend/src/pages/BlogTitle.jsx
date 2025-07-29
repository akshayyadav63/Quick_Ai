import { Edit, Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '../context/themeContext'; // Import theme context

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'
  ];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();
  const { darkMode } = useTheme(); // Get dark mode state from theme context

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Generate a blog title for the topic "${input}" in the category "${selectedCategory}".`;

      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
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
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            AI Title Generator
          </h1>
        </div>

        <p className={`mt-6 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Keyword
        </p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder='The future of artificial intelligence is ...'
          required
        />

        <p className={`mt-4 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Category
        </p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors ${
                selectedCategory === item
                  ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-600'
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

        <br />
        <button 
          disabled={loading} 
          className={`w-full flex justify-center items-center gap-2 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#C341F6] to-[#8E37EB] hover:from-[#b439e3] hover:to-[#7d2fd4]'
          }`}
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Hash className='w-5' />
          )}
          Generate title
        </button>
      </form>

      {/* Right Column */}
      <div className={`w-full lg:w-1/2 p-4 rounded-lg flex flex-col border min-h-96 ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className='flex items-center gap-3'>
          <Hash className='w-5 h-5 text-[#8E37EB]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Generated titles
          </h1>
        </div>
        
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className={`text-sm flex flex-col items-center gap-5 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <Hash className='w-9 h-9' />
              <p>Enter a topic and click "Generate title" to get started</p>
            </div>
          </div>
        ) : (
          <div className={`mt-3 h-full overflow-y-scroll text-sm ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            <div className={`reset-tw prose prose-sm max-w-none ${
              darkMode 
                ? 'prose-invert prose-headings:text-gray-200 prose-p:text-gray-300 prose-strong:text-gray-200 prose-code:text-gray-300 prose-pre:bg-gray-800 prose-pre:text-gray-300 prose-blockquote:text-gray-400 prose-li:text-gray-300' 
                : 'prose-gray'
            }`}>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitle;