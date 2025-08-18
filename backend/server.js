// backend/server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Читаем товары из файла (для прототипа). В продакшене — БД.
const productsPath = path.join(__dirname, "db.json");
let products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

// Список товаров
app.get("/products", (req, res) => {
  res.json(products);
});

// Сохраняем заказы в памяти (для прототипа)
let orders = [];

// Оформление заказа (минимально)
app.post("/order", (req, res) => {
  const order = req.body || {};
  orders.push(order); // добавляем заказ в массив
  console.log("Новый заказ:", order);
  res.json({ status: "ok", message: "Заказ принят! Мы свяжемся с вами." });
});

// Роут для админки — получить все заказы
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Railway передаёт порт через переменную окружения
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));
