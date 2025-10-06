import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Loader2,
  Crown,
  Users,
  Mic,
  UserCircle,
  UserPlus
} from "lucide-react";

type UserRole = "pastor" | "leader" | "minister" | "member" | "visitor";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions: RoleOption[] = [
    {
      value: "pastor",
      label: "Pastor",
      description: "Líder principal da igreja com acesso total",
      icon: <Crown className="h-5 w-5" />,
    },
    {
      value: "leader",
      label: "Líder",
      description: "Coordena ministérios e grupos específicos",
      icon: <Users className="h-5 w-5" />,
    },
    {
      value: "minister",
      label: "Ministro",
      description: "Atua em ministérios e serviços da igreja",
      icon: <Mic className="h-5 w-5" />,
    },
    {
      value: "member",
      label: "Membro",
      description: "Membro ativo da comunidade",
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      value: "visitor",
      label: "Visitante",
      description: "Primeira visita ou conhecendo a igreja",
      icon: <UserPlus className="h-5 w-5" />,
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (!selectedRole) {
      newErrors.role = "Selecione um perfil";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulação de cadastro
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 shadow-lg animate-fade-in-up">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Cadastro realizado com sucesso!</h2>
              <p className="text-muted-foreground">
                Bem-vindo(a) à família, {name}! Enviamos um email de confirmação para {email}
              </p>
            </div>
            <Link to="/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in-up">
        {/* Back to Login */}
        <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para login
        </Link>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-4 text-center pb-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-divine rounded-2xl">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Cadastro de Usuário</CardTitle>
              <CardDescription className="text-base mt-2">
                Junte-se à comunidade da sua igreja
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Seleção de Perfil */}
              <div className="space-y-3">
                <Label className="text-base">Selecione seu perfil</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`
                        relative flex items-start space-x-3 p-4 rounded-xl border-2 transition-all duration-200
                        ${
                          selectedRole === role.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }
                      `}
                    >
                      <div
                        className={`
                        p-2 rounded-lg transition-colors
                        ${
                          selectedRole === role.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                      >
                        {role.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm">{role.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {role.description}
                        </p>
                      </div>
                      {selectedRole === role.value && (
                        <CheckCircle2 className="h-5 w-5 text-primary absolute top-3 right-3" />
                      )}
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.role}</p>
                )}
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="João da Silva"
                      className={`h-11 pl-10 ${errors.name ? "border-destructive" : ""}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className={`h-11 pl-10 ${errors.email ? "border-destructive" : ""}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`h-11 pl-10 ${errors.password ? "border-destructive" : ""}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`h-11 pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive animate-fade-in">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-divine hover:opacity-90 transition-opacity"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserRegister;
