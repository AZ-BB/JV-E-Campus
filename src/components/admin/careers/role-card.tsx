"use client"

import Image from "next/image"
import { Users, ArrowRight, ChefHat, UserCheck, Crown } from "lucide-react"

interface Role {
    id: number
    name: string
}

interface RoleCardProps {
    role: Role
}

// Function to get the appropriate image for each role
function getRoleImage(roleName: string): string {
    const name = roleName.toUpperCase()
    switch (name) {
        case 'FOH':
            return '/roles/foh-cover.jpg'
        case 'BOH':
            return '/roles/boh-cover.jpg'
        case 'MANAGER':
            return '/roles/manager-cover.jpg'
        default:
            return '/roles/default-cover.jpg'
    }
}

// Function to get role description
function getRoleDescription(roleName: string): string {
    const name = roleName.toUpperCase()
    switch (name) {
        case 'FOH':
            return 'Front of House operations including customer service, order taking, and guest relations'
        case 'BOH':
            return 'Back of House operations including food preparation, kitchen management, and food safety'
        case 'MANAGER':
            return 'Leadership and management responsibilities including team coordination and business operations'
        default:
            return 'Explore training modules and career development opportunities for this role'
    }
}

// Function to get role display name
function getRoleDisplayName(roleName: string): string {
    const name = roleName.toUpperCase()
    switch (name) {
        case 'FOH':
            return 'Front of House'
        case 'BOH':
            return 'Back of House'
        case 'MANAGER':
            return 'Manager'
        default:
            return roleName
    }
}

// Function to get role gradient background
function getRoleGradient(roleName: string): string {
    const name = roleName.toUpperCase()
    switch (name) {
        case 'FOH':
            return 'bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600'
        case 'BOH':
            return 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500'
        case 'MANAGER':
            return 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500'
        default:
            return 'bg-gradient-to-br from-gray-500 via-slate-500 to-gray-600'
    }
}

// Function to get role icon
function getRoleIcon(roleName: string): React.ReactNode {
    const name = roleName.toUpperCase()
    const iconClass = "w-12 h-12 text-white/90"
    
    switch (name) {
        case 'FOH':
            return <UserCheck className={iconClass} />
        case 'BOH':
            return <ChefHat className={iconClass} />
        case 'MANAGER':
            return <Crown className={iconClass} />
        default:
            return <Users className={iconClass} />
    }
}

export default function RoleCard({ role }: RoleCardProps) {
    const handleRoleClick = () => {
        // TODO: Navigate to role modules page
        console.log(`Clicked on role: ${role.name}`)
    }

    return (
        <div 
            onClick={handleRoleClick}
            className="group bg-admin-surface rounded-lg border border-admin-border overflow-hidden hover:border-admin-primary transition-all duration-300 cursor-pointer hover:shadow-lg"
        >
            {/* Cover Image */}
            <div className={`relative h-48 overflow-hidden ${getRoleGradient(role.name)}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                </div>
                
                {/* Role icon and title */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center flex flex-col items-center">
                        {getRoleIcon(role.name)}
                        <p className="text-white/90 text-lg font-bold mt-3">
                            {getRoleDisplayName(role.name)}
                        </p>
                    </div>
                </div>


                {/* Hover arrow */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h4 className="text-admin-text font-semibold mb-2">
                        {getRoleDisplayName(role.name)}
                    </h4>
                    <p className="text-admin-text-muted text-sm leading-relaxed">
                        {getRoleDescription(role.name)}
                    </p>
                </div>

                {/* Action hint */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-admin-text-muted">
                        Click to view modules
                    </span>
                    <div className="flex items-center text-admin-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}