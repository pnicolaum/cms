import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDependencies,
  getProductBySlugAndColor
} from '../controllers/productController.js';
// import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/', getAllProducts);
router.get('/dependencies', getProductDependencies);
router.get('/:slug-:color', getProductBySlugAndColor);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


export default router;
