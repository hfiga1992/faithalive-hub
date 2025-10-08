import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Music,
  Baby,
  DollarSign,
  HandHeart,
  Sparkles,
  Camera,
  Monitor,
  Calendar,
  UtensilsCrossed,
  Plus,
  Search,
  Users,
  Edit,
  Eye,
  UserPlus,
} from "lucide-react";
import { useMinistries, useCreateMinistry, useUpdateMinistry } from "@/hooks/useMinistries";
import { useAuth } from "@/hooks/useAuth";
import { useMembers } from "@/hooks/useMembers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock members data
const mockMembers = [
  { id: 1, name: "Ana Silva", role: "Líder", avatar: "" },
  { id: 2, name: "João Pedro", role: "Vocal", avatar: "" },
  { id: 3, name: "Maria Clara", role: "Tecladista", avatar: "" },
  { id: 4, name: "Lucas Souza", role: "Guitarrista", avatar: "" },
];

const Ministries = () => {
  const { church } = useAuth();
  const { data: ministries = [], isLoading } = useMinistries();
  const createMinistry = useCreateMinistry();
  const updateMinistry = useUpdateMinistry();
  const { members = [] } = useMembers();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // Novo estado para modal de cadastro
  const [isAddMinistryOpen, setIsAddMinistryOpen] = useState(false);
  const [newMinistry, setNewMinistry] = useState({
    name: "",
    description: "",
    leader: "",
    color: "#0000ff",
    status: true,
  });
  // Estado para dados de edição
  const [editMinistry, setEditMinistry] = useState({
    name: "",
    description: "",
    leader_id: undefined as string | undefined,
    color: "#0000ff",
    status: true,
  });

  const filteredMinistries = ministries.filter((ministry) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && (ministry.is_active ?? true)) ||
      (filter === "inactive" && ministry.is_active === false);
    const matchesSearch = ministry.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (ministry: any) => {
    setSelectedMinistry(ministry);
    setDetailsOpen(true);
  };

  const handleEdit = (ministry: any) => {
    setSelectedMinistry(ministry);
    setEditMinistry({
      name: ministry.name,
      description: ministry.description || "",
      leader_id: ministry.leader_id || undefined,
      color: ministry.color || "#0000ff",
      status: ministry.is_active ?? true,
    });
    setEditOpen(true);
  };

  // Função para atualizar ministério
  const handleUpdateMinistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMinistry?.id) return;
    updateMinistry.mutate({
      id: selectedMinistry.id,
      name: editMinistry.name,
      description: editMinistry.description,
      color: editMinistry.color,
      is_active: editMinistry.status,
      leader_id: editMinistry.leader_id || null,
    });
    setEditOpen(false);
  };

  // Função para adicionar novo ministério
  const handleAddMinistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!church?.id) return;
    createMinistry.mutate({
      name: newMinistry.name,
      description: newMinistry.description,
      color: newMinistry.color,
      is_active: newMinistry.status,
      church_id: church.id,
      leader_id: newMinistry.leader || null,
      icon: null, // pode customizar depois
    });
    setIsAddMinistryOpen(false);
    setNewMinistry({ name: "", description: "", leader: "", color: "#0000ff", status: true });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ministérios</h1>
            <p className="text-muted-foreground">Gerencie os ministérios da sua igreja</p>
          </div>
          <Dialog open={isAddMinistryOpen} onOpenChange={setIsAddMinistryOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Novo Ministério
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Ministério</DialogTitle>
                <DialogDescription>Preencha os dados do novo ministério</DialogDescription>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleAddMinistry}>
                <div className="space-y-2">
                  <Label htmlFor="ministry-name">Nome do Ministério *</Label>
                  <Input
                    id="ministry-name"
                    placeholder="Ex: Louvor, Kids, Mídia..."
                    value={newMinistry.name}
                    onChange={e => setNewMinistry({ ...newMinistry, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ministry-description">Descrição</Label>
                  <Textarea
                    id="ministry-description"
                    placeholder="Descreva o propósito do ministério"
                    value={newMinistry.description}
                    onChange={e => setNewMinistry({ ...newMinistry, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ministry-leader">Líder</Label>
                  <div className="flex gap-2">
                    <Select
                      value={newMinistry.leader || ""}
                      onValueChange={(value) => setNewMinistry({ ...newMinistry, leader: value || "" })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione um líder" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMinistry({ ...newMinistry, leader: "" })}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ministry-color">Cor do Tema</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ministry-color"
                      type="color"
                      value={newMinistry.color}
                      onChange={e => setNewMinistry({ ...newMinistry, color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={newMinistry.color}
                      onChange={e => setNewMinistry({ ...newMinistry, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ministry-status">Status Ativo</Label>
                  <Switch
                    id="ministry-status"
                    checked={newMinistry.status}
                    onCheckedChange={checked => setNewMinistry({ ...newMinistry, status: checked })}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddMinistryOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Salvar Ministério
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar ministério..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  size="sm"
                >
                  Todos
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  onClick={() => setFilter("active")}
                  size="sm"
                >
                  Ativos
                </Button>
                <Button
                  variant={filter === "inactive" ? "default" : "outline"}
                  onClick={() => setFilter("inactive")}
                  size="sm"
                >
                  Inativos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ministries Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando ministérios...</div>
          ) : filteredMinistries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Nenhum ministério encontrado</div>
          ) : (
            filteredMinistries.map((ministry) => {
              const Icon = Music; // Ícone fixo por enquanto
              return (
                <Card
                  key={ministry.id}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                >
                  {/* Colored top bar */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: ministry.color || '#0000ff' }}
                  />
                  <CardHeader className="text-center pb-4">
                    {/* Icon */}
                    <div
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${ministry.color || '#0000ff'}20` }}
                    >
                      <Icon className="h-8 w-8" style={{ color: ministry.color || '#0000ff' }} />
                    </div>
                    <CardTitle className="text-xl">{ministry.name}</CardTitle>
                    {/* Exibir líder se disponível */}
                    <CardDescription>
                      {ministry.leader_id ? 
                        `Líder: ${members.find(m => m.id === ministry.leader_id)?.name || 'Carregando...'}` : 
                        'Sem líder definido'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>- membros</span>
                      </div>
                      <Badge variant={ministry.is_active ? "default" : "secondary"}>
                        {ministry.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewDetails(ministry)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(ministry)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Gerenciar Membros
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Details Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedMinistry && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${selectedMinistry.color || '#0000ff'}20` }}
                    >
                      <Music className="h-6 w-6" style={{ color: selectedMinistry.color || '#0000ff' }} />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">{selectedMinistry.name}</DialogTitle>
                      <DialogDescription>{selectedMinistry.description}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="info" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="members">Membros</TabsTrigger>
                    <TabsTrigger value="schedules">Escalas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-muted-foreground">Líder</Label>
                        <p className="text-lg font-medium">
                          {selectedMinistry.leader_id ? 
                            members.find(m => m.id === selectedMinistry.leader_id)?.name || 'Carregando...' : 
                            "Não definido"
                          }
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Total de Membros</Label>
                        <p className="text-lg font-medium">-</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Badge variant={selectedMinistry.is_active ? "default" : "secondary"}>
                          {selectedMinistry.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Descrição</Label>
                        <p className="text-sm">{selectedMinistry.description}</p>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid gap-4 sm:grid-cols-3 mt-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardDescription>Presença Média</CardDescription>
                          <CardTitle className="text-3xl">85%</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardDescription>Próximas Escalas</CardDescription>
                          <CardTitle className="text-3xl">3</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardDescription>Eventos/Mês</CardDescription>
                          <CardTitle className="text-3xl">8</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="members" className="mt-4">
                    <div className="space-y-4">
                      {mockMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="schedules" className="mt-4">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Domingo - 10:00</CardTitle>
                          <CardDescription>Culto Principal</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">4 membros escalados</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quarta - 19:30</CardTitle>
                          <CardDescription>Culto de Oração</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">3 membros escalados</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            {selectedMinistry && (
              <>
                <DialogHeader>
                  <DialogTitle>Editar Ministério</DialogTitle>
                  <DialogDescription>
                    Atualize as informações do ministério {selectedMinistry.name}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <form onSubmit={handleUpdateMinistry}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome do Ministério</Label>
                        <Input
                          id="name"
                          value={editMinistry.name}
                          onChange={e => setEditMinistry({ ...editMinistry, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={editMinistry.description}
                          onChange={e => setEditMinistry({ ...editMinistry, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leader">Líder</Label>
                        <div className="flex gap-2">
                          <Select
                            value={editMinistry.leader_id || ""}
                            onValueChange={(value) => setEditMinistry({ ...editMinistry, leader_id: value || undefined })}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Selecione um líder" />
                            </SelectTrigger>
                            <SelectContent>
                              {members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditMinistry({ ...editMinistry, leader_id: undefined })}
                          >
                            Limpar
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color">Cor do Tema</Label>
                        <div className="flex gap-2">
                          <Input
                            id="color"
                            type="color"
                            value={editMinistry.color}
                            onChange={e => setEditMinistry({ ...editMinistry, color: e.target.value })}
                            className="w-20 h-10"
                          />
                          <Input
                            value={editMinistry.color}
                            onChange={e => setEditMinistry({ ...editMinistry, color: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="status">Status Ativo</Label>
                        <Switch
                          id="status"
                          checked={editMinistry.status}
                          onCheckedChange={checked => setEditMinistry({ ...editMinistry, status: checked })}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={updateMinistry.isPending}>
                          {updateMinistry.isPending ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Ministries;
