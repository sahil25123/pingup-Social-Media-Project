import React, { useState } from "react";
// import { dummyUserData } from "../assets/assets";
import { X , Image, Sparkles, SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import {useNavigate} from "react-router-dom"
import api from "../api/axios";

function CreatePost() {
  const navigate =useNavigate()
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {getToken} = useAuth()



  const handleSubmit = async () => {
    if(!images.length && !content){
      return toast.error('Please add at least one image or text');
    }
    setLoading(true);

    const postType = images.length && content ? 'text_with_image' : images.length ? 'image' : 'text';

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('post_type', postType);
      images.map((image) => {
        formData.append('images', image)
      })

      const token = await getToken();
      const { data } = await api.post('/api/post/add', formData, {

        headers: {Authorization: `Bearer ${token}`}
      });

      if(data.success){
        navigate('/');
      }else{
        console.log(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error.message);
        throw new Error(error.message);
    }
  }

  const user = useSelector((state)=>state.user.value);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto page-shell space-y-6">
        <div>
          <h1 className="app-title mb-2">Create Post</h1>
          <p className="app-subtitle">Share your thoughts with the world</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 items-start">
          <div className='section-card p-5 sm:p-7 space-y-5'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                {user?.profile_picture ? (
                  <img src={user.profile_picture} className='aspect-square object-cover size-12 rounded-full shadow-sm' alt="" />
                ) : (
                  <div className='aspect-square size-12 rounded-full bg-slate-200 flex items-center justify-center'>
                    <span className='font-semibold text-slate-600'>{user?.full_name?.charAt(0) || "U"}</span>
                  </div>
                )}
                <div>
                  <h2 className='font-semibold text-slate-900'>{user?.full_name || "User"}</h2>
                  <p className='text-sm text-slate-500'>@{user?.username || "username"}</p>
                </div>
              </div>
              <span className='inline-flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full'>
                <Sparkles className='size-3.5' />
                Draft
              </span>
            </div>

            <textarea onChange={(e)=>setContent(e.target.value)} value={content} className='w-full resize-none max-h-40 text-sm input-shell min-h-36 placeholder-gray-400' placeholder="What do you want to share today?"/>

            { images.length > 0 && 
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5'>
                { images.map((image, i) => (
                  <div key={i} className='relative group rounded-xl overflow-hidden subtle-border bg-slate-100'>
                    <img src={URL.createObjectURL(image)} className='h-28 w-full object-cover' alt="" />
                    <button onClick={()=>setImages(images.filter((_, index) => index !== i))} className='absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-1 cursor-pointer transition'>
                      <X className='size-4'/>
                    </button>
                  </div>
                ))}
              </div>
            }

            <div className='flex items-center justify-between pt-4 border-t border-slate-200'>
              <label htmlFor='images' className='inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition cursor-pointer rounded-xl px-3 py-2 hover:bg-slate-100'>
                <Image className='size-5'/>
                <span>Add photos</span>
              </label>

              <input type="file" id='images' accept='image/*' hidden multiple onChange={(e)=>setImages([...images, ...e.target.files])} />

              <button disabled={loading} onClick={()=>
                toast.promise(handleSubmit(),
                { loading: 'uploading...',
                success: <p>Post Uploaded</p>,
                error: <p>Post Not Uploaded</p>
              })} className='text-sm btn-primary font-medium px-6 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'>
                <SendHorizontal className='size-4' />
                Publish Post
              </button>
            </div>
          </div>

          <aside className='section-card p-5 space-y-4'>
            <h3 className='font-semibold text-slate-900'>Posting Tips</h3>
            <div className='space-y-3 text-sm text-slate-600'>
              <p className='rounded-xl bg-slate-50 px-3 py-2'>Start with a strong first line to grab attention.</p>
              <p className='rounded-xl bg-slate-50 px-3 py-2'>Posts with clear images usually get better engagement.</p>
              <p className='rounded-xl bg-slate-50 px-3 py-2'>Keep your message concise and meaningful.</p>
            </div>
            <div className='text-xs text-slate-500 border-t border-slate-200 pt-3'>
              Your current post type is detected automatically based on text and images.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
