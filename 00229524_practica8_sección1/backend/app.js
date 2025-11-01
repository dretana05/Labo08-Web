// app.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import controllers from './controllers/controllers.js';
import { pool } from "./data/connection.js";

const app = express();
const PORT = 3000;
const JWT_SECRET = "your_jwt_secret"; // Use a strong, secure key in production

app.use(bodyParser.json());
app.use(cors());

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Routes
app.post("/signin", async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    )

    const isPasswordValid = true
    const user = { id: 1, email }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor", error: err.message })
  }
})

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected data accessed", user: req.user });
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', verifyToken, controllers.getUsers);
app.get('/users/:id', verifyToken, controllers.getUserById);
app.post('/users', verifyToken, controllers.createUser);
app.put('/users/:id', verifyToken, controllers.updateUser);
app.delete('/users/:id', verifyToken, controllers.deleteUser);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))

const generarHash = async () => {
  const passwordOriginal = "1234";
  const saltRounds = 10;

  const hash = await bcrypt.hash(passwordOriginal, saltRounds);
  console.log("Contraseña original:", passwordOriginal);
  console.log("Hash generador:", hash)
};