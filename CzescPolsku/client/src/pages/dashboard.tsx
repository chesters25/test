import { AppShell } from "@/components/layout/app-shell";
import { GroupOverview } from "@/components/dashboard/group-overview";
import { QuestProgress } from "@/components/dashboard/quest-progress";
import { UpcomingRaids } from "@/components/dashboard/upcoming-raids";
import { HideoutStatus } from "@/components/dashboard/hideout-status";
import { RecentActivity } from "@/components/dashboard/map-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Calendar, Download, FolderSync } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleSyncQuests = () => {
    syncQuestsMutation.mutate();
  };

  const handlePlanRaid = () => {
    console.log("Plan Raid clicked");
    toast({
      title: "Planowanie Raid",
      description: "Funkcja w budowie - przekierowanie do strony planowania",
    });
    // Tutaj można dodać nawigację do strony raids
    // window.location.href = '/raids';
  };

  const handleExport = () => {
    console.log("Export clicked");
    toast({
      title: "Eksport danych",
      description: "Funkcja w budowie - eksport statystyk i questów",
    });
    // Tutaj można dodać logikę eksportu danych
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Squad Status Cards */}
        <GroupOverview />

        {/* Active Raid Planning & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UpcomingRaids />
          
          <div className="space-y-6">
            <HideoutStatus />
            <RecentActivity />
          </div>
        </div>

        {/* Active Quests Overview */}
        <QuestProgress />

        {/* Quick Action Bar */}
        <Card className="bg-dark-surface border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-white">Szybkie Akcje</h3>
                <div className="h-6 w-px bg-gray-600"></div>
                <span className="text-sm text-text-muted">Ostatnia synchronizacja: 5 min temu</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  className="bg-tarkov-green text-white hover:bg-tarkov-forest flex items-center space-x-2"
                  onClick={handleSyncQuests}
                  disabled={syncQuestsMutation.isPending}
                >
                  <RefreshCw className={`h-4 w-4 ${syncQuestsMutation.isPending ? 'animate-spin' : ''}`} />
                  <span>Synchronizuj z API</span>
                </Button>
                <Button 
                  className="bg-accent-cyan text-dark-bg hover:bg-blue-400 flex items-center space-x-2"
                  onClick={handlePlanRaid}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Zaplanuj Raid</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="text-white border-gray-600 hover:bg-gray-600 flex items-center space-x-2"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  <span>Eksportuj</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}