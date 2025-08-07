"use client"

import { Role } from "@/actions/roles"
import Link from "next/link"
import React from "react"

interface Module {
  id: number
  name: string
  description: string | null
  slogan: string | null
}

interface CareerPageContentProps {
  modulesData: Module[]
  role: Role
}

// Color schemes for different modules (cycling through them)
const moduleColorSchemes = [
  { primary: "#ea580c", light: "#fb923c", bg: "bg-orange-100", text: "text-orange-600", icon: "ri-cake-2-line" },
  { primary: "#dc2626", light: "#f87171", bg: "bg-pink-100", text: "text-pink-600", icon: "ri-drop-line" },
  { primary: "#d97706", light: "#fbbf24", bg: "bg-yellow-100", text: "text-yellow-600", icon: "ri-cup-line" },
  { primary: "#6b7280", light: "#9ca3af", bg: "bg-gray-100", text: "text-gray-600", icon: "ri-cash-line" },
  { primary: "#059669", light: "#34d399", bg: "bg-green-100", text: "text-green-600", icon: "ri-user-star-line" },
  { primary: "#2563eb", light: "#60a5fa", bg: "bg-blue-100", text: "text-blue-600", icon: "ri-door-open-line" },
  { primary: "#7c3aed", light: "#a78bfa", bg: "bg-purple-100", text: "text-purple-600", icon: "ri-door-close-line" },
]

export default function CareerPageContent({ modulesData, role }: CareerPageContentProps) {
  return (
    <>
      <style jsx>{`
        .nav-text {
          font-size: 12px;
          line-height: 1.2;
          text-align: center;
          display: block;
          margin-left: 0.5rem;
        }
        .nav-item {
          position: relative;
        }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: white;
        }
        .progress-circle {
          position: relative;
          width: 60px;
          height: 60px;
        }
        .progress-circle svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .progress-circle .background {
          fill: none;
          stroke: #e5e7eb;
          stroke-width: 4;
        }
        .progress-circle .progress {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 125.66;
          stroke-dashoffset: 125.66;
          transition: stroke-dashoffset 0.5s ease;
        }
        .progress-circle .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
        }
        .progress-orange .progress { stroke: #ea580c; }
        .progress-pink .progress { stroke: #dc2626; }
        .progress-yellow .progress { stroke: #d97706; }
        .progress-gray .progress { stroke: #6b7280; }
        .progress-green .progress { stroke: #059669; }
        .progress-blue .progress { stroke: #2563eb; }
        .progress-purple .progress { stroke: #7c3aed; }
        .training-card {
          transition: all 0.3s ease-in-out;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          cursor: pointer;
        }
        .training-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
          transform: scaleX(0);
          transition: transform 0.3s ease;
          border-radius: 12px 12px 0 0;
        }
        .training-card:hover::before {
          transform: scaleX(1);
        }
        .training-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-color);
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
        }
        .training-card .icon-container {
          transition: all 0.3s ease;
        }
        .training-card:hover .icon-container {
          transform: scale(1.05);
        }
      `}</style>

      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="px-12 py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{role?.fullName} Training Path</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your journey at Jon & Vinny's as a {role?.fullName} starts here!
          </p>
          <p className="text-gray-600 leading-relaxed mb-12">
            Throughout this training, you will acquire knowledge and skills in {role?.fullName}, hygiene procedures, creating great guest experiences, and much more.
          </p>

          {/* Introduction Section */}
          <div className="mb-12">
            <div className="training-card flex items-center p-6 border border-gray-200" style={{"--card-color": "#2563eb", "--card-color-light": "#60a5fa"} as React.CSSProperties}>
              <div className="flex-shrink-0 w-16 h-16 mr-6">
                <div className="icon-container w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-information-line text-2xl text-blue-600"></i>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide mb-1">INTRODUCTION</p>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Training Introduction</h3>
                <p className="text-gray-600">Our training material, platforms and journey explained.</p>
              </div>
              <div className="flex-shrink-0 ml-6">
                <div className="progress-circle progress-blue">
                  <svg viewBox="0 0 50 50">
                    <circle className="background" cx="25" cy="25" r="20"></circle>
                    <circle className="progress" cx="25" cy="25" r="20" style={{strokeDashoffset: "31.41"}}></circle>
                  </svg>
                  <div className="progress-text">75%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Training Modules Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Training Modules</h2>
            
            <div className="space-y-6">
              {modulesData.map((module, index) => {
                const colorScheme = moduleColorSchemes[index % moduleColorSchemes.length]
                const progressPercentage = 0
                const strokeDashoffset = 125.66 - (125.66 * progressPercentage) / 100
                const progressColorClass = `progress-${colorScheme.primary === "#ea580c" ? "orange" : 
                  colorScheme.primary === "#dc2626" ? "pink" :
                  colorScheme.primary === "#d97706" ? "yellow" :
                  colorScheme.primary === "#6b7280" ? "gray" :
                  colorScheme.primary === "#059669" ? "green" :
                  colorScheme.primary === "#2563eb" ? "blue" : "purple"}`

                return (
                  <Link 
                    key={module.id} 
                    href={`/modules/${module.id}`}
                    className="training-card flex items-center p-6 border border-gray-200" 
                    style={{"--card-color": colorScheme.primary, "--card-color-light": colorScheme.light} as React.CSSProperties}
                  >
                    <div className="flex-shrink-0 w-16 h-16 mr-6">
                      <div className={`icon-container w-16 h-16 ${colorScheme.bg} rounded-lg flex items-center justify-center`}>
                        <i className={`${colorScheme.icon} text-2xl ${colorScheme.text}`}></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide mb-1">TRAINING MODULE</p>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{module.name}</h3>
                      <p className="text-gray-600">{module.description || module.slogan || "Essential training for your role."}</p>
                    </div>
                    <div className="flex-shrink-0 ml-6">
                      <div className={`progress-circle ${progressColorClass}`}>
                        <svg viewBox="0 0 50 50">
                          <circle className="background" cx="25" cy="25" r="20"></circle>
                          <circle className="progress" cx="25" cy="25" r="20" style={{strokeDashoffset: strokeDashoffset.toString()}}></circle>
                        </svg>
                        <div className="progress-text">{progressPercentage}%</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Remix Icon CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css"
      />
    </>
  )
}