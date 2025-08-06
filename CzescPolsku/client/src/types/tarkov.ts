export interface TarkovPlayer {
  id: string;
  username: string;
  level: number;
  groupId?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface TarkovGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface TarkovQuest {
  id: string;
  name: string;
  description?: string;
  trader: string;
  map?: string;
  objectives?: QuestObjective[];
  requirements?: QuestRequirement[];
  rewards?: QuestReward[];
  wikiLink?: string;
}

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

export interface PlayerQuest {
  id: string;
  playerId: string;
  questId: string;
  status: 'available' | 'active' | 'complete' | 'failed';
  progress?: QuestProgress[];
  completedAt?: Date | null;
  quest?: TarkovQuest;
  player?: TarkovPlayer;
}

export interface QuestProgress {
  objectiveId: string;
  current: number;
  required: number;
  complete: boolean;
}

export interface TarkovRaid {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  map: string;
  scheduledFor: Date;
  duration: number;
  maxPlayers: number;
  objectives?: string[];
  requiredItems?: RequiredItem[];
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  createdBy?: string;
}

export interface RequiredItem {
  name: string;
  count: number;
  foundInRaid?: boolean;
}

export interface RaidParticipant {
  id: string;
  raidId: string;
  playerId: string;
  status: 'pending' | 'confirmed' | 'declined';
  joinedAt: Date;
  player?: TarkovPlayer;
}

export interface HideoutModule {
  id: string;
  name: string;
  description?: string;
  levels?: HideoutLevel[];
}

export interface HideoutLevel {
  level: number;
  requirements: RequiredItem[];
  constructionTime: number;
  bonuses?: string[];
}

export interface PlayerHideout {
  id: string;
  playerId: string;
  moduleId: string;
  currentLevel: number;
  isConstructing: boolean;
  constructionEndTime?: Date | null;
  module?: HideoutModule;
}

export interface MapSuggestion {
  name: string;
  activeQuests: number;
  difficulty: 'low' | 'medium' | 'high';
  questTypes: string[];
  recommendation: string;
}

// API Types from tarkov.dev
export interface TarkovAPIQuest {
  id: string;
  name: string;
  description?: string;
  trader?: {
    name: string;
  };
  map?: {
    name: string;
  };
  objectives?: TarkovAPIObjective[];
  taskRequirements?: TarkovAPITaskRequirement[];
  finishRewards?: TarkovAPIReward[];
  wikiLink?: string;
}

export interface TarkovAPIObjective {
  id?: string;
  type?: string;
  description?: string;
  count?: number;
  target?: string;
  location?: string;
  foundInRaid?: boolean;
}

export interface TarkovAPITaskRequirement {
  task?: {
    id: string;
    name: string;
  };
  status?: string;
}

export interface TarkovAPIReward {
  experience?: number;
  traderStanding?: {
    trader: {
      name: string;
    };
    standing: number;
  };
  items?: {
    item: {
      name: string;
    };
    count: number;
  }[];
}

export interface TarkovAPIMap {
  id: string;
  name: string;
  normalizedName: string;
  description?: string;
  enemies?: string[];
  raidDuration?: number;
}

export interface TarkovAPIItem {
  id: string;
  name: string;
  shortName?: string;
  description?: string;
  iconLink?: string;
  avg24hPrice?: number;
  basePrice?: number;
  width?: number;
  height?: number;
  types?: string[];
  sellFor?: {
    source: string;
    price: number;
    currency: string;
  }[];
}
