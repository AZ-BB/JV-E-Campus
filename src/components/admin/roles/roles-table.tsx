"use client"

import React, { useState } from "react"
import { GeneralActionResponse } from "@/types/general-action-response"
import { useRouter } from "next/navigation"
import CreateRoleModal from "./create-role-modal" 
import { Role } from "@/actions/roles"

export default function RolesTable({
  roles,
}: {
  roles: GeneralActionResponse<Role[]>
}) {
  const router = useRouter()
  const { data: rolesData, error: rolesError } = roles

  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = async () => {
    router.refresh()
  }
  return (
    <div className="w-full p-6">
      <CreateRoleModal isOpen={isCreateRoleModalOpen} onClose={() => setIsCreateRoleModalOpen(false)} />
      {/* Table Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Roles</h2>
        <p className="text-gray-400">Manage roles</p>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex gap-3">
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            onClick={handleRefresh}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            onClick={() => setIsCreateRoleModalOpen(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Role
          </button>
        </div>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        {rolesData?.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No roles found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Number of Staff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {rolesData?.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-sm font-medium text-white">
                            {role.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {role.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {role.number_of_staff}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          role.number_of_staff === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {role.number_of_staff === 0 ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {role.updatedAt
                        ? new Date(role.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
