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


// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      typeId,
      colorIds, // ← IDs de colores existentes
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        typeId,
        colors: {
          create: colorIds.map(colorId => ({
            color: { connect: { id: colorId } },
          })),
        },
      },
      include: {
        colors: {
          include: { color: true },
        },
        type: {
          include: { sizes: true },
        },
        category: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
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

