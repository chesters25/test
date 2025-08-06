import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, User, MapPin, Scroll } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PlayerQuest } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestProgressProps {
  groupId?: string;
}

export function QuestProgress({ groupId = "default" }: QuestProgressProps) {
  const { data: activeQuests, isLoading } = useQuery<PlayerQuest[]>({
    queryKey: ['/api/groups', groupId, 'player-quests'],
    enabled: !!groupId,
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-surface border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-white">
              <ListTodo className="text-tarkov-green mr-2 h-5 w-5" />
              Aktywne Questy Zespołu
            </CardTitle>
            <Skeleton className="h-8 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-surface-light rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-12 w-full mb-4" />
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-status-away';
      case 'low':
        return 'bg-tarkov-green';
      default:
        return 'bg-gray-500';
    }
  };

  const getTraderIcon = (trader: string) => {
    switch (trader.toLowerCase()) {
      case 'prapor':
        return 'bg-tarkov-green';
      case 'therapist':
        return 'bg-blue-600';
      case 'fence':
        return 'bg-gray-600';
      case 'skier':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  // Mock quest data since we don't have active quests yet
  const mockQuests = [
    {
      id: '1',
      name: 'Debut',
      trader: 'Prapor',
      priority: 'high',
      description: 'Znajdź i przekaż 2x MP-133 shotgun znalezione w raidzie',
      objectives: [
        { id: '1', completed: false, description: 'Znajdź MP-133 shotgun (0/2)' }
      ],
      assignedMembers: ['M', 'A']
    },
    {
      id: '2',
      name: 'Sanitary Standards',
      trader: 'Therapist',
      priority: 'medium',
      description: 'Znajdź i dostarcz czystą wodę i apteczki pierwszej pomocy',
      objectives: [
        { id: '1', completed: true, description: 'Znajdź Aquamari water (3/3)' },
        { id: '2', completed: false, description: 'Znajdź AI-2 medikit (1/5)' }
      ],
      assignedMembers: ['S']
    },
    {
      id: '3',
      name: 'The Punisher - Part 1',
      trader: 'Prapor',
      priority: 'high',
      description: 'Eliminuj Scav\'ów na mapie Shoreline używając broni AKM',
      objectives: [
        { id: '1', completed: false, description: 'Eliminuj Scav\'ów na Shoreline (8/15)' }
      ],
      assignedMembers: ['M', 'A', 'S']
    }
  ];

  const questsToShow = activeQuests && activeQuests.length > 0 ? activeQuests : mockQuests;

  return (
    <Card className="bg-dark-surface border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <ListTodo className="text-tarkov-green mr-2 h-5 w-5" />
            Aktywne Questy Zespołu
          </CardTitle>
          <div className="flex items-center space-x-4">
            <select className="bg-dark-surface-light border border-gray-600 rounded-lg px-3 py-2 text-sm text-white">
              <option value="">Wszyscy traderzy</option>
              <option value="prapor">Prapor</option>
              <option value="therapist">Therapist</option>
              <option value="fence">Fence</option>
              <option value="skier">Skier</option>
              <option value="peacekeeper">Peacekeeper</option>
              <option value="mechanic">Mechanic</option>
              <option value="ragman">Ragman</option>
              <option value="jaeger">Jaeger</option>
            </select>
            <Button className="bg-tarkov-green text-white hover:bg-tarkov-forest">
              Synchronizuj z API
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {questsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questsToShow.map((quest: any) => (
              <div
                key={quest.id}
                className="bg-dark-surface-light rounded-lg p-4 border border-gray-600 hover:border-tarkov-green transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getTraderIcon(quest.trader)} rounded-lg flex items-center justify-center`}>
                      <Scroll className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{quest.name}</h4>
                      <p className="text-xs text-text-muted">{quest.trader}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getPriorityColor(quest.priority)} text-white`}>
                    {quest.priority === 'high' ? 'Wysoki' : 
                     quest.priority === 'medium' ? 'Średni' : 'Niski'}
                  </Badge>
                </div>
                
                <p className="text-sm text-text-muted mb-3">
                  {quest.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  {quest.objectives?.map((objective: any) => (
                    <div key={objective.id} className="flex items-center space-x-2 text-sm">
                      <Checkbox 
                        checked={objective.completed}
                        className="border-gray-600 data-[state=checked]:bg-tarkov-green data-[state=checked]:border-tarkov-green" 
                      />
                      <span className={`text-text-light ${objective.completed ? 'line-through' : ''}`}>
                        {objective.description}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Przypisane:</span>
                  <div className="flex -space-x-1">
                    {quest.assignedMembers?.map((member: string, index: number) => (
                      <div 
                        key={index}
                        className="w-6 h-6 bg-tarkov-forest rounded-full flex items-center justify-center text-white border border-dark-surface"
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ListTodo className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">Brak aktywnych questów</p>
            <p className="text-sm text-text-muted mt-1">
              Rozpocznij pierwszy quest, aby zobaczyć postęp
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
