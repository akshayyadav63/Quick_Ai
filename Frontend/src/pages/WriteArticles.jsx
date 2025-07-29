import { Edit, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import Markdown from 'react-markdown'
import { useTheme } from '../context/themeContext'; // Import theme context

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; 

const WriteArticles = () => {
  const articleLength = [
    { length: 800, text: 'short (500-800 words)' },
    { length: 1200, text: 'short (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' }
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();
  const { darkMode } = useTheme(); // Get dark mode state from theme context

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article on the topic "${input}" with a length of ${selectedLength.length} words.`;
      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
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
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Article Configuration
          </h1>
        </div>

        <p className={`mt-6 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Article Topic
        </p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
          Article Length
        </p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-600'
                  : darkMode 
                    ? 'text-gray-300 border-gray-600 hover:bg-gray-800' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>

        <br />
        <button 
          disabled={loading} 
          className={`w-full flex justify-center items-center gap-2 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#226BFF] to-[#65ADFF] hover:from-[#1f5ce6] hover:to-[#5a9ee6]'
          }`}
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Edit className='w-5' />
          )}
          Generate Article
        </button>
      </form>

      {/* Right Column */}
      <div className={`w-full lg:w-1/2 p-4 rounded-lg flex flex-col border min-h-96 max-h-[600px] ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Generated article
          </h1>
        </div>
        
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className={`text-sm flex flex-col items-center gap-5 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <Edit className='w-9 h-9' />
              <p>Enter a topic and click "Generate article" to get started</p>
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

export default WriteArticles;