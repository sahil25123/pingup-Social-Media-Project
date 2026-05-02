import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate, Link } from 'react-router-dom'
import { useClerk, UserButton } from "@clerk/clerk-react"
import MenuItems from './MenuItems'
import { CirclePlus, Compass, LogOut, Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const { signOut } = useClerk();
  const user = useSelector((state) => state.user.value);

  return (
    <aside className={`w-64 xl:w-76 bg-gradient-to-b from-white via-teal-50/35 to-cyan-50/35 border-r border-teal-100/70 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out shadow-2xl`}>
      
      <div className='w-full'>
        <div className='px-6 py-6'>
          <div 
            onClick={() => {
              setSidebarOpen(false);
              navigate('/');
            }} 
            className='flex items-center gap-3 cursor-pointer group rounded-2xl p-2 hover:bg-white/70 transition'
          >
            <div className='w-11 h-11 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105'>
              <Sparkles className='w-5 h-5 text-white' />
            </div>
            <div>
              <img src={assets.logo} alt="" className='h-7 object-contain' />
              <p className='text-[11px] text-slate-500 -mt-0.5'>Your social workspace</p>
            </div>
          </div>
        </div>

        <div className='h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-6'></div>

        {/* Menu Items */}
        <MenuItems setSidebarOpen={setSidebarOpen} />

        <div className='px-6 mt-6'>
          <Link 
            to={'/create-post'} 
            onClick={() => setSidebarOpen(false)} 
            className='flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 active:scale-95 transition-all duration-300 text-white cursor-pointer shadow-lg hover:shadow-xl group font-semibold'
          >
            <CirclePlus className='w-5 h-5 group-hover:rotate-90 transition-transform duration-300' />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      <div className='w-full'>
        <div className='h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent mb-4'></div>
        
        <div className='px-6 pb-6'>
          <div className='bg-white/75 backdrop-blur-sm rounded-3xl p-4 border border-teal-100/80 shadow-md'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex gap-3 items-center flex-1'>
                <div className='relative'>
                  <UserButton />
                  <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                </div>
                <div className='flex-1 min-w-0'>
                  <h1 className='text-base font-semibold text-slate-900 truncate'>
                    {user?.full_name || 'User'}
                  </h1>
                  <p className='text-sm text-slate-500 truncate'>
                    @{user?.username || 'username'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={signOut}
              className='w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all duration-200 group'
            >
              <LogOut className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
              <span className='text-sm font-medium'>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar