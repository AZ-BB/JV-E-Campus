import { relations } from "drizzle-orm/relations";
import { modules, modulesRoles, staffRoles, usersInAuth, users, branches, staff, sections, actionLogs, lessons, bookmarks, progress } from "./schema";

export const modulesRolesRelations = relations(modulesRoles, ({one}) => ({
	module: one(modules, {
		fields: [modulesRoles.moduleId],
		references: [modules.id]
	}),
	staffRole: one(staffRoles, {
		fields: [modulesRoles.roleId],
		references: [staffRoles.id]
	}),
}));

export const modulesRelations = relations(modules, ({one, many}) => ({
	modulesRoles: many(modulesRoles),
	user_createdBy: one(users, {
		fields: [modules.createdBy],
		references: [users.id],
		relationName: "modules_createdBy_users_id"
	}),
	user_updatedBy: one(users, {
		fields: [modules.updatedBy],
		references: [users.id],
		relationName: "modules_updatedBy_users_id"
	}),
	sections: many(sections),
}));

export const staffRolesRelations = relations(staffRoles, ({many}) => ({
	modulesRoles: many(modulesRoles),
	staff: many(staff),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [users.authUserId],
		references: [usersInAuth.id]
	}),
	user: one(users, {
		fields: [users.createdBy],
		references: [users.id],
		relationName: "users_createdBy_users_id"
	}),
	users: many(users, {
		relationName: "users_createdBy_users_id"
	}),
	staff: many(staff),
	modules_createdBy: many(modules, {
		relationName: "modules_createdBy_users_id"
	}),
	modules_updatedBy: many(modules, {
		relationName: "modules_updatedBy_users_id"
	}),
	sections_createdBy: many(sections, {
		relationName: "sections_createdBy_users_id"
	}),
	sections_updatedBy: many(sections, {
		relationName: "sections_updatedBy_users_id"
	}),
	actionLogs: many(actionLogs),
	lessons_createdBy: many(lessons, {
		relationName: "lessons_createdBy_users_id"
	}),
	lessons_updatedBy: many(lessons, {
		relationName: "lessons_updatedBy_users_id"
	}),
	bookmarks: many(bookmarks),
	progresses: many(progress),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	users: many(users),
}));

export const staffRelations = relations(staff, ({one}) => ({
	branch: one(branches, {
		fields: [staff.branchId],
		references: [branches.id]
	}),
	staffRole: one(staffRoles, {
		fields: [staff.staffRoleId],
		references: [staffRoles.id]
	}),
	user: one(users, {
		fields: [staff.userId],
		references: [users.id]
	}),
}));

export const branchesRelations = relations(branches, ({many}) => ({
	staff: many(staff),
}));

export const sectionsRelations = relations(sections, ({one, many}) => ({
	user_createdBy: one(users, {
		fields: [sections.createdBy],
		references: [users.id],
		relationName: "sections_createdBy_users_id"
	}),
	module: one(modules, {
		fields: [sections.moduleId],
		references: [modules.id]
	}),
	user_updatedBy: one(users, {
		fields: [sections.updatedBy],
		references: [users.id],
		relationName: "sections_updatedBy_users_id"
	}),
	lessons: many(lessons),
}));

export const actionLogsRelations = relations(actionLogs, ({one}) => ({
	user: one(users, {
		fields: [actionLogs.actorId],
		references: [users.id]
	}),
}));

export const lessonsRelations = relations(lessons, ({one, many}) => ({
	user_createdBy: one(users, {
		fields: [lessons.createdBy],
		references: [users.id],
		relationName: "lessons_createdBy_users_id"
	}),
	section: one(sections, {
		fields: [lessons.sectionId],
		references: [sections.id]
	}),
	user_updatedBy: one(users, {
		fields: [lessons.updatedBy],
		references: [users.id],
		relationName: "lessons_updatedBy_users_id"
	}),
	bookmarks: many(bookmarks),
}));

export const bookmarksRelations = relations(bookmarks, ({one}) => ({
	lesson: one(lessons, {
		fields: [bookmarks.lessonId],
		references: [lessons.id]
	}),
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id]
	}),
}));

export const progressRelations = relations(progress, ({one}) => ({
	user: one(users, {
		fields: [progress.userId],
		references: [users.id]
	}),
}));