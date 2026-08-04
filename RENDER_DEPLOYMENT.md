# 🚀 Render Deployment Guide - ERP Student Management System

## Prerequisites
1. GitHub account with access to the repo
2. Render account (free at https://render.com)
3. MongoDB Atlas account (free tier available)

---

## Step 1: Create MongoDB Atlas Cluster (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/erp_student_management`
5. Copy this connection string

---

## Step 2: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository: `Deepan-01/ERP_-Student-Management-System`
5. Fill in the details:
   - **Name**: `erp-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or paid if needed)

6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: `mysecretkey`
   - `PORT`: `5000`

7. Click **"Create Web Service"**
8. Wait for deployment (5-10 minutes)
9. Copy the backend URL (e.g., `https://erp-backend.onrender.com`)

---

## Step 3: Deploy Frontend on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository (same repo)
4. Fill in the details:
   - **Name**: `erp-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL from Step 2 (e.g., `https://erp-backend.onrender.com`)

6. Click **"Create Static Site"**
7. Wait for deployment (3-5 minutes)

---

## Step 4: Update Frontend API Configuration (If Needed)

If the frontend can't connect to backend, update the API base URL in:
- File: `frontend/src/services/api.js` or similar

Change:
```javascript
const API_BASE_URL = "http://localhost:5000";
```

To:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:5000";
```

---

## Step 5: Test the Deployment

1. Open your frontend URL from Render
2. Login with:
   - **Email**: `admin@erp.com`
   - **Password**: `admin123`
3. Verify all features work

---

## Troubleshooting

### Backend won't start
- Check Render logs: Dashboard → Service → Logs
- Verify `MONGO_URI` is correct
- Ensure MongoDB cluster is active

### Frontend can't connect to backend
- Check browser console (F12)
- Verify `VITE_API_URL` environment variable
- Check CORS settings in backend (`server.js`)

### Build fails
- Check build command is correct for your directory structure
- Ensure `package.json` exists in backend/frontend folders

---

## Live URLs After Deployment
- **Frontend**: `https://erp-frontend.onrender.com` (example)
- **Backend**: `https://erp-backend.onrender.com` (example)

---

## Need Help?
If something doesn't work:
1. Check Render dashboard logs
2. Verify environment variables
3. Ensure MongoDB is connected
4. Check GitHub actions/deployments

Happy deploying! 🎉
