'use client'
import { useEffect, useMemo, useState } from "react"
import { lessons } from "@/db/schema/schema"
import Logout from "@/components/logout"
import Image from 'next/image'
import { 
    PlayCircle, 
    FileText, 
    Award,
    ChevronRight,
    ChevronDown,
    ArrowLeft,
    ArrowRight,
    Bookmark,
    Eye,
    Calendar,
    Clock,
    CheckCircle,
    Shield,
    MapPin,
    UtensilsCrossed,
    ClipboardList,
    ExternalLink
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
    const [currentLessonId, setCurrentLessonId] = useState(parseInt(lessonId))
    const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())
    const [progressPercent, setProgressPercent] = useState(0)
    const [expandedSections, setExpandedSections] = useState<Set<number>>(() => {
        const initial = new Set<number>()
        const currentSection = sections.find(s => s.lessons.some(l => l.id === parseInt(lessonId)))
        if (currentSection) initial.add(currentSection.id)
        else if (sections[0]) initial.add(sections[0].id)
        return initial
    })

    // Persist last watched lesson and completed lessons in localStorage
    useEffect(() => {
        const moduleKey = `ecampus.module.${moduleId}.lastLessonId`
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(moduleKey, String(currentLessonId))
        }
    }, [moduleId, currentLessonId])

    useEffect(() => {
        const completedKey = `ecampus.module.${moduleId}.completedLessons`
        if (typeof window === 'undefined') return
        try {
            const raw = window.localStorage.getItem(completedKey)
            if (raw) {
                const parsed = JSON.parse(raw) as number[]
                setCompletedLessons(new Set(parsed))
            }
        } catch (_) {
            // ignore
        }
    }, [moduleId])

    const allLessons = useMemo(() => sections.flatMap(section => section.lessons), [sections])
    useEffect(() => {
        const total = allLessons.length || 1
        const done = [...completedLessons].filter(id => allLessons.some(l => l.id === id)).length
        setProgressPercent(Math.round((done / total) * 100))
    }, [allLessons, completedLessons])

    const toggleCompleted = (id: number) => {
        const next = new Set(completedLessons)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setCompletedLessons(next)
        const completedKey = `ecampus.module.${moduleId}.completedLessons`
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(completedKey, JSON.stringify([...next]))
        }
    }

    const toggleSection = (sectionId: number) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(sectionId)) next.delete(sectionId)
            else next.add(sectionId)
            return next
        })
    }

    useEffect(() => {
        // Ensure section containing current lesson is expanded
        const container = sections.find(s => s.lessons.some(l => l.id === currentLessonId))
        if (container && !expandedSections.has(container.id)) {
            setExpandedSections(prev => new Set(prev).add(container.id))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLessonId])

    const getSectionDuration = (section: SectionData) =>
        section.lessons.reduce((acc, l) => acc + (l.duration || 0), 0)

    const handleLessonClick = (lessonId: number) => {
        setCurrentLessonId(lessonId)
        // Navigation will be handled by the href attribute
    }

    // Get all lessons in order for previous/next navigation
    const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId)
    const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
    const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null

    // Calculate total course stats
    const totalLectures = sections.reduce((acc, section) => acc + section.lessons.length, 0)
    const totalDuration = sections.reduce((acc, section) => 
        acc + section.lessons.reduce((sectionAcc, lesson) => sectionAcc + (lesson.duration || 0), 0), 0
    )

    const isCurrentCompleted = completedLessons.has(currentLessonId)
    const currentSection = useMemo(() => sections.find(s => s.lessons.some(l => l.id === currentLessonId)), [sections, currentLessonId])

    // Static demo data for sidebar (can be swapped with real data later)
    const stationArea = {
        area: 'Kitchen - Prep Area',
        station: 'Hot Line / Equipment Station',
        sectionLabel: currentSection?.name || 'General'
    }
    const equipmentList = [
        'Chef Knife',
        'Cutting Board',
        'Food Thermometer',
        'Heat-resistant Gloves',
        'Sanitizing Towels'
    ]
    const ingredientsList = [
        'Tomatoes',
        'Olive Oil',
        'Garlic',
        'Basil',
        'Salt & Pepper'
    ]

    // Extract YouTube video ID from lesson's videoUrl
    const youtubeVideoId = lesson?.videoUrl ? extractYouTubeId(lesson.videoUrl) : null

    return (
        <div className=" bg-gray-50">
            {/* Main Content */}
            <div className="pt-20 bg-white min-h-screen">
                <div className="flex">
                    {/* Course Sidebar */}
                    <div className="w-80 bg-gray-50 border-r border-gray-200" style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
                        {/* Course Header */}
                        <div className="p-4 bg-white border-b sticky top-0 z-10">
                            <h3 className="font-bold text-gray-800 mb-1 truncate">{module?.name || 'Training Course'}</h3>
                            <p className="text-sm text-gray-600">
                                {sections.length} sections • {totalLectures} lectures • {formatDuration(totalDuration)}
                            </p>
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => setExpandedSections(new Set(sections.map(s => s.id)))}
                                        className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    >
                                        Expand all
                                    </button>
                                    <button
                                        onClick={() => setExpandedSections(new Set())}
                                        className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    >
                                        Collapse all
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Sections (Accordion) */}
                        <div className="pb-8">
                            {sections.map((section) => {
                                const isOpen = expandedSections.has(section.id)
                                const sectionDuration = getSectionDuration(section)
                                return (
                                    <div key={section.id} className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex items-center justify-between text-sm font-semibold text-gray-700"
                                        >
                                            <span className="flex items-center text-sm">
                                                {getSectionIcon(section.name)}
                                                {section.name}
                                            </span>
                                            <span className="flex items-center gap-3 text-gray-600 font-normal">
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="animate-[accordion-down_200ms_ease-out]">
                                                {section.lessons.map((sectionLesson) => {
                                                    const isActive = sectionLesson.id === currentLessonId
                                                    const isCompleted = completedLessons.has(sectionLesson.id)
                                                    return (
                                                        <a
                                                            key={sectionLesson.id}
                                                            href={`/modules/${moduleId}/lessons/${sectionLesson.id}`}
                                                            onClick={() => handleLessonClick(sectionLesson.id)}
                                                            className={`flex items-center p-3 border-t border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
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
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`text-sm font-medium truncate ${
                                                                    isCompleted ? 'text-gray-600' : 'text-gray-800'
                                                                }`}>
                                                                    {sectionLesson.name}
                                                                </div>
                                                            </div>
                                                            {sectionLesson.duration && (
                                                                <div className="text-xs text-gray-500 ml-2">
                                                                    {formatDuration(sectionLesson.duration)}
                                                                </div>
                                                            )}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Video Player Section */}
                    <div className="flex-1 p-6">
                        {/* Breadcrumb */}
                        <div className="mb-4">
                            <nav className="flex items-center space-x-2 text-sm">
                                <a href={`/modules/${moduleId}`} className="text-gray-600 hover:text-gray-800">
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
                                    Progress: {progressPercent}%
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
                                     href={`/modules/${moduleId}/lessons/${previousLesson.id}`}
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
                                     href={`/modules/${moduleId}/lessons/${nextLesson.id}`}
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

                              <button
                                  onClick={() => toggleCompleted(currentLessonId)}
                                  className={`${isCurrentCompleted ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} px-4 py-2 rounded-lg font-medium transition-colors`}
                              >
                                  {isCurrentCompleted ? 'Marked Completed' : 'Mark as Completed'}
                              </button>
                         </div>
                    </div>
 
                    {/* Right Sidebar (static info) */}
                    <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 hidden lg:block">
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <h4 className="text-sm font-semibold text-gray-800">Station & Area</h4>
                                </div>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p><span className="font-medium text-gray-800">Area:</span> {stationArea.area}</p>
                                    <p><span className="font-medium text-gray-800">Station:</span> {stationArea.station}</p>
                                    <p><span className="font-medium text-gray-800">Section:</span> {stationArea.sectionLabel}</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <UtensilsCrossed className="w-4 h-4 text-green-600" />
                                    <h4 className="text-sm font-semibold text-gray-800">Equipment Needed</h4>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    {equipmentList.map(item => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <ClipboardList className="w-4 h-4 text-green-600" />
                                    <h4 className="text-sm font-semibold text-gray-800">Ingredients</h4>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-3">
                                    {ingredientsList.map(item => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                                <a
                                    href="/ingredients"
                                    className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-semibold"
                                >
                                    View ingredients page
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
