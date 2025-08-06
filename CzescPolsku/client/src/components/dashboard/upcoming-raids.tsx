import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Raid } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface UpcomingRaidsProps {
  groupId?: string;
}

export function UpcomingRaids({ groupId = "default" }: UpcomingRaidsProps) {
  const { data: raids, isLoading } = useQuery<Raid[]>({
    queryKey: ['/api/groups', groupId, 'raids'],
    enabled: !!groupId,
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-surface border-gray-700 lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-white">
              <Calendar className="text-tarkov-green mr-2 h-5 w-5" />
              Zaplanowane Raid'y
            </CardTitle>
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-dark-surface-light rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMapImage = (mapName: string) => {
    switch (mapName.toLowerCase()) {
      case 'customs':
        return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400';
      case 'factory':
        return 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
      case 'woods':
        return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
      default:
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
    }
  };

  // Mock raid data since we don't have actual raids yet
  const mockRaids = [
    {
      id: '1',
      title: 'Customs Quest Run',
      map: 'Customs',
      scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      maxPlayers: 5,
      duration: 45,
      objectives: ['Eliminate Scavs on Customs', 'Find Bronze Lion', 'Extract via Crossroads'],
      participants: 4
    },
    {
      id: '2',
      title: 'Factory Speed Run',
      map: 'Factory',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      maxPlayers: 5,
      duration: 20,
      objectives: ['Plant item in Factory', 'Survive for 5 minutes'],
      participants: 2
    }
  ];

  const raidsToShow = raids && raids.length > 0 ? raids : mockRaids;

  return (
    <Card className="bg-dark-surface border-gray-700 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <Calendar className="text-tarkov-green mr-2 h-5 w-5" />
            Zaplanowane Raid'y
          </CardTitle>
          <Button className="bg-tarkov-green text-white hover:bg-tarkov-forest flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Nowy Raid</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {raidsToShow.length > 0 ? (
          <div className="space-y-4">
            {raidsToShow.map((raid: any) => (
              <div
                key={raid.id}
                className="bg-dark-surface-light rounded-lg p-4 border border-gray-600 border-l-4 border-l-tarkov-green"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 bg-cover bg-center rounded-lg border border-gray-600"
                      style={{ backgroundImage: `url(${getMapImage(raid.map)})` }}
                    />
                    <div>
                      <h4 className="font-semibold text-white">{raid.title || `${raid.map} Raid`}</h4>
                      <p className="text-sm text-text-muted">
                        {format(new Date(raid.scheduledFor), "HH:mm - dd.MM", { locale: pl })}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="text-xs bg-accent-cyan text-dark-bg font-mono">
                          {raid.objectives?.length || 0} questy
                        </Badge>
                        <Badge className={`text-xs ${raid.participants >= 3 ? 'bg-tarkov-green' : 'bg-status-away'} text-white`}>
                          {raid.participants || 0}/{raid.maxPlayers} graczy
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-2 text-text-muted hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 text-text-muted hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {raid.objectives?.map((objective: string, index: number) => (
                    <span 
                      key={index}
                      className="text-xs bg-dark-surface text-text-light px-2 py-1 rounded border border-gray-600"
                    >
                      {objective}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">{raid.map}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">
                      {raid.participants || 0}/{raid.maxPlayers} graczy
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">~{raid.duration} min</span>
                  </div>
                  <div className="ml-auto">
                    <Button size="sm" className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                      Dołącz
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">Brak zaplanowanych raidów</p>
            <p className="text-sm text-text-muted mt-1">
              Zaplanuj pierwszy raid dla swojej grupy
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
