import { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Category, Type, Color, ProductGroup } from "@/types";

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
  hasGroup: boolean;
  group: string;
};



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
    hasGroup: false,
    group: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [groups, setGroups] = useState<ProductGroup[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const res = await fetch("/api/product/dependencies", { method: "GET" });
        const data = await res.json();

        if (!res.ok || !data.success) {
          console.error("Error fetching product dependencies:", data.error || "Unknown error");
          return;
        }
        setCategories(data.data.categories || []);
        setTypes(data.data.types || []);
        setColors(data.data.colors || []);
        setGroups(data.data.groups || []);
      } catch (error) {
        console.error("Error fetching product dependencies:", error);
      }
    };

    fetchDependencies();
  }, []);

  const handleChange = (key: keyof ProductFormData, value: string | boolean) => {
    const numericFields: (keyof ProductFormData)[] = ["price", "stock"];

    setFormData(prev => ({
      ...prev,
      [key]: numericFields.includes(key) ? Number(value) : value,
      ...(key === "type" ? { size: "" } : {}),
      ...(key === "hasGroup" && value === false ? { group: "" } : {}),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const groupSlug = !formData.hasGroup
    ? formData.name.toLowerCase().replace(/\s+/g, "-")
    : formData.group;

    try {
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          group: groupSlug,
        }),
      });

      const data = await res.json();
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

  const selectedType = types.find(t => t.name === formData.type);

  // Slug y coincidencia con grupo existente
  const existingGroupSlug = formData.name.toLowerCase().replace(/\s+/g, "-");
  const matchedGroup = groups.find(g => g.slug.toLowerCase() === existingGroupSlug);

  // Actualiza automáticamente el grupo si el slug coincide
  useEffect(() => {
    if (!formData.hasGroup || !formData.name) return;

    const generatedSlug = formData.name.toLowerCase().replace(/\s+/g, "-");
    const existing = groups.find(g => g.slug.toLowerCase() === generatedSlug);

    if (existing) {
      setFormData(prev => ({
        ...prev,
        group: existing.slug,
      }));
    }
  }, [formData.name, formData.hasGroup, groups]);

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
            <select id="category" value={formData.category} onChange={e => handleChange("category", e.target.value)} className="w-full border rounded p-2">
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="type" className="pb-2">Tipo</Label>
            <select id="type" value={formData.type} onChange={e => handleChange("type", e.target.value)} className="w-full border rounded p-2">
              <option value="">Selecciona un tipo</option>
              {types.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          {selectedType?.sizes.length ? (
            <div>
              <Label>Talla</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                {selectedType.sizes.map(size => (
                  <label key={size.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="size"
                      value={size.name}
                      checked={formData.size === size.name}
                      onChange={e => handleChange("size", e.target.value)}
                    />
                    <span>{size.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-4 mt-1">
              {colors.map(color => (
                <label key={color.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="color"
                    value={color.name}
                    checked={formData.color === color.name}
                    onChange={e => handleChange("color", e.target.value)}
                  />
                  <span>{color.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>¿Tiene grupo?</Label>
            <div className="flex items-center gap-6 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hasGroup"
                  checked={formData.hasGroup === true}
                  onChange={() => handleChange("hasGroup", true)}
                />
                <span>Sí</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hasGroup"
                  checked={formData.hasGroup === false}
                  onChange={() => handleChange("hasGroup", false)}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {formData.hasGroup ? (
            <div className="mt-2 space-y-1">
              <Label htmlFor="group" className="pb-2">Selecciona grupo existente</Label>
              <select
                id="group"
                value={formData.group}
                onChange={e => handleChange("group", e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Selecciona un grupo</option>
                {groups.map(group => (
                  <option key={group.id} value={group.slug}>{group.slug}</option>
                ))}
              </select>

              {matchedGroup && matchedGroup.slug === formData.group ? (
                <p className="text-sm text-green-600 italic mt-1">
                  Hemos visto este grupo ya existente.
                </p>
              ) : (
                <p className="text-sm text-red-600 italic mt-1">
                  No se ha encontrado por defecto ninguno que concuerde con el nombre.
                </p>
              )}
            </div>
          ) : (
            <>
              {matchedGroup ? (
                <p className="text-sm text-yellow-600 italic mt-2">
                  He visto que ya hay un grupo creado con este nombre, lo asignaré automáticamente: <strong>{matchedGroup.slug}</strong>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic mt-2">
                  Se creará un grupo con el nombre del producto: <strong>{formData.name || "[sin nombre]"}</strong>
                </p>
              )}

              {!formData.name.trim() && (
                <p className="text-sm text-red-600 italic mt-2">
                  Por favor, introduce un nombre antes de continuar. Este nombre se usará para crear el grupo automáticamente.
                </p>
              )}
            </>
          )}



          <Button type="submit" className="w-full mt-4">Crear Producto</Button>
        </form>
      </CardContent>
    </Card>
  );
}
