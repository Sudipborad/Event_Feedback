# FeedbackHub - Production Deployment Guide

This guide describes how to deploy the FeedbackHub backend (Fastify) and frontend (React/Vite) to production environments using **MongoDB Atlas**, **Render**, and **Vercel**.

---

## 1. MongoDB Atlas Setup (Database Cloud)

1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. **Create a Cluster**: Spin up a free-tier shared cluster (Shared M0) in your preferred region.
3. **Configure Database Access User**:
   - Go to **Security** -> **Database Access**.
   - Click **Add New Database User**.
   - Create a user with **Read and write to any database** privilege (e.g. user `admin`).
4. **Configure Network IP Access**:
   - Go to **Security** -> **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) so cloud servers like Render can connect.
5. **Get Connection String**:
   - Navigate to the **Database Deployments** panel.
   - Click **Connect** on your cluster.
   - Select **Drivers** (Node.js).
   - Copy the connection string format: `mongodb+srv://admin:<password>@cluster.mongodb.net/event_feedback?retryWrites=true&w=majority`.

---

## 2. Fastify Backend Deployment (Render)

1. **Prepare Code**: Ensure your repository is pushed to GitHub.
2. **Create Render Service**:
   - Log into [Render](https://render.com/).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.
3. **Configure Project Settings**:
   - **Name**: `feedback-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Define Environment Variables**:
   - Add the following keys in Render's **Environment** tab:
     - `PORT`: `10000` (Render's default)
     - `HOST`: `0.0.0.0` (Mandatory for external cloud routing)
     - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app` (Your production frontend URL)
     - `MONGODB_URI`: `mongodb+srv://admin:<password>@cluster.mongodb.net/event_feedback`
5. **Deploy**: Click **Create Web Service**. Render will build and expose a public URL (e.g., `https://feedback-api.onrender.com`).

---

## 3. React Frontend Deployment (Vercel)

1. **Configure API Base URL**:
   - Open [src/services/api.js](file:///c:/Users/HP/Desktop/InternShip/src/services/api.js) and update the `API_BASE_URL` to reference your live Render API URL instead of `localhost` (or bind it to an environment variable like `import.meta.env.VITE_API_URL` to support both dev and prod).
2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com/) and import your project.
   - Set the following configurations:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
3. **Deploy**: Click **Deploy**. Vercel will compile and host your static files, generating your live client link.
