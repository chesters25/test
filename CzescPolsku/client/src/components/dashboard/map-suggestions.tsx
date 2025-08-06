import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, MapPin, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentActivityProps {
  groupId?: string;
}

export function RecentActivity({ groupId = "default" }: RecentActivityProps) {
  const { data: activity, isLoading } = useQuery({
    queryKey: ['/api/groups', groupId, 'activity'],
    enabled: !!groupId,
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-surface border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Users className="text-tarkov-green mr-2 h-5 w-5" />
            Ostatnia Aktywność
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-2 h-2 rounded-full mt-2" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock recent activity data
  const recentActivity = [
    {
      id: '1',
      description: 'ukończył quest "Debut"',
      user: 'MattyDev',
      highlight: 'Debut',
      timestamp: '2 min temu',
      type: 'quest'
    },
    {
      id: '2',
      description: 'zaplanował raid na',
      user: 'AkimboKiller',
      highlight: 'Interchange',
      timestamp: '15 min temu',
      type: 'raid'
    },
    {
      id: '3',
      description: 'dołączył do zespołu',
      user: 'SniperNoob',
      highlight: null,
      timestamp: '1 godz. temu',
      type: 'join'
    }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'quest':
        return 'bg-status-online';
      case 'raid':
        return 'bg-accent-cyan';
      case 'join':
        return 'bg-status-away';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-dark-surface border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Clock className="text-tarkov-green mr-2 h-5 w-5" />
          Ostatnia Aktywność
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}></div>
              <div className="text-sm">
                <p className="text-text-light">
                  <span className="font-medium text-white">{activity.user}</span>{' '}
                  {activity.description}{' '}
                  {activity.highlight && (
                    <span className="text-accent-cyan">"{activity.highlight}"</span>
                  )}
                </p>
                <p className="text-xs text-text-muted">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
