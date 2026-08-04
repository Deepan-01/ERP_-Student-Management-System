# 🚀 GitHub Pages Deployment Guide

## What was fixed:

1. ✅ **Vite Base Path** - Set to `/ERP_-Student-Management-System/`
2. ✅ **API Configuration** - Made dynamic via `VITE_API_URL` environment variable
3. ✅ **GitHub Actions Workflow** - Auto-deploy on push to main/master

---

## How to Deploy to GitHub Pages

### Step 1: Push changes to GitHub
```bash
git add .
git commit -m "Fix GitHub Pages deployment configuration"
git push origin main
```

### Step 2: GitHub Actions will automatically:
- Build the frontend with `npm run build`
- Deploy to `gh-pages` branch
- Your site will be live at: `https://deepan-01.github.io/ERP_-Student-Management-System/`

### Step 3: Configure GitHub Pages Settings (One-time)
1. Go to repository **Settings** → **Pages**
2. Source: Select **Deploy from a branch**
3. Branch: Select **gh-pages**
4. Click **Save**

---

## Using the Frontend with Different Backends

### Local Development
```bash
cd frontend
npm install
npm run dev
# Automatically uses: http://localhost:5000/api
```

### With Render Backend
Create `.env.local` in frontend folder:
```
VITE_API_URL=https://erp-backend.onrender.com/api
```

Then:
```bash
npm run build
npm run preview
```

---

## Troubleshooting

### GitHub Pages shows blank page
1. Check GitHub Actions workflow status: Go to **Actions** tab
2. If build fails, check the logs for errors
3. Verify `gh-pages` branch exists in repository
4. Clear browser cache: **Ctrl+Shift+R**

### Frontend can't connect to backend
1. Check browser console: **F12** → **Console**
2. Look for CORS errors
3. Verify backend API URL is correct
4. Backend must be running and accessible

### Build fails in GitHub Actions
1. Go to **Actions** → **Workflow run**
2. Check the build logs
3. Common issues:
   - Missing dependencies: Check `package.json`
   - Node version incompatibility
   - Disk space issues

---

## Environment Variables Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## Files Modified

- ✏️ `frontend/vite.config.js` - Added base path and build config
- ✏️ `frontend/src/services/api.js` - Made API URL configurable
- ✏️ `frontend/.env.example` - Example environment variables
- ✨ `.github/workflows/deploy-frontend.yml` - GitHub Actions workflow

---

## Live URLs

After deployment:
- **Frontend**: https://deepan-01.github.io/ERP_-Student-Management-System/
- **Backend**: https://erp-backend.onrender.com (separate deployment)

---

## Need Help?

If something doesn't work:
1. Check GitHub Actions logs
2. Verify browser console for errors (F12)
3. Ensure backend is running or deployed
4. Try hard refresh: **Ctrl+Shift+R**
