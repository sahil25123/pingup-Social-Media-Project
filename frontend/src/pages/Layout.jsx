import Sidebar from '../components/Sidebar';
import React , {useState} from 'react'
import { Outlet } from 'react-router-dom'
import {X  , Menu} from "lucide-react"
import Loading from '../components/Loading';
import Feed from './Feed';
import { useSelector } from 'react-redux';


function Layout() {


    const [sidebarOpen , setSidebarOpen] = useState(false);
    const user  = useSelector((state)=>state.user.value);
    // console.log("Redux user state:", user)


  return  user ? (
    <div className='w-full flex h-screen bg-[#f6f8fc]'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <div className='flex-1 bg-transparent'>
            <Outlet/>
        </div>
      { sidebarOpen ? 
        <X className='absolute top-4 right-4 p-2 z-100 bg-white/90 rounded-xl shadow-lg w-10 h-10 text-slate-700 sm:hidden subtle-border' onClick={()=>setSidebarOpen(false)}/> 
        : 
        <Menu className='absolute top-4 right-4 p-2 z-100 bg-white/90 rounded-xl shadow-lg w-10 h-10 text-slate-700 sm:hidden subtle-border' onClick={()=>setSidebarOpen(true)}/>
      }
    </div>

      
  ) : (
    <Loading/>
  )
}

export default Layout
