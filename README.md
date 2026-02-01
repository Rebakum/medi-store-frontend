## My project name: Medi-store
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

```
medi-store-frontend/
│
├── app/                        # Next routes
│   │
│   ├── (public)/              # public pages group
│   │   ├── page.tsx           # Home
│   │   ├── shop/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   └── product/[id]/
│   │       └── page.tsx
│   │
│   ├── (auth)/                # auth group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (dashboard)/           # protected area
│   │   ├── layout.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── users/page.tsx
│   │   │
│   │   └── customer/
│   │       ├── page.tsx
│   │       └── orders/page.tsx
│   │
│   ├── api/                   # next api routes (optional)
│   │
│   ├── layout.tsx             # root layout
│   └── globals.css
│
├── components/                # shared components
│   │
│   ├── layout/               # navbar/sidebar/footer
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   │
│   ├── common/               # reusable
│   │   ├── product-card.tsx
│   │   ├── loading.tsx
│   │   └── empty.tsx
│   │
│   └── ui/                   # shadcn components
│
├── features/                 # feature based logic
│   ├── auth/
│   │   ├── auth.service.ts
│   │   └── auth.hooks.ts
│   │
│   ├── products/
│   │   ├── product.service.ts
│   │   └── product.slice.ts
│   │
│   └── cart/
│       ├── cart.store.ts
│       └── cart.utils.ts
│
├── lib/                      # helpers
│   ├── axios.ts
│   ├── auth.ts
│   └── utils.ts
│
├── types/                    # TS interfaces
│   ├── product.ts
│   └── user.ts
│
├── hooks/
│   └── useAuth.ts
│
├── public/
│   └── images/
│
├── components.json           # shadcn config
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json

```
## Learn More


## Deploy on Vercel

