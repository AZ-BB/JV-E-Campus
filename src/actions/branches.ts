"use server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { db } from "@/db"
import { branches, staff } from "@/db/schema/schema"
import { asc, count, desc, eq, ilike, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import responses from "@/responses/responses"
import { createSupabaseServerClient } from "@/utils/supabase-server"
import { getCurrentUser } from "@/utils/utils"
import { createLog } from "./logs"

export interface Branch {
  id: number
  name: string
  createdAt: string | null
  staffCount: number
}

export const getBranchesNames = async (): Promise<GeneralActionResponse<{ id: number, name: string }[]>> => {
  try {
    const branchesList = await db.select({
      id: branches.id,
      name: branches.name,
    }).from(branches)
    return { data: branchesList, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: "Failed to fetch branches, please try again later" as string }
  }
}

export const getDetailedBranches = async ({
  page = 1,
  limit = 10,
  search = "",
  orderBy = "createdAt",
  orderDirection = "desc",
}: {
  page?: number,
  limit?: number,
  search?: string,
  orderBy?: keyof Branch,
  orderDirection?: "asc" | "desc",
}): Promise<GeneralActionResponse<{ rows: Branch[], count: number, numberOfPages: number }>> => {
  try {

    const branchSelection = {
      id: branches.id,
      name: branches.name,
      createdAt: branches.createdAt,
      staffCount: count(staff.id),
    } as const

    const tx = await db.transaction(async (tx) => {
      const query = tx.select(branchSelection).from(branches)
        .leftJoin(staff, eq(branches.id, staff.branchId))
        .groupBy(branches.id)
        .limit(limit)
        .offset((page - 1) * limit)

      if (search) {
        query.where(ilike(branches.name, `%${search}%`))
      }

      const orderByColumn = branchSelection[orderBy as keyof typeof branchSelection] || branches.createdAt
      query.orderBy(orderDirection === "asc" ? asc(orderByColumn) : desc(orderByColumn))

      const rows = await query
      const rowsCount = await tx.select({ count: count() }).from(branches)

      return { rows, count: rowsCount[0].count, numberOfPages: Math.ceil(rowsCount[0].count / limit) }
    })


    return {
      data: {
        rows: tx.rows,
        count: tx.count,
        numberOfPages: tx.numberOfPages
      }, error: null
    }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.branch.fetchedAll.error.general }
  }
}

export interface BranchesStats {
  total_branches: number
  average_staff_per_branch: number
}

export const getBranchesStats = async (): Promise<
  GeneralActionResponse<BranchesStats>
> => {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(branches)
    const result2 = await db
      .select({ count: sql<number>`count(*)` })
      .from(staff)

    const data = {
      total_branches: result[0].count,
      average_staff_per_branch:
        result2.length > 0 && result[0].count > 0
          ? result2[0].count / result[0].count
          : 0,
    }
    return { data, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.branch.fetchedAll.error.general }
  }
}

// CREATORS
export const createBranch = async (branch: {
  name: string
}): Promise<GeneralActionResponse<typeof branches.$inferSelect>> => {
  try {
    const currentUser = await getCurrentUser()

    const result = await db.insert(branches).values({
      name: branch.name.trim(),
    }).returning()

    createLog({
      type: "CREATE_BRANCH",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: result[0].id,
      actedOnType: "BRANCH",
      message: "Branch created with name: " + result[0].name,
      metadata: {
        name: result[0].name
      }
    })
    revalidatePath("/admin/branches")
    return { data: result[0], error: null, message: responses.branch.created.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.branch.created.error.general }
  }
}


// UPDATERS
export const updateBranch = async (branchId: number, data: { name: string }): Promise<GeneralActionResponse<typeof branches.$inferSelect>> => {
  try {
    const result = await db.update(branches).set({ name: data.name.trim() }).where(eq(branches.id, branchId)).returning()

    const currentUser = await getCurrentUser()

    // LOG
    createLog({
      type: "UPDATE_BRANCH",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: branchId,
      actedOnType: "BRANCH",
      message: "Branch updated with name: " + data.name,
    })

    revalidatePath("/admin/branches")
    return { data: result[0], error: null, message: responses.branch.updated.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.branch.updated.error.general }
  }
}

// DELETERS
export const deleteBranch = async (branchId: number): Promise<GeneralActionResponse<void>> => {
  try {
    const result = await db.select({
      name: branches.name,
      staffCount: count(staff.id),
    }).from(staff).where(eq(staff.branchId, branchId))

    if (result[0]?.staffCount > 0) {
      console.error("Branch has staff, please remove staff from this branch first")
      return { data: null, error: responses.branch.deleted.error.hasStaff }
    }

    await db.delete(branches).where(eq(branches.id, branchId))

    // LOG
    const currentUser = await getCurrentUser()

    createLog({
      type: "DELETE_BRANCH",
      actorId: currentUser?.user?.user_metadata?.db_user_id || 1,
      actedOnId: branchId,
      actedOnType: "BRANCH",
      message: "Branch deleted with id: " + branchId + " and name: " + result[0].name,
    })

    revalidatePath("/admin/branches")
    return { data: null, error: null, message: responses.branch.deleted.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.branch.deleted.error.general }
  }
}


