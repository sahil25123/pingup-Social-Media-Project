import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className='px-5 text-slate-600 space-y-2 font-medium'>
        {
            menuItemsData.map(({to, label, Icon}) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={()=>setSidebarOpen(false)}
                className={({isActive}) => `group relative px-3.5 py-3 flex items-center gap-3 rounded-2xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm border border-teal-100/80' : 'hover:bg-white/70 hover:shadow-sm border border-transparent text-slate-700'}`}
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex items-center justify-center size-9 rounded-xl transition ${isActive ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                      <Icon className='size-5'/>
                    </span>
                    <div className='flex-1'>
                      <span className='text-[1.04rem] tracking-wide block'>{label}</span>
                    </div>
                  </>
                )}
              </NavLink>
            ))
        }
    </div>
  )
}

export default MenuItems