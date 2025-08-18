import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Подключение к SQLite
const dbPromise = open({
  filename: "database.sqlite",
  driver: sqlite3.Database
});

// Хранилище токенов в памяти
const sessions = new Set();

// 🔑 Пароль администратора
const ADMIN_PASSWORD = "MySecret123";

// 🔹 Логин
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(16).toString("hex");
    sessions.add(token);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Неверный пароль" });
  }
});

// 🔹 Middleware для защиты
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (sessions.has(token)) {
    next();
  } else {
    res.status(403).json({ error: "Нет доступа" });
  }
}

// 🔹 Отдаём заказы (только для авторизованных)
app.get("/orders", authMiddleware, async (req, res) => {
  const db = await dbPromise;
  const orders = await db.all("SELECT * FROM orders ORDER BY created_at DESC");
  res.json(orders);
});

// 🔹 Создание заказов (без авторизации)
app.post("/order", async (req, res) => {
  const { productId, product, price, name, phone } = req.body;
  if (!productId || !name || !phone) {
    return res.status(400).json({ error: "Не хватает данных" });
  }

  const db = await dbPromise;
  await db.run(
    "INSERT INTO orders (product_id, product_name, price, customer_name, customer_phone) VALUES (?, ?, ?, ?, ?)",
    [productId, product, price, name, phone]
  );

  res.json({ message: "Заказ принят!" });
});

app.listen(3000, () => console.log("✅ Сервер запущен на http://localhost:3000"));
