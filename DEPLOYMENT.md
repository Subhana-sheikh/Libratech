# 🚀 Libratech Deployment Guide (Free & Fast)

Ye guide aapko Libratech ko bilkul free me internet par live deploy karne ke pure steps batata hai.

---

## 🌟 Architecture Overview
- **Frontend (UI)**: [Vercel](https://vercel.com) (Superfast, Free SSL, 1-Click Deploy)
- **Backend (API)**: [Render](https://render.com) (Free Node.js Web Service)
- **Database (Optional)**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Free M0 Cluster)

---

## 1️⃣ STEP 1: Deploy Frontend on Vercel (2 Minutes)

1. **Vercel** website par jayein: [https://vercel.com](https://vercel.com)
2. **Continue with GitHub** par click karke login karein.
3. Dashboard par **"Add New..."** ➡️ **"Project"** par click karein.
4. Apni GitHub repository **`Subhana-sheikh/Libratech`** ko **"Import"** karein.
5. Settings me:
   - **Framework Preset**: Vite (automatic detect hoga)
   - **Root Directory**: `client` select karein (Edit par click karke `client` choose karein)
6. **"Deploy"** button dabayein!
7. 60 seconds ke andar aapko ek live public link mil jayega jaise:
   `https://libratech-subhana.vercel.app` 🎉

---

## 2️⃣ STEP 2: Deploy Backend on Render (Free)

1. **Render** website par jayein: [https://render.com](https://render.com)
2. **Sign in with GitHub** karein.
3. **"New +"** ➡️ **"Web Service"** select karein.
4. Apni repository **`Subhana-sheikh/Libratech`** select karein.
5. Configuration settings:
   - **Name**: `libratech-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. **Environment Variables** (Add Environment Variable button dabayein):
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `JWT_SECRET` = `libratech_super_secret_production_key_2026`
   - `CLIENT_URL` = (Apna Vercel wala link, e.g. `https://libratech-subhana.vercel.app`)
   - `MONGODB_URI` = (MongoDB Atlas string ya default rehne dein)
7. **"Deploy Web Service"** par click karein.
8. Render aapko ek live backend URL dega:
   `https://libratech-api.onrender.com`

---

## 3️⃣ STEP 3: Connect Frontend to Backend (Final Step)

1. Vercel dashboard me jayein ➡️ Apne project par click karein.
2. **Settings** ➡️ **Environment Variables** me jayein.
3. Naya variable add karein:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://libratech-api.onrender.com/api` (Apna Render Backend URL)
4. **Deployments** tab me jakar latest commit par **"Redeploy"** click kar dein.

**Mubarak ho! Aapki poori Libratech website worldwide live ho chuki hai!** 🚀
