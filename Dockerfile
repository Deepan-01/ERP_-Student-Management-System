# ═══════════════════════════════════════════════════════════════
#  STAGE 1 — Build React Frontend
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies first (better layer caching)
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY frontend/ .
RUN npm run build


# ═══════════════════════════════════════════════════════════════
#  STAGE 2 — Build Backend & Install Production Dependencies
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .


# ═══════════════════════════════════════════════════════════════
#  STAGE 3 — Final Production Image
#  Nginx serves React; Node serves API; supervisord runs both
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS production

# Install nginx and supervisor to run both services in one container
RUN apk add --no-cache nginx supervisor

# ── Nginx config ──────────────────────────────────────────────
RUN mkdir -p /run/nginx
COPY --from=frontend-builder /app/frontend/build /usr/share/nginx/html

RUN cat > /etc/nginx/http.d/default.conf <<'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # React Router SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy all /api/* requests to the Node backend
    location /api/ {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
EOF

# ── Backend ───────────────────────────────────────────────────
WORKDIR /app/backend
COPY --from=backend-builder /app/backend .

# ── Supervisor config (runs nginx + node together) ────────────
RUN cat > /etc/supervisord.conf <<'EOF'
[supervisord]
nodaemon=true
logfile=/var/log/supervisord.log

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:node]
command=node /app/backend/server.js
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

# ── Security: non-root user ───────────────────────────────────
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app /usr/share/nginx/html
# nginx needs root to bind port 80 — supervisor runs as root, spawns nginx
# node child runs as the process user set by supervisor env below

# ── Environment variables (override at runtime) ───────────────
ENV NODE_ENV=production \
    PORT=5000 \
    MONGO_URI=mongodb://mongo:27017/yourdbname \
    JWT_SECRET=change_this_secret \
    JWT_EXPIRES_IN=7d

# Expose only port 80 (nginx) — node is internal only
EXPOSE 80

# Health check on nginx
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
