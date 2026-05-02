import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import React, { useState  } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

function PostCard({post}) {
    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-teal-600 font-semibold">$1</span>');
    const [likes, setLikes] = useState(post.likes_count);
    const totalImages = post.image_urls?.length || 0;

    const {getToken} = useAuth();
    const currentUser = useSelector((state)=>state.user.value)

   const HandleLike = async () => {
        try {
            const token = await getToken();
            const { data } = await api.post('/api/post/like', {postId: post._id}, {
                headers: {Authorization: `Bearer ${token}`}
            });

            if(data.success){
                toast.success(data.message);
                setLikes(prev => {
                    if(prev.includes(currentUser._id)){
                        return prev.filter(id => id !== currentUser._id);
                    }else{
                        return [...prev, currentUser._id];
                    }
                })
            }else{
                toast(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
  return (
    <article className='section-card p-4 sm:p-5 space-y-4 w-full max-w-2xl transition duration-300 hover:-translate-y-0.5 hover:shadow-lg'>
      <div className='flex items-start justify-between gap-3'>
        <div className='inline-flex items-center gap-3 cursor-pointer min-w-0'>
          {post.user.profile_picture ? (
            <img src={post.user.profile_picture} className='rounded-full shadow w-11 h-11 object-cover' />
          ) : (
            <div className='rounded-full shadow w-11 h-11 bg-slate-200 flex items-center justify-center'>
              <span className='text-slate-500 text-sm font-semibold'>{post.user.full_name?.charAt(0) || 'U'}</span>
            </div>
          )}
          <div className='min-w-0'>
            <div className='flex items-center gap-1.5'>
              <span className='font-semibold text-slate-900 truncate'>{post.user.full_name}</span>
              <BadgeCheck className='w-4 h-4 text-cyan-600' />
            </div>
            <div className='text-slate-500 text-sm truncate'>@{post.user.username}</div>
          </div>
        </div>
        <span className='text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap'>
          {moment(post.createdAt).fromNow()}
        </span>
      </div>

      {post.content && (
        <div
          className='text-slate-700 text-sm sm:text-[15px] whitespace-pre-line leading-relaxed bg-white/70 rounded-2xl p-3 subtle-border'
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {totalImages > 0 && (
        <div className={`grid gap-2.5 ${totalImages === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.image_urls.map((img, index) => (
            <div
              key={index}
              className={`${totalImages === 3 && index === 0 ? 'col-span-2' : ''} overflow-hidden rounded-xl subtle-border bg-slate-100`}
            >
              <img
                src={img}
                className={`w-full object-cover transition duration-500 hover:scale-[1.03] ${totalImages === 1 ? 'max-h-[28rem]' : totalImages === 3 && index === 0 ? 'h-64' : 'h-48'}`}
                alt=""
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-slate-600 text-sm pt-2 border-t border-slate-200">
        <button onClick={HandleLike} className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer'>
          <Heart className={`size-4 transition ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} />
          <span>{likes.length}</span>
        </button>
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition'>
          <MessageCircle className='size-4' />
          <span>{0}</span>
        </div>
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition'>
          <Share2 className='size-4' />
          <span>{0}</span>
        </div>
      </div>
    </article>
  )
}

export default PostCard
