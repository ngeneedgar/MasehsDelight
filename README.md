# Maseh’s Delights — Premium African Pastries & Custom Cakes

A production-ready, colorful, and responsive online ordering platform for **Maseh’s Delights**, specializing in authentic West African pastries (Puff Puff, Chin Chin, Fish Rolls, Peanut Burger) and custom celebration fondant cakes.

Built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and an **Express.js** backend configured for **Payment on Delivery** and direct deployment to **Hostinger (Node.js)** or cloud environments.

---

## 🎂 Brand Assets & Design System

- **Color Palette**:
  - Chocolate: `#3A1F1F`
  - Dark Brown: `#4B2926`
  - Deep Burgundy: `#8E2745`
  - Raspberry: `#D93462`
  - Warm Cream: `#FFF8F0`
  - Soft Ivory: `#FFFCF8`
  - Honey Gold: `#F5C84B`
  - Coral: `#F47B68`
  - Sage Green: `#4C9B72`
- **Branding**:
  - Color Logo: `https://i.postimg.cc/QN2hWDTv/maseh-color.png`
  - White Logo: `https://i.postimg.cc/bY7p2PtW/maseh-white.png`
  - Favicon: `https://i.postimg.cc/L4c2ZS17/maseh-fav.png`
- **Order Policy**:
  - **Payment on Delivery**: No advance credit card required. Customers inspect fresh treats and pay cash or local mobile transfer upon arrival or at pickup.

---

## 🚀 Key Features

1. **Online Ordering & Cart**:
   - Centralized product database with custom portions and batch catering sizes.
   - Persistent client cart with quantity steppers and special preparation notes.
   - Custom celebration cake configuration (flavors, tiers, color themes, cake message banner).
2. **Payment on Delivery Checkout**:
   - Zero merchant gateway fees or card exposure.
   - Full delivery and pickup date selection with minimum advance lead times.
   - Agreement checkboxes confirming understanding of payment collection upon delivery.
   - Instant order number generation (e.g. `MD-2026-XXXX`).
3. **Order Confirmation & Tracking**:
   - Live visual kitchen pipeline (`Pending` → `Confirmed` → `Preparing` → `Ready for pickup` → `Completed`).
   - Printable order receipt summary.
   - Instant WhatsApp messaging link with pre-filled order reference.
4. **Operations Hub & Admin Dashboard**:
   - Protected by staff PIN (`2025`) or master credentials (`Masehs@2025@.`).
   - Real-time kanban and table view of all incoming orders.
   - Daily kitchen prep sheet with aggregated batch totals for frying and baking.
   - Menu pricing & stock availability toggles.
   - Custom cake consultation reviews and quote approvals.
5. **REST API Backend**:
   - `GET /api/products` & `GET /api/products/:slug`
   - `POST /api/orders` (server recalculates and validates product totals securely)
   - `GET /api/orders/:orderNumber`
   - `POST /api/contact` & `POST /api/custom-cake-inquiries`
   - `POST /api/admin/login` & `GET /api/admin/orders`
   - `PATCH /api/admin/orders/:id` & `PATCH /api/admin/products/:id`

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (Express + Vite middlewares on port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

---

## 🌐 Hostinger Node.js Deployment Guide

### 1. Hostinger Node.js Application Setup
1. Log into your **Hostinger hPanel**.
2. Navigate to **Websites** → select `masehsdelight.com` → **Node.js**.
3. Create or configure your Node.js application with the following settings:
   - **Node.js Version**: `v20.x` or `v22.x`
   - **Application Mode**: `Production`
   - **Application Root**: `public_html` (or your chosen repository directory)
   - **Application Startup File**: `server.ts` (or `server.js` if compiled via esbuild)
   - **Custom Start Command**: `npm run start`

### 2. Environment Variables Configuration
In the Hostinger Node.js management panel under **Environment Variables**, add:
- `PORT`: (Hostinger automatically provides this port or binds to 3000)
- `NODE_ENV`: `production`
- `ADMIN_EMAIL`: `edgarngene@gmail.com`
- `BUSINESS_PHONE`: `+1 (240) 619-0313`
- `BUSINESS_WHATSAPP`: `https://wa.me/12406190313`

### 3. Build & Startup Execution
In the Hostinger terminal or via SSH:
```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the client SPA bundle to dist/
npm run build

# Start or restart the Node.js application
npm run start
```
Hostinger's Passenger or PM2 process manager will keep `server.ts` active and serve both the REST API and the static frontend.

### 4. Continuous Deployment via GitHub Actions
This project includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`. Whenever you export or push changes to GitHub, the workflow automatically:
1. Runs `npm install --legacy-peer-deps`
2. Compiles the frontend via `npm run build`
3. Transfers production files to Hostinger FTPS.

---

## 🔒 Master Bakery Staff Credentials
- **Staff Quick PIN**: `2025`
- **Bakery Master Password**: `Masehs@2025@.`
- **Admin Email**: `edgarngene@gmail.com`
- **Dashboard Access**: Access via `https://masehsdelight.com/#admin` or click **Staff Portal** in the website footer.
