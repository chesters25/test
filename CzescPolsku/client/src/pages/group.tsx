import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, User, Plus, Edit, Trash2, Crown, Shield } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupMember, Group } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function GroupPage() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberLevel, setNewMemberLevel] = useState("1");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups } = useQuery<Group[]>({
    queryKey: ['/api/groups'],
  });

  const { data: members, isLoading } = useQuery<GroupMember[]>({
    queryKey: ['/api/groups', 'default', 'members'],
  });

  const addMemberMutation = useMutation({
    mutationFn: (memberData: { username: string; level: number }) =>
      apiRequest('POST', '/api/groups/default/members', memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups', 'default', 'members'] });
      setIsAddMemberOpen(false);
      setNewMemberName("");
      setNewMemberLevel("1");
      toast({
        title: "Członek dodany",
        description: "Nowy członek został dodany do grupy",
      });
    },
    onError: () => {
      toast({
        title: "Błąd",
        description: "Nie udało się dodać członka do grupy",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      apiRequest('DELETE', `/api/groups/default/members/${memberId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups', 'default', 'members'] });
      toast({
        title: "Członek usunięty",
        description: "Członek został usunięty z grupy",
      });
    },
    onError: () => {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć członka z grupy",
        variant: "destructive",
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ memberId, updates }: { memberId: string; updates: Partial<GroupMember> }) =>
      apiRequest('PUT', `/api/groups/default/members/${memberId}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups', 'default', 'members'] });
      toast({
        title: "Członek zaktualizowany",
        description: "Dane członka zostały zaktualizowane",
      });
    },
  });

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    
    addMemberMutation.mutate({
      username: newMemberName.trim(),
      level: parseInt(newMemberLevel) || 1,
    });
  };

  const toggleMemberOnline = (member: GroupMember) => {
    updateMemberMutation.mutate({
      memberId: member.id,
      updates: { isOnline: !member.isOnline, lastSeen: new Date() },
    });
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "bg-status-online" : "bg-gray-500";
  };

  const getStatusText = (isOnline: boolean) => {
    return isOnline ? "Online" : "Offline";
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Group Header */}
        <Card className="bg-dark-surface border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-tarkov-green rounded-lg flex items-center justify-center">
                  <Users className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Moja Grupa</CardTitle>
                  <p className="text-text-muted">Zarządzaj członkami swojej grupy Tarkov</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-status-online text-white">
                  {members?.filter(m => m.isOnline).length || 0} Online
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-text-muted">
                  {members?.length || 0}/5 Członków
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-dark-surface border-gray-700">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-600 rounded w-full"></div>
                      <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {members?.map((member) => (
                <Card key={member.id} className="bg-dark-surface border-gray-700 hover:border-tarkov-green transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-tarkov-forest rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{getInitials(member.username)}</span>
                          </div>
                          <button
                            onClick={() => toggleMemberOnline(member)}
                            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.isOnline)} rounded-full border-2 border-dark-surface cursor-pointer hover:scale-110 transition-transform`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{member.username}</h3>
                          <p className="text-xs text-text-muted">Poziom {member.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${member.isOnline ? 'bg-status-online' : 'bg-gray-500'} text-white`}
                        >
                          {getStatusText(member.isOnline)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Aktywne questy:</span>
                        <span className="text-accent-cyan font-mono">8/15</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Ukończone:</span>
                        <span className="text-status-online font-mono">127</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Ostatnio widziany:</span>
                        <span className="text-text-muted text-xs">
                          {member.isOnline ? 'Teraz' : new Date(member.lastSeen).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                        <div className="bg-tarkov-green h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                        <div className="flex items-center space-x-1">
                          <Crown className="h-3 w-3 text-status-away" />
                          <span className="text-xs text-text-muted">Lider</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                            <Edit className="h-3 w-3 text-text-muted hover:text-white" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-6 w-6"
                            onClick={() => deleteMemberMutation.mutate(member.id)}
                          >
                            <Trash2 className="h-3 w-3 text-text-muted hover:text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add Member Card */}
              {(!members || members.length < 5) && (
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Card className="bg-dark-surface border-2 border-dashed border-gray-600 hover:border-tarkov-green transition-colors cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                        <div className="w-16 h-16 bg-dark-surface-light rounded-full flex items-center justify-center mb-4">
                          <Plus className="h-8 w-8 text-text-muted" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">Dodaj Gracza</h3>
                        <p className="text-xs text-text-muted mb-4">
                          Maksymalnie 5 graczy w zespole
                        </p>
                        <Button className="bg-tarkov-green text-white hover:bg-tarkov-forest">
                          Dodaj
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-dark-surface border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Dodaj nowego członka</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username" className="text-text-light">Nazwa gracza</Label>
                        <Input
                          id="username"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          placeholder="Wprowadź nazwę gracza"
                          className="bg-dark-surface-light border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="level" className="text-text-light">Poziom</Label>
                        <Input
                          id="level"
                          type="number"
                          min="1"
                          max="79"
                          value={newMemberLevel}
                          onChange={(e) => setNewMemberLevel(e.target.value)}
                          placeholder="1"
                          className="bg-dark-surface-light border-gray-600 text-white"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddMemberOpen(false)}
                          className="border-gray-600 text-text-muted hover:bg-gray-600"
                        >
                          Anuluj
                        </Button>
                        <Button 
                          onClick={handleAddMember}
                          disabled={!newMemberName.trim() || addMemberMutation.isPending}
                          className="bg-tarkov-green text-white hover:bg-tarkov-forest"
                        >
                          {addMemberMutation.isPending ? 'Dodawanie...' : 'Dodaj'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">
                {members?.filter(m => m.isOnline).length || 0}
              </div>
              <div className="text-sm text-text-muted mb-2">Członków online</div>
              <div className="text-xs text-text-muted">
                z {members?.length || 0} członków
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-status-online mb-2">
                {members?.reduce((sum, m) => sum + (m.level || 1), 0) || 0}
              </div>
              <div className="text-sm text-text-muted mb-2">Łączny poziom</div>
              <div className="text-xs text-text-muted">
                Średni: {members?.length ? Math.round((members.reduce((sum, m) => sum + (m.level || 1), 0) / members.length)) : 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-tarkov-green mb-2">
                292
              </div>
              <div className="text-sm text-text-muted mb-2">Ukończone questy</div>
              <div className="text-xs text-text-muted">
                przez całą grupę
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
