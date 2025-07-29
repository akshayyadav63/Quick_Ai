import { FileText, Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useTheme } from '../context/themeContext'; // Import theme context

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const [content, setContent] = useState('');
  const { darkMode } = useTheme(); // Get dark mode state from theme context

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', input);
      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || 'Failed to review resume');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to review resume');
    }
    setLoading(false);
  };

  return (
    <div className={`h-full overflow-y-scroll p-6 flex flex-col lg:flex-row gap-4 ${
      darkMode ? 'text-gray-300' : 'text-slate-700'
    }`}>
      
      {/* Left Column */}
      <form 
        onSubmit={onSubmitHandler} 
        className={`w-full lg:w-1/2 p-4 rounded-lg border ${
          darkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00DA83]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Resume Review
          </h1>
        </div>

        <p className={`mt-6 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Upload Resume
        </p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='application/pdf'
          className={`w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white file:bg-gray-700 file:text-gray-300 file:border-gray-600' 
              : 'bg-white border-gray-300 text-gray-600 file:bg-gray-50 file:text-gray-700 file:border-gray-300'
          } file:mr-4 file:py-1 file:px-3 file:rounded file:border file:text-sm file:font-medium cursor-pointer`}
          required
        />
        <p className={`text-xs font-light mt-1 ${
          darkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Supports PDF resume only.
        </p>

        <button 
          disabled={loading} 
          className={`w-full flex justify-center items-center gap-2 text-white px-4 py-2 mt-6 text-sm rounded-lg transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#00DA83] to-[#009BB3] hover:from-[#00c775] hover:to-[#008ba3] cursor-pointer'
          }`}
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin'></span>
          ) : (
            <FileText className='w-5' />
          )}
          Review Resume
        </button>
      </form>

      {/* Right Column */}
      <div className={`w-full lg:w-1/2 p-4 rounded-lg flex flex-col border min-h-96 max-h-[600px] ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-[#00DA83]' />
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Analysis Result
          </h1>
        </div>
        
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className={`text-sm flex flex-col items-center gap-5 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <FileText className='w-9 h-9' />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className={`mt-3 h-full overflow-y-scroll text-sm ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            <div className={`reset-tw reset-tw prose prose-sm max-w-none ${
              darkMode ? 'prose-invert' : ''
            }`}>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;