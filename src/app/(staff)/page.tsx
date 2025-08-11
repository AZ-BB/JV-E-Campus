import { getRolesDetailed } from "@/actions/roles";
import TrainingCard from "@/components/staff/training-card";
import { getRoleColor, getRoleColorLight, getRoleIcon, getRoleDescription } from "@/utils/role-utils";





export default async function Staff() {

  const {data, error} = await getRolesDetailed({
    page: 1,
    limit: 10,
  })
  if (error) {
    return <div>Error: {error}</div>
  }
  
  const roles = data?.rows.map((role) => ({
    id: role.id,
    title: role.fullName || role.name,
    description: getRoleDescription(role.name),
    icon: getRoleIcon(role.name),
    color: getRoleColor(role.name),
    colorLight: getRoleColorLight(role.name),
    progress: 0,
  })) || []




  return (
    <div className="bg-transparent pt-10">
      {/* Header Section */}
      <div className="relative px-4 md:px-12 py-16">
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
      <div className="px-4 md:px-12 py-16 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="relative z-10">
          <div className="md:text-center text-left mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Learning Path</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select a career path to begin your journey. Each path is designed to build expertise 
              and prepare you for your next career milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role) => (
              <TrainingCard key={role.id} role={role} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}