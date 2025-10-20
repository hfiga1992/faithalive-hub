import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialCategories } from "@/hooks/useFinancialCategories";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function FinancialCategories() {
  const {
    incomeCategories,
    expenseCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    isLoading,
  } = useFinancialCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "INCOME" as "INCOME" | "EXPENSE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory.mutateAsync(formData);
    setDialogOpen(false);
    setFormData({ name: "", description: "", type: "INCOME" });
  };

  const CategoryCard = ({
    title,
    categories,
    colorClass,
  }: {
    title: string;
    categories: any[];
    colorClass: string;
  }) => (
    <Card className="flex-1">
      <CardHeader className={`${colorClass} text-white`}>
        <CardTitle>
          {title} ({categories.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
            >
              <div className="flex-1">
                <p className="font-medium">{category.name}</p>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteCategory.mutate(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma categoria cadastrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Categorias Financeiras</h1>
            <p className="text-muted-foreground">
              Gerencie todas as categorias de transações financeiras
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Categoria</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(v) =>
                      setFormData({ ...formData, type: v as any })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INCOME" id="income" />
                      <Label htmlFor="income" className="cursor-pointer">
                        Receita
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="EXPENSE" id="expense" />
                      <Label htmlFor="expense" className="cursor-pointer">
                        Despesa
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Criar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <CategoryCard
            title="Receitas"
            categories={incomeCategories}
            colorClass="bg-green-600"
          />
          <CategoryCard
            title="Despesas"
            categories={expenseCategories}
            colorClass="bg-red-600"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
