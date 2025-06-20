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

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, '-')           // espacios o guiones bajos por guiones
    .replace(/[^\w\-]+/g, '')           // quitar caracteres especiales
    .replace(/\-\-+/g, '-')             // evitar múltiples guiones seguidos
    .replace(/^-+|-+$/g, '');           // quitar guiones al inicio o fin
};

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
        group: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
};

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
        group: true,
      },
    });

    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};

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
      group
    } = req.body;

    const {
      existingCategory,
      existingType,
      existingSize,
      existingColor,
    } = await validateProductInput({ category, type, size, color });

    const groupSlug  = generateSlug(group);
    
    let groupRecord = await prisma.productGroup.findUnique({
      where: { slug: groupSlug },
    });

    if (!groupRecord) {
      groupRecord = await prisma.productGroup.create({
        data: { slug: groupSlug },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        category:     { connect: { id: existingCategory.id } },
        type:         { connect: { id: existingType.id } },
        size:         { connect: { id: existingSize.id } },
        color:        { connect: { id: existingColor.id } },
        productGroup: { connect: { id: groupRecord.id } },
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

    const groups = await prisma.productGroup.findMany({
      select: { id: true, slug: true},
    });

    res.json({
      categories,
      types,
      colors,
      groups
    });
  } catch (error) {
    console.error('Error al obtener info de productos:', error);
    res.status(500).json({ error: 'Error al obtener info de productos.' });
  }
};