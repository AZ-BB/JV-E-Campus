"use server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { db } from "@/db"
import { branches, staff } from "@/db/schema/schema"
import { count, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import responses from "@/responses/responses"

export const getBranches = async (): Promise<
  GeneralActionResponse<(typeof branches.$inferSelect)[]>
> => {
  try {
    const branchesData = await db
      .select()
      .from(branches)
    return { data: branchesData, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.branch.fetchedAll.error.general }
  }
}

export interface Branch {
  id: number
  name: string
  createdAt: string | null
  staffCount: number
}
export const getDetailedBranches = async (page: number = 1, limit: number = 20): Promise<
  GeneralActionResponse<Branch[]>
> => {
  try {
    const branchesData = await db
      .select({
        id: branches.id,
        name: branches.name,
        createdAt: branches.createdAt,
        staffCount: count(staff.id),
      })
      .from(branches)
      .leftJoin(staff, eq(branches.id, staff.branchId))
      .groupBy(branches.id)
      .limit(limit)
      .offset((page - 1) * limit)
    return { data: branchesData, error: null }
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
    const result = await db.insert(branches).values({
      name: branch.name.trim(),
    }).returning()
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
      staffCount: count(staff.id),
    }).from(staff).where(eq(staff.branchId, branchId))
    if(result[0]?.staffCount > 0) {
      console.error("Branch has staff, please remove staff from this branch first")
      return { data: null, error: responses.branch.deleted.error.hasStaff }
    }
    await db.delete(branches).where(eq(branches.id, branchId))
    revalidatePath("/admin/branches")
    return { data: null, error: null, message: responses.branch.deleted.success }
  } catch (error) {
    console.error(error)
    return { data: null, error: responses.branch.deleted.error.general }
  }
}