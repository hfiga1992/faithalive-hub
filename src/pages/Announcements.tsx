import { useState } from "react";
import { Megaphone, Plus, Filter, Pin, AlertCircle, Info, Calendar as CalendarIcon, DollarSign, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useMinistries } from "@/hooks/useMinistries";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryIcons = {
  URGENT: AlertCircle,
  INFO: Info,
  EVENT: CalendarIcon,
  PRAYER: Heart,
  FINANCIAL: DollarSign,
};

const categoryColors = {
  URGENT: "destructive",
  INFO: "default",
  EVENT: "secondary",
  PRAYER: "outline",
  FINANCIAL: "default",
} as const;

const categoryLabels = {
  URGENT: "Urgente",
  INFO: "Informativo",
  EVENT: "Evento",
  PRAYER: "Oração",
  FINANCIAL: "Financeiro",
};

export default function Announcements() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ministryFilter, setMinistryFilter] = useState("all");
  const [newAnnouncementOpen, setNewAnnouncementOpen] = useState(false);

  const { announcements, isLoading, createAnnouncement, isCreating, markAsViewed } = useAnnouncements({
    category: categoryFilter,
    ministry_id: ministryFilter,
  });
  const ministriesQuery = useMinistries();
  const ministries = ministriesQuery.data || [];
  const { hasAnyRole } = useAuth();

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    category: "INFO",
    ministry_id: "",
    target_profiles: [] as string[],
    is_urgent: false,
    is_public: false,
    is_pinned: false,
    expires_at: "",
  });

  const canCreateAnnouncement = hasAnyRole(['PASTOR', 'LEADER']);

  const handleCreateAnnouncement = () => {
    const data: any = {
      title: announcementForm.title,
      content: announcementForm.content,
      category: announcementForm.category,
      is_urgent: announcementForm.is_urgent,
      is_public: announcementForm.is_public,
      is_pinned: announcementForm.is_pinned,
    };

    if (announcementForm.ministry_id) {
      data.ministry_id = announcementForm.ministry_id;
    }

    if (announcementForm.target_profiles.length > 0) {
      data.target_profiles = announcementForm.target_profiles;
    }

    if (announcementForm.expires_at) {
      data.expires_at = new Date(announcementForm.expires_at).toISOString();
    }

    createAnnouncement(data);
    setAnnouncementForm({
      title: "",
      content: "",
      category: "INFO",
      ministry_id: "",
      target_profiles: [],
      is_urgent: false,
      is_public: false,
      is_pinned: false,
      expires_at: "",
    });
    setNewAnnouncementOpen(false);
  };

  const handleAnnouncementClick = (announcementId: string) => {
    markAsViewed(announcementId);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Megaphone className="h-8 w-8" />
              Anúncios
            </h1>
            <p className="text-muted-foreground mt-1">
              Comunicados e avisos da igreja
            </p>
          </div>
          {canCreateAnnouncement && (
            <Dialog open={newAnnouncementOpen} onOpenChange={setNewAnnouncementOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Anúncio
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Anúncio</DialogTitle>
                  <DialogDescription>
                    Publique um comunicado para a igreja
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      placeholder="Título do anúncio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      placeholder="Escreva o conteúdo do anúncio..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria *</Label>
                      <Select
                        value={announcementForm.category}
                        onValueChange={(value) => setAnnouncementForm({ ...announcementForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INFO">Informativo</SelectItem>
                          <SelectItem value="URGENT">Urgente</SelectItem>
                          <SelectItem value="EVENT">Evento</SelectItem>
                          <SelectItem value="PRAYER">Oração</SelectItem>
                          <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ministry">Ministério (opcional)</Label>
                      <Select
                        value={announcementForm.ministry_id}
                        onValueChange={(value) => setAnnouncementForm({ ...announcementForm, ministry_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          {ministries.map((ministry) => (
                            <SelectItem key={ministry.id} value={ministry.id}>
                              {ministry.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Data de Expiração (opcional)</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={announcementForm.expires_at}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, expires_at: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_urgent">Marcar como urgente</Label>
                      <Switch
                        id="is_urgent"
                        checked={announcementForm.is_urgent}
                        onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, is_urgent: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_pinned">Fixar no topo</Label>
                      <Switch
                        id="is_pinned"
                        checked={announcementForm.is_pinned}
                        onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, is_pinned: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_public">Visível para visitantes</Label>
                      <Switch
                        id="is_public"
                        checked={announcementForm.is_public}
                        onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, is_public: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setNewAnnouncementOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateAnnouncement}
                      disabled={!announcementForm.title || !announcementForm.content || isCreating}
                    >
                      {isCreating ? "Publicando..." : "Publicar Anúncio"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                    <SelectItem value="INFO">Informativo</SelectItem>
                    <SelectItem value="EVENT">Evento</SelectItem>
                    <SelectItem value="PRAYER">Oração</SelectItem>
                    <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ministério</Label>
                <Select value={ministryFilter} onValueChange={setMinistryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry.id} value={ministry.id}>
                        {ministry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando anúncios...
            </div>
          ) : announcements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum anúncio disponível no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => {
              const CategoryIcon = categoryIcons[announcement.category as keyof typeof categoryIcons];
              
              return (
                <Card
                  key={announcement.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    announcement.is_urgent ? "border-destructive" : ""
                  }`}
                  onClick={() => handleAnnouncementClick(announcement.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.is_pinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                          <Badge variant={categoryColors[announcement.category as keyof typeof categoryColors]}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {categoryLabels[announcement.category as keyof typeof categoryLabels]}
                          </Badge>
                          {announcement.is_urgent && (
                            <Badge variant="destructive">Urgente</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(announcement.publish_at), "PPP 'às' HH:mm", { locale: ptBR })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">{announcement.content}</p>
                    {announcement.expires_at && (
                      <p className="text-xs text-muted-foreground mt-4">
                        Expira em: {format(new Date(announcement.expires_at), "PPP 'às' HH:mm", { locale: ptBR })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}