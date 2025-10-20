import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialTransactions } from "@/hooks/useFinancialTransactions";
import { DollarSign, TrendingUp, TrendingDown, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Finance() {
  const { transactions, isLoading } = useFinancialTransactions();

  const today = format(new Date(), "yyyy-MM-dd");
  
  // Calculate financial indicators
  const receivedToday = transactions
    ?.filter((t) => t.type === "INCOME" && t.status === "PAID" && t.transaction_date === today)
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const paidToday = transactions
    ?.filter((t) => t.type === "EXPENSE" && t.status === "PAID" && t.transaction_date === today)
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const toReceiveToday = transactions
    ?.filter((t) => t.type === "INCOME" && t.status === "PENDING" && t.due_date === today)
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const toPayToday = transactions
    ?.filter((t) => t.type === "EXPENSE" && t.status === "PENDING" && t.due_date === today)
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const overdueReceivables = transactions
    ?.filter((t) => t.type === "INCOME" && t.status === "OVERDUE")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const overduePayables = transactions
    ?.filter((t) => t.type === "EXPENSE" && t.status === "OVERDUE")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const cards = [
    {
      title: "Recebido hoje",
      value: receivedToday,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pago hoje",
      value: paidToday,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "A receber hoje",
      value: toReceiveToday,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "A pagar hoje",
      value: toPayToday,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Recebimentos em atraso",
      value: overdueReceivables,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Pagamentos em atraso",
      value: overduePayables,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const menuItems = [
    { title: "Transações", path: "/finance/transactions", description: "Gerencie receitas e despesas" },
    { title: "Categorias", path: "/finance/categories", description: "Organize por categorias" },
    { title: "Contas", path: "/finance/accounts", description: "Contas bancárias e caixas" },
    { title: "Contatos", path: "/finance/contacts", description: "Fornecedores e clientes" },
    { title: "Centros de Custos", path: "/finance/cost-centers", description: "Gerencie centros de custos" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">
            Visualize seus indicadores financeiros
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {formatCurrency(card.value)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Menu Rápido</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {item.title}
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
