import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, ArrowLeft } from "lucide-react";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para início
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-4 text-center pb-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-spiritual rounded-2xl">
                <Church className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Cadastre sua Igreja</CardTitle>
              <CardDescription className="text-base mt-2">
                Comece a transformar a gestão da sua comunidade hoje
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="church-name">Nome da Igreja</Label>
              <Input 
                id="church-name" 
                placeholder="Igreja Exemplo"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nome do Responsável</Label>
              <Input 
                id="admin-name" 
                placeholder="João Silva"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="contato@igreja.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(11) 99999-9999"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full h-11 bg-gradient-spiritual hover:opacity-90 transition-opacity" size="lg">
              Criar Conta
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Fazer login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
