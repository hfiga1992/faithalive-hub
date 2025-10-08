import { useState } from "react";
import { BarChart3, Users, Calendar, TrendingUp, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useChurchStats } from "@/hooks/useChurchStats";
import { useAuth } from "@/hooks/useAuth";
import { useMembers } from "@/hooks/useMembers";
import { useEvents } from "@/hooks/useEvents";

export default function Reports() {
  const { church, hasRole } = useAuth();
  const { stats } = useChurchStats();
  const { members } = useMembers();
  const { events } = useEvents();

  const latestStats = stats[0];

  const activeMembers = members.filter(m => m.status === 'ACTIVE').length;
  const upcomingEvents = events.filter(e => 
    new Date(e.event_date) > new Date() && e.status === 'SCHEDULED'
  ).length;

  if (!hasRole('PASTOR')) {
    return (
      <DashboardLayout>
        <div>
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
              <p className="text-muted-foreground">
                Apenas pastores podem acessar os relatórios da igreja.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Relatórios e Estatísticas
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão geral e análise da {church?.name}
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total de Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestStats?.total_members || members.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeMembers} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Novos Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestStats?.new_members || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestStats?.events_count || events.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {upcomingEvents} próximos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Frequência Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {latestStats?.average_attendance ? latestStats.average_attendance.toFixed(0) : '0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Por evento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Crescimento da Igreja</CardTitle>
            <CardDescription>
              Novos membros nos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico de crescimento (implementar com recharts)
            </div>
          </CardContent>
        </Card>

        {/* Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Frequência por Tipo de Evento</CardTitle>
            <CardDescription>
              Média de participação por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico de frequência (implementar com recharts)
            </div>
          </CardContent>
        </Card>

        {/* Top Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Membros Mais Participativos</CardTitle>
              <CardDescription>
                Baseado em frequência e escalas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dados disponíveis em breve
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Membros Ausentes</CardTitle>
              <CardDescription>
                Requerem atenção pastoral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dados disponíveis em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}