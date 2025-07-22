"use client"

import React, { useState, useEffect } from "react"
import { GeneralActionResponse } from "@/app/types/general-action-response"
import { createAdminUser, createStaffUser } from "@/actions/users"
import { useRouter } from "next/navigation"

interface User {
  id: number
  fullName: string
  email: string
  role: string
  language?: string | null
  profilePictureUrl?: string | null
  createdAt?: string | null
}

export default function UserTable({
  adminUsers,
  staffUsers,
}: {
  adminUsers: GeneralActionResponse<User[]>
  staffUsers: GeneralActionResponse<User[]>
}) {
  const { data: adminUsersData, error: adminUsersError } = adminUsers
  const { data: staffUsersData, error: staffUsersError } = staffUsers
  const [activeTab, setActiveTab] = useState<"admin" | "staff">("admin")
  const currentUsers = activeTab === "admin" ? adminUsers : staffUsers
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const handleCreateAdminUser = async () => {
    const response = await createAdminUser({
      email: "adham2@test.com",
      password: "123456",
      fullName: "Test User",
    })
    if (response.error) {
      setError(response.error)
    }
  }
  const handleCreateStaffUser = async () => {
    const response = await createStaffUser({
      email: "staff3@test.com",
      password: "123456",
      fullName: "Test User",
      branchId: 1,
      staffCategory: "FOH",
      phoneNumber: "1234567890",
      nationality: "Egypt",
      profilePictureUrl: "https://via.placeholder.com/150",
    })
    if (response.error) {
      setError(response.error)
    }
  }
  const handleRefresh = async () => {
    router.refresh()
  }
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("admin")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "admin"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            Admins ({adminUsersData?.length})
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "staff"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            Staff ({staffUsersData?.length})
          </button>
        </nav>
      </div>

      {/* Table Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          {activeTab === "admin" ? "Admin Users" : "Staff Users"}
        </h2>
        <p className="text-gray-400">
          Manage {activeTab === "admin" ? "admin" : "staff"} user accounts
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex gap-3">
          {activeTab === "admin" && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={handleCreateAdminUser}
            >
              Create Admin User
            </button>
          )}
          {activeTab === "staff" && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={handleCreateStaffUser}
            >
              Create Staff User
            </button>
          )}
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
        {currentUsers?.data?.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No {activeTab} users found
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
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {currentUsers?.data?.map((user) => (
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
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.language || "N/A"}
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
