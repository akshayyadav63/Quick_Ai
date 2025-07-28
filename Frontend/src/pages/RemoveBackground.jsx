
import {  Eraser, Image, Sparkles } from 'lucide-react';
  import React, { useState } from 'react';
  import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  import { useAuth } from '@clerk/clerk-react';
  import { toast } from 'react-hot-toast';
 
  

const RemoveBackground = () => {
  
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();
    const [content, setContent] = useState('');
  
    const onSubmitHandler = async (e) => {
      e.preventDefault();
      try{

        setLoading(true);

      const formData = new FormData();
      formData.append('image', input);
        const {data}=await axios.post('/api/ai/remove-image-background', formData, {headers:{Authorization: `Bearer ${await getToken()}`}});

        if(data.success){
          setContent(data.content);
        }else{
          toast.error(data.message || 'Failed to remove background');
        }
      }catch(error){
        toast.error(error.message || 'Failed to remove background');
      }
      setLoading(false);
    };
  
    return (
      <div className='h-full overflow-y-scroll p-6 flex flex-col lg:flex-row gap-4 text-slate-700'>
        
        {/* Left Column */}
        <form onSubmit={onSubmitHandler} className='w-full lg:w-1/2 p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 text-[#FF4938]' />
            <h1 className='text-xl font-semibold'>Background Removal</h1>
          </div>
  
          <p className='mt-6 text-sm font-medium'>Describe Your Images</p>
          <input
            onChange={(e) => setInput(e.target.files[0])}
           type="file"
           accept='image/*'
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
            required
          />
  
         <p className=' text-xs text-gray-500 font-light mt-1'>Supports JPG,PNG and other image formats</p>
       
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
           {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Eraser className='w-5' />}
          Remove background
          </button>
        </form>
  
        
        {/* Right Column */}
<div className='w-full lg:w-1/2 p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem]'>
  <div className='flex items-center gap-3 mb-3'>
    <Eraser className='w-5 h-5 text-[#FF4938]' />
    <h1 className='text-xl font-semibold'>Processed image</h1>
  </div>

  {!content ? (
    <div className='flex-1 flex justify-center items-center'>
      <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
        <Eraser className='w-9 h-9' />
        <p>Upload an image and click "Remove Background" to get started</p>
      </div>
    </div>
  ) : (

      <img
        src={content}
        alt="Processed"
        className='max-w-full max-h-[24rem] object-contain rounded-md '
      />
   
  )}
</div>

      </div>
    );
  };
  
 
export default RemoveBackground
