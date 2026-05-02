import { BadgeCheck, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'

function StoryViwer({ viewStory, setViewStory }) {
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000; // 5 seconds

  useEffect(() => {
    // Auto-close timer
    const closeTimer = setTimeout(() => {
      setViewStory(null);
    }, STORY_DURATION);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(progressInterval);
    };
  }, [setViewStory]);

  const handleClose = () => {
    setViewStory(null);
  };

  const renderContent = () => {
    switch (viewStory.media_type) {
      case 'image':
        return (
          <img 
            src={viewStory.media_url} 
            alt="" 
            className='max-w-full max-h-screen object-contain' 
          />
        );

      case 'video':
        return (
          <video 
            controls 
            autoPlay 
            onEnded={() => setViewStory(null)} 
            src={viewStory.media_url} 
            className='max-h-screen' 
          />
        );

      case 'text':
        return (
          <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'>
            {viewStory.content}
          </div>
        );
    
      default:
        return null;
    }
  }

  return (
    <div 
      className='fixed inset-0 h-screen bg-black bg-opacity-90 z-50 flex items-center justify-center' 
      style={{
        backgroundColor: viewStory.media_type === 'text' 
          ? viewStory.background_color 
          : "#000000"
      }}
    >
      {/* Progress bar */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
        <div 
          className='h-full bg-white transition-all ease-linear' 
          style={{width: `${progress}%`}}
        />
      </div>

      {/* User info - top left */}
      <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50'>
        {viewStory.user?.profile_picture ? (
          <img 
            src={viewStory.user.profile_picture} 
            alt="" 
            className='w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white'
          />
        ) : (
          <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center border border-white'>
            <span className='text-white text-xs font-semibold'>
              {viewStory.user?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <div className='text-white font-medium flex items-center gap-1.5'>
          <span>{viewStory.user?.full_name || 'User'}</span>
          {viewStory.user?.is_verified && <BadgeCheck size={18} />}
        </div>
      </div>

      {/* Close Button */}
      <button  
        onClick={handleClose} 
        className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'
      >
        <X className='w-8 h-8 hover:scale-110 transition cursor-pointer' />
      </button>

      {/* Content Wrapper */}
      <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
        {renderContent()}
      </div>
    </div>
  )
}

export default StoryViwer