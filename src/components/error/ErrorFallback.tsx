import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({ 
  error, 
  onRetry, 
  title = "Erro ao carregar dados",
  description = "Ocorreu um erro ao buscar as informações. Tente novamente."
}: ErrorFallbackProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="w-full">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
