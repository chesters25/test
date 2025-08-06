import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Raid } from "@shared/schema";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function Raids() {
  const { data: raids, isLoading } = useQuery<Raid[]>({
    queryKey: ['/api/groups', 'default', 'raids'],
  });

  const getMapImage = (mapName: string) => {
    switch (mapName.toLowerCase()) {
      case 'customs':
        return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400';
      case 'factory':
        return 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
      case 'woods':
        return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
      case 'shoreline':
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
      case 'interchange':
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
      default:
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-accent-cyan';
      case 'active':
        return 'bg-status-online';
      case 'completed':
        return 'bg-tarkov-green';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Zaplanowany';
      case 'active':
        return 'Aktywny';
      case 'completed':
        return 'Ukończony';
      case 'cancelled':
        return 'Anulowany';
      default:
        return status;
    }
  };

  // Mock raid data
  const mockRaids = [
    {
      id: '1',
      title: 'Customs Quest Run',
      map: 'Customs',
      scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
      maxPlayers: 5,
      duration: 45,
      status: 'planned' as const,
      objectives: ['Eliminate Scavs on Customs', 'Find Bronze Lion', 'Extract via Crossroads'],
      participants: 4
    },
    {
      id: '2',
      title: 'Factory Speed Run',
      map: 'Factory',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      maxPlayers: 5,
      duration: 20,
      status: 'planned' as const,
      objectives: ['Plant item in Factory', 'Survive for 5 minutes'],
      participants: 2
    },
    {
      id: '3',
      title: 'Woods Loot Run',
      map: 'Woods',
      scheduledFor: new Date(Date.now() - 2 * 60 * 60 * 1000),
      maxPlayers: 4,
      duration: 60,
      status: 'completed' as const,
      objectives: ['Collect valuable loot', 'Extract safely'],
      participants: 3
    }
  ];

  const raidsToShow = raids && raids.length > 0 ? raids : mockRaids;

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <Card className="bg-dark-surface border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-white">
                <Calendar className="text-tarkov-green mr-2 h-5 w-5" />
                Planowanie Raid'ów
              </CardTitle>
              <Button className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                <Plus className="mr-2 h-4 w-4" />
                Nowy Raid
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Raids Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-dark-surface border-gray-700">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div>
                          <div className="h-5 bg-gray-600 rounded w-32 mb-2"></div>
                          <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                          <div className="flex space-x-2">
                            <div className="h-5 bg-gray-600 rounded w-16"></div>
                            <div className="h-5 bg-gray-600 rounded w-20"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-gray-600 rounded"></div>
                        <div className="h-8 w-8 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : raidsToShow.length > 0 ? (
            raidsToShow.map((raid: any) => (
              <Card key={raid.id} className="bg-dark-surface border-gray-700 hover:border-tarkov-green transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 bg-cover bg-center rounded-lg border border-gray-600"
                        style={{ backgroundImage: `url(${getMapImage(raid.map)})` }}
                      />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{raid.title}</h4>
                        <p className="text-sm text-text-muted mb-2">
                          {format(new Date(raid.scheduledFor), "HH:mm - dd.MM.yyyy", { locale: pl })}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className="text-xs bg-accent-cyan text-dark-bg font-mono">
                            {raid.objectives?.length || 0} celów
                          </Badge>
                          <Badge 
                            className={`text-xs ${raid.participants >= 3 ? 'bg-tarkov-green' : 'bg-status-away'} text-white`}
                          >
                            {raid.participants || 0}/{raid.maxPlayers} graczy
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(raid.status)} text-white`}>
                            {getStatusText(raid.status)}
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
                  
                  {raid.objectives && raid.objectives.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-text-light mb-2">Cele raidu:</p>
                      <div className="flex flex-wrap gap-2">
                        {raid.objectives.map((objective: string, index: number) => (
                          <span 
                            key={index}
                            className="text-xs bg-dark-surface-light text-text-light px-2 py-1 rounded border border-gray-600"
                          >
                            {objective}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm border-t border-gray-600 pt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-text-muted" />
                        <span className="text-text-muted">{raid.map}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-text-muted" />
                        <span className="text-text-muted">~{raid.duration} min</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {raid.status === 'planned' && (
                        <Button size="sm" className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                          Dołącz
                        </Button>
                      )}
                      {raid.status === 'active' && (
                        <Button size="sm" className="bg-status-online text-white">
                          W trakcie
                        </Button>
                      )}
                      {raid.status === 'completed' && (
                        <Button size="sm" variant="outline" className="border-gray-600 text-text-muted">
                          Zobacz wyniki
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted mb-2">Brak zaplanowanych raid'ów</p>
              <p className="text-sm text-text-muted mb-4">
                Zaplanuj pierwszy raid dla swojej grupy
              </p>
              <Button className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                <Plus className="mr-2 h-4 w-4" />
                Zaplanuj Raid
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent-cyan mb-1">
                {raidsToShow.filter((r: any) => r.status === 'planned').length}
              </div>
              <div className="text-sm text-text-muted">Zaplanowane</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-status-online mb-1">
                {raidsToShow.filter((r: any) => r.status === 'active').length}
              </div>
              <div className="text-sm text-text-muted">Aktywne</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-tarkov-green mb-1">
                {raidsToShow.filter((r: any) => r.status === 'completed').length}
              </div>
              <div className="text-sm text-text-muted">Ukończone</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-text-light mb-1">
                {raidsToShow.reduce((sum: number, r: any) => sum + (r.participants || 0), 0)}
              </div>
              <div className="text-sm text-text-muted">Uczestników</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
