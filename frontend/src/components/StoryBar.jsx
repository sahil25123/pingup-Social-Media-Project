import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react';
import moment from 'moment'
import StoryModel from './StoryModal';
import StoryViewer from './StoryViwer';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const StoriesBar = () => {

    const { getToken } = useAuth();

    const [stories, setStories] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [viewStory, setViewStory] = useState(false);

    const fetchStories = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/story/get', {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(data.success){
                setStories(data.stories);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        fetchStories();
    }, []);

  return (
    <section className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl px-4'>
        <div className='flex items-center justify-between mb-3'>
            <div>
                <p className='text-xs uppercase tracking-[0.2em] text-teal-700/80 font-semibold'>Stories</p>
                <h3 className='text-slate-900 font-semibold text-lg -mt-0.5'>Daily moments</h3>
            </div>
            <p className='text-xs text-slate-500'>{stories.length} active</p>
        </div>

        <div className='no-scrollbar overflow-x-auto pb-5'>
            <div className='flex gap-3.5 min-w-max snap-x snap-mandatory'>
                <button
                    onClick={()=>setShowModel(true)}
                    className='snap-start min-w-31 max-w-31 h-46 rounded-2xl cursor-pointer border border-teal-200 bg-gradient-to-b from-teal-50 via-white to-cyan-50 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left'
                >
                    <div className='h-full flex flex-col items-center justify-center p-4'>
                        <div className='size-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-3 shadow-md'>
                            <Plus className='size-5 text-white'/>
                        </div>
                        <p className='text-sm font-semibold text-slate-800 text-center'>Create Story</p>
                        <p className='text-xs text-slate-500 mt-1 text-center'>Share an update</p>
                    </div>
                </button>

                {stories.map((story, index) => (
                    <button
                        key={index}
                        onClick={() => setViewStory(story)}
                        className='snap-start relative min-w-31 max-w-31 h-46 rounded-2xl shadow-md cursor-pointer transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-lg overflow-hidden text-left'
                    >
                        {story.media_type !== 'text' && story.media_url ? (
                            story.media_type === 'image' ? (
                                <img src={story.media_url} className='absolute inset-0 h-full w-full object-cover' alt="" />
                            ) : (
                                <video src={story.media_url} className='absolute inset-0 h-full w-full object-cover' />
                            )
                        ) : (
                            <div className='absolute inset-0 bg-gradient-to-b from-teal-500 to-cyan-700'></div>
                        )}

                        <div className='absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/65'></div>

                        <div className='absolute top-3 left-3 z-10'>
                            {story.user.profile_picture ? (
                                <img src={story.user.profile_picture} className='aspect-square object-cover size-9 rounded-full ring-2 ring-white/90 shadow' alt="" />
                            ) : (
                                <div className='aspect-square size-9 rounded-full ring-2 ring-white/90 shadow bg-slate-200 flex items-center justify-center'>
                                    <span className='text-slate-600 text-xs font-semibold'>{story.user.full_name?.charAt(0) || 'U'}</span>
                                </div>
                            )}
                        </div>

                        <div className='absolute bottom-3 left-3 right-3 z-10'>
                            <p className='text-white text-sm font-medium truncate'>
                                {story.content || story.user?.full_name || 'Story'}
                            </p>
                            <p className='text-white/80 text-xs mt-0.5'>{moment(story.createdAt).fromNow()}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
        
        {/* Add Story Model */}
        {
            showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories}/>
        }

        {/* View Story Model */}
        {
            viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory}/>
        }
    </section>
  )
}

export default StoriesBar