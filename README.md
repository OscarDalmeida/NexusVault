# NexusVault — Digital Product Marketplace

A full-stack marketplace for buying and selling digital products. Built with Next.js, TypeScript, Prisma, Stripe, and Tailwind CSS.

## Features

- **15 product categories** — AI tools, templates, courses, design assets, code, music, and more
- **Seller dashboard** — create listings, track sales, view reviews
- **Buyer experience** — browse, search, filter, purchase, review
- **Instant delivery** — file downloads (signed S3 URLs), external links, license keys, custom instructions
- **Stripe payments** — Checkout Sessions for purchases, Connect for seller payouts
- **10% platform commission** — configurable via environment variable
- **Dark-first design** — sleek, modern UI with violet accent

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (credentials + Google OAuth)
- **Payments:** Stripe (Checkout + Connect)
- **Storage:** AWS S3 / Cloudflare R2 (signed URLs)
- **Email:** Resend

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- AWS S3 bucket or Cloudflare R2 bucket
- Resend account (for transactional emails)

### Setup

1. **Clone and install:**
   ```bash
   git clone <repo-url> && cd nexusvault
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Fill in all values in .env
   ```

3. **Database setup:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open** http://localhost:3000

### Stripe Webhook Setup

For local development:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`.

For production, create a webhook endpoint in the Stripe Dashboard pointing to `https://yourdomain.com/api/webhooks/stripe` and listen for:
- `checkout.session.completed`
- `payment_intent.payment_failed`

### S3 / R2 Bucket Configuration

1. Create a bucket (e.g., `nexusvault-files`)
2. Set up CORS to allow uploads from your domain
3. Create IAM credentials with `s3:PutObject` and `s3:GetObject` permissions
4. Add credentials to `.env`

For Cloudflare R2, also set `S3_ENDPOINT` to your R2 endpoint URL.

### Stripe Connect (Seller Payouts)

1. Enable Stripe Connect in your Stripe Dashboard
2. Use destination charges model
3. Sellers onboard via Stripe Connect OAuth flow

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth + signup
│   │   ├── listings/     # CRUD for listings
│   │   ├── orders/       # Checkout + order details
│   │   ├── reviews/      # Review submission
│   │   ├── seller/       # Seller stats
│   │   ├── upload/       # S3 presigned URLs
│   │   ├── webhooks/     # Stripe webhooks
│   │   └── wishlist/     # Wishlist toggle
│   ├── auth/             # Login + signup pages
│   ├── browse/           # Browse + category pages
│   ├── checkout/         # Post-checkout success
│   ├── dashboard/        # Buyer + seller dashboards
│   ├── orders/           # Order detail + delivery
│   ├── product/          # Product detail page
│   └── profile/          # Public seller profile
├── components/
│   ├── layout/           # Navbar, footer
│   └── listings/         # Card, grid, star rating
├── lib/                  # Utilities, config, services
│   ├── auth.ts           # NextAuth config
│   ├── categories.ts     # Category taxonomy
│   ├── db.ts             # Prisma client
│   ├── email.ts          # Resend email templates
│   ├── s3.ts             # S3 upload/download URLs
│   ├── stripe.ts         # Stripe + commission calc
│   ├── utils.ts          # Formatting helpers
│   └── validations.ts    # Zod schemas
└── types/                # TypeScript declarations
```

## Deployment

### Vercel (Frontend)
1. Connect your repo to Vercel
2. Add all environment variables
3. Deploy

### Database (Supabase / Railway)
1. Create a PostgreSQL instance
2. Run `npx prisma migrate deploy`
3. Update `DATABASE_URL` in Vercel env vars

## License

MIT
