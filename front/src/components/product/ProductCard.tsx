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
  availableColors: { id: string; name: string; hexCode: string }[]
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
  availableColors,
}: ProductCardProps) {
  const router = useRouter()

  return (
    <Card
      key={id}
      onClick={() => router.push(`/shop/${slug}-${color.name.toLowerCase()}`)}
      className="hover:shadow-xl transition cursor-pointer"
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent>
        {imageUrl && (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        )}

        <div className="mb-2">
          <span className="font-bold">Precio: </span>${price.toFixed(2)}
        </div>
        <div className="mb-4">
          <span className="font-bold">Stock: </span>{stock}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{category.name}</Badge>
          <Badge>{type.name}</Badge>
          <Badge>Size {size.name}</Badge>
        </div>

        <div className="flex gap-2 mt-3 items-center flex-wrap">
          {availableColors.map((color) => (
            <div
              key={color.id}
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: `#${color.hexCode}` }}
              title={color.name}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
