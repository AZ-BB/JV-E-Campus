'use client'

import React from 'react'
import Link from 'next/link'

interface TrainingCardProps {
  role: {
    id: string | number
    title: string
    description: string
    icon: string
    color: string
    colorLight: string
    progress: number
  }
}

export default function TrainingCard({ role }: TrainingCardProps) {
  return (
    <Link href={`/career/${role.id}`}>
      <div
        className="group relative training-card p-8 border-0 cursor-pointer rounded-2xl transition-all duration-500 hover:transform hover:-translate-y-4 bg-white"
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
        '--card-color': role.color,
        '--card-color-light': role.colorLight
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.background = 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.background = 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)';
      }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"
           style={{ background: `linear-gradient(135deg, ${role.color}, ${role.colorLight})` }}></div>
      
      <div className="relative text-center">
        {/* Card Icon */}
        <div className="relative mb-8">
          <div
            className="flex items-center justify-center w-24 h-24 mx-auto text-3xl rounded-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${role.color}, ${role.colorLight})`,
              color: 'white',
              boxShadow: `0 8px 25px ${role.color}40`
            }}
          >
            <i className={role.icon}></i>
          </div>
          {/* Glowing effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
               style={{ 
                 background: `linear-gradient(135deg, ${role.color}, ${role.colorLight})`,
                 filter: 'blur(10px)',
                 transform: 'scale(1.2)'
               }}></div>
        </div>
        
        <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xl mb-4 group-hover:text-gray-900 transition-colors duration-300">
          {role.title}
        </h3>
        <p className="text-gray-600 text-base mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {role.description}
        </p>
        
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-gray-500">Progress</span>
            <span 
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{ 
                backgroundColor: `${role.color}15`,
                color: role.color
              }}
            >
              {role.progress}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative"
              style={{
                width: `${role.progress}%`,
                background: `linear-gradient(90deg, ${role.color}, ${role.colorLight})`
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Start Training Button */}
        <button 
          className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
          style={{
            background: `linear-gradient(135deg, ${role.color}, ${role.colorLight})`,
            boxShadow: `0 4px 15px ${role.color}25`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 8px 25px ${role.color}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 15px ${role.color}25`;
          }}
        >
          Start Training
          <i className="ri-arrow-right-line ml-2"></i>
        </button>
      </div>
      </div>
    </Link>
  )
}