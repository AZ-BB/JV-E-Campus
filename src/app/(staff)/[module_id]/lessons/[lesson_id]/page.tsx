import { getLesson, getLessons } from "@/actions/lessons"
import { getModule } from "@/actions/modules"
import { getSections } from "@/actions/sections"
import { lessons } from "@/db/schema/schema"
import LessonPlayer from "./lesson-player"

export default async function Lesson({
    params
}: {
    params: Promise<{ lesson_id: string, module_id: string }>
}) {
    const { lesson_id, module_id } = await params

    const { data: lesson, error: lessonError } = await getLesson(parseInt(lesson_id))
    if (lessonError) {
        return <div>Error: {lessonError}</div>
    }

    const { data: module, error: moduleError } = await getModule(parseInt(module_id))
    if (moduleError) {
        return <div>Error: {moduleError}</div>
    }

    const { data: sections, error: sectionsError } = await getSections(parseInt(module_id), {
        page: 1,
        limit: 100,
        search: "",
        sort: "createdAt",
        order: "desc"
    })

    if (sectionsError) {
        return <div>Error: {sectionsError}</div>
    }

    const sectionsData: {
        id: number
        name: string
        description?: string | null
        lessons: typeof lessons.$inferSelect[]
    }[] = sections?.rows.map((section) => ({
        ...section,
        lessons: []
    })) || []

    for (let i = 0; i < sectionsData.length; i++) {
        const section = sectionsData[i]
        const { data: lessons, error: lessonsError } = await getLessons(section.id, {
            page: 1,
            limit: 100,
            search: "",
            sort: "createdAt",
            order: "desc"
        })

        if (lessonsError) {
            continue
        }

        sectionsData[i].lessons = lessons?.rows || []
    }

    return (
        <LessonPlayer 
            lesson={lesson}
            module={module}
            sections={sectionsData}
            moduleId={module_id}
            lessonId={lesson_id}
        />
    )
}