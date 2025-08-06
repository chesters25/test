import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GroupMember } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupOverviewProps {
  groupId?: string;
}

export function GroupOverview({ groupId = "default" }: GroupOverviewProps) {
  const { data: members, isLoading } = useQuery<GroupMember[]>({
    queryKey: ['/api/groups', groupId, 'members'],
    enabled: !!groupId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-dark-surface border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-6" />
                </div>
                <Skeleton className="h-2 w-full mt-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "bg-status-online" : "bg-gray-500";
  };

  const getStatusText = (isOnline: boolean) => {
    return isOnline ? "Online" : "Offline";
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {members && members.map((member) => (
        <Card key={member.id} className="bg-dark-surface border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-tarkov-forest rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{getInitials(member.username)}</span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.isOnline)} rounded-full border-2 border-dark-surface`}></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{member.username}</h3>
                  <p className="text-xs text-text-muted">Poziom {member.level}</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${member.isOnline ? 'bg-status-online' : 'bg-gray-500'} text-white`}
              >
                {getStatusText(member.isOnline)}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Aktywne questy:</span>
                <span className="text-accent-cyan font-mono">8/15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Ukończone:</span>
                <span className="text-status-online font-mono">127</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div className="bg-tarkov-green h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Add Member Card */}
      {(!members || members.length < 5) && (
        <Card className="bg-dark-surface border-2 border-dashed border-gray-600">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 bg-dark-surface-light rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="font-semibold text-white mb-2">Dodaj Gracza</h3>
            <p className="text-xs text-text-muted mb-4">Maksymalnie 5 graczy w zespole</p>
            <Button className="bg-tarkov-green text-white hover:bg-tarkov-forest">
              Dodaj
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
