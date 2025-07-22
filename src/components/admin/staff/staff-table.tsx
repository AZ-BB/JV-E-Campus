"use client"

import React, { useState, useEffect } from "react"
import { GeneralActionResponse } from "@/types/general-action-response"
import { createAdminUser, createStaffUser } from "@/actions/users"
import { useRouter } from "next/navigation"
import CreateStaffModal from "./create-staff-modal"
import { StaffCategory } from "@/db/enums"
import { Staff } from "@/actions/users"

export default function StaffTable({
  staffUsers,
}: {
  staffUsers: GeneralActionResponse<Staff[]>
}) {
  const router = useRouter()
  const { data: staffUsersData, error: staffUsersError } = staffUsers

  const [isCreateStaffModalOpen, setIsCreateStaffModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = async () => {
    router.refresh()
  }
  return (
    <div className="w-full p-6">
      <CreateStaffModal isOpen={isCreateStaffModalOpen} onClose={() => setIsCreateStaffModalOpen(false)} />
      {/* Table Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          Staff Users
        </h2>
        <p className="text-gray-400">
          Manage staff user accounts
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex gap-3">
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            onClick={() => setIsCreateStaffModalOpen(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Staff
          </button>

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
        </div>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        {staffUsersData?.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No staff users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nationality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {staffUsersData?.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profilePictureUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.profilePictureUrl}
                              alt={user.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-300">
                                {user.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                          }`}
                      >
                        {user.staffRoleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.language || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.branchName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.nationality || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.createdByName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
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
