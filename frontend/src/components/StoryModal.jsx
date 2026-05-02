import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState, useEffect } from 'react' // ✅ Added useEffect
import toast from 'react-hot-toast';
import api from '../api/axios';

const StoryModal = ({setShowModel, fetchStories}) => {
    const bgColors = [
        "#4f46e5", // Indigo
        "#7c3aed", // Purple
        "#db2777", // Pink
        "#e11d48", // Red
        "#ca8a04", // Yellow/Amber
        "#0d9488", // Teal
        "#2563eb", // Blue
        "#14b8a6", // Cyan
        "#22c55e", // Green
        "#84cc16", // Lime
        "#f59e0b", // Orange
        "#d97706", // Amber
        "#ef4444", // Bright Red
        "#ec4899", // Fuchsia
        "#8b5cf6", // Violet
        "#6366f1", // Indigo Light
        "#3b82f6", // Sky Blue
        "#06b6d4", // Turquoise
        "#10b981", // Emerald
        "#f43f5e", // Rose
    ];

    const [mode, setMode] = useState("text");
    const [bg, setBg] = useState(bgColors[0]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [preview_url, setPreview_url] = useState(null); // ✅ Fixed typo

    const { getToken } = useAuth();

    const MAX_VIDEO_DURATION = 60; // seconds
    const MAX_VIDEO_SIZE_MB = 50; // MB 

    // ✅ Cleanup object URLs on unmount or when preview changes
    useEffect(() => {
        return () => {
            if (preview_url) {
                URL.revokeObjectURL(preview_url);
            }
        };
    }, [preview_url]);

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if(file){
            // ✅ Revoke previous URL before creating new one
            if(preview_url){
                URL.revokeObjectURL(preview_url);
            }

            if(file.type.startsWith("video")){
                if(file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024){
                    toast.error(`Video file size cannot exceed ${MAX_VIDEO_SIZE_MB} MB.`);
                    setMedia(null);
                    setPreview_url(null);
                    return;
                }
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(video.src);
                    if(video.duration > MAX_VIDEO_DURATION){
                        toast.error("Video duration cannot exceed 1 minute.");
                        setMedia(null);
                        setPreview_url(null);
                    }else{
                        setMedia(file);
                        setPreview_url(URL.createObjectURL(file));
                        setText('');
                        setMode("media");
                    }
                }
                video.src = URL.createObjectURL(file);
            }else if(file.type.startsWith("image")){
                setMedia(file);
                setPreview_url(URL.createObjectURL(file));
                setText('');
                setMode("media");
            }
        }
    }

    const handleCreateStory = async () => {
        
            const media_type = mode === 'media' ? media?.type.startsWith('image') ? 'image' : "video" : "text";

            if(media_type === "text" && !text){
                throw new Error('Please enter some text');
            }

            let formData = new FormData();
            formData.append('content', text);
            formData.append('media_type', media_type);
            
            // ✅ Only append media if it exists
            if(media){
                formData.append('media', media);
            }
            formData.append('background_color', bg);

            const token = await getToken();
            const { data } = await api.post('/api/story/create', formData, {
                headers: {Authorization: `Bearer ${token}`}
            });

            if(data.success){
                setShowModel(false);
                toast.success("Story created successfully");
                fetchStories();
            }else{
                toast.error(data.message);
            }
    }

    return (
        <div className='fixed inset-0 z-50 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'> {/* ✅ Fixed: z-110 -> z-50, backdrop:-blur -> backdrop-blur */}
            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button onClick={()=>setShowModel(false)} className='text-white p-2 cursor-pointer hover:bg-white/10 rounded transition'>
                        <ArrowLeft />
                    </button>
                    <h2 className='text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>
                <div className='rounded-lg h-96 flex items-center justify-center relative overflow-hidden' style={{backgroundColor: bg}}> {/* ✅ Fixed: item-center -> items-center, added overflow-hidden */}
                    {mode === "text" && (
                        <textarea 
                            className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none' // ✅ Fixed: focus-outline -> focus:outline-none
                            placeholder="What's on your mind"
                            onChange={(e)=>setText(e.target.value)} 
                            value={text}
                        />
                    )}
                    {mode === 'media' && preview_url && (
                        media?.type.startsWith('image') ? (
                            <img src={preview_url} alt="" className='object-contain max-h-full'/>
                        ) : (
                            <video src={preview_url} className='object-contain max-h-full' controls /> // ✅ Added controls
                        )
                    )}
                </div>
                <div className='flex gap-2 mt-4 overflow-x-auto pb-2'> {/* ✅ Added overflow handling */}
                    {bgColors.map((color)=>(
                        <button 
                            key={color}  
                            className={`size-6 rounded-full cursor-pointer flex-shrink-0 transition-transform hover:scale-110 ${bg === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`} // ✅ Improved styling
                            style={{backgroundColor: color}} 
                            onClick={()=>setBg(color)}
                        />
                    ))}
                </div>
                <div className='flex gap-2 mt-4'>
                    <button 
                        onClick={()=>{ 
                            setMode('text'); 
                            setMedia(null); 
                            if(preview_url){
                                URL.revokeObjectURL(preview_url); // ✅ Cleanup URL
                            }
                            setPreview_url(null); 
                        }} 
                        className={`flex-1 flex font-semibold items-center justify-center gap-2 p-2 cursor-pointer rounded transition ${mode === 'text' ? "bg-white text-black" : "bg-zinc-800 hover:bg-zinc-700"}`}
                    >
                        <TextIcon size={18}/> Text
                    </button>
                    <label className={`flex-1 flex font-semibold items-center justify-center gap-2 p-2 rounded cursor-pointer transition ${mode === 'media' ? "bg-white text-black" : "bg-zinc-800 hover:bg-zinc-700"}`}> {/* ✅ Added font-semibold and hover */}
                        <input onChange={handleMediaUpload} type="file" accept='image/*, video/*' className='hidden' />
                        <Upload size={18}/> Photo/Video
                    </label>
                </div>

                <button 
                    onClick={()=>toast.promise(handleCreateStory(), {
                        loading: 'Saving...',
                        success: <p>Story Added</p>,
                        error: e => <p>{e.message}</p>
                    })} 
                    className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 active:scale-95 transition cursor-pointer font-semibold'
                >
                    <Sparkle size={18}/> Create Story
                </button>
            </div>
        </div>
    )
}

export default StoryModal