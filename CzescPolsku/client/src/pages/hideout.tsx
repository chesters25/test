import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building, Wrench, Clock, ArrowUp, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PlayerHideout, HideoutModule } from "@shared/schema";

export default function Hideout() {
  const { data: hideoutData, isLoading } = useQuery<PlayerHideout[]>({
    queryKey: ['/api/members', 'current', 'hideout'],
  });

  const { data: modules } = useQuery<HideoutModule[]>({
    queryKey: ['/api/hideout/modules'],
  });

  // Mock hideout modules data based on real Tarkov hideout
  const mockHideoutModules = [
    {
      id: 'generator',
      name: 'Generator',
      currentLevel: 2,
      maxLevel: 3,
      isConstructing: false,
      requirements: [
        { name: 'Metal spare parts', current: 5, required: 8, foundInRaid: false },
        { name: 'Bolts', current: 12, required: 15, foundInRaid: false }
      ],
      bonuses: ['Zapewnia energię dla innych modułów', 'Zwiększa wydajność produkcji'],
      constructionTime: 3600000, // 1 hour in ms
      fuel: 85
    },
    {
      id: 'security',
      name: 'Security',
      currentLevel: 1,
      maxLevel: 3,
      isConstructing: false,
      requirements: [
        { name: 'Screw nuts', current: 2, required: 6, foundInRaid: false },
        { name: 'Bolts', current: 4, required: 10, foundInRaid: false }
      ],
      bonuses: ['Zwiększa bezpieczeństwo hideoutu', 'Zmniejsza ryzyko raidów scavów']
    },
    {
      id: 'workbench',
      name: 'Workbench',
      currentLevel: 2,
      maxLevel: 3,
      isConstructing: true,
      requirements: [
        { name: 'Metal cutting scissors', current: 1, required: 1, foundInRaid: true },
        { name: 'Toolset', current: 0, required: 2, foundInRaid: false }
      ],
      bonuses: ['Umożliwia tworzenie broni i modyfikacji', 'Dostęp do zaawansowanych receptur'],
      constructionTime: 7200000, // 2 hours
      constructionEndTime: Date.now() + 1800000 // 30 minutes left
    },
    {
      id: 'medstation',
      name: 'Medstation',
      currentLevel: 1,
      maxLevel: 3,
      isConstructing: false,
      requirements: [
        { name: 'Morphine injector', current: 0, required: 2, foundInRaid: true },
        { name: 'Pile of meds', current: 1, required: 3, foundInRaid: false }
      ],
      bonuses: ['Produkcja apteczek i leków', 'Regeneracja zdrowia poza raidem']
    },
    {
      id: 'nutrition-unit',
      name: 'Nutrition Unit',
      currentLevel: 0,
      maxLevel: 3,
      isConstructing: false,
      requirements: [
        { name: 'Dry fuel', current: 0, required: 1, foundInRaid: false },
        { name: 'Metal fuel tank', current: 0, required: 1, foundInRaid: false }
      ],
      bonuses: ['Produkcja jedzenia i wody', 'Zwiększa energię i hydratację']
    },
    {
      id: 'rest-space',
      name: 'Rest Space',
      currentLevel: 1,
      maxLevel: 3,
      isConstructing: false,
      requirements: [
        { name: 'Wooden clock', current: 1, required: 1, foundInRaid: true },
        { name: 'Flat screwdriver', current: 0, required: 2, foundInRaid: false }
      ],
      bonuses: ['Regeneracja energii offline', 'Zwiększa maksymalną energię']
    }
  ];

  const getLevelColor = (currentLevel: number, maxLevel: number) => {
    if (currentLevel === 0) return "text-gray-400";
    if (currentLevel === maxLevel) return "text-status-online";
    return "text-accent-cyan";
  };

  const getProgressColor = (currentLevel: number, maxLevel: number) => {
    if (currentLevel === 0) return "bg-gray-600";
    if (currentLevel === maxLevel) return "bg-status-online";
    return "bg-accent-cyan";
  };

  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'generator':
        return '⚡';
      case 'security':
        return '🛡️';
      case 'workbench':
        return '🔧';
      case 'medstation':
        return '🏥';
      case 'nutrition-unit':
        return '🍽️';
      case 'rest-space':
        return '🛏️';
      default:
        return '🏠';
    }
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours}g ${minutes}m`;
  };

  const getRequirementStatus = (current: number, required: number) => {
    if (current >= required) return 'complete';
    if (current > 0) return 'partial';
    return 'missing';
  };

  const getRequirementColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-status-online';
      case 'partial':
        return 'text-status-away';
      case 'missing':
        return 'text-red-400';
      default:
        return 'text-text-muted';
    }
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
                  <Building className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Hideout</CardTitle>
                  <p className="text-text-muted">Zarządzaj i rozbudowuj swój hideout</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-status-online text-white">
                  Generator: 85%
                </Badge>
                <Button className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                  <Wrench className="mr-2 h-4 w-4" />
                  Ulepsz
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Hideout Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockHideoutModules.map((module) => (
            <Card key={module.id} className="bg-dark-surface border-gray-700 hover:border-tarkov-green transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getModuleIcon(module.id)}</div>
                    <div>
                      <h3 className="font-semibold text-white">{module.name}</h3>
                      <p className={`text-sm ${getLevelColor(module.currentLevel, module.maxLevel)}`}>
                        Poziom {module.currentLevel}/{module.maxLevel}
                      </p>
                    </div>
                  </div>
                  {module.isConstructing && (
                    <div className="flex items-center space-x-1 text-accent-cyan">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="text-xs">
                        {formatTime(module.constructionEndTime! - Date.now())}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted">Postęp</span>
                    <span className="text-text-light">
                      {Math.round((module.currentLevel / module.maxLevel) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(module.currentLevel, module.maxLevel)}`}
                      style={{ width: `${(module.currentLevel / module.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-text-light">Wymagania na następny poziom:</p>
                  {module.requirements.map((req, index) => {
                    const status = getRequirementStatus(req.current, req.required);
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {status === 'complete' && <CheckCircle className="h-3 w-3 text-status-online" />}
                          <span className="text-text-muted">{req.name}</span>
                          {req.foundInRaid && (
                            <Badge variant="outline" className="text-xs border-accent-cyan text-accent-cyan">
                              FiR
                            </Badge>
                          )}
                        </div>
                        <span className={getRequirementColor(status)}>
                          {req.current}/{req.required}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bonuses */}
                {module.bonuses && module.bonuses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-text-light mb-2">Bonusy:</p>
                    <div className="space-y-1">
                      {module.bonuses.map((bonus, index) => (
                        <p key={index} className="text-xs text-text-muted">• {bonus}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special indicators */}
                {module.id === 'generator' && module.fuel !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted">Paliwo</span>
                      <span className="text-status-online">{module.fuel}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-status-online h-1 rounded-full"
                        style={{ width: `${module.fuel}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                  {module.isConstructing ? (
                    <Button disabled size="sm" className="bg-gray-600 text-white">
                      Budowanie...
                    </Button>
                  ) : module.currentLevel < module.maxLevel ? (
                    <Button size="sm" className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      Ulepsz
                    </Button>
                  ) : (
                    <Button disabled size="sm" className="bg-status-online text-white">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Maks
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Construction Queue */}
        <Card className="bg-dark-surface border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="mr-2 h-5 w-5 text-tarkov-green" />
              Kolejka Budowy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHideoutModules
                .filter(module => module.isConstructing)
                .map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 bg-dark-surface-light rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{getModuleIcon(module.id)}</div>
                      <div>
                        <h4 className="font-medium text-white">{module.name}</h4>
                        <p className="text-sm text-text-muted">
                          Poziom {module.currentLevel} → {module.currentLevel + 1}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-accent-cyan font-mono">
                        {formatTime(module.constructionEndTime! - Date.now())}
                      </p>
                      <p className="text-xs text-text-muted">pozostało</p>
                    </div>
                  </div>
                ))}
              
              {mockHideoutModules.filter(module => module.isConstructing).length === 0 && (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted">Brak aktywnych budów</p>
                  <p className="text-sm text-text-muted mt-1">
                    Rozpocznij ulepszenie modułu, aby zobaczyć postęp
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-status-online mb-1">
                {mockHideoutModules.filter(m => m.currentLevel > 0).length}
              </div>
              <div className="text-sm text-text-muted">Aktywne moduły</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent-cyan mb-1">
                {mockHideoutModules.filter(m => m.isConstructing).length}
              </div>
              <div className="text-sm text-text-muted">W budowie</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-tarkov-green mb-1">
                {mockHideoutModules.filter(m => m.currentLevel === m.maxLevel).length}
              </div>
              <div className="text-sm text-text-muted">Zmaksymalizowane</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-status-away mb-1">85%</div>
              <div className="text-sm text-text-muted">Paliwo generatora</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
