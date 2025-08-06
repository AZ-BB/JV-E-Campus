import { getSection } from "@/actions/sections"
import Breadcrumb from "@/components/ui/breadcrumb"
import { Clock, BookOpen, PlayCircle, FileText, HelpCircle, Calendar, User, BarChart3, ArrowLeft, GraduationCap } from "lucide-react"
import Link from "next/link"

// Helper function to get lesson type icon with dark mode support
function getLessonTypeIcon(type: string) {
    switch (type?.toUpperCase()) {
        case 'VIDEO':
            return <PlayCircle className="w-5 h-5 text-admin-primary" />
        case 'TEXT':
            return <FileText className="w-5 h-5 text-admin-success" />
        case 'QUIZ':
            return <HelpCircle className="w-5 h-5 text-admin-secondary" />
        default:
            return <BookOpen className="w-5 h-5 text-admin-textMuted" />
    }
}

// Helper function to get level badge color with dark mode support
function getLevelBadgeColor(level: string) {
    switch (level?.toUpperCase()) {
        case 'BEGINNER':
            return 'bg-admin-success/10 text-admin-success border-admin-success/20'
        case 'INTERMEDIATE':
            return 'bg-admin-accent/10 text-admin-accent border-admin-accent/20'
        case 'EXPERT':
            return 'bg-admin-danger/10 text-admin-danger border-admin-danger/20'
        default:
            return 'bg-admin-textMuted/10 text-admin-textMuted border-admin-textMuted/20'
    }
}

// Helper function to get lesson type color
function getLessonTypeColor(type: string) {
    switch (type?.toUpperCase()) {
        case 'VIDEO':
            return 'bg-admin-primary/10 text-admin-primary border-admin-primary/20'
        case 'TEXT':
            return 'bg-admin-success/10 text-admin-success border-admin-success/20'
        case 'QUIZ':
            return 'bg-admin-secondary/10 text-admin-secondary border-admin-secondary/20'
        default:
            return 'bg-admin-textMuted/10 text-admin-textMuted border-admin-textMuted/20'
    }
}

// Helper function to format duration
function formatDuration(duration: number | null) {
    if (!duration) return '0m'
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
}

export default async function SectionPage({
    params
}: {
    params: Promise<{
        id: string
        section_id: string
    }>
}) {
    const { id, section_id } = await params

    const sectionResponse = await getSection(Number(section_id))
    if (sectionResponse.error || !sectionResponse.data) {
        return <div className="p-6 text-red-500">Error: {sectionResponse.error || "Section not found"}</div>
    }

    const sectionData = sectionResponse.data

    const breadcrumbItems = [
        { label: "Modules", href: "/admin/modules" },
        { label: sectionData.module.name, href: `/admin/modules/${id}` },
        { label: sectionData.name }
    ]

    // Calculate total duration from lessons
    const totalDuration = sectionData.lessons.reduce((total, lesson) => {
        return total + (lesson.duration || 0)
    }, 0)



    return (
        <div className="p-4 sm:p-6 pt-4  min-h-screen">
            <Breadcrumb items={breadcrumbItems} className="mb-4 sm:mb-6" />
            
            {/* Back Button */}
            <Link
                href={`/admin/modules/${id}`}
                className="inline-flex items-center gap-2 text-admin-textMuted hover:text-admin-primary transition-colors mb-4 sm:mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Module</span>
                <span className="sm:hidden">Back</span>
            </Link>

            {/* Section Hero Card */}
            <div className="bg-admin-surface border border-admin-border rounded-xl shadow-sm mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-admin-primary/5 to-admin-secondary/5 p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row items-start gap-6">
                        {/* Section Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-admin-primary/10 border border-admin-primary/20 flex items-center justify-center">
                                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-admin-primary" />
                            </div>
                        </div>

                        {/* Section Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                <h1 className="text-2xl sm:text-3xl font-bold text-admin-text">{sectionData.name}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border self-start ${getLevelBadgeColor(sectionData.level || 'BEGINNER')}`}>
                                    {sectionData.level || 'BEGINNER'}
                                </span>
                            </div>
                            {sectionData.description && (
                                <p className="text-admin-textMuted text-base leading-relaxed mb-4">{sectionData.description}</p>
                            )}
                            
                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 text-sm text-admin-textMuted">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Created {sectionData.createdAt ? new Date(sectionData.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>By {sectionData.createdByFullName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section Stats Cards */}
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs mx-auto lg:max-w-none">
                                <div className="bg-admin-surface/50 backdrop-blur-sm p-4 rounded-lg border border-admin-border/50">
                                    <BookOpen className="w-5 h-5 text-admin-primary mb-2" />
                                    <div className="text-xs text-admin-textMuted mb-1">Lessons</div>
                                    <div className="text-xl font-bold text-admin-text">{sectionData.lessonsCount}</div>
                                </div>
                                <div className="bg-admin-surface/50 backdrop-blur-sm p-4 rounded-lg border border-admin-border/50">
                                    <Clock className="w-5 h-5 text-admin-success mb-2" />
                                    <div className="text-xs text-admin-textMuted mb-1">Duration</div>
                                    <div className="text-xl font-bold text-admin-text">{formatDuration(totalDuration)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons Grid */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-admin-text flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-admin-primary" />
                        Course Content ({sectionData.lessonsCount} lessons)
                    </h2>
                </div>
                
                {sectionData.lessonsCount === 0 ? (
                    <div className="bg-admin-surface border border-admin-border rounded-xl p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-admin-textMuted/10 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-admin-textMuted" />
                        </div>
                        <h3 className="text-lg font-medium text-admin-text mb-2">No lessons yet</h3>
                        <p className="text-admin-textMuted">This section doesn't have any lessons yet. Lessons will appear here once they are added.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sectionData.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="bg-admin-surface border border-admin-border rounded-lg p-4 hover:shadow-md hover:border-admin-primary/30 transition-all duration-200">
                                <div className="flex items-center gap-4">
                                    {/* Lesson Number */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-admin-primary/10 border border-admin-primary/20 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-admin-primary">{index + 1}</span>
                                        </div>
                                    </div>

                                    {/* Lesson Icon */}
                                    <div className="flex-shrink-0">
                                        {getLessonTypeIcon(lesson.type || 'VIDEO')}
                                    </div>

                                    {/* Lesson Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-admin-text truncate">{lesson.name}</h3>
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getLessonTypeColor(lesson.type || 'VIDEO')}`}>
                                                {(lesson.type || 'VIDEO').toLowerCase()}
                                            </span>
                                        </div>
                                        {lesson.description && (
                                            <p className="text-sm text-admin-textMuted line-clamp-1">{lesson.description}</p>
                                        )}
                                    </div>

                                    {/* Lesson Duration */}
                                    <div className="flex-shrink-0 text-right">
                                        <div className="flex items-center gap-1 text-admin-textMuted">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">{formatDuration(lesson.duration)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Section Metadata Card */}
            {/* <div className="bg-admin-surface border border-admin-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-admin-textMuted" />
                    Section Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-admin-text mb-2">Created By</h4>
                        <p className="text-admin-textMuted">{sectionData.createdByFullName}</p>
                        <p className="text-xs text-admin-textMuted mt-1">
                            {sectionData.createdAt ? new Date(sectionData.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                    {sectionData.updatedAt && (
                        <div>
                            <h4 className="text-sm font-medium text-admin-text mb-2">Last Updated By</h4>
                            <p className="text-admin-textMuted">{sectionData.updatedByFullName}</p>
                            <p className="text-xs text-admin-textMuted mt-1">
                                {new Date(sectionData.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div> */}
        </div>
    )
}