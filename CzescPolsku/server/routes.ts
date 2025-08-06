import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertGroupSchema,
  insertGroupMemberSchema,
  insertQuestSchema,
  insertPlayerQuestSchema,
  insertRaidSchema,
  insertRaidParticipantSchema,
  insertHideoutModuleSchema,
  insertPlayerHideoutSchema,
  type Group,
  type GroupMember,
  type Quest,
  type PlayerQuest,
  type Raid,
  type RaidParticipant,
  type HideoutModule,
  type PlayerHideout
} from "@shared/schema";
import { getTarkovQuests, getTarkovMaps, getTarkovItems } from "../client/src/lib/tarkov-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Groups
  app.get("/api/groups", async (req, res) => {
    try {
      // For demo, return all groups - in real app would filter by user
      const groups = Array.from((storage as any).groups.values());
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  });

  app.get("/api/groups/:id", async (req, res) => {
    try {
      const group = await storage.getGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch group" });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const validatedData = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(validatedData);
      res.json(group);
    } catch (error) {
      res.status(400).json({ error: "Invalid group data" });
    }
  });

  // Group Members
  app.get("/api/groups/:groupId/members", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.groupId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch group members" });
    }
  });

  app.post("/api/groups/:groupId/members", async (req, res) => {
    try {
      const validatedData = insertGroupMemberSchema.parse({
        ...req.body,
        groupId: req.params.groupId
      });
      const member = await storage.createGroupMember(validatedData);
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid member data" });
    }
  });

  app.put("/api/groups/:groupId/members/:memberId", async (req, res) => {
    try {
      const member = await storage.updateGroupMember(req.params.memberId, req.body);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to update member" });
    }
  });

  app.delete("/api/groups/:groupId/members/:memberId", async (req, res) => {
    try {
      await storage.deleteGroupMember(req.params.memberId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // Quests
  app.get("/api/quests", async (req, res) => {
    try {
      const quests = await storage.getAllQuests();
      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quests" });
    }
  });

  app.post("/api/quests", async (req, res) => {
    try {
      const validatedData = insertQuestSchema.parse(req.body);
      const quest = await storage.createQuest(validatedData);
      res.json(quest);
    } catch (error) {
      res.status(400).json({ error: "Invalid quest data" });
    }
  });

  // Player Quests
  app.get("/api/groups/:groupId/player-quests", async (req, res) => {
    try {
      const activeQuests = await storage.getActiveGroupQuests(req.params.groupId);
      res.json(activeQuests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player quests" });
    }
  });

  app.post("/api/members/:memberId/quests", async (req, res) => {
    try {
      const validatedData = insertPlayerQuestSchema.parse({
        ...req.body,
        groupMemberId: req.params.memberId
      });
      const playerQuest = await storage.createPlayerQuest(validatedData);
      res.json(playerQuest);
    } catch (error) {
      res.status(400).json({ error: "Invalid player quest data" });
    }
  });

  app.put("/api/player-quests/:questId", async (req, res) => {
    try {
      const playerQuest = await storage.updatePlayerQuest(req.params.questId, req.body);
      if (!playerQuest) {
        return res.status(404).json({ error: "Player quest not found" });
      }
      res.json(playerQuest);
    } catch (error) {
      res.status(500).json({ error: "Failed to update player quest" });
    }
  });

  // Raids
  app.get("/api/groups/:groupId/raids", async (req, res) => {
    try {
      const raids = await storage.getGroupRaids(req.params.groupId);
      res.json(raids);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch raids" });
    }
  });

  app.post("/api/groups/:groupId/raids", async (req, res) => {
    try {
      const validatedData = insertRaidSchema.parse({
        ...req.body,
        groupId: req.params.groupId
      });
      const raid = await storage.createRaid(validatedData);
      res.json(raid);
    } catch (error) {
      res.status(400).json({ error: "Invalid raid data" });
    }
  });

  app.put("/api/raids/:raidId", async (req, res) => {
    try {
      const raid = await storage.updateRaid(req.params.raidId, req.body);
      if (!raid) {
        return res.status(404).json({ error: "Raid not found" });
      }
      res.json(raid);
    } catch (error) {
      res.status(500).json({ error: "Failed to update raid" });
    }
  });

  // Raid Participants
  app.get("/api/raids/:raidId/participants", async (req, res) => {
    try {
      const participants = await storage.getRaidParticipants(req.params.raidId);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  app.post("/api/raids/:raidId/participants", async (req, res) => {
    try {
      const validatedData = insertRaidParticipantSchema.parse({
        ...req.body,
        raidId: req.params.raidId
      });
      const participant = await storage.createRaidParticipant(validatedData);
      res.json(participant);
    } catch (error) {
      res.status(400).json({ error: "Invalid participant data" });
    }
  });

  // Hideout Modules
  app.get("/api/hideout/modules", async (req, res) => {
    try {
      const modules = await storage.getAllHideoutModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hideout modules" });
    }
  });

  app.post("/api/hideout/modules", async (req, res) => {
    try {
      const validatedData = insertHideoutModuleSchema.parse(req.body);
      const module = await storage.createHideoutModule(validatedData);
      res.json(module);
    } catch (error) {
      res.status(400).json({ error: "Invalid module data" });
    }
  });

  // Player Hideout
  app.get("/api/members/:memberId/hideout", async (req, res) => {
    try {
      const hideout = await storage.getPlayerHideout(req.params.memberId);
      res.json(hideout);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player hideout" });
    }
  });

  app.post("/api/members/:memberId/hideout", async (req, res) => {
    try {
      const validatedData = insertPlayerHideoutSchema.parse({
        ...req.body,
        groupMemberId: req.params.memberId
      });
      const hideout = await storage.createPlayerHideout(validatedData);
      res.json(hideout);
    } catch (error) {
      res.status(400).json({ error: "Invalid hideout data" });
    }
  });

  // Tarkov API Integration
  app.get("/api/tarkov/quests", async (req, res) => {
    try {
      const quests = await getTarkovQuests();
      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Tarkov quests from API" });
    }
  });

  app.get("/api/tarkov/maps", async (req, res) => {
    try {
      const maps = await getTarkovMaps();
      res.json(maps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Tarkov maps from API" });
    }
  });

  app.get("/api/tarkov/items", async (req, res) => {
    try {
      const name = req.query.name as string | undefined;
      const items = await getTarkovItems(name);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Tarkov items from API" });
    }
  });

  // Sync quests from Tarkov API to local storage
  app.post("/api/sync/quests", async (req, res) => {
    try {
      const tarkovQuests = await getTarkovQuests();
      const syncedQuests = [];
      
      for (const tarkovQuest of tarkovQuests) {
        const quest: Quest = {
          id: tarkovQuest.id,
          name: tarkovQuest.name,
          description: '', // Pole nie istnieje w API
          trader: tarkovQuest.trader?.name || 'Unknown',
          map: null, // Pole nie pobrane w query
          objectives: [], // Pole nie pobrane w query
          requirements: tarkovQuest.taskRequirements?.map(req => ({
            type: 'task',
            target: req.task?.id || '',
            compareMethod: 'equals',
            value: 1
          })) || [],
          rewards: [], // finishRewards nie pobrane w query
          wikiLink: tarkovQuest.wikiLink || null
        };
        
        const existingQuest = await storage.getQuest(quest.id);
        if (!existingQuest) {
          await storage.createQuest(quest);
          syncedQuests.push(quest);
        }
      }
      
      res.json({ 
        message: `Synced ${syncedQuests.length} new quests`,
        syncedQuests: syncedQuests.length
      });
    } catch (error) {
      console.error('Sync error:', error);
      res.status(500).json({ error: "Failed to sync quests from Tarkov API" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}