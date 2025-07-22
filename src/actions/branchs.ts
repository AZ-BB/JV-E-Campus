"use server"
import { GeneralActionResponse } from "@/types/general-action-response";
import { db } from "@/db";
import { branches } from "@/db/schema/schema";

export const getBranchs = async (): Promise<GeneralActionResponse<typeof branches.$inferSelect[]>> => {
    const branchs = await db.select().from(branches);
    return { data: branchs, error: null };
}