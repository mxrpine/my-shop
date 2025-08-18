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

// Хранение заказов в памяти
let orders = [];

// Оформление заказа (с id и датой)
app.post("/order", (req, res) => {
  const order = req.body || {};

  const newOrder = {
    id: orders.length + 1,
    product: order.product,
    price: order.price,
    name: order.name,
    phone: order.phone,
    date: new Date()
  };

  orders.push(newOrder);
  console.log("Новый заказ:", newOrder);

  res.json({ status: "ok", message: "Заказ принят! Мы свяжемся с вами." });
});

// Роут для админки — получить все заказы
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Railway передаёт порт через переменную окружения
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));
