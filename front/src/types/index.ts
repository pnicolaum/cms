export type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  tokenExpiresAt: string; 
};

export type Product = {
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
  productGroup: { slug: string }
}

export type Category = { id: string; name: string };
export type Size = { id: string; name: string };
export type Type = { id: string; name: string; sizes: Size[] };
export type Color = { id: string; name: string; hexCode: string };
export type ProductGroup = { id: string; slug: string };