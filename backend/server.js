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

// Заказы в памяти
let orders = [];

// Логин для админки (хранится на сервере)
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

// Список товаров
app.get("/products", (req, res) => {
  res.json(products);
});

// Проверка логина
app.post("/admin/login", (req, res) => {
  const { login, password } = req.body;
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    res.json({ status: "ok" });
  } else {
    res.status(401).json({ status: "error", message: "Неверный логин или пароль" });
  }
});

// Оформление заказа
app.post("/order", (req, res) => {
  const order = req.body || {};
  const newOrder = {
  id: orders.length + 1,
  product: order.product,
  price: order.price,
  name: order.name,
  phone: order.phone,
  address: order.address, // <- здесь добавлено
  date: new Date()
};
  orders.push(newOrder);
  console.log("Новый заказ:", newOrder);
  res.json({ status: "ok", message: "Заказ принят!" });
});

// Получение всех заказов
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));
