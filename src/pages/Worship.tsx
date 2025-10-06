import { useState } from "react";
import { Music, Plus, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSongs } from "@/hooks/useSongs";
import { useWorshipSets } from "@/hooks/useWorshipSets";
import { useEvents } from "@/hooks/useEvents";

export default function Worship() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newSongOpen, setNewSongOpen] = useState(false);
  const [newSetOpen, setNewSetOpen] = useState(false);

  const { songs, isLoading: loadingSongs, createSong, isCreating } = useSongs({ search: searchTerm });
  const { worshipSets, isLoading: loadingSets } = useWorshipSets();
  const { events } = useEvents();

  const [songForm, setSongForm] = useState({
    title: "",
    artist: "",
    original_key: "",
    bpm: "",
    duration_minutes: "",
    lyrics: "",
    chords: "",
  });

  const [setForm, setSetForm] = useState({
    title: "",
    event_id: "",
    notes: "",
  });

  const handleCreateSong = () => {
    createSong({
      title: songForm.title,
      artist: songForm.artist || null,
      original_key: songForm.original_key || null,
      bpm: songForm.bpm ? parseInt(songForm.bpm) : null,
      duration_minutes: songForm.duration_minutes ? parseInt(songForm.duration_minutes) : null,
      lyrics: songForm.lyrics || null,
      chords: songForm.chords || null,
    });
    setSongForm({
      title: "",
      artist: "",
      original_key: "",
      bpm: "",
      duration_minutes: "",
      lyrics: "",
      chords: "",
    });
    setNewSongOpen(false);
  };

  const upcomingEvents = events.filter(e => 
    new Date(e.event_date) > new Date() && 
    e.status === 'SCHEDULED'
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Music className="h-8 w-8" />
              Ministério de Louvor
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie músicas, setlists e escalas de louvor
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Próximos Cultos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Eventos agendados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Biblioteca de Músicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{songs.length}</div>
              <p className="text-xs text-muted-foreground">
                Músicas cadastradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Setlists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{worshipSets.length}</div>
              <p className="text-xs text-muted-foreground">
                Setlists criadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Cultos
              </CardTitle>
              <CardDescription>
                Eventos que precisam de setlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">{event.event_type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Song Library */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Biblioteca de Músicas</CardTitle>
                <CardDescription>
                  Gerencie todas as músicas da igreja
                </CardDescription>
              </div>
              <Dialog open={newSongOpen} onOpenChange={setNewSongOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Música
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Música</DialogTitle>
                    <DialogDescription>
                      Cadastre uma nova música na biblioteca
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          value={songForm.title}
                          onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                          placeholder="Nome da música"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="artist">Artista</Label>
                        <Input
                          id="artist"
                          value={songForm.artist}
                          onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
                          placeholder="Nome do artista"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="key">Tom Original</Label>
                        <Input
                          id="key"
                          value={songForm.original_key}
                          onChange={(e) => setSongForm({ ...songForm, original_key: e.target.value })}
                          placeholder="Ex: C, G, Am"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bpm">BPM</Label>
                        <Input
                          id="bpm"
                          type="number"
                          value={songForm.bpm}
                          onChange={(e) => setSongForm({ ...songForm, bpm: e.target.value })}
                          placeholder="120"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duração (min)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={songForm.duration_minutes}
                          onChange={(e) => setSongForm({ ...songForm, duration_minutes: e.target.value })}
                          placeholder="5"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lyrics">Letra</Label>
                      <Textarea
                        id="lyrics"
                        value={songForm.lyrics}
                        onChange={(e) => setSongForm({ ...songForm, lyrics: e.target.value })}
                        placeholder="Letra da música..."
                        rows={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chords">Cifra</Label>
                      <Textarea
                        id="chords"
                        value={songForm.chords}
                        onChange={(e) => setSongForm({ ...songForm, chords: e.target.value })}
                        placeholder="Cifra da música..."
                        rows={6}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setNewSongOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateSong} disabled={!songForm.title || isCreating}>
                        {isCreating ? "Salvando..." : "Salvar Música"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar músicas por título ou artista..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loadingSongs ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando músicas...
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhuma música encontrada" : "Nenhuma música cadastrada"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Artista</TableHead>
                    <TableHead>Tom</TableHead>
                    <TableHead>BPM</TableHead>
                    <TableHead>Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {songs.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell className="font-medium">{song.title}</TableCell>
                      <TableCell>{song.artist || "-"}</TableCell>
                      <TableCell>{song.original_key || "-"}</TableCell>
                      <TableCell>{song.bpm || "-"}</TableCell>
                      <TableCell>
                        {song.duration_minutes ? `${song.duration_minutes} min` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}