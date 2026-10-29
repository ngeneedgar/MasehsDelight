# Hostinger Deployment & Working Admin Dashboard Plan

A complete architectural and operational plan to deploy **Maseh's Delight** to **Hostinger Web/Cloud Shared Hosting** using a **GitHub Actions CI/CD workflow** (`.github/workflows/deploy.yml`), paired with **Firebase Firestore** for real-time cloud data synchronization of products, blog posts, orders, and inquiries.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Architecture Decisions:**
> - **Hosting Target**: Hostinger Web/Cloud Shared Hosting (`public_html` static directory).
> - **CI/CD Pipeline**: Automated GitHub Actions YAML workflow using secure FTPS to build the Vite production bundle and sync `dist/` directly to Hostinger upon every git push to `main`.
> - **Live Data Sync**: Firebase Firestore for real-time, zero-maintenance cloud database persistence so product edits, blog posts, and order status updates sync across all devices without needing a VPS or backend server on Hostinger.
> - **Admin Access Control**: Dedicated, secure admin authentication with role enforcement allowing bakery staff to manage menu items, pricing, inventory, and journal articles from anywhere.

---

## 1. Overview & Core Concept

### What It Delivers
1. **Hostinger Production Deployment**:
   - A single-command Vite build (`npm run build`) generating an optimized client-side SPA (`dist/`).
   - Apache/LiteSpeed `.htaccess` configuration inside `public/` to ensure client-side routing works smoothly on Hostinger without `404 Not Found` errors.
2. **GitHub Actions Automated Pipeline (`deploy.yml`)**:
   - Automated lint, type-check, and build verification on push to `main`.
   - Secure deployment using `SamKirkland/FTP-Deploy-Action` or `lftp` targeting Hostinger FTP credentials stored in GitHub Repository Secrets.
3. **Working Admin Dashboard with Cloud Persistence**:
   - **Product Manager**: Create, edit, toggle in/out of stock, adjust tier pricing, and delete menu items directly with instant cloud synchronization.
   - **Journal / Post Manager**: Full CRUD for bakery blog posts (kitchen secrets, heritage stories, event guides, featured images) with live updates on the storefront.
   - **Order & Inquiry Hub**: Real-time kitchen prep board and bespoke inquiry approval workflow connected to Firestore.

---

## 2. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DEVELOPMENT & CI/CD                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                             git push origin main
                                     ▼
                ┌─────────────────────────────────────────┐
                │        GitHub Actions CI/CD             │
                │  1. Checkout repo                       │
                │  2. Setup Node.js & npm ci              │
                │  3. Inject Firebase secrets             │
                │  4. npm run build (creates /dist)       │
                │  5. Deploy via FTPS to Hostinger        │
                └─────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            HOSTINGER HOSTING                                │
└─────────────────────────────────────────────────────────────────────────────┘
                 Hostinger Web / Cloud Shared Server
               ┌─────────────────────────────────────┐
               │  public_html/                       │
               │  ├── index.html                     │
               │  ├── assets/ (.js, .css, images)     │
               │  └── .htaccess (SPA URL rewrites)   │
               └─────────────────────────────────────┘
                                     │
                 Client Browser loads SPA
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE FIRESTORE                                │
└─────────────────────────────────────────────────────────────────────────────┘
          Cloud Firestore (Google Cloud / Firebase Enterprise)
       ┌───────────────────────────────────────────────────────┐
       │ Collections:                                          │
       │  ├── /products/ (Pastries, cakes, pricing, photos)    │
       │  ├── /posts/ (Blog articles, stories, categories)     │
       │  ├── /orders/ (Customer orders, deposits, status)     │
       │  └── /inquiries/ (Bespoke cake quotes & catering)     │
       └───────────────────────────────────────────────────────┘
                               ▲                      ▲
                               │                      │
             Public Storefront (Read-only)    Admin Dashboard (Read/Write)
