"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/ProductCard"
import { Product, Category, Type, Color, ProductGroup } from "@/types"



function Shop() {
  const [products, setProducts] = useState<Product[]>([])
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
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
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
