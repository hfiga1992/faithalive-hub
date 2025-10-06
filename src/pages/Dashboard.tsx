import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Layers, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  // Mock data
  const stats = [
    {
      title: "Total de Membros",
      value: "234",
      change: "+12 este mês",
      icon: Users,
      trend: "up",
    },
    {
      title: "Eventos Próximos",
      value: "8",
      change: "Nos próximos 7 dias",
      icon: Calendar,
      trend: "neutral",
    },
    {
      title: "Ministérios Ativos",
      value: "15",
      change: "3 novos este ano",
      icon: Layers,
      trend: "up",
    },
    {
      title: "Presença Média",
      value: "87%",
      change: "+5% vs mês anterior",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Culto de Jovens - Sexta às 19h",
      description: "Venha participar do nosso culto especial para jovens",
      date: "Hoje",
      priority: "high",
    },
    {
      id: 2,
      title: "Retiro Espiritual - Inscrições Abertas",
      description: "Garanta sua vaga para o retiro de março",
      date: "Amanhã",
      priority: "medium",
    },
    {
      id: 3,
      title: "Escola Bíblica - Nova Turma",
      description: "Início das aulas: próximo domingo",
      date: "Em 3 dias",
      priority: "low",
    },
  ];

  const upcomingSchedules = [
    { id: 1, ministry: "Louvor", role: "Vocal", date: "Dom, 10/10", time: "09:00" },
    { id: 2, ministry: "Recepção", role: "Recepcionista", date: "Dom, 10/10", time: "08:30" },
    { id: 3, ministry: "Multimídia", role: "Operador", date: "Qua, 13/10", time: "19:00" },
  ];

  const events = [
    { day: 5, title: "Culto de Oração", time: "19:00" },
    { day: 10, title: "Culto Dominical", time: "09:00" },
    { day: 12, title: "Reunião de Jovens", time: "19:30" },
    { day: 15, title: "Célula Zona Norte", time: "20:00" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo de hoje.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar & Events */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Calendário de Eventos</CardTitle>
              <CardDescription>Próximos eventos programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.day}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                        <span className="text-xs text-muted-foreground">Out</span>
                        <span className="text-lg font-bold text-primary">{event.day}</span>
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Anúncios Recentes</CardTitle>
              <CardDescription>Últimas novidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 rounded-lg border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={
                          announcement.priority === "high"
                            ? "destructive"
                            : announcement.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {announcement.date}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{announcement.title}</h4>
                    <p className="text-xs text-muted-foreground">{announcement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Schedules */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Próximas Escalas</CardTitle>
            <CardDescription>Suas atividades programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-12 bg-gradient-spiritual rounded-full" />
                    <div>
                      <p className="font-semibold">{schedule.ministry}</p>
                      <p className="text-sm text-muted-foreground">{schedule.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{schedule.date}</p>
                    <p className="text-xs text-muted-foreground">{schedule.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
