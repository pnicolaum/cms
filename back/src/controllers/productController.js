import prisma from '../lib/prisma.js';

const validateProductInput = async ({ category, type, size, color }) => {
  // 1. Validar categoría
  const existingCategory = await prisma.category.findUnique({
    where: { name: category },
  });
  if (!existingCategory) {
    throw new Error(`Categoría '${category}' no encontrada`);
  }

  // 2. Validar tipo
  const existingType = await prisma.productType.findUnique({
    where: { name: type },
  });
  if (!existingType) {
    throw new Error(`Tipo de producto '${type}' no encontrado`);
  }

  // 3. Validar talla asociada al tipo
  const existingSize = await prisma.size.findFirst({
    where: {
      name: size,
      typeId: existingType.id,
    },
  });
  if (!existingSize) {
    throw new Error(`Talla '${size}' no válida para el tipo '${type}'`);
  }

  // 4. Validar color
  const existingColor = await prisma.color.findUnique({
    where: { name: color },
  });
  if (!existingColor) {
    throw new Error(`Color '${color}' no encontrado`);
  }

  return {
    existingCategory,
    existingType,
    existingSize,
    existingColor,
  };
};


// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        type: {
          include: { sizes: true },
        },
        color: true,
        size: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
};



// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        type: {
          include: { sizes: true },
        },
        color: true,
        size: true,
      },
    });

    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};



// Crear un nuevo productoimport { prisma } from "../generated/prisma";
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
      type,
      color,
      size,
    } = req.body;

    const {
      existingCategory,
      existingType,
      existingSize,
      existingColor,
    } = await validateProductInput({ category, type, size, color });

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        category: { connect: { id: existingCategory.id } },
        type:     { connect: { id: existingType.id } },
        size:     { connect: { id: existingSize.id } },
        color:    { connect: { id: existingColor.id } },
      },
      include: {
        category: true,
        type:     true,
        size:     true,
        color:    true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: error.message || 'Error al crear el producto.' });
  }
};





// Actualizar producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    stock,
    imageUrl,
    category,
    type,
    color,
    size,
  } = req.body;

  try {
    const {
      existingCategory,
      existingType,
      existingSize,
      existingColor,
    } = await validateProductInput({ category, type, size, color });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        category: { connect: { id: existingCategory.id } },
        type:     { connect: { id: existingType.id } },
        size:     { connect: { id: existingSize.id } },
        color:    { connect: { id: existingColor.id } },
      },
      include: {
        category: true,
        type: true,
        size: true,
        color: true,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: error.message || 'Error al actualizar el producto.' });
  }
};




// Eliminar producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};


export const getProductDependencies = async (req, res) => {
  try {
    console.log("Fetching product dependencies...");
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const types = await prisma.productType.findMany({
      select: {
        id: true,
        name: true,
        sizes: {
          select: { id: true, name: true },
        },
      },
    });

    const colors = await prisma.color.findMany({
      select: { id: true, name: true, hexCode: true },
    });

    res.json({
      categories,
      types,
      colors,
    });
  } catch (error) {
    console.error('Error al obtener info de productos:', error);
    res.status(500).json({ error: 'Error al obtener info de productos.' });
  }
};