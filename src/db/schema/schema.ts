import { pgTable, foreignKey, unique, serial, varchar, text, integer, timestamp, uuid, boolean, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const lessonLevel = pgEnum("lesson_level", ['BEGINNER', 'INTERMEDIATE', 'EXPERT'])
export const lessonType = pgEnum("lesson_type", ['VIDEO', 'TEXT', 'QUIZ'])
export const progressEntityType = pgEnum("progress_entity_type", ['MODULE', 'SECTION', 'LESSON'])
export const staffCategory = pgEnum("staff_category", ['FOH', 'BOH', 'MANAGER'])
export const trainingStatus = pgEnum("training_status", ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
export const userRole = pgEnum("user_role", ['ADMIN', 'STAFF'])


export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	role: userRole().notNull(),
	language: varchar({ length: 2 }),
	profilePictureUrl: text("profile_picture_url"),
	createdBy: integer("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	authUserId: uuid("auth_user_id"),
}, (table) => [
	foreignKey({
			columns: [table.authUserId],
			foreignColumns: [table.id],
			name: "fk_auth_user"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [table.id],
			name: "users_created_by_fkey"
		}).onDelete("set null"),
	unique("users_email_key").on(table.email),
	unique("users_auth_user_id_key").on(table.authUserId),
]);

export const branches = pgTable("branches", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const staff = pgTable("staff", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	nationality: text(),
	phoneNumber: text("phone_number"),
	staffCategory: staffCategory("staff_category").notNull(),
	profilePictureUrl: text("profile_picture_url"),
	firstLogin: boolean("first_login").default(true),
	branchId: integer("branch_id"),
	staffRoleId: integer("staff_role_id"),
}, (table) => [
	foreignKey({
			columns: [table.branchId],
			foreignColumns: [branches.id],
			name: "staff_branch_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.staffRoleId],
			foreignColumns: [staffRoles.id],
			name: "staff_staff_role_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "staff_user_id_fkey"
		}).onDelete("cascade"),
]);

export const modules = pgTable("modules", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slogan: text(),
	description: text(),
	iconUrl: text("icon_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "modules_created_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "modules_updated_by_fkey"
		}).onDelete("set null"),
]);

export const sections = pgTable("sections", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	level: lessonLevel().default('BEGINNER'),
	description: text(),
	moduleId: integer("module_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "sections_created_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.moduleId],
			foreignColumns: [modules.id],
			name: "sections_module_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "sections_updated_by_fkey"
		}).onDelete("set null"),
]);

export const lessons = pgTable("lessons", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	duration: integer(),
	type: lessonType().default('VIDEO'),
	videoUrl: text("video_url"),
	documentUrl: text("document_url"),
	text: text(),
	sectionId: integer("section_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "lessons_created_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.sectionId],
			foreignColumns: [sections.id],
			name: "lessons_section_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "lessons_updated_by_fkey"
		}).onDelete("set null"),
]);

export const bookmarks = pgTable("bookmarks", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	lessonId: integer("lesson_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lessons.id],
			name: "bookmarks_lesson_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "bookmarks_user_id_fkey"
		}).onDelete("cascade"),
]);

export const progress = pgTable("progress", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	entityId: integer("entity_id").notNull(),
	entityType: progressEntityType("entity_type").notNull(),
	percentage: numeric().default('0'),
	status: trainingStatus().default('IN_PROGRESS'),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "progress_user_id_fkey"
		}).onDelete("cascade"),
]);

export const staffRoles = pgTable("staff_roles", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	fullName: varchar("full_name", { length: 255 }),
});
