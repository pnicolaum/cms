import jwt from "jsonwebtoken";
import prisma from '../lib/prisma.js';

const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No authentication token, access denied" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, name: true },
    });    
    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
    next();
  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({code: "TOKEN_EXPIRED", message: "Token expired" });
    }

    res.status(401).json({code: "TOKEN_INVALID", message: "Token is not valid" });
  }
};

export default protectRoute;
