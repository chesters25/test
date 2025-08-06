import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListTodo, Search, Filter, FolderSync, User, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Quest } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Quests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [traderFilter, setTraderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quests, isLoading } = useQuery<Quest[]>({
    queryKey: ['/api/quests'],
  });

  const syncQuestsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/sync/quests'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quests'] });
      toast({
        title: "Synchronizacja zakończona",
        description: "Questy zostały zsynchronizowane z tarkov.dev API",
      });
    },
    onError: () => {
      toast({
        title: "Błąd synchronizacji",
        description: "Nie udało się zsynchronizować questów",
        variant: "destructive",
      });
    },
  });

  const filteredQuests = quests?.filter(quest => {
    const matchesSearch = quest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrader = traderFilter === "all" || quest.trader.toLowerCase() === traderFilter.toLowerCase();
    return matchesSearch && matchesTrader;
  }) || [];

  const getTraderColor = (trader: string) => {
    switch (trader.toLowerCase()) {
      case 'prapor':
        return 'bg-tarkov-green';
      case 'therapist':
        return 'bg-blue-600';
      case 'fence':
        return 'bg-gray-600';
      case 'skier':
        return 'bg-purple-600';
      case 'peacekeeper':
        return 'bg-cyan-600';
      case 'mechanic':
        return 'bg-orange-600';
      case 'ragman':
        return 'bg-yellow-600';
      case 'jaeger':
        return 'bg-green-700';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header with Search and Filters */}
        <Card className="bg-dark-surface border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-white">
                <ListTodo className="text-tarkov-green mr-2 h-5 w-5" />
                Wszystkie Questy
              </CardTitle>
              <Button 
                className="bg-tarkov-green text-white hover:bg-tarkov-forest"
                onClick={() => syncQuestsMutation.mutate()}
                disabled={syncQuestsMutation.isPending}
              >
                <FolderSync className={`mr-2 h-4 w-4 ${syncQuestsMutation.isPending ? 'animate-spin' : ''}`} />
                Synchronizuj z API
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                <Input
                  placeholder="Szukaj questów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-dark-surface-light border-gray-600 text-white"
                />
              </div>
              <Select value={traderFilter} onValueChange={setTraderFilter}>
                <SelectTrigger className="w-48 bg-dark-surface-light border-gray-600 text-white">
                  <SelectValue placeholder="Filtruj po trader" />
                </SelectTrigger>
                <SelectContent className="bg-dark-surface-light border-gray-600">
                  <SelectItem value="all">Wszyscy traderzy</SelectItem>
                  <SelectItem value="prapor">Prapor</SelectItem>
                  <SelectItem value="therapist">Therapist</SelectItem>
                  <SelectItem value="fence">Fence</SelectItem>
                  <SelectItem value="skier">Skier</SelectItem>
                  <SelectItem value="peacekeeper">Peacekeeper</SelectItem>
                  <SelectItem value="mechanic">Mechanic</SelectItem>
                  <SelectItem value="ragman">Ragman</SelectItem>
                  <SelectItem value="jaeger">Jaeger</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-dark-surface-light border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-dark-surface-light border-gray-600">
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="available">Dostępne</SelectItem>
                  <SelectItem value="active">Aktywne</SelectItem>
                  <SelectItem value="complete">Ukończone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-dark-surface border-gray-700">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-gray-600 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-600 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-5 bg-gray-600 rounded w-16"></div>
                    </div>
                    <div className="h-12 bg-gray-600 rounded mb-4"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
              <Card key={quest.id} className="bg-dark-surface border-gray-700 hover:border-tarkov-green transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${getTraderColor(quest.trader)} rounded-lg flex items-center justify-center`}>
                        <User className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{quest.name}</h4>
                        <p className="text-xs text-text-muted">{quest.trader}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-gray-600 text-white">
                      Dostępny
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-text-muted mb-3 line-clamp-3">
                    {quest.description || 'Brak opisu'}
                  </p>
                  
                  {quest.map && (
                    <div className="flex items-center space-x-2 text-xs text-text-muted mb-3">
                      <MapPin className="h-3 w-3" />
                      <span>{quest.map}</span>
                    </div>
                  )}

                  {quest.objectives && quest.objectives.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-medium text-text-light">Cele:</p>
                      {quest.objectives.slice(0, 2).map((objective, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs">
                          <Checkbox className="mt-0.5 border-gray-600 data-[state=checked]:bg-tarkov-green data-[state=checked]:border-tarkov-green" />
                          <span className="text-text-muted">
                            {objective.description}
                          </span>
                        </div>
                      ))}
                      {quest.objectives.length > 2 && (
                        <p className="text-xs text-text-muted">
                          +{quest.objectives.length - 2} więcej celów...
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {quest.requirements && quest.requirements.length > 0 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-text-muted">
                          {quest.requirements.length} wymagań
                        </Badge>
                      )}
                      {quest.rewards && quest.rewards.length > 0 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-text-muted">
                          {quest.rewards.length} nagród
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                      Rozpocznij
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <ListTodo className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted mb-2">
                {searchTerm || traderFilter ? 'Brak questów spełniających kryteria' : 'Brak dostępnych questów'}
              </p>
              <p className="text-sm text-text-muted">
                {!quests?.length && 'Zsynchronizuj questy z API tarkov.dev'}
              </p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <Card className="bg-dark-surface border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Wyświetlane: {filteredQuests.length} z {quests?.length || 0} questów
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-text-muted">
                  Ostatnia synchronizacja: {syncQuestsMutation.isSuccess ? 'Teraz' : '5 min temu'}
                </span>
                <Badge variant="secondary" className="bg-status-online text-white">
                  API Online
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
