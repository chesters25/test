import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  username: text("username").notNull(),
  level: integer("level").default(1).notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
});

export const quests = pgTable("quests", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  trader: text("trader").notNull(),
  map: text("map"),
  objectives: json("objectives").$type<QuestObjective[]>().default([]),
  requirements: json("requirements").$type<QuestRequirement[]>().default([]),
  rewards: json("rewards").$type<QuestReward[]>().default([]),
  wikiLink: text("wiki_link"),
});

export const playerQuests = pgTable("player_quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupMemberId: varchar("group_member_id").notNull(),
  questId: varchar("quest_id").notNull(),
  status: text("status").$type<'available' | 'active' | 'complete' | 'failed'>().default('available').notNull(),
  progress: json("progress").$type<QuestProgress[]>().default([]),
  completedAt: timestamp("completed_at"),
});

export const raids = pgTable("raids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  map: text("map").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  duration: integer("duration").notNull(),
  maxPlayers: integer("max_players").default(5).notNull(),
  objectives: json("objectives").$type<string[]>().default([]),
  requiredItems: json("required_items").$type<RequiredItem[]>().default([]),
  status: text("status").$type<'planned' | 'active' | 'completed' | 'cancelled'>().default('planned').notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const raidParticipants = pgTable("raid_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  raidId: varchar("raid_id").notNull(),
  groupMemberId: varchar("group_member_id").notNull(),
  status: text("status").$type<'pending' | 'confirmed' | 'declined'>().default('pending').notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const hideoutModules = pgTable("hideout_modules", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  levels: json("levels").$type<HideoutLevel[]>().default([]),
});

export const playerHideout = pgTable("player_hideout", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupMemberId: varchar("group_member_id").notNull(),
  moduleId: varchar("module_id").notNull(),
  currentLevel: integer("current_level").default(0).notNull(),
  isConstructing: boolean("is_constructing").default(false).notNull(),
  constructionEndTime: timestamp("construction_end_time"),
});

// Types
export interface QuestObjective {
  id: string;
  type: string;
  description: string;
  count?: number;
  target?: string;
  location?: string;
  foundInRaid?: boolean;
}

export interface QuestRequirement {
  type: string;
  target: string;
  compareMethod: string;
  value: number;
}

export interface QuestReward {
  type: string;
  item?: string;
  count?: number;
  trader?: string;
  reputation?: number;
  experience?: number;
}

export interface QuestProgress {
  objectiveId: string;
  current: number;
  required: number;
  complete: boolean;
}

export interface RequiredItem {
  name: string;
  count: number;
  foundInRaid?: boolean;
}

export interface HideoutLevel {
  level: number;
  requirements: RequiredItem[];
  constructionTime: number;
  bonuses?: string[];
}

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  lastSeen: true,
});

export const insertQuestSchema = createInsertSchema(quests);

export const insertPlayerQuestSchema = createInsertSchema(playerQuests).omit({
  id: true,
  completedAt: true,
});

export const insertRaidSchema = createInsertSchema(raids).omit({
  id: true,
  createdAt: true,
});

export const insertRaidParticipantSchema = createInsertSchema(raidParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertHideoutModuleSchema = createInsertSchema(hideoutModules);

export const insertPlayerHideoutSchema = createInsertSchema(playerHideout).omit({
  id: true,
});

// Inferred types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;

export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;

export type PlayerQuest = typeof playerQuests.$inferSelect;
export type InsertPlayerQuest = z.infer<typeof insertPlayerQuestSchema>;

export type Raid = typeof raids.$inferSelect;
export type InsertRaid = z.infer<typeof insertRaidSchema>;

export type RaidParticipant = typeof raidParticipants.$inferSelect;
export type InsertRaidParticipant = z.infer<typeof insertRaidParticipantSchema>;

export type HideoutModule = typeof hideoutModules.$inferSelect;
export type InsertHideoutModule = z.infer<typeof insertHideoutModuleSchema>;

export type PlayerHideout = typeof playerHideout.$inferSelect;
export type InsertPlayerHideout = z.infer<typeof insertPlayerHideoutSchema>;
