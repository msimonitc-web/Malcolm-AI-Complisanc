# Complisey Academy — Master VPS Deployment & Operations Guide
**Hosting Provider:** Namecheap Ubuntu VPS  
**Application Stack:** Node.js (Express Backend) + Vite (React SPA Frontend) + Firebase Firestore + Resend Transactional Email API  
**Last Updated:** September 2026

---

## 1. Architecture Overview
Complisey Academy is a secure, production-grade full-stack web application designed for independent AML/CFT compliance training in Victoria, Mahé, Seychelles. 
* **Backend (`server.ts`):** Express server running on port 3000, handling anti-CSRF protection, security headers (HSTS, CSP), transactional emails (Resend API), and serving the React frontend.
* **Frontend (`src/`):** React 18 + Vite SPA with Tailwind CSS, supporting offline learning (PWA), corporate portals, interactive courses, exams, and certificate generation.
* **Database & Auth:** Firebase Firestore & Firebase Authentication.

---

## 2. Initial VPS Setup on Namecheap Ubuntu (Reference Checklist)

If you are setting up a fresh Ubuntu VPS instance from scratch on Namecheap:

### Step 1: System Update & Node.js Installation
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential
sudo npm install -g pm2
```

### Step 2: Clone Repository & Environment Variables
```bash
cd /var/www
git clone <your-git-repository-url> complisey
cd complisey
cp .env.example .env
nano .env
```
*(Fill in your production Firebase keys, Resend API key, and environment settings in `.env`).*

### Step 3: Build & Start with PM2
```bash
npm install
npm run build
pm2 start server.ts --name "complisey" --interpreter ./node_modules/.bin/tsx
pm2 save
pm2 startup
```

### Step 4: Nginx Reverse Proxy & SSL (Let's Encrypt / Certbot)
Install Nginx and configure reverse proxy to port 3000:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```
Configure `/etc/nginx/sites-available/complisey`:
```nginx
server {
    server_name complisey.com www.complisey.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable site and obtain SSL:
```bash
sudo ln -s /etc/nginx/sites-available/complisey /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d complisey.com -d www.complisey.com
```

---

## 3. Security Headers (HSTS & CSP)
Security headers are automatically enforced in `server.ts`:
* **HSTS (`Strict-Transport-Security`):** `max-age=63072000; includeSubDomains; preload` (forces secure HTTPS connections).
* **CSP (`Content-Security-Policy`)**: Restricts resource loading securely to prevent XSS attacks while allowing Firebase, Unsplash, Google Fonts, and Resend APIs.

---

## 4. User Accounts & First-Login Password Change
* **Admin Accounts:** Malcolm Simon (`malcolm@complisanc.com`) & Eric D'Souza (`eric@complisanc.com`).
* **Enforcement:** Upon their first login, the system automatically prompts `FirstLoginPasswordChangeModal` requiring an immediate secure password update before accessing administrative tools.

---

## 5. Routine Update & Deployment Guide (How to Update Website)

Whenever you make changes in AI Studio / Git and need to push updates to your Namecheap Ubuntu VPS, follow this 4-step sequence:

### 1. SSH into your VPS
```bash
ssh your_username@your_vps_ip
```

### 2. Navigate to your project folder
```bash
cd /var/www/complisey
```

### 3. Pull latest changes and rebuild
```bash
git pull origin main
npm install
npm run build
```

### 4. Restart PM2 server
```bash
pm2 restart complisey
```

Your updated website is now live instantly!

---

## 6. Troubleshooting & Logs
* **View Live Logs:** `pm2 logs complisey`
* **Check Server Status:** `pm2 status`
* **Check Backend Health API:** Visit `https://yourdomain.com/api/health`
