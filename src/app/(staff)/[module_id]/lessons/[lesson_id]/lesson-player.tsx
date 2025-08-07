'use client'
import { useState } from "react"
import { lessons } from "@/db/schema/schema"
import Logout from "@/components/logout"
import Image from 'next/image'
import { 
    PlayCircle, 
    FileText, 
    Award,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    Bookmark,
    Eye,
    Calendar,
    Clock,
    CheckCircle,
    Shield
} from "lucide-react"

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

interface LessonData {
    id: number
    name: string
    description?: string | null
    duration?: number | null
    type?: string | null
    videoUrl?: string | null
    documentUrl?: string | null
    text?: string | null
    sectionId?: number | null
}

interface LessonPlayerProps {
    lesson: LessonData | null
    module: ModuleData | null
    sections: SectionData[]
    moduleId: string
    lessonId: string
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

function getLessonIcon(type: string, completed: boolean = false) {
    if (completed) {
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    
    switch (type) {
        case 'VIDEO':
            return <PlayCircle className="w-5 h-5 text-blue-500" />
        case 'TEXT':
            return <FileText className="w-5 h-5 text-gray-500" />
        case 'QUIZ':
            return <Award className="w-5 h-5 text-yellow-500" />
        default:
            return <FileText className="w-5 h-5 text-gray-500" />
    }
}

function getSectionIcon(sectionName: string) {
    const name = sectionName.toLowerCase()
    if (name.includes('introduction')) {
        return <PlayCircle className="w-4 h-4 mr-2" />
    } else if (name.includes('safety') || name.includes('hygiene')) {
        return <Shield className="w-4 h-4 mr-2" />
    } else if (name.includes('equipment') || name.includes('training')) {
        return <PlayCircle className="w-4 h-4 mr-2" />
    } else if (name.includes('assessment') || name.includes('certification')) {
        return <Award className="w-4 h-4 mr-2" />
    }
    return <PlayCircle className="w-4 h-4 mr-2" />
}

function extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}

export default function LessonPlayer({ lesson, module, sections, moduleId, lessonId }: LessonPlayerProps) {
    const [activeNav, setActiveNav] = useState('TRAINING')
    const [currentLessonId, setCurrentLessonId] = useState(parseInt(lessonId))

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

    const handleLessonClick = (lessonId: number) => {
        setCurrentLessonId(lessonId)
        // Navigation will be handled by the href attribute
    }

    // Get all lessons in order for previous/next navigation
    const allLessons = sections.flatMap(section => section.lessons)
    const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId)
    const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
    const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null

    // Calculate total course stats
    const totalLectures = sections.reduce((acc, section) => acc + section.lessons.length, 0)
    const totalDuration = sections.reduce((acc, section) => 
        acc + section.lessons.reduce((sectionAcc, lesson) => sectionAcc + (lesson.duration || 0), 0), 0
    )

    // Mock completed lessons (you'd get this from your backend)
    const completedLessons = new Set([1, 2]) // Example completed lesson IDs

