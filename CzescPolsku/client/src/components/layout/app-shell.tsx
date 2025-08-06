import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  ListTodo, 
  Calendar, 
  Building, 
  BarChart3,
  User,
  Bell,
  Crosshair
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Questy", href: "/quests", icon: ListTodo },
  { name: "Planowanie Raid'ów", href: "/raids", icon: Calendar },
  { name: "Hideout", href: "/hideout", icon: Building },
  { name: "Zespół", href: "/group", icon: Users },
  { name: "Statystyki", href: "/stats", icon: BarChart3 },
];

export function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex bg-dark-bg text-text-light font-inter">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-dark-surface border-r border-gray-700 z-50">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-tarkov-green rounded-lg flex items-center justify-center">
              <Crosshair className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Squad Planner</h1>
              <p className="text-xs text-text-muted">Escape from Tarkov</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-12",
                    isActive 
                      ? "bg-tarkov-green text-white hover:bg-tarkov-forest" 
                      : "text-text-light hover:bg-dark-surface-light hover:text-white"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                  {item.name === "Questy" && (
                    <span className="ml-auto bg-accent-cyan text-dark-bg text-xs px-2 py-1 rounded-full font-medium">
                      12
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* API Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-dark-surface-light rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-status-online rounded-full"></div>
              <span className="text-sm font-medium">API Status</span>
            </div>
            <p className="text-xs text-text-muted">tarkov.dev: Online</p>
            <p className="text-xs text-text-muted">Ostatnia aktualizacja: 12:34</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-dark-surface border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {navigation.find(nav => nav.href === location)?.name || "Dashboard"}
              </h2>
              <p className="text-text-muted">Zarządzaj swoim zespołem i planuj raid'y</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-text-muted hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-cyan text-dark-bg text-xs rounded-full flex items-center justify-center font-medium">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-tarkov-green rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">MD</span>
                </div>
                <span className="text-sm font-medium">MattyDev</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