```

### Data Collections & Schemas
- **`/products/{productId}`**:
  - `id`: string (e.g. `puff-puff-golden`)
  - `name`: string
  - `category`: `'Chewable' | 'Fondant Cakes' | 'Savory Pastries'`
  - `description`: string
  - `imageUrl`: string (CDN or media link)
  - `sizes`: array of `{ label: string, price: number, piecesCount?: string }`
  - `flavorNotes`: array of strings
  - `active`: boolean (in-stock toggle)
  - `updatedAt`: timestamp
- **`/posts/{postId}`**:
  - `id`: string (slug)
  - `title`: string
  - `excerpt`: string
  - `content`: array of strings (paragraphs)
  - `category`: string
  - `readTime`: string
  - `publishedDate`: string
  - `featuredImage`: string
  - `author`: `{ name: string, role: string }`
  - `relatedProductId`: optional string
  - `updatedAt`: timestamp
- **`/orders/{orderId}`**:
  - Customer contact, item lines, total, deposit, event date, status (`Awaiting Confirmation`, `Preparing`, `Ready`, `Delivered`).
- **`/inquiries/{inquiryId}`**:
  - Bespoke cake requests, guest count, cake tier, pastry addons, estimated quote, baker status.

---

## 3. Step-by-Step Implementation Plan

### Step 1: SPA Routing Configuration (`public/.htaccess`)
Hostinger runs on LiteSpeed / Apache. Single-page applications require URL rewriting so routes like `/admin`, `/track-order`, or deep links don't return 404 when refreshed.
- Create `/public/.htaccess` with:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```

### Step 2: GitHub Actions Workflow (`.github/workflows/deploy.yml`)
Create an automated deployment script that triggers on every push to `main`:
- Checks out code.
- Installs dependencies with `npm ci`.
- Runs TypeScript build (`npm run build`).
- Uploads the compiled `dist/` directory to Hostinger via FTPS (`SamKirkland/FTP-Deploy-Action`).
- Requires three secrets configured in GitHub repo settings (**Settings > Secrets and variables > Actions**):
  - `HOSTINGER_FTP_SERVER` (e.g., `ftp.yourdomain.com` or Hostinger IP)
  - `HOSTINGER_FTP_USERNAME` (Hostinger FTP username)
  - `HOSTINGER_FTP_PASSWORD` (Hostinger FTP password)

### Step 3: Firebase Firestore Cloud Setup
- Initialize Firebase via the standard AI Studio flow (`show_aistudio_ui` with `firebase_setup` -> `ProvisionFirebase`).
- Generate `firebase-blueprint.json` and hardened `firestore.rules`:
  - **Public Read Access**: Allow public reads for active `/products` and `/posts`.
  - **Public Create Access**: Allow public creation for `/orders` and `/inquiries`.
  - **Admin Restricted Write**: Restrict updates and deletions of `/products`, `/posts`, `/orders`, and `/inquiries` to authorized admin credentials.
- Add real-time sync listeners (`onSnapshot`) in `BakeryContext` with automatic fallback to initial bakery data if offline.

### Step 4: Admin Dashboard Enhancement for Posts & Products
- Add a dedicated **"Blog / Stories" tab** in `AdminDashboard.tsx`:
  - View all published articles.
  - "New Article" modal with fields for Title, Category, Reading Time, Excerpt, Content paragraphs, Featured Image URL, and Author.
  - Edit and Delete existing articles with live Firestore updates.
- Refine the **"Inventory & Menu" tab** in `AdminDashboard.tsx`:
  - Edit product names, descriptions, flavor badges, and individual size variant pricing.
  - Instant one-click toggle for Out-of-Stock / In-Stock.
  - Add new pastry or cake products with instant live reflection on the public storefront.

### Step 5: Verification & Deployment Walkthrough Guide
- Test full local build via `npm run build`.
- Provide concise, step-by-step instructions for the user to:
  1. Create their FTP account in Hostinger hPanel.
  2. Add the 3 secrets to GitHub.
  3. Push to GitHub to trigger the automated live deployment.
