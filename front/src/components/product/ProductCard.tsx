"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type ProductCardProps = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
  category: { name: string }
  type: { name: string }
  color: { name: string; hexCode: string }
  size: { name: string }
  slug: string
}

export function ProductCard({
  id,
  name,
  description,
  price,
  stock,
  imageUrl,
  category,
  type,
  color,
  size,
  slug,
}: ProductCardProps) {
  const router = useRouter()

  return (
    <Card
      key={id}
      onClick={() => router.push(`/product/${slug}`)}
      className="hover:shadow-xl transition cursor-pointer"
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {/* Puedes agregar aquí una imagen si usas imageUrl */}
        <div className="mb-2">
          <span className="font-bold">Precio: </span>${price}
        </div>
        <div className="mb-2">
          <span className="font-bold">Stock: </span>{stock}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge>{category.name}</Badge>
          <Badge>{type.name}</Badge>
          <Badge style={{ backgroundColor: `#${color.hexCode}`, color: "#000" }}>
            {color.name}
          </Badge>
          <Badge>Size {size.name}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard