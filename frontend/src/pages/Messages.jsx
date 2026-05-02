import React from 'react'
import { Eye, MessageSquare, Search, Users2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function Messages() {
  const navigate = useNavigate();
  const {connections} = useSelector((state)=>state.connections)

  // console.log("Full Redux state:", useSelector(state => state));
  // console.log("Connections state:", useSelector(state => state.connections));
  // console.log("Connections array:", connections);



  return (
    <div className='min-h-screen relative'>
      <div className='max-w-6xl mx-auto page-shell space-y-6'>

         <div>
          <h1 className='app-title mb-2'>Messages</h1>
          <p className='app-subtitle'>Talk to your friends and family</p>         
        </div>

        <div className='section-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>
          <div className='inline-flex items-center gap-2 text-slate-700'>
            <Users2 className='w-5 h-5 text-teal-600' />
            <span className='font-semibold'>Connected people</span>
            <span className='text-slate-500 text-sm'>({connections?.length || 0})</span>
          </div>
          <div className='inline-flex items-center gap-2 rounded-xl bg-white subtle-border px-3 py-2 text-slate-500 text-sm'>
            <Search className='w-4 h-4' />
            <span>Open a chat or view profile</span>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {connections && connections.length > 0 ? connections.map((user)=>(
            <div key={user._id} className='section-card p-5 flex items-start gap-4 transition hover:shadow-lg'>
              <div className='relative'>
                {user.profile_picture ? (
                  <img className='aspect-square object-cover rounded-full size-13 shadow-sm' alt="" src={user.profile_picture}/>
                ) : (
                  <div className='aspect-square rounded-full size-13 bg-slate-200 flex items-center justify-center shadow-sm'>
                    <span className='text-slate-500 text-sm font-medium'>{user.full_name?.charAt(0) || 'U'}</span>
                  </div>
                )}
                <span className='absolute bottom-0.5 right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-white'></span>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-slate-800 truncate'>{user.full_name}</p>
                <p className='text-slate-500 text-sm truncate'>@{user.username}</p>
                <p className='text-xs text-slate-500 mt-3'>Start a conversation or check profile details.</p>
                <div className='flex items-center gap-2 mt-4'>
                  <button onClick={()=> navigate(`/messages/${user._id}`)} className='flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl btn-primary cursor-pointer'>
                    <MessageSquare className='w-4 h-4'/>
                    <span className='text-sm font-medium'>Message</span>
                  </button>
                  <button onClick={()=> navigate(`/profile/${user._id}`)} className='inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl btn-secondary cursor-pointer'>
                    <Eye className='w-4 h-4'/>
                    <span className='text-sm font-medium'>Profile</span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className='section-card p-10 text-center md:col-span-2'>
              <p className='text-slate-700 font-semibold mb-1'>No connections yet</p>
              <p className='text-slate-500 text-sm'>Once you connect with people, they will appear here for quick messaging.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  )
}

export default Messages
