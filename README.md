# Мой первый интернет‑магазин (JS + Node + Railway)

Это минимальный прототип, который можно запустить локально и задеплоить бесплатно:
- **Backend**: Node.js + Express (Railway)
- **Frontend**: HTML/CSS/JS (GitHub Pages или Netlify)

## 1) Локальный запуск

Требуется: Node.js и Git (необязательно, но пригодится).

```bash
cd backend
npm install
npm start
# Сервер на http://localhost:3000
```

Открой `frontend/index.html` двойным кликом (или через расширение Live Server в VS Code).
Товары должны загрузиться с `http://localhost:3000/products`.

## 2) Деплой backend на Railway

1. Создай публичный репозиторий на GitHub, загрузи папку `backend`.
2. На https://railway.app → **New Project** → **Deploy from GitHub Repo** → выбери репозиторий.
3. Если у тебя монорепо (backend не в корне), в настройках сервиса Railway укажи **Root Directory** = `backend`.
4. Скрипт запуска: Railway сам выполнит `npm start` (у нас прописано в `package.json`).
5. После деплоя скопируй домен вида `https://<имя>.up.railway.app`.
6. Проверь `GET /products` в браузере: `https://<имя>.up.railway.app/products`.

> На бесплатном плане сервер может "засыпать". Первый запрос после простоя может занимать несколько секунд — это нормально.

## 3) Деплой фронтенда (GitHub Pages)

1. Создай второй репозиторий `my-shop-frontend` на GitHub.
2. Залей туда файлы из папки `frontend/`.
3. В `frontend/index.html` поменяй константу `BACKEND_URL` на Railway URL.
4. В настройках репозитория → **Pages** → Source: **Deploy from a branch**, ветка `main`, папка `/root`.
5. Открой выданный адрес типа `https://username.github.io/my-shop-frontend/` — магазин готов.

Альтернатива: **Netlify** — перетаскиваешь папку `frontend/` в сайт Netlify → получаешь ссылку.

## 4) (Опционально) Уведомления в Telegram

В бэкенд можно добавить отправку уведомления о заказе в Telegram. Для этого:
- Создай бота через @BotFather и получи **BOT_TOKEN**.
- Узнай **CHAT_ID** (например, написав что‑то боту и используя @userinfobot, либо через getUpdates).
- На Railway добавь переменные окружения: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- В `server.js` используй fetch к Bot API:

```js
// Вверху файла: const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.post("/order", async (req, res) => {
  const order = req.body || {};
  try {
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const msg = `Новый заказ: ${order.product} за ${order.price}₽\nИмя: ${order.name}\nТелефон: ${order.phone}`;
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg })
      });
    }
    res.json({ status: "ok", message: "Заказ принят!" });
  } catch (e) {
    console.error(e);
    res.json({ status: "ok", message: "Заказ принят (без Telegram)." });
  }
});
```

## Полезные подсказки
- Если фронт не видит бэк — открой консоль браузера (F12) → вкладка *Network*, посмотри ошибки.
- На Railway для монорепо обязательно укажи **Root Directory**.
- Не храни токены и секреты в `frontend` — только через переменные окружения на бэкенде.

Удачи! 🚀
