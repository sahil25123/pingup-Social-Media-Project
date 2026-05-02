import React from 'react'

const Loading = ({ height = '100vh'}) => {
  return (
    <div style={{height}} className='flex items-center justify-center h-screen'>
        <div className='relative w-10 h-10'>
          <div className='absolute inset-0 rounded-full border-3 border-teal-200'></div>
          <div className='absolute inset-0 rounded-full border-3 border-teal-600 border-t-transparent animate-spin'></div>
        </div>
    </div>
  )
}

export default Loading
