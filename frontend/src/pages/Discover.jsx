import React, { useEffect, useState } from 'react'

import { Search, Sparkles, Users2 } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchUser } from '../features/user/userSlice';
import api from '../api/axios';

function Discover() {

   const dispatch = useDispatch();
  const [input , setInput] = useState("");
  const [users, setUsers ] =useState([])
  const [loading , setLoading] = useState(false)
  const { getToken } = useAuth();
 

   const handleSearch = async (e) => {
    if(e.key === 'Enter'){
      try {
        setUsers([]);
        setLoading(true);
        const token = await getToken();
        const { data } = await api.post('/api/user/discover', {input}, {
          headers: {Authorization: `Bearer ${token}`}
        });
        data.success ? setUsers(data.users) : toast.error(data.message);
        setLoading(false);
        setInput('');
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    }
  }
  useEffect(()=>{
    getToken().then((token)=>{
      dispatch(fetchUser(token));
    });
  },[])


  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto page-shell space-y-6'>
        <div>
          <h1 className='app-title mb-2'>Discover People</h1>
          <p className='app-subtitle'>Connect with amazing people and grow your network</p>
        </div>

        <div className='section-card glass-surface p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-3 justify-between'>
          <div className='inline-flex items-center gap-2 text-slate-700'>
            <Users2 className='w-5 h-5 text-teal-600' />
            <span className='font-semibold'>People Explorer</span>
          </div>
          <div className='inline-flex items-center gap-2 text-slate-500 text-sm'>
            <Sparkles className='w-4 h-4 text-cyan-600' />
            <span>Press Enter to run search</span>
          </div>
        </div>

        <div className='section-card glass-surface'>
          <div className='p-5 sm:p-6'>
            <div className='relative'>
              <Search className=' absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-5'/>
              <input type="text" onChange={(e)=>setInput(e.target.value)} value={input} onKeyUp={handleSearch} className='input-shell pl-10 sm:pl-12 max-sm:text-sm h-12' placeholder='Search people by name, username, bio or location...' />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
          {users.map((user) => (
            <UserCard key={user._id} user={user}/>
          ))}
        </div>

        {!loading && users.length === 0 && (
          <div className='section-card p-10 text-center'>
            <p className='text-slate-800 font-semibold mb-1'>Search to discover new people</p>
            <p className='text-slate-500 text-sm'>Try name, username, bio, or location to find relevant profiles.</p>
          </div>
        )}

        {
          loading && (<Loading height='60vh'/>)
        }
      </div>
    </div>
  )
}

export default Discover