    // Extract YouTube video ID from lesson's videoUrl
    const youtubeVideoId = lesson?.videoUrl ? extractYouTubeId(lesson.videoUrl) : null

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
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
            <div className="pt-20 bg-white min-h-screen">
                <div className="flex">
                    {/* Course Sidebar */}
                    <div className="w-80 bg-gray-50 border-r border-gray-200" style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
                        {/* Course Header */}
                        <div className="p-4 bg-white border-b">
                            <h3 className="font-bold text-gray-800 mb-1">{module?.name || 'Training Course'}</h3>
                            <p className="text-sm text-gray-600">
                                {sections.length} sections • {totalLectures} lectures • {formatDuration(totalDuration)}
                            </p>
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>25%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Course Sections */}
                        <div>
                            {sections.map((section) => (
                                <div key={section.id}>
                                    {/* Section Header */}
                                    <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 font-semibold text-sm text-gray-700 flex items-center">
                                        {getSectionIcon(section.name)}
                                        {section.name}
                                    </div>
                                    
                                                                         {/* Section Lessons */}
                                     {section.lessons.map((sectionLesson) => {
                                         const isActive = sectionLesson.id === currentLessonId
                                         const isCompleted = completedLessons.has(sectionLesson.id)
                                         
                                         return (
                                             <a
                                                 key={sectionLesson.id}
                                                 href={`/${moduleId}/lessons/${sectionLesson.id}`}
                                                 onClick={() => handleLessonClick(sectionLesson.id)}
                                                 className={`flex items-center p-3 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
                                                     isActive 
                                                         ? isCompleted 
                                                             ? 'bg-green-50 border-l-4 border-green-500' 
                                                             : 'bg-blue-50 border-l-4 border-blue-500'
                                                         : isCompleted 
                                                             ? 'bg-green-50' 
                                                             : ''
                                                 }`}
                                             >
                                                 <div className="mr-3">
                                                     {getLessonIcon(sectionLesson.type || 'TEXT', isCompleted)}
                                                 </div>
                                                 <div className="flex-1">
                                                     <div className={`text-sm font-medium ${
                                                         isCompleted ? 'text-gray-600' : 'text-gray-800'
                                                     }`}>
                                                         {sectionLesson.name}
                                                     </div>
                                                 </div>
                                                 {sectionLesson.duration && (
                                                     <div className="text-xs text-gray-500">
                                                         {formatDuration(sectionLesson.duration)}
                                                     </div>
                                                 )}
                                             </a>
                                         )
                                     })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Player Section */}
                    <div className="flex-1 p-6">
                        {/* Breadcrumb */}
                        <div className="mb-4">
                            <nav className="flex items-center space-x-2 text-sm">
                                <a href={`/${moduleId}`} className="text-gray-600 hover:text-gray-800">
                                    {module?.name || 'Training'}
                                </a>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <a href="#" className="text-gray-600 hover:text-gray-800">
                                    {sections.find(s => s.lessons.some(l => l.id === currentLessonId))?.name || 'Section'}
                                </a>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-800 font-medium">{lesson?.name}</span>
                            </nav>
                        </div>

                                                 {/* Content Display based on lesson type */}
                         {lesson?.type === 'VIDEO' ? (
                             /* Video Player */
                             <div className="bg-black rounded-lg overflow-hidden mb-6 relative max-w-4xl" style={{ aspectRatio: '16/9', height: '400px' }}>
                                 {youtubeVideoId ? (
                                     <iframe
                                         className="w-full h-full"
                                         src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                                         title={lesson?.name || 'Training Video'}
                                         frameBorder="0"
                                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                         referrerPolicy="strict-origin-when-cross-origin"
                                         allowFullScreen
                                     ></iframe>
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center">
                                         <div className="text-center">
                                             <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                                                 <PlayCircle className="w-12 h-12 text-white" />
                                             </div>
                                             <p className="text-white text-lg">{lesson?.name}</p>
                                             <p className="text-gray-300 text-sm">No video available</p>
                                         </div>
                                     </div>
                                 )}
                             </div>
                         ) : lesson?.type === 'TEXT' ? (
                             /* Text Content */
                             <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 max-w-4xl">
                                 <div className="flex items-center mb-4">
                                     <FileText className="w-6 h-6 text-blue-500 mr-3" />
                                     <span className="text-sm font-medium text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                                         Text Lesson
                                     </span>
                                 </div>
                                 <div className="prose prose-lg max-w-none">
                                     {lesson?.text ? (
                                         <div 
                                             className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                             dangerouslySetInnerHTML={{ __html: lesson.text.replace(/\n/g, '<br />') }}
                                         />
                                     ) : (
                                         <div className="text-center py-12">
                                             <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                             <p className="text-gray-500 text-lg">No text content available</p>
                                             <p className="text-gray-400 text-sm">This lesson content is being prepared</p>
                                         </div>
                                     )}
                                 </div>
                                 {lesson?.documentUrl && (
                                     <div className="mt-6 pt-6 border-t border-gray-200">
                                         <a 
                                             href={lesson.documentUrl}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                         >
                                             <FileText className="w-4 h-4 mr-2" />
                                             Download Resource
                                         </a>
                                     </div>
                                 )}
                             </div>
                         ) : lesson?.type === 'QUIZ' ? (
                             /* Quiz Content */
                             <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-8 mb-6 max-w-4xl">
                                 <div className="flex items-center mb-4">
                                     <Award className="w-6 h-6 text-yellow-600 mr-3" />
                                     <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                                         Assessment
                                     </span>
                                 </div>
                                 <div className="text-center py-12">
                                     <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Quiz Assessment</h3>
                                     <p className="text-gray-600 mb-6">Test your knowledge on the topics covered in this module</p>
                                     <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                         Start Quiz
                                     </button>
                                 </div>
                             </div>
                         ) : (
                             /* Default/Unknown Type */
                             <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 mb-6 max-w-4xl">
                                 <div className="text-center py-12">
                                     <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                     <p className="text-gray-500 text-lg">Content type not recognized</p>
                                     <p className="text-gray-400 text-sm">Please contact support if this issue persists</p>
                                 </div>
                             </div>
                         )}

                        {/* Video Info */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{lesson?.name}</h1>
                            <p className="text-gray-600 mb-4">
                                {lesson?.description || 'Learn the essential skills and knowledge for this training module.'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                                                         Duration: {formatDuration(lesson?.duration || null) || 'N/A'}
                                </span>
                                <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Progress: 60%
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Added: 2 days ago
                                </span>
                            </div>
                        </div>

                                                 {/* Action Buttons */}
                         <div className="flex items-center gap-4 mb-6">
                             {previousLesson ? (
                                 <a 
                                     href={`/${moduleId}/lessons/${previousLesson.id}`}
                                     className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                                 >
                                     <ArrowLeft className="w-4 h-4 mr-2" />
                                     Previous Lesson
                                 </a>
                             ) : (
                                 <button 
                                     disabled 
                                     className="bg-gray-50 text-gray-400 px-4 py-2 rounded-lg font-medium flex items-center cursor-not-allowed"
                                 >
                                     <ArrowLeft className="w-4 h-4 mr-2" />
                                     Previous Lesson
                                 </button>
                             )}
                             
                             {nextLesson ? (
                                 <a 
                                     href={`/${moduleId}/lessons/${nextLesson.id}`}
                                     className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                                 >
                                     Next Lesson
                                     <ArrowRight className="w-4 h-4 ml-2" />
                                 </a>
                             ) : (
                                 <button 
                                     disabled 
                                     className="bg-gray-50 text-gray-400 px-4 py-2 rounded-lg font-medium flex items-center cursor-not-allowed"
                                 >
                                     Next Lesson
                                     <ArrowRight className="w-4 h-4 ml-2" />
                                 </button>
                             )}
                             
                             <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                                 <Bookmark className="w-4 h-4 mr-2" />
                                 Bookmark
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
