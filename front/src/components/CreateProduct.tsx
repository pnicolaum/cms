import { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  type: string;
  size: string;
  color: string;
};

type Category = { id: string; name: string };
type Size = { id: string; name: string };
type Type = { id: string; name: string; sizes: Size[] };
type Color = { id: string; name: string; hexCode: string };

export default function CreateProduct() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    category: "",
    type: "",
    size: "",
    color: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const router = useRouter(); 

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        console.log("Fetching product dependencies...");
        const res = await fetch("/api/product/dependencies", { method: "GET" });
        const data = await res.json();

        if (!res.ok || !data.success) {
          console.error("Error fetching product dependencies:", data.error || "Unknown error");
          return;
        }
        setCategories(data.data.categories || []);
        setTypes(data.data.types || []);
        setColors(data.data.colors || []);
      } catch (error) {
        console.error("Error fetching product dependencies:", error);
      }
    };

    fetchDependencies();
  }, []);

  const handleChange = (key: keyof ProductFormData, value: string) => {
    const numericFields: (keyof ProductFormData)[] = ["price", "stock"];
    setFormData(prev => ({
      ...prev,
      [key]: numericFields.includes(key) ? Number(value) : value,
    }));

    // Reset talla si cambia el tipo
    if (key === "type") {
      setFormData(prev => ({ ...prev, size: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Submitting form data:", formData);
      const res = await fetch("/api/product/create", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });

      const data = await res.json();
      console.log("Response data:", data);
      if (!res.ok || !data.success) {
        alert(data.error || "Fallo");
        return;
      }

      router.refresh();
      window.location.href = "/admin";
    } catch (error) {
      alert("Algo salió mal, intenta de nuevo");
      console.error(error);
    }
  };

  const selectedType = types.find(t => t.id === formData.type);

  return (
    <Card className="max-w-2xl mx-auto p-4 mt-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="pb-2">Nombre</Label>
            <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description" className="pb-2">Descripción</Label>
            <Textarea id="description" value={formData.description} onChange={e => handleChange("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="pb-2">Precio</Label>
              <Input type="number" step="0.01" id="price" value={formData.price} onChange={e => handleChange("price", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="stock" className="pb-2">Stock</Label>
              <Input type="number" id="stock" value={formData.stock} onChange={e => handleChange("stock", e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl" className="pb-2">Imagen URL</Label>
            <Input id="imageUrl" value={formData.imageUrl} onChange={e => handleChange("imageUrl", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="category" className="pb-2">Categoría</Label>
            <select
              id="category"
              value={formData.category}
              onChange={e => handleChange("category", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="type" className="pb-2">Tipo</Label>
            <select
              id="type"
              value={formData.type}
              onChange={e => handleChange("type", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Selecciona un tipo</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {selectedType?.sizes.length ? (
            <div>
              <Label className="pb-2">Talla</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                {selectedType.sizes.map(size => (
                  <label key={size.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="size"
                      value={size.id}
                      checked={formData.size === size.id}
                      onChange={e => handleChange("size", e.target.value)}
                    />
                    <span>{size.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <Label className="pb-2">Color</Label>
            <div className="flex flex-wrap gap-4 mt-1">
              {colors.map(color => (
                <label key={color.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="color"
                    value={color.id}
                    checked={formData.color === color.id}
                    onChange={e => handleChange("color", e.target.value)}
                  />
                  <span>{color.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">Crear Producto</Button>
        </form>
      </CardContent>
    </Card>
  );
}
