import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, UserPlus, MoreVertical, Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Mock data
  const members = [
    {
      id: 1,
      name: "Ana Carolina Santos",
      email: "ana.santos@email.com",
      phone: "(11) 98765-4321",
      role: "Membro",
      ministry: "Louvor",
      status: "active",
      avatar: "",
    },
    {
      id: 2,
      name: "Carlos Eduardo Lima",
      email: "carlos.lima@email.com",
      phone: "(11) 97654-3210",
      role: "Líder",
      ministry: "Jovens",
      status: "active",
      avatar: "",
    },
    {
      id: 3,
      name: "Mariana Oliveira",
      email: "mariana.oliveira@email.com",
      phone: "(11) 96543-2109",
      role: "Ministro",
      ministry: "Recepção",
      status: "active",
      avatar: "",
    },
    {
      id: 4,
      name: "Pedro Henrique Costa",
      email: "pedro.costa@email.com",
      phone: "(11) 95432-1098",
      role: "Membro",
      ministry: "Multimídia",
      status: "active",
      avatar: "",
    },
    {
      id: 5,
      name: "Juliana Ferreira",
      email: "juliana.ferreira@email.com",
      phone: "(11) 94321-0987",
      role: "Visitante",
      ministry: "-",
      status: "inactive",
      avatar: "",
    },
  ];

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      Pastor: "bg-purple-500/10 text-purple-600",
      Líder: "bg-blue-500/10 text-blue-600",
      Ministro: "bg-cyan-500/10 text-cyan-600",
      Membro: "bg-green-500/10 text-green-600",
      Visitante: "bg-gray-500/10 text-gray-600",
    };

    return (
      <Badge className={roleColors[role] || "bg-gray-500/10 text-gray-600"}>
        {role}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Membros</h1>
            <p className="text-muted-foreground">
              Gerencie todos os membros da sua igreja
            </p>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo membro da igreja
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="contact">Contato</TabsTrigger>
                  <TabsTrigger value="church">Igreja</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input id="firstName" placeholder="João" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input id="lastName" placeholder="Silva" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input id="birthDate" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input id="whatsapp" placeholder="(11) 99999-9999" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" placeholder="Rua, número" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" placeholder="São Paulo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" placeholder="SP" maxLength={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="church" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Perfil</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="member">Membro</SelectItem>
                        <SelectItem value="minister">Ministro</SelectItem>
                        <SelectItem value="leader">Líder</SelectItem>
                        <SelectItem value="pastor">Pastor</SelectItem>
                        <SelectItem value="visitor">Visitante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ministry">Ministério</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ministério" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="louvor">Louvor</SelectItem>
                        <SelectItem value="recepcao">Recepção</SelectItem>
                        <SelectItem value="multimidia">Multimídia</SelectItem>
                        <SelectItem value="jovens">Jovens</SelectItem>
                        <SelectItem value="infantil">Infantil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baptismDate">Data do Batismo</Label>
                    <Input id="baptismDate" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Data de Entrada</Label>
                    <Input id="joinDate" type="date" />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-spiritual hover:opacity-90">
                  Salvar Membro
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar membro..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Role Filter */}
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os perfis" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">Todos os perfis</SelectItem>
                  <SelectItem value="pastor">Pastor</SelectItem>
                  <SelectItem value="leader">Líder</SelectItem>
                  <SelectItem value="minister">Ministro</SelectItem>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="visitor">Visitante</SelectItem>
                </SelectContent>
              </Select>

              {/* Ministry Filter */}
              <Select value={filterMinistry} onValueChange={setFilterMinistry}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os ministérios" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">Todos os ministérios</SelectItem>
                  <SelectItem value="louvor">Louvor</SelectItem>
                  <SelectItem value="recepcao">Recepção</SelectItem>
                  <SelectItem value="multimidia">Multimídia</SelectItem>
                  <SelectItem value="jovens">Jovens</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Membro</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Ministério</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {member.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>
                        <span className="text-sm">{member.ministry}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover z-50">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">1-5</span> de{" "}
            <span className="font-medium">5</span> membros
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Members;
