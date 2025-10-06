import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-destructive/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center animate-fade-in">
        <CardHeader className="space-y-4">
          <div className="mx-auto p-4 bg-destructive/10 rounded-full w-fit">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl">Acesso Negado</CardTitle>
            <CardDescription className="text-base mt-2">
              Você não tem permissão para acessar esta página
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Esta área é restrita a usuários com perfis específicos. Se você acredita que deveria ter acesso, entre em contato com o administrador da sua igreja.
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/dashboard">
              <Button className="w-full">
                Voltar ao Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ir para Página Inicial
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
