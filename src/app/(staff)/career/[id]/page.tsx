
import { getModules } from "@/actions/modules"
import { getRole } from "@/actions/roles"
import CareerPageContent from "@/components/staff/career-page-content"

interface CareerPageProps {
  params: Promise<{ id: string }>
}



export default async function CareerPage({ params }: CareerPageProps) {
  const { id } = await params
  const {data: role} = await getRole(Number(id))
  const {data: modules, error: modulesError} = await getModules({
    page: 1,
    limit: 100,
    search: "",
    orderBy: "name",
    orderDirection: "asc",
    filters: {
      roleIds: [Number(id)]
    }
  })
  if (modulesError) {
    return <div>Error</div>
  }

  const modulesData = modules?.rows || []


  return <CareerPageContent modulesData={modulesData as any} role={role as any} />
}
