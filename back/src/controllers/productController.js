import prisma from '../lib/prisma.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        type: {
          include: { sizes: true },
        },
        category: true,
        colors: {
          include: {
            color: true, // Color completo desde ProductColor
          },
        },
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
        type: {
          include: { sizes: true },
        },
        category: true,
        colors: {
          include: {
            color: true,
          },
        },
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
  console.log("Creating product with body:", req.body);

  try {
    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      category,  // string (nombre)
      type,      // string (nombre)
      color,     // string (nombre, ej: "Rojo")
      size       // string (nombre, ej: "M")
    } = req.body;

    // 1. Buscar categoría
    const existingCategory = await prisma.category.findUnique({
      where: { name: category },
    });
    if (!existingCategory) {
      return res.status(400).json({ error: `Categoría '${category}' no encontrada` });
    }

    // 2. Buscar tipo
    const existingType = await prisma.productType.findUnique({
      where: { name: type },
      include: { sizes: true },
    });
    if (!existingType) {
      return res.status(400).json({ error: `Tipo de producto '${type}' no encontrado` });
    }

    // 3. Buscar talla por nombre y asegurar que pertenece a ese tipo
    const existingSize = await prisma.size.findFirst({
      where: {
        name: size,
        typeId: existingType.id,
      },
    });
    if (!existingSize) {
      return res.status(400).json({ error: `Talla '${size}' no válida para el tipo '${type}'` });
    }

    // 4. Buscar color
    const existingColor = await prisma.color.findUnique({
      where: { name: color },
    });
    if (!existingColor) {
      return res.status(400).json({ error: `Color '${color}' no encontrado` });
    }

    // 5. Crear producto
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

    console.log("Producto creado:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: 'Error al crear el producto.' });
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
    categoryId,
    typeId,
    colorIds, // opcional para actualizar colores también
  } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        typeId,
        ...(colorIds && {
          colors: {
            deleteMany: {}, // primero se limpian
          },
        }),
      },
    });

    if (colorIds) {
      await prisma.product.update({
        where: { id },
        data: {
          colors: {
            create: colorIds.map(colorId => ({
              color: { connect: { id: colorId } },
            })),
          },
        },
      });
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        type: { include: { sizes: true } },
        category: true,
        colors: { include: { color: true } },
      },
    });

    res.json(finalProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};


// Eliminar producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.productColor.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({ where: { id } });

    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

