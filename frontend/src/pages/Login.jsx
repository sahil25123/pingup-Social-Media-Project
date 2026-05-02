import React from 'react'
import { assets } from '../assets/assets.js'
import { ArrowRight, Globe2, ShieldCheck, Sparkles, Users2, Workflow } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

function Login() {
  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-16 left-8 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob'></div>
        <div className='absolute top-28 right-8 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-blob animation-delay-2000'></div>
        <div className='absolute bottom-8 left-[35%] w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative min-h-screen max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 items-center px-6 py-10 md:px-10'>
        <div className='z-10 space-y-8 lg:col-span-3'>
          <div className='inline-flex items-center gap-3 bg-white/80 border border-teal-100 rounded-2xl px-3 py-2 shadow-sm'>
            <div className='w-11 h-11 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <img src={assets.logo} className='h-8 object-contain' alt="PingUp" />
          </div>

          <div className='space-y-5'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-teal-100 text-teal-700'>
              <Globe2 className='w-4 h-4' />
              <span className='text-sm font-semibold'>Network Without Limits</span>
            </div>

            <h1 className='text-4xl md:text-6xl font-bold leading-tight text-slate-900 max-w-2xl'>
              Build your daily
              <span className='block bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent'>
                collaboration network
              </span>
            </h1>

            <p className='text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed'>
              One place to discover people, share ideas, and keep real-time conversations moving.
            </p>
          </div>

          <div className='grid sm:grid-cols-3 gap-4'>
            <div className='bg-white/85 backdrop-blur-sm border border-teal-100 rounded-2xl p-4 shadow-sm'>
              <div className='flex items-center gap-3 mb-2 text-teal-700'>
                <Users2 className='w-5 h-5' />
                <span className='font-semibold'>Growing Community</span>
              </div>
              <p className='text-slate-600 text-sm'>Connect with creators, developers, and teams worldwide.</p>
            </div>
            <div className='bg-white/85 backdrop-blur-sm border border-cyan-100 rounded-2xl p-4 shadow-sm'>
              <div className='flex items-center gap-3 mb-2 text-cyan-700'>
                <ShieldCheck className='w-5 h-5' />
                <span className='font-semibold'>Safe & Reliable</span>
              </div>
              <p className='text-slate-600 text-sm'>Secure sign in and a smooth experience across every device.</p>
            </div>
            <div className='bg-white/85 backdrop-blur-sm border border-emerald-100 rounded-2xl p-4 shadow-sm'>
              <div className='flex items-center gap-3 mb-2 text-emerald-700'>
                <Workflow className='w-5 h-5' />
                <span className='font-semibold'>Fast Workflow</span>
              </div>
              <p className='text-slate-600 text-sm'>Move from feed to messages and profile without friction.</p>
            </div>
          </div>

          <div className='inline-flex items-center gap-2 text-teal-700 font-semibold'>
            <span>Sign in to continue</span>
            <ArrowRight className='w-4 h-4' />
          </div>
        </div>

        <div className='z-10 flex justify-center lg:justify-end lg:col-span-2'>
          <div className='w-full max-w-md'>
            <div className='mb-3 px-1'>
              <p className='text-sm uppercase tracking-[0.22em] text-teal-700/85 font-semibold'>Account Access</p>
            </div>
            <div className='w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8'>
              <div className='mb-5'>
              <h2 className='text-2xl font-bold text-slate-900 mb-1'>Welcome back</h2>
              <p className='text-slate-600'>Sign in and pick up where you left off.</p>
              </div>
              <div className='flex justify-center'>
                <SignIn />
              </div>
            </div>
            <div className='mt-4 rounded-2xl border border-teal-100 bg-white/70 p-3 text-xs text-slate-600'>
              By continuing, you agree to a secure and privacy-first sign-in experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login