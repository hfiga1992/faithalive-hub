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

// Mock data for ministries
const mockMinistries = [
  {
    id: 1,
    name: "Louvor",
    icon: Music,
    color: "hsl(221, 83%, 53%)", // blue
    leader: "Ana Silva",
    members: 12,
    status: "active",
    description: "Ministério responsável pelo louvor e adoração",
  },
  {
    id: 2,
    name: "KIDS",
    icon: Baby,
    color: "hsl(142, 71%, 45%)", // green
    leader: "Carlos Souza",
    members: 8,
    status: "active",
    description: "Ministério infantil",
  },
  {
    id: 3,
    name: "Financeiro",
    icon: DollarSign,
    color: "hsl(45, 93%, 47%)", // golden
    leader: "Maria Santos",
    members: 5,
    status: "active",
    description: "Gestão financeira da igreja",
  },
  {
    id: 4,
    name: "Diaconato",
    icon: HandHeart,
    color: "hsl(271, 81%, 56%)", // purple
    leader: "João Oliveira",
    members: 15,
    status: "active",
    description: "Serviço e apoio à congregação",
  },
  {
    id: 5,
    name: "Intercessão",
    icon: Sparkles,
    color: "hsl(330, 81%, 60%)", // pink
    leader: "Lucia Costa",
    members: 20,
    status: "active",
    description: "Oração e intercessão",
  },
  {
    id: 6,
    name: "Mídia",
    icon: Camera,
    color: "hsl(24, 95%, 53%)", // orange
    leader: "Pedro Lima",
    members: 6,
    status: "active",
    description: "Produção de conteúdo e mídias sociais",
  },
  {
    id: 7,
    name: "Áudio Visual",
    icon: Monitor,
    color: "hsl(0, 84%, 60%)", // red
    leader: "Rafael Dias",
    members: 7,
    status: "active",
    description: "Som, iluminação e projeção",
  },
  {
    id: 8,
    name: "Cronograma",
    icon: Calendar,
    color: "hsl(217, 91%, 35%)", // dark blue
    leader: "Beatriz Rocha",
    members: 4,
    status: "active",
    description: "Organização de escalas e eventos",
  },
  {
    id: 9,
    name: "Cantina",
    icon: UtensilsCrossed,
    color: "hsl(30, 67%, 40%)", // brown
    leader: null,
    members: 0,
    status: "inactive",
    description: "Serviço de alimentação",
  },
];

// Mock members data
const mockMembers = [
  { id: 1, name: "Ana Silva", role: "Líder", avatar: "" },
  { id: 2, name: "João Pedro", role: "Vocal", avatar: "" },
  { id: 3, name: "Maria Clara", role: "Tecladista", avatar: "" },
  { id: 4, name: "Lucas Souza", role: "Guitarrista", avatar: "" },
];

const Ministries = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState<typeof mockMinistries[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const filteredMinistries = mockMinistries.filter((ministry) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && ministry.status === "active") ||
      (filter === "inactive" && ministry.status === "inactive");
    const matchesSearch = ministry.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (ministry: typeof mockMinistries[0]) => {
    setSelectedMinistry(ministry);
    setDetailsOpen(true);
  };

  const handleEdit = (ministry: typeof mockMinistries[0]) => {
    setSelectedMinistry(ministry);
    setEditOpen(true);
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
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo Ministério
          </Button>
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
          {filteredMinistries.map((ministry) => {
            const Icon = ministry.icon;
            return (
              <Card
                key={ministry.id}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
              >
                {/* Colored top bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: ministry.color }}
                />

                <CardHeader className="text-center pb-4">
                  {/* Icon */}
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${ministry.color}20` }}
                  >
                    <Icon className="h-8 w-8" style={{ color: ministry.color }} />
                  </div>

                  <CardTitle className="text-xl">{ministry.name}</CardTitle>
                  {ministry.leader ? (
                    <CardDescription>Líder: {ministry.leader}</CardDescription>
                  ) : (
                    <CardDescription className="text-destructive">Sem líder definido</CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{ministry.members} membros</span>
                    </div>
                    <Badge variant={ministry.status === "active" ? "default" : "secondary"}>
                      {ministry.status === "active" ? "Ativo" : "Inativo"}
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
          })}
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
                      style={{ backgroundColor: `${selectedMinistry.color}20` }}
                    >
                      <selectedMinistry.icon className="h-6 w-6" style={{ color: selectedMinistry.color }} />
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
                          {selectedMinistry.leader || "Não definido"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Total de Membros</Label>
                        <p className="text-lg font-medium">{selectedMinistry.members}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Badge variant={selectedMinistry.status === "active" ? "default" : "secondary"}>
                          {selectedMinistry.status === "active" ? "Ativo" : "Inativo"}
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Ministério</Label>
                    <Input id="name" defaultValue={selectedMinistry.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" defaultValue={selectedMinistry.description} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leader">Líder</Label>
                    <Input id="leader" defaultValue={selectedMinistry.leader || ""} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Cor do Tema</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        type="color"
                        defaultValue={selectedMinistry.color}
                        className="w-20 h-10"
                      />
                      <Input defaultValue={selectedMinistry.color} className="flex-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status Ativo</Label>
                    <Switch id="status" defaultChecked={selectedMinistry.status === "active"} />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1" onClick={() => setEditOpen(false)}>
                      Salvar Alterações
                    </Button>
                  </div>
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
