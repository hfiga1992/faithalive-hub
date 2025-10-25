import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Church, ArrowLeft, ArrowRight, Building2, MapPin, Phone, User, Mail, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    churchName: "",
    churchAddress: "",
    churchPhone: "",
    pastorName: "",
    pastorEmail: "",
    pastorPassword: "",
    pastorPasswordConfirm: "",
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.churchName.trim()) newErrors.churchName = "Nome da igreja é obrigatório";
    if (!formData.churchAddress.trim()) newErrors.churchAddress = "Endereço é obrigatório";
    if (!/^\d{10,11}$/.test(formData.churchPhone.replace(/\D/g, ''))) newErrors.churchPhone = "Telefone inválido (10 ou 11 dígitos)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.pastorName.trim()) newErrors.pastorName = "Nome é obrigatório";
    if (!/\S+@\S+\.\S+/.test(formData.pastorEmail)) newErrors.pastorEmail = "Email inválido";
    if (formData.pastorPassword.length < 6) newErrors.pastorPassword = "Senha deve ter no mínimo 6 caracteres";
    if (formData.pastorPassword !== formData.pastorPasswordConfirm) newErrors.pastorPasswordConfirm = "As senhas não coincidem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.acceptTerms) newErrors.terms = "Você deve aceitar os termos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (isValid && currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
  if (!validateStep3()) return;
  setIsLoading(true);
  
  try {
    const { data, error } = await supabase.functions.invoke('register-new-church', {
      body: {
        email: formData.pastorEmail,
        password: formData.pastorPassword,
        fullName: formData.pastorName,
        churchName: formData.churchName,
        address: formData.churchAddress,
        phone: formData.churchPhone,
        planType: 'freemium' // Plano padrão
      }
    });

    if (error) {
      // Verifica se o erro é de e-mail duplicado
      if (error.message.includes("Este e-mail já está cadastrado")) {
        setErrors(prev => ({ ...prev, pastorEmail: "Este e-mail já está em uso." }));
        setCurrentStep(2); // Volta para a etapa do formulário de e-mail
        toast.error("E-mail já cadastrado", {
          description: "Por favor, use um e-mail diferente ou faça login se você já possui uma conta.",
        });
      } else {
        throw error;
      }
    } else {
      setIsSuccess(true);
      toast.success("Igreja cadastrada com sucesso!", {
        description: "Verifique seu email para confirmar o cadastro.",
      });
    }
  } catch (error: any) {
    console.error("Error registering church:", error);
    toast.error("Erro ao cadastrar", {
    });
  } finally {
    setIsLoading(false);
  }
};

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 shadow-lg animate-fade-in-up">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Igreja cadastrada!</h2>
              <p className="text-muted-foreground">Enviamos um email de confirmação para {formData.pastorEmail}</p>
            </div>
            <Link to="/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para início
        </Link>
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-spiritual rounded-xl"><Church className="h-8 w-8 text-white" /></div>
                <div>
                  <CardTitle className="text-2xl">Cadastre sua Igreja</CardTitle>
                  <CardDescription className="text-sm mt-1">Passo {currentStep} de {totalSteps}</CardDescription>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Dados da Igreja</span>
                <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Dados do Pastor</span>
                <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Confirmação</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="churchName">Nome da Igreja</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="churchName" placeholder="Igreja Batista Central" className={`h-11 pl-10 ${errors.churchName ? 'border-destructive' : ''}`} value={formData.churchName} onChange={handleChange} />
                  </div>
                  {errors.churchName && <p className="text-sm text-destructive animate-fade-in">{errors.churchName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="churchAddress">Endereço Completo</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="churchAddress" placeholder="Rua, número, bairro, cidade - UF" className={`h-11 pl-10 ${errors.churchAddress ? 'border-destructive' : ''}`} value={formData.churchAddress} onChange={handleChange} />
                  </div>
                  {errors.churchAddress && <p className="text-sm text-destructive animate-fade-in">{errors.churchAddress}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="churchPhone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="churchPhone" placeholder="11999999999" className={`h-11 pl-10 ${errors.churchPhone ? 'border-destructive' : ''}`} value={formData.churchPhone} onChange={handleChange} />
                  </div>
                  {errors.churchPhone && <p className="text-sm text-destructive animate-fade-in">{errors.churchPhone}</p>}
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="pastorName">Nome Completo do Pastor</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="pastorName" placeholder="João da Silva" className={`h-11 pl-10 ${errors.pastorName ? 'border-destructive' : ''}`} value={formData.pastorName} onChange={handleChange} />
                  </div>
                  {errors.pastorName && <p className="text-sm text-destructive animate-fade-in">{errors.pastorName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastorEmail">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="pastorEmail" type="email" placeholder="pastor@igreja.com" className={`h-11 pl-10 ${errors.pastorEmail ? 'border-destructive' : ''}`} value={formData.pastorEmail} onChange={handleChange} />
                  </div>
                  {errors.pastorEmail && <p className="text-sm text-destructive animate-fade-in">{errors.pastorEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastorPassword">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="pastorPassword" type="password" placeholder="••••••••" className={`h-11 pl-10 ${errors.pastorPassword ? 'border-destructive' : ''}`} value={formData.pastorPassword} onChange={handleChange} />
                  </div>
                  {errors.pastorPassword && <p className="text-sm text-destructive animate-fade-in">{errors.pastorPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastorPasswordConfirm">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input id="pastorPasswordConfirm" type="password" placeholder="••••••••" className={`h-11 pl-10 ${errors.pastorPasswordConfirm ? 'border-destructive' : ''}`} value={formData.pastorPasswordConfirm} onChange={handleChange} />
                  </div>
                  {errors.pastorPasswordConfirm && <p className="text-sm text-destructive animate-fade-in">{errors.pastorPasswordConfirm}</p>}
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Resumo do Cadastro</h3>
                  <div className="space-y-3 text-sm">
                    <div><p className="text-muted-foreground">Igreja</p><p className="font-medium">{formData.churchName}</p></div>
                    <div><p className="text-muted-foreground">Endereço</p><p className="font-medium">{formData.churchAddress}</p></div>
                    <div><p className="text-muted-foreground">Telefone</p><p className="font-medium">{formData.churchPhone}</p></div>
                    <div className="border-t pt-3"><p className="text-muted-foreground">Pastor Responsável</p><p className="font-medium">{formData.pastorName}</p><p className="text-muted-foreground text-xs">{formData.pastorEmail}</p></div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" checked={formData.acceptTerms} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))} className={errors.terms ? 'border-destructive' : ''} />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">Concordo com os <a href="#" className="text-primary hover:underline">Termos de Uso</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a></Label>
                    {errors.terms && <p className="text-sm text-destructive animate-fade-in">{errors.terms}</p>}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between pt-4 gap-4">
              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90">Próximo <ArrowRight className="ml-2 h-4 w-4" /></Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-gradient-spiritual hover:opacity-90">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cadastrando...</> : "Finalizar Cadastro"}
                </Button>
              )}
            </div>
            <div className="text-sm text-center text-muted-foreground pt-2">
              Já tem uma conta? <Link to="/login" className="text-primary hover:underline font-medium">Fazer login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
