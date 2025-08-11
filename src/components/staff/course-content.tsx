'use client'
import { useEffect, useMemo, useState } from "react"
import {
    ChevronDown,
    PlayCircle,
    FileText,
    Award,
    ChevronUp
} from "lucide-react"
import { lessons } from "@/db/schema/schema"
import Link from "next/link"
import Input from "@/components/ui/input"

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

//

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
                className="section-header p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 gap-3 sm:gap-0"
                onClick={onToggle}
            >
                <div className="flex-1">
                    <div className="section-title font-semibold text-base sm:text-lg text-gray-800 pr-4 sm:pr-0">
                        {section.name}
                    </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <span className="section-meta text-xs sm:text-sm text-gray-600 font-medium sm:mr-4">
                        {section.lessons.length} lectures • {formatDuration(totalDuration)}
                    </span>
                    <ChevronDown 
                        className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                        }`}
                    />
                </div>
            </div>
            
            {isExpanded && (
                <div className="section-content bg-gray-50">
                    {section.lessons.map((lesson) => (
                        <div 
                            key={lesson.id}
                            className="lesson-item flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:translate-x-1 transition-all duration-200 gap-3 sm:gap-0"
                        >
                            {/* Mobile: Top row with icon and duration */}
                            <div className="flex items-center justify-between w-full sm:w-auto">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="lesson-icon transition-transform duration-200 hover:scale-110">
                                        {getLessonIcon(lesson.type || 'TEXT')}
                                    </div>
                                    <Link 
                                        href={`/modules/${moduleId}/lessons/${lesson.id}`}
                                        className="flex-1 text-sm text-gray-700 font-medium hover:underline"
                                    >
                                        {lesson.name}
                                    </Link>
                                </div>
                                
                                {/* Duration - visible on mobile */}
                                <span className="lesson-duration text-xs sm:hidden text-gray-600 font-medium ml-2">
                                    {formatDuration(lesson.duration)}
                                </span>
                            </div>

                            {/* Mobile: Bottom row with preview button (if exists) */}
                            {lesson.videoUrl && (
                                <div className="sm:hidden w-full">
                                    <Link
                                        href={`/modules/${moduleId}/lessons/${lesson.id}`}
                                        className="inline-flex items-center text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-md bg-purple-50 hover:bg-purple-600 hover:text-white transition-all duration-200"
                                    >
                                        Preview Lesson
                                    </Link>
                                </div>
                            )}

                            {/* Desktop: Preview and duration */}
                            <div className="hidden sm:flex items-center gap-4 ml-auto">
                                {lesson.videoUrl && (
                                    <Link
                                        href={`/modules/${moduleId}/lessons/${lesson.id}`}
                                        className="lesson-preview text-purple-600 text-sm font-semibold px-2 py-1 rounded hover:bg-purple-600 hover:text-white transition-all duration-200"
                                    >
                                        Preview
                                    </Link>
                                )}
                                <span className="lesson-duration text-sm text-gray-600 min-w-16 text-right font-medium">
                                    {formatDuration(lesson.duration)}
                                </span>
                            </div>
                        </div>
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
    const [search, setSearch] = useState("")
    const [resumeLessonId, setResumeLessonId] = useState<number | null>(null)
    const [isClient, setIsClient] = useState(false)
    

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

    // Set client-side flag to prevent hydration mismatches
    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isClient || !module?.id) return
        const moduleKey = `ecampus.module.${module.id}.lastLessonId`
        try {
            const lastIdRaw = window.localStorage.getItem(moduleKey)
            if (lastIdRaw) setResumeLessonId(parseInt(lastIdRaw))
        } catch (_) {
            // ignore localStorage errors
        }
    }, [module?.id, isClient])

    const totalLectures = sections.reduce((acc, section) => acc + section.lessons.length, 0)
    const totalDuration = sections.reduce((acc, section) => 
        acc + section.lessons.reduce((sectionAcc, lesson) => sectionAcc + (lesson.duration || 0), 0), 0
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
            {/* Main Content (account for fixed StaffNavbar) */}
            <div className="bg-transparent pt-14 md:pt-20">
                {/* Header Section */}
                <div className="relative px-4 md:px-12 py-8 overflow-hidden">
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
                        {resumeLessonId && (
                            <div className="mt-6 inline-flex items-center gap-3 bg-white/15 text-white px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                                <span className="text-sm">Resume where you left off</span>
                                <Link
                                    href={`/modules/${module?.id}/lessons/${resumeLessonId}`}
                                    className="text-sm font-semibold px-3 py-1.5 bg-white text-green-700 rounded-lg hover:bg-gray-100"
                                >
                                    Continue
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Course Structure Section */}
                <div className="px-4 md:px-12 py-10">
                    <div className="mb-6 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <span className="text-sm sm:text-base text-gray-600">
                                    {sections.length} sections • {totalLectures} lectures • {formatDuration(totalDuration)} total length
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="w-full sm:w-72">
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search lessons..."
                                        className="h-10 bg-white border-gray-200"
                                    />
                                </div>
                                <div className="flex items-center gap-3 justify-center sm:justify-start">
                                    <button 
                                        onClick={expandAllSections}
                                        className="inline-flex items-center gap-1.5 text-purple-700 font-medium hover:underline text-sm"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                        <span className="hidden sm:inline">Expand all</span>
                                        <span className="sm:hidden">Expand</span>
                                    </button>
                                    <button 
                                        onClick={() => setExpandedSections(new Set())}
                                        className="inline-flex items-center gap-1.5 text-purple-700 font-medium hover:underline text-sm"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                        <span className="hidden sm:inline">Collapse all</span>
                                        <span className="sm:hidden">Collapse</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {useMemo(() => {
                        const q = search.trim().toLowerCase()
                        const filtered = q
                            ? sections
                                .map((s) => ({
                                    ...s,
                                    lessons: s.lessons.filter(l => l.name.toLowerCase().includes(q))
                                }))
                                .filter(s => s.lessons.length > 0)
                            : sections
                        return (
                            <div className="course-sections">
                                {filtered.length === 0 ? (
                                    <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 sm:p-10 text-center text-gray-600">
                                        <div className="text-sm sm:text-base">No lessons found for "{search}"</div>
                                    </div>
                                ) : (
                                    filtered.map((section) => (
                                        <CourseSection
                                            key={section.id}
                                            section={section}
                                            isExpanded={expandedSections.has(section.id)}
                                            onToggle={() => toggleSection(section.id)}
                                            moduleId={module?.id.toString() || ''}
                                        />
                                    ))
                                )}
                            </div>
                        )
                    }, [search, sections, expandedSections])}
                </div>
            </div>
        </div>
    )
}