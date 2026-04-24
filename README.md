# BFHL — SRM Full Stack Engineering Challenge

## Project Structure

```
bfhl-project/
├── server.js       ← Express API (POST /bfhl)
├── package.json
├── index.html      ← Frontend (single-page, no framework)
└── README.md
```

---

## ✏️ Step 1 — Fill in your credentials

Open `server.js` and update lines 7–9:

```js
const USER_ID = 'yourfullname_ddmmyyyy';   // e.g. johndoe_17091999
const EMAIL_ID = 'your@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2211003XXXXXX';
```

---

## 🚀 Step 2 — Run locally

```bash
npm install
npm start
# API running at http://localhost:3000
```

Test it:
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data":["A->B","A->C","B->D","hello","A->A"]}'
```

Open `index.html` directly in your browser (just double-click it — no build step needed).

---

## ☁️ Step 3 — Deploy the API to Render (free)

1. Push this folder to a **public GitHub repo**
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Deploy → copy your URL, e.g. `https://bfhl-api.onrender.com`

---

## 🌐 Step 4 — Deploy the Frontend to Netlify (free)

Option A — drag & drop:
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag your `index.html` file
3. Done — copy the URL

Option B — via CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

> After deploying the API, update the default URL in `index.html` line:
> ```js
> <input ... value="https://your-api.onrender.com" ...>
> ```

---

## 📋 Submission Checklist

- [ ] `user_id`, `email_id`, `college_roll_number` filled in
- [ ] API hosted (Render / Railway / Vercel / etc.)
- [ ] Frontend hosted (Netlify / Vercel / etc.)
- [ ] GitHub repo is public
- [ ] CORS enabled (already done in server.js)
- [ ] `POST /bfhl` accepts `application/json`
