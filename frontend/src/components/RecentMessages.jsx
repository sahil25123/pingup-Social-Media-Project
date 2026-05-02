import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { MessageSquareText } from 'lucide-react';

const RecentMessages = () => {

    const [msg , setMessages] = useState([]);
    const { user } = useUser();
    const { getToken } = useAuth();

    const fetchRecentMessages = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/user/recent-messages', {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(data.success){
                // Group message by sender and get the latest message for each sender
                const groupedMessages = data.messages.reduce((acc, message)=>{
                    const senderId = message.from_user_id._id;
                    if(!acc[senderId] || new Date(message.createdAt) > new Date(acc[senderId].createdAt)){
                        acc[senderId] = message;
                    }
                    return acc;
                }, {})

                // Sort messages by date
                const sortedMessages = Object.values(groupedMessages).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setMessages(sortedMessages)
            }else{
                toast.error(data.message);
            
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(()=>{
        if(user){
            fetchRecentMessages();
            const intervalId = setInterval(fetchRecentMessages, 30000);
            return () => clearInterval(intervalId);
        }
    },[user]);
  return (
    <div className='section-card p-4 text-xs text-slate-800'>
        <div className='flex items-center justify-between mb-3'>
            <h3 className='font-semibold text-slate-800'>Recent Messages</h3>
            <span className='text-[11px] rounded-full px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100'>{msg.length}</span>
        </div>
        <div className='flex flex-col max-h-64 overflow-y-auto no-scrollbar'>
            {msg.length > 0 ? msg.map((message, index) => (
                <Link to={`/messages/${message.from_user_id._id}`} key={index} className='flex items-start rounded-xl gap-2.5 py-2.5 hover:bg-slate-100 p-2 transition'>
                    <img src={message.from_user_id.profile_picture} className='size-9 rounded-full aspect-square object-cover shadow-sm' alt="" />
                    <div className='w-full min-w-0'>
                        <div className='flex justify-between gap-2'>
                            <p className='font-medium text-sm text-slate-800 truncate'>{message.from_user_id.full_name}</p>
                            <p className='text-[10px] text-slate-400 whitespace-nowrap'>{moment(message.createdAt).fromNow()}</p>
                        </div>
                        <div className='flex justify-between items-center gap-2 mt-0.5'>
                            <p className='text-slate-500 text-xs truncate'>{message.text ? message.text : 'Media'}</p>
                            { !message.seen && <p className='bg-teal-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>1</p>}
                        </div>
                    </div>
                </Link>
            )) : (
                <div className='rounded-xl bg-slate-50 border border-slate-200 p-4 text-center'>
                    <MessageSquareText className='w-5 h-5 text-slate-400 mx-auto mb-1.5' />
                    <p className='text-slate-600 text-sm font-medium'>No recent messages</p>
                    <p className='text-slate-500 text-xs mt-1'>Your latest conversations will show up here.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default RecentMessages
