import { 
  type User, 
  type InsertUser,
  type Group,
  type InsertGroup,
  type GroupMember,
  type InsertGroupMember,
  type Quest,
  type InsertQuest,
  type PlayerQuest,
  type InsertPlayerQuest,
  type Raid,
  type InsertRaid,
  type RaidParticipant,
  type InsertRaidParticipant,
  type HideoutModule,
  type InsertHideoutModule,
  type PlayerHideout,
  type InsertPlayerHideout
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Groups
  getGroup(id: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  getGroupsByUser(userId: string): Promise<Group[]>;
  
  // Group Members
  getGroupMembers(groupId: string): Promise<GroupMember[]>;
  createGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  updateGroupMember(id: string, updates: Partial<GroupMember>): Promise<GroupMember | undefined>;
  deleteGroupMember(id: string): Promise<void>;
  getGroupMember(id: string): Promise<GroupMember | undefined>;
  
  // Quests
  getQuest(id: string): Promise<Quest | undefined>;
  createQuest(quest: InsertQuest): Promise<Quest>;
  getAllQuests(): Promise<Quest[]>;
  
  // Player Quests
  getPlayerQuests(groupMemberId: string): Promise<PlayerQuest[]>;
  createPlayerQuest(playerQuest: InsertPlayerQuest): Promise<PlayerQuest>;
  updatePlayerQuest(id: string, updates: Partial<PlayerQuest>): Promise<PlayerQuest | undefined>;
  getActiveGroupQuests(groupId: string): Promise<PlayerQuest[]>;
  
  // Raids
  getRaid(id: string): Promise<Raid | undefined>;
  createRaid(raid: InsertRaid): Promise<Raid>;
  getGroupRaids(groupId: string): Promise<Raid[]>;
  updateRaid(id: string, updates: Partial<Raid>): Promise<Raid | undefined>;
  
  // Raid Participants
  createRaidParticipant(participant: InsertRaidParticipant): Promise<RaidParticipant>;
  getRaidParticipants(raidId: string): Promise<RaidParticipant[]>;
  updateRaidParticipant(id: string, updates: Partial<RaidParticipant>): Promise<RaidParticipant | undefined>;
  
  // Hideout Modules
  getHideoutModule(id: string): Promise<HideoutModule | undefined>;
  createHideoutModule(module: InsertHideoutModule): Promise<HideoutModule>;
  getAllHideoutModules(): Promise<HideoutModule[]>;
  
  // Player Hideout
  getPlayerHideout(groupMemberId: string): Promise<PlayerHideout[]>;
  createPlayerHideout(playerHideout: InsertPlayerHideout): Promise<PlayerHideout>;
  updatePlayerHideout(id: string, updates: Partial<PlayerHideout>): Promise<PlayerHideout | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private groups: Map<string, Group> = new Map();
  private groupMembers: Map<string, GroupMember> = new Map();
  private quests: Map<string, Quest> = new Map();
  private playerQuests: Map<string, PlayerQuest> = new Map();
  private raids: Map<string, Raid> = new Map();
  private raidParticipants: Map<string, RaidParticipant> = new Map();
  private hideoutModules: Map<string, HideoutModule> = new Map();
  private playerHideout: Map<string, PlayerHideout> = new Map();

  constructor() {
    // Initialize with default group and some members
    const defaultGroupId = randomUUID();
    const defaultGroup: Group = {
      id: defaultGroupId,
      name: "Moja Grupa",
      description: "Domyślna grupa Tarkov",
      createdBy: "system",
      createdAt: new Date(),
    };
    this.groups.set(defaultGroupId, defaultGroup);

    // Add some default group members
    const members = [
      { username: "MattyDev", level: 42, isOnline: true },
      { username: "AkimboKiller", level: 38, isOnline: true },
      { username: "SniperNoob", level: 29, isOnline: false },
    ];

    members.forEach((memberData) => {
      const member: GroupMember = {
        id: randomUUID(),
        groupId: defaultGroupId,
        username: memberData.username,
        level: memberData.level,
        isOnline: memberData.isOnline,
        lastSeen: new Date(),
      };
      this.groupMembers.set(member.id, member);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Groups
  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const group: Group = { 
      ...insertGroup, 
      id, 
      createdAt: new Date(),
      description: insertGroup.description || null
    };
    this.groups.set(id, group);
    return group;
  }

  async getGroupsByUser(userId: string): Promise<Group[]> {
    return Array.from(this.groups.values()).filter(group => group.createdBy === userId);
  }

  // Group Members
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return Array.from(this.groupMembers.values()).filter(member => member.groupId === groupId);
  }

  async createGroupMember(insertMember: InsertGroupMember): Promise<GroupMember> {
    const id = randomUUID();
    const member: GroupMember = { 
      ...insertMember, 
      id, 
      lastSeen: new Date(),
      level: insertMember.level || 1,
      isOnline: insertMember.isOnline || false
    };
    this.groupMembers.set(id, member);
    return member;
  }

  async updateGroupMember(id: string, updates: Partial<GroupMember>): Promise<GroupMember | undefined> {
    const member = this.groupMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updates };
    this.groupMembers.set(id, updatedMember);
    return updatedMember;
  }

  async deleteGroupMember(id: string): Promise<void> {
    this.groupMembers.delete(id);
  }

  async getGroupMember(id: string): Promise<GroupMember | undefined> {
    return this.groupMembers.get(id);
  }

  // Quests
  async getQuest(id: string): Promise<Quest | undefined> {
    return this.quests.get(id);
  }

  async createQuest(insertQuest: InsertQuest): Promise<Quest> {
    const quest: Quest = { 
      ...insertQuest,
      description: insertQuest.description || null,
      map: insertQuest.map || null,
      objectives: insertQuest.objectives || null,
      requirements: insertQuest.requirements || null,
      rewards: insertQuest.rewards || null,
      wikiLink: insertQuest.wikiLink || null
    };
    this.quests.set(quest.id, quest);
    return quest;
  }

  async getAllQuests(): Promise<Quest[]> {
    return Array.from(this.quests.values());
  }

  // Player Quests
  async getPlayerQuests(groupMemberId: string): Promise<PlayerQuest[]> {
    return Array.from(this.playerQuests.values()).filter(pq => pq.groupMemberId === groupMemberId);
  }

  async createPlayerQuest(insertPlayerQuest: InsertPlayerQuest): Promise<PlayerQuest> {
    const id = randomUUID();
    const playerQuest: PlayerQuest = { 
      ...insertPlayerQuest, 
      id,
      completedAt: null,
      status: insertPlayerQuest.status || "available",
      progress: insertPlayerQuest.progress || null
    };
    this.playerQuests.set(id, playerQuest);
    return playerQuest;
  }

  async updatePlayerQuest(id: string, updates: Partial<PlayerQuest>): Promise<PlayerQuest | undefined> {
    const playerQuest = this.playerQuests.get(id);
    if (!playerQuest) return undefined;
    
    const updatedPlayerQuest = { ...playerQuest, ...updates };
    this.playerQuests.set(id, updatedPlayerQuest);
    return updatedPlayerQuest;
  }

  async getActiveGroupQuests(groupId: string): Promise<PlayerQuest[]> {
    const groupMembers = await this.getGroupMembers(groupId);
    const memberIds = groupMembers.map(m => m.id);
    
    return Array.from(this.playerQuests.values()).filter(pq => 
      memberIds.includes(pq.groupMemberId) && pq.status === 'active'
    );
  }

  // Raids
  async getRaid(id: string): Promise<Raid | undefined> {
    return this.raids.get(id);
  }

  async createRaid(insertRaid: InsertRaid): Promise<Raid> {
    const id = randomUUID();
    const raid: Raid = { 
      ...insertRaid, 
      id, 
      createdAt: new Date(),
      description: insertRaid.description || null,
      maxPlayers: insertRaid.maxPlayers || 5,
      objectives: insertRaid.objectives || null,
      requiredItems: insertRaid.requiredItems || null,
      status: insertRaid.status || "planned"
    };
    this.raids.set(id, raid);
    return raid;
  }

  async getGroupRaids(groupId: string): Promise<Raid[]> {
    return Array.from(this.raids.values()).filter(raid => raid.groupId === groupId);
  }

  async updateRaid(id: string, updates: Partial<Raid>): Promise<Raid | undefined> {
    const raid = this.raids.get(id);
    if (!raid) return undefined;
    
    const updatedRaid = { ...raid, ...updates };
    this.raids.set(id, updatedRaid);
    return updatedRaid;
  }

  // Raid Participants
  async createRaidParticipant(insertParticipant: InsertRaidParticipant): Promise<RaidParticipant> {
    const id = randomUUID();
    const participant: RaidParticipant = { 
      ...insertParticipant, 
      id, 
      joinedAt: new Date(),
      status: insertParticipant.status || "pending"
    };
    this.raidParticipants.set(id, participant);
    return participant;
  }

  async getRaidParticipants(raidId: string): Promise<RaidParticipant[]> {
    return Array.from(this.raidParticipants.values()).filter(p => p.raidId === raidId);
  }

  async updateRaidParticipant(id: string, updates: Partial<RaidParticipant>): Promise<RaidParticipant | undefined> {
    const participant = this.raidParticipants.get(id);
    if (!participant) return undefined;
    
    const updatedParticipant = { ...participant, ...updates };
    this.raidParticipants.set(id, updatedParticipant);
    return updatedParticipant;
  }

  // Hideout Modules
  async getHideoutModule(id: string): Promise<HideoutModule | undefined> {
    return this.hideoutModules.get(id);
  }

  async createHideoutModule(insertModule: InsertHideoutModule): Promise<HideoutModule> {
    const module: HideoutModule = { 
      ...insertModule,
      description: insertModule.description || null,
      levels: insertModule.levels || null
    };
    this.hideoutModules.set(module.id, module);
    return module;
  }

  async getAllHideoutModules(): Promise<HideoutModule[]> {
    return Array.from(this.hideoutModules.values());
  }

  // Player Hideout
  async getPlayerHideout(groupMemberId: string): Promise<PlayerHideout[]> {
    return Array.from(this.playerHideout.values()).filter(ph => ph.groupMemberId === groupMemberId);
  }

  async createPlayerHideout(insertPlayerHideout: InsertPlayerHideout): Promise<PlayerHideout> {
    const id = randomUUID();
    const playerHideout: PlayerHideout = { 
      ...insertPlayerHideout, 
      id,
      constructionEndTime: null,
      currentLevel: insertPlayerHideout.currentLevel || 0,
      isConstructing: insertPlayerHideout.isConstructing || false
    };
    this.playerHideout.set(id, playerHideout);
    return playerHideout;
  }

  async updatePlayerHideout(id: string, updates: Partial<PlayerHideout>): Promise<PlayerHideout | undefined> {
    const hideout = this.playerHideout.get(id);
    if (!hideout) return undefined;
    
    const updatedHideout = { ...hideout, ...updates };
    this.playerHideout.set(id, updatedHideout);
    return updatedHideout;
  }
}

export const storage = new MemStorage();
