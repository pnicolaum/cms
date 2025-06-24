"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/product"
import { Skeleton } from "@/components/ui/skeleton"
import { Product, Category, Type, Color, ProductGroup } from "@/types"



function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [categories, setCategories] = useState<Category[]>([])
  const [types, setTypes] = useState<Type[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<ProductGroup[]>([])

  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/get", { method: "GET" })
        const data = await res.json()

        if (!res.ok || !data.success) {
          console.error("Error fetching product dependencies:", data.error || "Unknown error")
          return
        }

        setProducts(data.data)
      } catch (error) {
        console.error("Error fetching product dependencies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

   return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        : products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              stock={product.stock}
              imageUrl={product.imageUrl}
              category={product.category}
              type={product.type}
              color={product.color}
              size={product.size}
              slug={product.productGroup.slug}
            />
          ))}
    </div>
  )

}

export default Shop
