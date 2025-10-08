import { useState } from "react";
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEvents } from "@/hooks/useEvents";
import { useMembers } from "@/hooks/useMembers";
import { useAttendance } from "@/hooks/useAttendance";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Attendance() {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const { events } = useEvents();
  const { members } = useMembers();
  const { attendance, recordAttendance, isRecording } = useAttendance(selectedEventId);

  const recentEvents = events
    .filter(e => e.status === 'FINISHED' || e.status === 'IN_PROGRESS')
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    .slice(0, 10);

  const handleMarkAttendance = (userId: string, status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED') => {
    if (!selectedEventId) return;
    recordAttendance({
      event_id: selectedEventId,
      user_id: userId,
      status,
    });
  };

  const getAttendanceStatus = (userId: string) => {
    const record = attendance.find(a => a.user_id === userId);
    return record?.status || null;
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Controle de Presença
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre a presença dos membros em cultos e eventos
          </p>
        </div>

        {/* Event Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Evento</CardTitle>
            <CardDescription>
              Escolha o evento para registrar a presença
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um evento" />
              </SelectTrigger>
              <SelectContent>
                {recentEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} - {format(new Date(event.event_date), "PPP 'às' HH:mm", { locale: ptBR })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Attendance List */}
        {selectedEventId && selectedEvent && (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Chamada - {selectedEvent.title}</CardTitle>
              <CardDescription>
                {format(new Date(selectedEvent.event_date), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membro</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => {
                    const status = getAttendanceStatus(member.id);
                    
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          {status === 'PRESENT' && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Presente
                            </Badge>
                          )}
                          {status === 'ABSENT' && (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Ausente
                            </Badge>
                          )}
                          {status === 'JUSTIFIED' && (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Justificado
                            </Badge>
                          )}
                          {!status && (
                            <Badge variant="outline">Não registrado</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant={status === 'PRESENT' ? 'default' : 'outline'}
                            onClick={() => handleMarkAttendance(member.id, 'PRESENT')}
                            disabled={isRecording}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'ABSENT' ? 'destructive' : 'outline'}
                            onClick={() => handleMarkAttendance(member.id, 'ABSENT')}
                            disabled={isRecording}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'JUSTIFIED' ? 'secondary' : 'outline'}
                            onClick={() => handleMarkAttendance(member.id, 'JUSTIFIED')}
                            disabled={isRecording}
                          >
                            <Clock className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {!selectedEventId && (
          <Card>
            <CardContent className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Selecione um evento para registrar a presença dos membros
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}