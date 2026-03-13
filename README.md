# Flowe Collective Shop

Salon-curated R+Co and R+Co BLEU product storefront for Flowe Collective.

## Stack
- **Frontend:** Vite + React
- **Payments:** Stripe Checkout
- **Hosting:** Vercel
- **Product images:** R+Co Shopify CDN

## Deploy to Vercel

### 1. Push to GitHub

```bash
cd flowe-shop
git init
git add .
git commit -m "Initial shop setup"
git remote add origin https://github.com/flowecollective/shop.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `flowecollective/shop` repo
3. Framework preset: **Vite**
4. Add environment variables:
   - `STRIPE_SECRET_KEY` = your Stripe secret key (sk_live_...)
   - `NEXT_PUBLIC_URL` = `https://shop.flowecollective.com`
5. Deploy

### 3. Custom domain

1. In Vercel project settings > Domains
2. Add `shop.flowecollective.com`
3. Add CNAME record in your DNS:
   - **Type:** CNAME
   - **Name:** shop
   - **Value:** cname.vercel-dns.com

### 4. Stripe setup

Make sure your Stripe account has:
- Live mode enabled
- The checkout session will create payment intents automatically
- Webhook (optional): set up `checkout.session.completed` webhook for order notifications

## Project structure

```
flowe-shop/
  api/
    checkout.js       # Vercel serverless function for Stripe Checkout
  src/
    App.jsx           # Main shop component
    main.jsx          # React entry point
    products.js       # Product catalog data (68 products)
  index.html          # HTML entry
  package.json
  vite.config.js
  vercel.json         # Vercel routing config
  .env.example        # Environment variable template
```

## Updating products

Edit `src/products.js` to add/remove products, change prices, or update images.
Each product has: id, line, name, sub, cat, sz, price, badge, img.

## Fulfillment

The checkout supports two modes:
- **Ship to Me:** Collects shipping address, $8 flat rate (free over $75)
- **Local Pickup:** No shipping, pickup at Flowe Collective Houston
