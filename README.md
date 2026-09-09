# AURA Fashion — Luxury E-Commerce Shopify OS 2.0 Theme

A modern, high-fashion storefront built on the Shopify Dawn Online Store 2.0 architecture, featuring **Tailwind CSS**, a **Custom 4-Column Mega Menu with 2x2 Promo Image Grid**, dynamic **Shopify Navigation Integration**, an **Off-Canvas Mobile Drawer**, and an **80% Centered Desktop Layout**.

---

## ✨ Key Features & Customizations

### 1. Brand Identity & High-Fashion Design
- **Typography & Aesthetics**: Custom Garamond italic serif brand logo (`AURA`), crisp minimalist typography, and high-fashion color palette (`#0F0F11`, `#FFFFFF`, `#EF4444` for Sale items).
- **80% Centered Desktop Layout**: Main content (`.page-width`) is centered at `80%` viewport width on Laptop/Desktop screens (`≥ 990px`) for a spacious, luxury boutique feel.

### 2. Tailwind CSS Integration
- Tailwind CSS utility framework loaded in `layout/theme.liquid` for rapid responsive design, hover animations, grid layouts, and clean UI components.

### 3. Custom 4-Column Mega Menu + 2x2 Promo Image Grid
- **Full-Width Header Dropdown**: Spans `100%` width attached directly to the bottom border of the header bar without horizontal scrollbar overflow.
- **Invisible Hover Bridge (`::before`)**: Built-in 24px transparent hit area between the navigation text items and dropdown panel to eliminate mouse hover flicker.
- **Inline Arrow Indicators**: Dropdown arrows (`˅`) stay strictly on the same line as the category title (`Women ˅`, `Men ˅`, `Kids ˅`).
- **2x2 Featured Promo Image Grid**: Displays 4 square promo cards on the right side of the mega menu with hover zoom animations.
- **Merchant-Configurable in `{% schema %}`**: Image pickers (`promo_image_1` to `promo_image_4`) and URL links editable directly in **Shopify Theme Editor** (**Online Store → Themes → Customize**).

### 4. Mobile Off-Canvas Navigation Drawer
- **Responsive Hamburger Toggle (`☰`)**: Shown strictly on mobile/tablet viewports (`< 990px`) and hidden on desktop.
- **Slide-in Off-Canvas Drawer**: Smooth slide-in menu with glassmorphism backdrop blur, navigation links, customer account, and wishlist shortcuts.

### 5. Shopify Online Store 2.0 Platform Standards
- **Zero Hardcoded Data**: All menus dynamically pulled from Shopify Navigation (`linklists[section.settings.menu]`).
- **Liquid Route Helpers**: Uses native `routes` helpers (`routes.root_url`, `routes.cart_url`, `routes.account_url`, `routes.all_products_collection_url`, `routes.collections_url`).
- **Validated & Compliant**: 100% passes `shopify theme check` with 0 errors.

---

## 📁 Directory Structure

```
.
├── assets/             # Static CSS, JS & Tailwind assets (aura-base.css, component styles)
├── blocks/             # Customizable OS 2.0 theme blocks
├── config/             # Theme settings schema & default data (settings_schema.json)
├── layout/             # Top-level layout wrappers (theme.liquid)
├── locales/            # Translation files (en.default.json)
├── sections/           # Modular page sections (aura-header.liquid, aura-hero-banner.liquid, etc.)
├── snippets/           # Reusable Liquid fragments (header-mega-menu.liquid, card-product.liquid)
└── templates/          # OS 2.0 JSON page templates (index.json, product.json, collection.json)
```

---

## 🛠️ Developer Setup & Commands

### 1. Start Local Development Server
To launch the Shopify CLI local development server and preview changes in real time:
```bash
shopify theme dev
```
Preview storefront locally at: `http://127.0.0.1:9292`

### 2. Run Shopify Theme Check (Linter)
To validate Liquid syntax, schema definitions, and platform compliance:
```bash
shopify theme check
```

---

## 📜 License
Built on top of Shopify Dawn. Copyright (c) 2026 AURA Fashion / Shopify Inc.
