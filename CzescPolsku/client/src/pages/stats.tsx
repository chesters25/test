import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target, Trophy, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GroupMember, PlayerQuest, Raid } from "@shared/schema";

export default function Stats() {
  const { data: members } = useQuery<GroupMember[]>({
    queryKey: ['/api/groups', 'default', 'members'],
  });

  const { data: raids } = useQuery<Raid[]>({
    queryKey: ['/api/groups', 'default', 'raids'],
  });

  // Mock statistics data
  const mockStats = {
    totalRaids: 127,
    successfulRaids: 89,
    totalPlayTime: 342, // hours
    averageRaidTime: 28, // minutes
    questsCompleted: 292,
    questsAvailable: 450,
    favoriteMap: 'Customs',
    bestPlayer: 'MattyDev',
    weeklyProgress: [
      { day: 'Pon', quests: 12, raids: 8 },
      { day: 'Wt', quests: 8, raids: 6 },
      { day: 'Śr', quests: 15, raids: 10 },
      { day: 'Czw', quests: 18, raids: 12 },
      { day: 'Pt', quests: 22, raids: 15 },
      { day: 'Sob', quests: 25, raids: 18 },
      { day: 'Nd', quests: 20, raids: 14 }
    ],
    mapStats: [
      { name: 'Customs', raids: 45, success: 32, winRate: 71 },
      { name: 'Factory', raids: 23, success: 18, winRate: 78 },
      { name: 'Woods', raids: 19, success: 12, winRate: 63 },
      { name: 'Shoreline', raids: 21, success: 13, winRate: 62 },
      { name: 'Interchange', raids: 19, success: 14, winRate: 74 }
    ],
    memberStats: [
      { name: 'MattyDev', level: 42, quests: 127, raids: 89, winRate: 70 },
      { name: 'AkimboKiller', level: 38, quests: 98, raids: 67, winRate: 68 },
      { name: 'SniperNoob', level: 29, quests: 67, raids: 45, winRate: 62 }
    ]
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-status-online';
    if (winRate >= 50) return 'text-status-away';
    return 'text-red-400';
  };

  const getProgressColor = (winRate: number) => {
    if (winRate >= 70) return 'bg-status-online';
    if (winRate >= 50) return 'bg-status-away';
    return 'bg-red-500';
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <Card className="bg-dark-surface border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-tarkov-green rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Statystyki Grupy</CardTitle>
                  <p className="text-text-muted">Szczegółowe statystyki twojej grupy Tarkov</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-status-online text-white">
                Aktualne
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent-cyan rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-dark-bg" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{mockStats.totalRaids}</div>
              <div className="text-sm text-text-muted mb-1">Łączne raid'y</div>
              <div className="text-xs text-status-online">
                {Math.round((mockStats.successfulRaids / mockStats.totalRaids) * 100)}% sukces
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-tarkov-green rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{mockStats.questsCompleted}</div>
              <div className="text-sm text-text-muted mb-1">Ukończone questy</div>
              <div className="text-xs text-status-online">
                z {mockStats.questsAvailable} dostępnych
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-status-away rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{mockStats.totalPlayTime}h</div>
              <div className="text-sm text-text-muted mb-1">Czas gry</div>
              <div className="text-xs text-text-muted">
                Średnio {mockStats.averageRaidTime}min/raid
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{mockStats.favoriteMap}</div>
              <div className="text-sm text-text-muted mb-1">Ulubiona mapa</div>
              <div className="text-xs text-status-online">
                {mockStats.mapStats.find(m => m.name === mockStats.favoriteMap)?.raids} raid'ów
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress Chart */}
        <Card className="bg-dark-surface border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-tarkov-green" />
              Postęp Tygodniowy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {mockStats.weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-text-muted mb-2">{day.day}</div>
                  <div className="space-y-2">
                    <div className="bg-dark-surface-light rounded-lg p-3">
                      <div className="text-lg font-bold text-accent-cyan">{day.quests}</div>
                      <div className="text-xs text-text-muted">Questy</div>
                    </div>
                    <div className="bg-dark-surface-light rounded-lg p-3">
                      <div className="text-lg font-bold text-tarkov-green">{day.raids}</div>
                      <div className="text-xs text-text-muted">Raid'y</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Statistics and Member Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Stats */}
          <Card className="bg-dark-surface border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-tarkov-green" />
                Statystyki Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.mapStats.map((map, index) => (
                  <div key={index} className="bg-dark-surface-light rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-tarkov-forest rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {map.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{map.name}</h4>
                          <p className="text-xs text-text-muted">{map.raids} raid'ów</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getWinRateColor(map.winRate)}`}>
                          {map.winRate}%
                        </div>
                        <div className="text-xs text-text-muted">sukces</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(map.winRate)}`}
                        style={{ width: `${map.winRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-text-muted mt-1">
                      <span>Udane: {map.success}</span>
                      <span>Nieudane: {map.raids - map.success}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Member Performance */}
          <Card className="bg-dark-surface border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5 text-tarkov-green" />
                Wydajność Członków
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.memberStats.map((member, index) => (
                  <div key={index} className="bg-dark-surface-light rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-tarkov-forest rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {member.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{member.name}</h4>
                          <p className="text-xs text-text-muted">Poziom {member.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {index === 0 && (
                          <Badge className="bg-status-away text-white text-xs">MVP</Badge>
                        )}
                        <div className={`text-lg font-bold ${getWinRateColor(member.winRate)}`}>
                          {member.winRate}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center mb-3">
                      <div>
                        <div className="text-lg font-bold text-accent-cyan">{member.quests}</div>
                        <div className="text-xs text-text-muted">Questy</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-tarkov-green">{member.raids}</div>
                        <div className="text-xs text-text-muted">Raid'y</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${getWinRateColor(member.winRate)}`}>
                          {member.winRate}%
                        </div>
                        <div className="text-xs text-text-muted">Sukces</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(member.winRate)}`}
                        style={{ width: `${member.winRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badges */}
        <Card className="bg-dark-surface border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-tarkov-green" />
              Osiągnięcia Grupy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-surface-light rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm font-medium text-white">Weteran Customs</div>
                <div className="text-xs text-text-muted">50+ udanych raid'ów</div>
              </div>
              <div className="bg-dark-surface-light rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium text-white">Szybka Akcja</div>
                <div className="text-xs text-text-muted">Raid &lt;20min</div>
              </div>
              <div className="bg-dark-surface-light rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm font-medium text-white">Quest Master</div>
                <div className="text-xs text-text-muted">100+ questów</div>
              </div>
              <div className="bg-dark-surface-light rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm font-medium text-white">Zespół Marzeń</div>
                <div className="text-xs text-text-muted">5 aktywnych członków</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
