// backend/server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

// Читаем базу
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

// Записываем базу
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

// Логин для админки
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

// --- Товары ---
app.get("/products", (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});

// --- Авторизация ---
app.post("/admin/login", (req, res) => {
  const { login, password } = req.body;
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    res.json({ status: "ok" });
  } else {
    res.status(401).json({ status: "error", message: "Неверный логин или пароль" });
  }
});

// --- Создание заказа ---
app.post("/order", (req, res) => {
  const db = readDB();
  const orders = db.orders || [];
  const products = db.products || [];

  const orderData = req.body;

  // Нормализуем товары (один или несколько)
  const items = (orderData.items || [orderData]).map(it => {
    const product = products.find(p => p.id === it.productId) || {};
    return {
      name: it.name || product.name || "Товар",
      price: it.price || product.price || 0,
      qty: it.qty || 1,
      size: it.size || "-",
      image: product.image || null
    };
  });

  const newOrder = {
    id: orders.length + 1,
    items,
    customerName: orderData.name || "",
    phone: orderData.phone || "",
    address: orderData.address || "",
    date: new Date().toISOString()
  };

  orders.push(newOrder);
  db.orders = orders;
  writeDB(db);

  console.log("📦 Новый заказ:", newOrder);
  res.json({ status: "ok", message: "Заказ принят!" });
});

// --- Получение всех заказов ---
app.get("/orders", (req, res) => {
  const db = readDB();
  res.json(db.orders || []);
});

// --- Запуск ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));
