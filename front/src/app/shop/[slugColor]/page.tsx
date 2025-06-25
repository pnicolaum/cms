'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Product = {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  category: { name: string }
  type: { name: string }
  color: { name: string }
  size: { name: string }
  slug: string
}

export default function ProductPage() {
  const { slugColor } = useParams<{ slugColor: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [slug, color] = slugColor.split('-')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${slug}-${color}`, { method: "GET" })
        if (!res.ok) throw new Error('Producto no encontrado')
        const data = await res.json()
        setProduct(data.data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    if (slug && color) {
      fetchProduct()
    }
  }, [slug, color])

  if (error) return <p>Error: {error}</p>
  if (!product) return <p>Cargando...</p>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Descripción: {product.description}</p>
      <p>Precio: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Categoría: {product.category.name}</p>
      <p>Tipo: {product.type.name}</p>
      <p>Color: {product.color.name}</p>
      <p>Tamaño: {product.size.name}</p>
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
    </div>
  )
}
