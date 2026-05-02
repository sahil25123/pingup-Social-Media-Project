import React from 'react'

import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { fetchUser } from '../features/user/userSlice';
import api from '../api/axios';
import {useNavigate} from "react-router-dom"

const UserCard = ({user}) => {
    const currentUser = useSelector((state)=>state.user.value);
    const { getToken } = useAuth();
    const dispatch =  useDispatch();
    const navigate = useNavigate();
    const profileImage = user.profile_picture || user.profil_picture;

   const handleFollow = async () => {
        try {
            const token = await getToken();
            const { data } = await api.post('/api/user/follow', {id: user._id}, {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(data.success){
                toast.success(data.message);
                const token = await getToken();
                dispatch(fetchUser(token));
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
     const handleConnection = async () => {
        if(currentUser.connections.includes(user._id)){
            return navigate('/messages/' + user._id);
        }
        try {
            const token = await getToken();
            const { data } = await api.post('/api/user/connect', {id: user._id}, {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(data.success){
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
  return (
    <div key={user._id} className='p-5 flex flex-col justify-between section-card min-h-86 transition hover:shadow-lg'>
        <div>
            <div className='flex items-start justify-between gap-2'>
                <div className='relative'>
                    {profileImage ? (
                        <img src={profileImage} className='aspect-square object-cover rounded-full w-16 h-16 shadow-sm' alt="" />
                    ) : (
                        <div className='aspect-square w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shadow-sm'>
                            <span className='text-slate-500 text-lg font-semibold'>{user.full_name?.charAt(0) || 'U'}</span>
                        </div>
                    )}
                    <span className='absolute bottom-0.5 right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-white'></span>
                </div>
                <button onClick={handleConnection} className='flex items-center justify-center w-10 h-10 border border-slate-200 text-slate-800 group rounded-xl cursor-pointer active:scale-95 transition hover:bg-slate-50'>
                    {
                        currentUser?.connections.includes(user._id) ? 
                        <MessageCircle className='size-5 group-hover:scale-105 transition'/> 
                        :
                        <Plus className='size-5 group-hover:scale-105 transition'/>
                    }
                </button>
            </div>

            <div className='mt-4'>
                <p className='font-semibold text-slate-800 text-lg leading-tight truncate'>{user.full_name}</p>
                { user.username && <p className='text-slate-500 text-sm'>@{user.username}</p> }
            </div>

            <p className='text-slate-600 mt-3 text-sm min-h-10'>
                {user.bio ? user.bio : 'No bio added yet.'}
            </p>
        </div>

        <div className='flex items-center gap-2 mt-4 text-xs text-slate-600'>
            <div className='flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1 bg-white'>
                <MapPin className='size-3.5'/> {user.location || 'Unknown'}
            </div>
            <div className='flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1 bg-white'>
                <span>{user.followers.length}</span> Followers
            </div>
        </div>

        <div className='flex mt-4 gap-2'>
            <button onClick={handleFollow} disabled={currentUser?.following.includes(user._id)} className='w-full py-2.5 rounded-xl flex justify-center items-center gap-2 btn-primary disabled:opacity-60 disabled:cursor-not-allowed'>
                <UserPlus className='size-4'/> {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
            </button>
        </div>
    </div>
  )
}

export default UserCard
