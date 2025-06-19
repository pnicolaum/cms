import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type FormData = {
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

const CATEGORIES = [
  { id: "MALE", name: "Male" },
  { id: "FEMALE", name: "Female" },
  { id: "KID", name: "Kid" },
];

const TYPES = [
  { id: "SHIRT", name: "Shirt" },
  { id: "SHOES", name: "Shoes" },
];

const COLORS = [
  { id: "WHITE", name: "White" },
  { id: "BLACK", name: "Black" },
  { id: "RED", name: "Red" },
];

const SIZES = {
  SHIRT: ["S", "M", "L"],
  SHOES: ["38", "40", "42"],
};

export default function CreateProduct() {
  const [formData, setFormData] = useState<FormData>({
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

  const handleChange = (key: keyof FormData, value: string) => {
    const numericFields: (keyof FormData)[] = ["price", "stock"];
    setFormData(prev => ({
      ...prev,
      [key]: numericFields.includes(key) ? Number(value) : value,
    }));
  };


  const router = useRouter();
  const type = formData.type as keyof typeof SIZES;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Sending data to API:", formData);
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Fallo");
        return;
      }

      console.log("Product created:", data);
      router.refresh();
      window.location.href = "/admin";
    } catch (error) {
      alert("Algo salió mal, intenta de nuevo");
      console.error(error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-4 mt-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={formData.description} onChange={e => handleChange("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input type="number" step="0.01" id="price" value={formData.price} onChange={e => handleChange("price", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input type="number" id="stock" value={formData.stock} onChange={e => handleChange("stock", e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Imagen URL</Label>
            <Input id="imageUrl" value={formData.imageUrl} onChange={e => handleChange("imageUrl", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={formData.category}
              onChange={e => handleChange("category", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              value={formData.type}
              onChange={e => handleChange("type", e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Selecciona un tipo</option>
              {TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {type && (
            <div>
              <Label>Talla</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                {SIZES[type]?.map(size => (
                  <label key={size} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={formData.size === size}
                      onChange={e => handleChange("size", e.target.value)}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-4 mt-1">
              {COLORS.map(color => (
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
