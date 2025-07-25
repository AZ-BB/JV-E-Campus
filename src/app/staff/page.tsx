'use client';
import { useState } from 'react';
import Logout from "@/components/logout";
import Image from 'next/image';

export default function Staff() {
  const [activeNav, setActiveNav] = useState('TRAINING');

  const trainingModules = [
    {
      id: 'juicer',
      title: 'JUICER',
      description: 'Learn the fundamentals of juice preparation and equipment operation',
      icon: 'ri-drop-line',
      progress: 0,
      color: '#22c55e',
      colorLight: '#86efac'
    },
    {
      id: 'shift-manager',
      title: 'SHIFT MANAGER',
      description: 'Master shift coordination, team management, and operational oversight',
      icon: 'ri-team-line',
      progress: 0,
      color: '#8b5cf6',
      colorLight: '#c4b5fd'
    },
    {
      id: 'bar-manager',
      title: 'BAR MANAGER',
      description: 'Develop skills in bar operations, inventory management, and staff training',
      icon: 'ri-bar-chart-line',
      progress: 0,
      color: '#f59e0b',
      colorLight: '#fbbf24'
    },
    {
      id: 'regional-manager',
      title: 'REGIONAL MANAGER',
      description: 'Advanced leadership training for multi-location management and strategy',
      icon: 'ri-building-line',
      progress: 0,
      color: '#ec4899',
      colorLight: '#f472b6'
    },
    {
      id: 'hygiene',
      title: 'HYGIENE',
      description: 'Essential food safety protocols and cleanliness standards',
      icon: 'ri-shield-check-line',
      progress: 0,
      color: '#06b6d4',
      colorLight: '#67e8f9'
    },
    {
      id: 'kitchen-staff',
      title: 'KITCHEN STAFF',
      description: 'Comprehensive kitchen operations, food prep, and safety procedures',
      icon: 'ri-restaurant-line',
      progress: 0,
      color: '#f97316',
      colorLight: '#fb923c'
    }
  ];

  const navItems = [
    { id: 'HOME', icon: 'ri-home-line' },
    { id: 'TRAINING', icon: 'ri-book-open-line' },
    { id: 'PRODUCTS', icon: 'ri-store-2-line' },
    { id: 'RESOURCES', icon: 'ri-file-list-3-line' },
    { id: 'GUIDE', icon: 'ri-user-settings-line' },
    { id: 'HELP', icon: 'ri-error-warning-line' }
  ];

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
  };

  const handleTrainingCardClick = (moduleId: string) => {
    console.log('Navigating to training module:', moduleId);
    // Add your navigation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Remix Icon CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" 
      />
      
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 shadow-lg border-b border-green-600/20 px-12 py-3 backdrop-blur-sm" 
           style={{ 
             background: 'linear-gradient(135deg, #01A252 0%, #029951 100%)',
             boxShadow: '0 10px 40px rgba(1, 162, 82, 0.15)'
           }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-12 w-28 rounded-xl flex items-center justify-center ">
              <Image src="/logo.jpg" alt="logo" width={180} height={180} className="rounded-lg" />
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex flex-col items-center text-white/90 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl relative overflow-hidden ${
                  activeNav === item.id ? 'active' : ''
                }`}
                style={{
                  ...(activeNav === item.id && {
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                  })
                }}
              >
                <i className={`${item.icon} text-xl mb-1 transform group-hover:scale-110 transition-transform duration-300`}></i>
                <span className="text-xs font-medium uppercase tracking-wide">
                  {item.id}
                </span>
                {activeNav === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Search Button and Logout */}
          <div className="flex items-center space-x-3">
            <button className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <i className="ri-search-line text-lg"></i>
            </button>
            <Logout />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="bg-transparent pt-20">
        {/* Header Section */}
        <div className="relative px-12 py-10 overflow-hidden">
          <div className="absolute inset-0">
            {/* Food Background Image */}
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/header.jpg')",
              }}
            ></div>
            {/* Green overlay to maintain brand consistency */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
          <div className="max-w-5xl relative z-10">
            <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <i className="ri-graduation-cap-line text-white/90 mr-2 text-sm"></i>
              <span className="text-white/90 text-xs font-medium">Learning Center</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight" 
                style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
              TRAINING
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-2xl font-light">
              All training modules and knowledge required to step into a new position. 
              Develop your skills and advance your career with our comprehensive learning paths.
            </p>
          </div>
        </div>

        {/* Training Cards Section */}
        <div className="px-12 py-16 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-50"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Learning Path</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Select a training module to begin your journey. Each module is designed to build expertise 
                and prepare you for your next career milestone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingModules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => handleTrainingCardClick(module.id)}
                  className="group relative training-card p-8 border-0 cursor-pointer rounded-2xl transition-all duration-500 hover:transform hover:-translate-y-4 bg-white"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    '--card-color': module.color,
                    '--card-color-light': module.colorLight
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
                       style={{ background: `linear-gradient(135deg, ${module.color}, ${module.colorLight})` }}></div>
                  
                  <div className="relative text-center">
                    {/* Card Icon */}
                    <div className="relative mb-8">
                      <div
                        className="flex items-center justify-center w-24 h-24 mx-auto text-3xl rounded-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${module.color}, ${module.colorLight})`,
                          color: 'white',
                          boxShadow: `0 8px 25px ${module.color}40`
                        }}
                      >
                        <i className={module.icon}></i>
                      </div>
                      {/* Glowing effect */}
                      <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                           style={{ 
                             background: `linear-gradient(135deg, ${module.color}, ${module.colorLight})`,
                             filter: 'blur(10px)',
                             transform: 'scale(1.2)'
                           }}></div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xl mb-4 group-hover:text-gray-900 transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-base mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {module.description}
                    </p>
                    
                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span className="text-gray-500">Progress</span>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-bold"
                          style={{ 
                            backgroundColor: `${module.color}15`,
                            color: module.color
                          }}
                        >
                          {module.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out relative"
                          style={{
                            width: `${module.progress}%`,
                            background: `linear-gradient(90deg, ${module.color}, ${module.colorLight})`
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
                        background: `linear-gradient(135deg, ${module.color}, ${module.colorLight})`,
                        boxShadow: `0 4px 15px ${module.color}25`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 8px 25px ${module.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 4px 15px ${module.color}25`;
                      }}
                    >
                      Start Training
                      <i className="ri-arrow-right-line ml-2"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  