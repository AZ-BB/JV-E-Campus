export default {
    admin: {
        created: {
            success: "Admin created successfully",
            error: {
                general: "Failed to create admin, please try again later",
                missingFields: "Email, password and full name are required",
            },
        },
        updated: {
            success: "Admin updated successfully",
            error: {
                general: "Failed to update admin, please try again later",
                missingFields: "Email, password and full name are required",
            },
        },
        deleted: {
            success: "Admin deleted successfully",
            error: {
                general: "Failed to delete admin, please try again later"
            },
        },
        fetched: {
            success: "Admin fetched successfully",
            error: {
                general: "Failed to fetch admin, please try again later"
            },
        },
        fetchedAll: {
            success: "All admins fetched successfully",
            error: {
                general: "Failed to fetch all admins, please try again later"
            },
        },
    },
    staff: {
        created: {
            success: "User created successfully",
            error: {
                general: "Failed to create staff, please try again later",
                missingFields: "Email, password, full name, branch id and staff role id are required",
            },
        },
        updated: {
            success: "User updated successfully",
            error: {
                general: "Failed to update staff, please try again later",
                missingFields: "Email, password, full name, branch id and staff role id are required",
            },
        },
        deleted: {
            success: "User deleted successfully",
            error: {
                general: "Failed to delete staff, please try again later",
                notFound: "User not found"
            },
        },
        fetched: {
            success: "User fetched successfully",
            error: {
                general: "Failed to fetch staff, please try again later"
            },
        },
        fetchedAll: {
            success: "All staff fetched successfully",
            error: {
                general: "Failed to fetch all staff, please try again later"
            },
        },
    },
    branch: {
        created: {
            success: "Branch created successfully",
            error: {
                general: "Failed to create branch, please try again later"
            },
        },
        updated: {
            success: "Branch updated successfully",
            error: {
                general: "Failed to update branch, please try again later"
            },
        },
        deleted: {
            success: "Branch deleted successfully",
            error: {
                general: "Failed to delete branch, please try again later",
                notFound: "Branch not found",
                hasStaff: "Branch has staff, please remove staff from this branch first"
            },
        },
        fetched: {
            success: "Branch fetched successfully",
            error: {
                general: "Failed to fetch branch, please try again later"
            },
        },
        fetchedAll: {
            success: "All branches fetched successfully",
            error: {
                general: "Failed to fetch all branches, please try again later"
            },
        },
    },
    role: {
        created: {
            success: "Role created successfully",
            error: {
                general: "Failed to create role, please try again later"
            },
        },
        updated: {
            success: "Role updated successfully",
            error: {
                general: "Failed to update role, please try again later"
            },
        },
        deleted: {
            success: "Role deleted successfully",
            error: {
                general: "Failed to delete role, please try again later",
                notFound: "Role not found",
                hasStaff: "Role has staff, please remove staff from this role first"
            },
        },
        fetched: {
            success: "Role fetched successfully",
            error: {
                general: "Failed to fetch role, please try again later"
            },
        },
        fetchedAll: {
            success: "All roles fetched successfully",
            error: {
                general: "Failed to fetch all roles, please try again later"
            },
        },
    },
    upload: {
        error: {
            general: "Failed to upload file, please try again later",
        }
    },
}