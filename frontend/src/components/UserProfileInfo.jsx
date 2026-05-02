import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'
import React from 'react'
import moment from "moment";

function UserProfileInfo({user, posts, profileId, setShowEdit}) {
  return (
    <div className='relative py-3 px-6 md:px-8 bg-white/70 backdrop-blur-sm'>
      <div className='flex flex-col md:flex-row items-start gap-6'>
        {/* Profile Picture - Fixed positioning and sizing */}
        <div className='w-32 h-32 border-4 border-white shadow-lg -mt-16 rounded-full bg-white relative flex-shrink-0'>
          {user.profile_picture ? (
            <img 
              src={user.profile_picture} 
              className='w-full h-full object-cover rounded-full' 
              alt={user.full_name} 
            />
          ) : (
            <div className='w-full h-full rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center'>
              <span className='text-white text-4xl font-bold'>
                {user.full_name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className='w-full pt-4 md:pt-0'>
          <div className='flex flex-col md:flex-row items-start justify-between gap-4'>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                {user.is_verified && <Verified className='w-6 h-6 text-blue-500' />}
              </div>
              <p className='text-gray-600 mt-1'>
                {user.username ? `@${user.username}` : 'Add a username'}
              </p>
            </div>

            {/* Edit Button - Only show on own profile */}
            {!profileId && (
              <button 
                onClick={() => {
                  setShowEdit(true);
                  //console.log("Edit button clicked");
                }} 
                className='flex items-center gap-2 btn-secondary px-4 py-2 rounded-xl font-medium transition-colors'
              >
                <PenBox className='w-4 h-4' />
                Edit Profile
              </button>
            )}
          </div>

          {/* Bio */}
          <p className='text-gray-700 text-sm max-w-3xl mt-4 leading-relaxed'>
            {user.bio || 'No bio yet'}
          </p>

          {/* Location and Join Date */}
          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4'>
            <span className='flex items-center gap-1.5'>
              <MapPin className='w-4 h-4' />
              {user.location || 'Add location'}
            </span>
            <span className='flex items-center gap-1.5'>
              <Calendar className='w-4 h-4' />
              Joined <span className='font-medium'>{moment(user.createdAt).fromNow()}</span>
            </span>
          </div>

          {/* Stats */}
          <div className='flex flex-wrap items-center gap-6 mt-6 border-t border-slate-200 pt-4'>
            <div>
              <span className='text-xl font-bold text-gray-900'>{posts.length}</span>
              <span className='text-sm text-gray-500 ml-1.5'>Posts</span>
            </div>
            <div>
              <span className='text-xl font-bold text-gray-900'>
                {user.followers?.length || 0}
              </span>
              <span className='text-sm text-gray-500 ml-1.5'>Followers</span>
            </div>
            <div>
              <span className='text-xl font-bold text-gray-900'>
                {user.following?.length || 0}
              </span>
              <span className='text-sm text-gray-500 ml-1.5'>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileInfo