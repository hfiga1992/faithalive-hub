import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useChurchRegistration } from '@/hooks/useChurchRegistration';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

const registrationSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  churchName: z.string().min(3, 'Nome da igreja deve ter pelo menos 3 caracteres'),
  cnpj: z.string().optional(),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  churchType: z.string().min(1, 'Selecione um tipo de igreja'),
  churchSize: z.string().min(1, 'Selecione o tamanho da igreja'),
  planType: z.string().min(1, 'Selecione um plano')
});

type RegistrationData = z.infer<typeof registrationSchema>;

export function RegistrationWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { registerChurch, isRegistering } = useChurchRegistration();
  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange'
  });

  const selectedPlan = watch('planType');

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['email', 'password', 'fullName'],
      2: ['churchName', 'address', 'phone', 'churchType', 'churchSize'],
    };
    const isValid = await trigger(fieldsToValidate[step]);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = (data: RegistrationData) => {
    registerChurch(data, {
      onSuccess: () => {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const plans = [
    { id: 'freemium', name: 'Freemium', price: 'Grátis', leaders: '1 líder', members: 'Até 100 membros', features: ['Gestão de membros', 'Eventos'] },
    { id: 'premium', name: 'Premium', price: 'R$ 99/mês', leaders: '5 líderes', members: 'Até 500 membros', features: ['Tudo do Freemium', 'Módulo financeiro'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Customizado', leaders: 'Ilimitado', members: 'Ilimitado', features: ['Tudo do Premium', 'Suporte dedicado'] }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Registre sua Igreja</CardTitle>
          <CardDescription>Passo {step} de 3</CardDescription>
          <Progress value={(step / 3) * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">1. Seus Dados de Acesso</h3>
                <div>
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input id="fullName" {...register('fullName')} />
                  {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">2. Dados da Igreja</h3>
                <div>
                  <Label htmlFor="churchName">Nome da Igreja *</Label>
                  <Input id="churchName" {...register('churchName')} />
                  {errors.churchName && <p className="text-sm text-red-500 mt-1">{errors.churchName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="address">Endereço *</Label>
                  <Input id="address" {...register('address')} />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input id="phone" {...register('phone')} />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">3. Escolha seu Plano</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div key={plan.id} onClick={() => setValue('planType', plan.id)} className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <h4 className="font-semibold">{plan.name}</h4>
                      <p className="text-2xl font-bold text-blue-600 my-2">{plan.price}</p>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>✓ {plan.leaders}</li>
                        <li>✓ {plan.members}</li>
                        {plan.features.map((feature, i) => <li key={i}>✓ {feature}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                {errors.planType && <p className="text-sm text-red-500">{errors.planType.message}</p>}
              </div>
            )}
            <div className="flex gap-2 justify-between pt-6">
                <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={isRegistering}>
                  {isRegistering ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processando...</> : 'Criar Igreja'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
