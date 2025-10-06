import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Church, Sparkles, Users, TrendingUp, Shield, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-secondary/20" />
        
        <div className="container relative mx-auto px-4 py-20 sm:py-32">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in-up">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <Church className="h-16 w-16 text-primary animate-glow" strokeWidth={1.5} />
                <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-spiritual bg-clip-text text-transparent">
                FaithAlive
              </h1>
            </div>

            {/* Slogan */}
            <p className="text-2xl sm:text-3xl text-muted-foreground max-w-2xl font-light">
              A tecnologia que{" "}
              <span className="text-secondary font-semibold">impulsiona</span>{" "}
              a sua igreja.
            </p>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl">
              Gerencie membros, eventos, finanças e muito mais em uma plataforma 
              completa e intuitiva projetada especialmente para igrejas modernas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  Fazer Login
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8"
                >
                  Cadastrar Igreja
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 animate-fade-in">
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Gestão de Membros"
              description="Cadastre e acompanhe sua comunidade de forma simples e organizada."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Análises e Relatórios"
              description="Insights valiosos sobre crescimento, engajamento e finanças."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Segurança e Privacidade"
              description="Dados protegidos com criptografia de ponta a ponta."
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <Heart className="h-12 w-12 text-accent animate-pulse" />
            <h2 className="text-3xl font-bold text-foreground">
              Milhares de igrejas já confiam no FaithAlive
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Junte-se a uma comunidade de líderes que escolheram simplicidade, 
              eficiência e fé no gerenciamento de suas igrejas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-spiritual opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" />
      <div className="relative space-y-4">
        <div className="inline-flex p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default Index;
