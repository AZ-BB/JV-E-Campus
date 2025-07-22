"use server"
import { GeneralActionResponse } from "@/types/general-action-response"
import { db } from "@/db"
import { branches, staff } from "@/db/schema/schema"
import { count, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

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
    return { data: null, error: error as string }
  }
}

export interface Branch {
  id: number
  name: string
  createdAt: string | null
  number_of_staff: number
}
export const getDetailedBranches = async (): Promise<
  GeneralActionResponse<Branch[]>
> => {
  try {
    const branchesData = await db
      .select({
        id: branches.id,
        name: branches.name,
        createdAt: branches.createdAt,
        number_of_staff: count(staff.id),
      })
      .from(branches)
      .leftJoin(staff, eq(branches.id, staff.branchId))
      .groupBy(branches.id)
    return { data: branchesData, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: error as string }
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
    return { data: null, error: error as string }
  }
}

// CREATORS
export const createBranch = async (branch: {
  name: string
}): Promise<GeneralActionResponse<typeof branches.$inferSelect>> => {
  try {
    const result = await db.insert(branches).values(branch).returning()
    revalidatePath("/admin/branches")
    return { data: result[0], error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: error as string }
  }
}
