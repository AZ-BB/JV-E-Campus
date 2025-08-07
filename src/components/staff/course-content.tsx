'use client'
import { useState } from "react"
import { 
    ChevronDown, 
    PlayCircle, 
    FileText, 
    Award
} from "lucide-react"
import { lessons } from "@/db/schema/schema"
import Logout from "@/components/logout"
import Image from 'next/image'
import Link from "next/link"

interface SectionData {
    id: number
    name: string
    description?: string | null
    lessons: (typeof lessons.$inferSelect)[]
}

interface ModuleData {
    id: number
    name: string
    description?: string | null
    slogan?: string | null
    iconUrl?: string | null
}

interface CourseContentProps {
    module: ModuleData | null
    sections: SectionData[]
}

function formatDuration(minutes: number | null): string {
    if (!minutes) return ""
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hrs > 0) {
        return `${hrs}h ${mins}m`
    }
    return `${mins}min`
}

function getLessonIcon(type: string) {
    switch (type) {
        case 'VIDEO':
            return <PlayCircle className="w-5 h-5 text-blue-500" />
        case 'TEXT':
            return <FileText className="w-5 h-5 text-purple-500" />
        case 'QUIZ':
            return <Award className="w-5 h-5 text-yellow-500" />
        default:
            return <FileText className="w-5 h-5 text-gray-500" />
    }
}

function CourseSection({ section, isExpanded, onToggle, moduleId }: {
    section: SectionData
    isExpanded: boolean
    onToggle: () => void
    moduleId: string
}) {
    const totalDuration = section.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0)
    
    return (
        <div className="course-section border border-gray-200 mb-0.5 bg-white overflow-hidden first:rounded-t-lg last:rounded-b-lg">
            <div 
                className="section-header p-6 cursor-pointer flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                onClick={onToggle}
            >
                <div>
                    <div className="section-title font-semibold text-base text-gray-800">
                        {section.name}
                    </div>
                </div>
                <div className="flex items-center">
                    <span className="section-meta text-sm text-gray-600 font-medium mr-4">
                        {section.lessons.length} lectures • {formatDuration(totalDuration)}
                    </span>
                    <ChevronDown 
                        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                        }`}
                    />
                </div>
            </div>
            
            {isExpanded && (
                <div className="section-content bg-gray-50">
                    {section.lessons.map((lesson) => (
                        <Link 
                            href={`/modules/${moduleId}/lessons/${lesson.id}`}
                            key={lesson.id}
                            className="lesson-item flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:translate-x-1 transition-all duration-200 cursor-pointer"
                        >
                            <div className="lesson-icon mr-4 transition-transform duration-200 hover:scale-110">
                                {getLessonIcon(lesson.type || 'TEXT')}
                            </div>
                            <span className="lesson-title flex-1 text-sm text-gray-700 font-medium">
                                {lesson.name}
                            </span>
                            {lesson.videoUrl && (
                                <a 
                                    href="#" 
                                    className="lesson-preview text-purple-600 text-sm mr-4 font-semibold px-2 py-1 rounded hover:bg-purple-600 hover:text-white transition-all duration-200"
                                >
                                    Preview
                                </a>
                            )}
                            <span className="lesson-duration text-sm text-gray-600 min-w-16 text-right font-medium">
                                {formatDuration(lesson.duration)}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CourseContent({ module, sections }: CourseContentProps) {
    const [expandedSections, setExpandedSections] = useState<Set<number>>(
        new Set([sections[0]?.id].filter(Boolean))
    )
    const [activeNav, setActiveNav] = useState('TRAINING')

    const toggleSection = (sectionId: number) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev)
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId)
            } else {
                newSet.add(sectionId)
            }
            return newSet
        })
    }

    const expandAllSections = () => {
        setExpandedSections(new Set(sections.map(s => s.id)))
    }

    const navItems = [
        { id: 'HOME', icon: 'ri-home-line' },
        { id: 'TRAINING', icon: 'ri-book-open-line' },
        { id: 'PRODUCTS', icon: 'ri-store-2-line' },
        { id: 'RESOURCES', icon: 'ri-file-list-3-line' },
        { id: 'GUIDE', icon: 'ri-user-settings-line' },
        { id: 'HELP', icon: 'ri-error-warning-line' }
    ]

    const handleNavClick = (navId: string) => {
        setActiveNav(navId)
    }

    const totalLectures = sections.reduce((acc, section) => acc + section.lessons.length, 0)
    const totalDuration = sections.reduce((acc, section) => 
        acc + section.lessons.reduce((sectionAcc, lesson) => sectionAcc + (lesson.duration || 0), 0), 0
    )

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
                <div className="relative px-12 py-8 overflow-hidden">
                    <div className="absolute inset-0">
                        <div 
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: "url('/header.jpg')",
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-black/70"></div>
                    </div>
                    <div className="max-w-5xl relative z-10">
                        <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                            <i className="ri-graduation-cap-line text-white/90 mr-2 text-sm"></i>
                            <span className="text-white/90 text-xs font-medium">Learning Center</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight" 
                            style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
                            {module?.name?.toUpperCase() || 'TRAINING COURSE'}
                        </h1>
                        <p className="text-white/90 text-lg leading-relaxed max-w-2xl font-light">
                            {module?.description || 'Complete training curriculum covering all aspects of your role and responsibilities.'}
                        </p>
                    </div>
                </div>

                {/* Course Structure Section */}
                <div className="px-12 py-10">
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-gray-600">
                                    {sections.length} sections • {totalLectures} lectures • {formatDuration(totalDuration)} total length
                                </span>
                            </div>
                            <button 
                                onClick={expandAllSections}
                                className="text-purple-600 font-medium hover:underline"
                            >
                                Expand all sections
                            </button>
                        </div>
                    </div>

                    <div className="course-sections">
                        {sections.map((section) => (
                            <CourseSection
                                key={section.id}
                                section={section}
                                isExpanded={expandedSections.has(section.id)}
                                onToggle={() => toggleSection(section.id)}
                                moduleId={module?.id.toString() || ''}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}