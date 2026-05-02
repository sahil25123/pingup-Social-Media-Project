import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, User, UserCheck, UserPlus, UserRoundPen, SearchCheck } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import { fetchConnections } from '../features/connections/connectionSlice.js';
import toast from 'react-hot-toast';

function Connections() {

  const {connections, pendingConnections, followers, following} = useSelector((state)=>state.connections) 

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState('followers');

  const navigate = useNavigate();

  const dataArray = [
    {label: "followers", value: followers, icon: User},
    {label: "following", value: following, icon: UserCheck}, 
    {label: "pending", value: pendingConnections, icon: UserRoundPen}, 
    {label: "connections", value: connections, icon: UserPlus} 
  ]

  const handleUnfollow = async (userId) => {
    try {
      const token = await getToken();
      const { data } = await api.post('/api/user/unfollow', {id: userId}, {
        headers: {Authorization: `Bearer ${token}`}
      });
      if(data.success){
        toast.success(data.message);
        dispatch(fetchConnections(token))
      }else{
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message);
    }
  }

  const acceptConnection = async (userId) => {
    try {
      const token = await getToken();
      const { data } = await api.post('/api/user/accept', {id: userId}, {
        headers: {Authorization: `Bearer ${token}`}
      });
      if(data.success){
        toast.success(data.message);
        dispatch(fetchConnections(token));
      }else{
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message);
    }
  }

  useEffect(()=>{
    getToken().then((token)=>{
      dispatch(fetchConnections(token));
    })
  },[])

  const activeUsers = dataArray.find((item)=>item.label === currentTab)?.value || [];

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto page-shell space-y-6'>
        <div>
          <h1 className='app-title mb-2'>Connections</h1>
          <p className='app-subtitle'>Manage your network and discover new connections</p>
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
          {dataArray.map((item, index) => (
            <div key={index} className='section-card px-4 py-4'>
              <div className='flex items-center justify-between'>
                <p className='text-slate-600 capitalize text-sm font-medium'>{item.label}</p>
                <item.icon className='size-4 text-teal-600' />
              </div>
              <p className='text-2xl font-bold text-slate-900 mt-2'>{item.value.length}</p>
            </div>
          ))}
        </div>

        <div className='section-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3'>
          <div className='inline-flex items-center gap-2 text-slate-600 text-sm'>
            <SearchCheck className='size-4 text-teal-600' />
            <span>Select a group to manage your network faster.</span>
          </div>

          <div className='inline-flex flex-wrap items-center subtle-border rounded-xl p-1 bg-white/90 shadow-sm'>
            {dataArray.map((tab) => (
              <button 
                onClick={()=>setCurrentTab(tab.label)} 
                key={tab.label} 
                className={`cursor-pointer flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors capitalize ${currentTab === tab.label ? "bg-teal-50 font-semibold text-teal-700" : "text-slate-500 hover:text-slate-900"}`}
              >
                <tab.icon className='size-4'/>
                <span className='ml-1'>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
          {activeUsers.length > 0 ? activeUsers.map((user)=>(
            <div key={user._id} className='section-card p-5 flex items-start gap-4 transition hover:shadow-lg'>
              {user.profile_picture ? (
                <img src={user.profile_picture} alt='' className='aspect-square object-cover rounded-full size-13 shadow-sm'></img>
              ) : (
                <div className='aspect-square rounded-full size-13 bg-slate-200 flex items-center justify-center shadow-sm'>
                  <span className='text-slate-500 text-sm font-medium'>{user.full_name?.charAt(0) || 'U'}</span>
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-slate-800 truncate'>{user.full_name}</p>
                <p className='text-slate-500 text-sm truncate'>@{user.username}</p>
                <p className='text-sm text-slate-600 mt-2 line-clamp-2'>{user.bio ? user.bio : 'No bio available'}</p> 
                <div className='flex flex-wrap gap-2 mt-4'> 
                  <button 
                    onClick={()=>navigate(`/profile/${user._id}`)} 
                    className='flex-1 min-w-30 p-2.5 text-sm rounded-xl btn-primary active:scale-95 transition cursor-pointer'
                  >
                    View Profile
                  </button>
                  
                  {currentTab === 'following' && ( 
                    <button  
                      onClick={()=>handleUnfollow(user._id)} 
                      className='flex-1 min-w-26 p-2.5 text-sm rounded-xl btn-secondary active:scale-95 transition cursor-pointer'
                    >
                      Unfollow
                    </button>
                  )}
                  
                  {currentTab === 'pending' && ( 
                    <button  
                      onClick={()=>acceptConnection(user._id)} 
                      className='flex-1 min-w-26 p-2.5 text-sm rounded-xl btn-secondary active:scale-95 transition cursor-pointer'
                    >
                      Accept
                    </button>
                  )}
                  
                  {currentTab === 'connections' && ( 
                    <button 
                      onClick={()=>navigate(`/messages/${user._id}`)} 
                      className='flex-1 min-w-26 p-2.5 text-sm rounded-xl btn-secondary active:scale-95 transition cursor-pointer flex items-center justify-center gap-1'
                    >
                      <MessageSquare className='size-4'/>
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className='section-card p-10 text-center xl:col-span-2 2xl:col-span-3'>
              <p className='text-slate-800 font-semibold mb-1 capitalize'>No {currentTab} found</p>
              <p className='text-slate-500 text-sm'>This section will populate as your network activity grows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Connections