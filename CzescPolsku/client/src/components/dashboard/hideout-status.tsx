import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PlayerHideout } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface HideoutStatusProps {
  memberId?: string;
}

export function HideoutStatus({ memberId = "current" }: HideoutStatusProps) {
  const { data: hideoutData, isLoading } = useQuery<PlayerHideout[]>({
    queryKey: ['/api/members', memberId, 'hideout'],
    enabled: !!memberId,
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Building className="text-tarkov-green mr-2 h-5 w-5" />
            Postęp Zespołu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
              <div className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock team progress data
  const teamStats = {
    completedQuests: 292,
    totalQuests: 450,
    activeRaids: 3,
    onlineMembers: 2
  };

  const progressPercentage = (teamStats.completedQuests / teamStats.totalQuests) * 100;

  return (
    <Card className="bg-dark-surface border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Building className="text-tarkov-green mr-2 h-5 w-5" />
          Postęp Zespołu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Ukończone questy:</span>
            <span className="font-mono text-status-online font-semibold">
              {teamStats.completedQuests}/{teamStats.totalQuests}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-tarkov-green to-status-online h-3 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
            <div className="text-center">
              <div className="text-xl font-bold text-accent-cyan">{teamStats.activeRaids}</div>
              <div className="text-xs text-text-muted">Aktywne Raid'y</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-status-online">{teamStats.onlineMembers}</div>
              <div className="text-xs text-text-muted">Online</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
