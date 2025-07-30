import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from '../src/middlewares/globalErrorHandler.js';
import { routes } from './routes/index.js';
import fs from 'fs'

dotenv.config();
const app = express();

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "WELCOME TO WHITEBOARDTEC...!"
  });
});
app.get("/debug-path", (req, res) => {
  res.json({
    staticPath: path.join(__dirname, 'uploads'),
    fileExists: fs.existsSync(path.join(__dirname, 'uploads/portfolioWorkFiles/3db8c289-7fe6-47fc-a896-70dfe639f253.pdf'))
  });
});


app.use("/api", routes);

// Error handler should come *after* routes and static handlers
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Serving static files from:", path.join(__dirname, 'uploads'));

  console.log(`Server is running at http://localhost:${PORT}`);
});
