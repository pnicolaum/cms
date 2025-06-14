import prisma from '../lib/prisma.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}; 

export const register = async (req, res) => {
  const { email, username, name, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUserByEmail = await prisma.user.findUnique({where: { email } });
  if (existingUserByEmail) return res.status(409).json({ message: "Email already in use" });
  
  const existingUserByUsername = await prisma.user.findUnique({where: { username }});
  if (existingUserByUsername) return res.status(409).json({ message: "Username already in use" });
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  try {
    const user = await prisma.user.create({
      data: { email, username, name, password: hashedPassword, },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(400).json({ error: "No se pudo crear el usuario", details: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({where: { email }});
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
    
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};