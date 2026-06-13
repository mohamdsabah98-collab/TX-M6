# Development Guide

## Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
│  - React Components                     │
│  - Tailwind CSS Styling                 │
│  - Framer Motion Animations             │
│  - State Management (Zustand)           │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────┐
│      Backend (Express.js)               │
│  - API Routes                           │
│  - Business Logic (Services)            │
│  - Database Operations (Prisma)         │
│  - Authentication (JWT/OAuth)           │
└────────────────┬────────────────────────┘
                 │ SQL
┌────────────────▼────────────────────────┐
│    Database (PostgreSQL)                │
│  - User Management                      │
│  - File Metadata                        │
│  - Analytics                            │
└─────────────────────────────────────────┘
```

## Backend Development

### Project Structure

```
backend/
├── src/
│   ├── index.ts                 # App entry point
│   ├── routes/                  # API endpoints
│   │   ├── auth.routes.ts
│   │   ├── file.routes.ts
│   │   ├── user.routes.ts
│   │   ├── share.routes.ts
│   │   ├── download.routes.ts
│   │   └── admin.routes.ts
│   ├── middleware/              # Custom middleware
│   │   ├── auth.ts              # JWT & auth
│   │   ├── errorHandler.ts      # Error handling
│   │   └── logger.ts            # Request logging
│   ├── utils/                   # Helper functions
│   │   ├── validators.ts        # Input validation
│   │   └── logger.ts            # Logging utility
│   └── services/                # Business logic (TODO)
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── .env                         # Environment variables
├── Dockerfile                   # Docker config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

### Key Concepts

#### Routes
Define API endpoints and request handlers:
```typescript
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  // Handle file upload
});
```

#### Middleware
Intercept requests for authentication, validation, etc:
```typescript
export const authMiddleware = async (req, res, next) => {
  // Verify JWT token
  // Attach user to request
};
```

#### Error Handling
Use AppError for consistent error responses:
```typescript
throw new AppError(400, 'Invalid input');
```

#### Database Queries
Use Prisma for type-safe database operations:
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
});
```

## Frontend Development

### Project Structure

```
frontend/
├── src/
│   ├── app/                     # Next.js app directory
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── login/page.tsx       # Login page
│   │   ├── register/page.tsx    # Registration page
│   │   ├── dashboard/           # Dashboard routes
│   │   │   ├── layout.tsx       # Dashboard layout
│   │   │   ├── page.tsx         # Files page
│   │   │   ├── shared/page.tsx  # Shared files
│   │   │   └── storage/page.tsx # Storage page
│   │   └── download/[id]/page.tsx # Download page
│   │
│   ├── components/              # Reusable components
│   │   └── ShareModal.tsx       # File sharing dialog
│   │
│   ├── hooks/                   # Custom hooks (TODO)
│   ├── utils/                   # Utility functions (TODO)
│   └── styles/
│       └── globals.css          # Global styles
│
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

### Key Concepts

#### Server Components vs Client Components
```typescript
// Server component (default)
export default function Page() {
  // Can access database, backend directly
}

// Client component
'use client';
export default function Component() {
  // Can use hooks, state, events
}
```

#### API Calls
Use Axios with Bearer token:
```typescript
const response = await axios.get('/api/users/profile', {
  headers: { Authorization: `Bearer ${token}` },
});
```

#### State Management
Use Zustand for global state (optional):
```typescript
const useStore = create((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
}));
```

## Common Workflows

### Adding a New Feature

1. **Backend**
   ```bash
   # 1. Create database migration
   npm run migrate:dev -- --name add_new_field
   
   # 2. Create API route
   # Edit: backend/src/routes/newfeature.routes.ts
   
   # 3. Add route to main app
   # Edit: backend/src/index.ts
   
   # 4. Test API
   curl http://localhost:5000/api/newfeature
   ```

2. **Frontend**
   ```bash
   # 1. Create component
   # Edit: frontend/src/components/NewFeature.tsx
   
   # 2. Create page
   # Edit: frontend/src/app/newfeature/page.tsx
   
   # 3. Add styling
   # Use Tailwind CSS classes
   
   # 4. Test locally
   npm run dev
   ```

### Creating an API Endpoint

```typescript
// 1. Define route
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    // 2. Validate input
    if (!req.params.id) {
      throw new AppError(400, 'ID is required');
    }

    // 3. Query database
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
    });

    // 4. Handle not found
    if (!item) {
      throw new AppError(404, 'Item not found');
    }

    // 5. Return response
    res.json({ data: item });
  } catch (error) {
    // 6. Handle errors
    next(error);
  }
});
```

### Database Schema Changes

```typescript
// 1. Edit schema.prisma
model User {
  // ... existing fields
  newField String // Add new field
}

// 2. Create migration
npm run migrate:dev -- --name add_new_field

// 3. Migration is created and applied
// 4. Generate Prisma client
npm run prisma:generate

// 5. Use in code
const user = await prisma.user.create({
  data: {
    newField: 'value',
  },
});
```

## Testing

### Manual Testing
```bash
# 1. Start services
docker-compose up -d

# 2. Run application
npm run dev

# 3. Test in browser/Postman
```

### API Testing
```bash
# Test endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## Debugging

### Backend Debugging
```bash
# Run with debug output
DEBUG=* npm run dev

# Check logs
docker-compose logs -f backend

# Database inspection
npm run prisma:studio
```

### Frontend Debugging
```bash
# React DevTools browser extension
# Next.js DevTools (built-in)
# Chrome DevTools for Network/Console
```

## Performance Tips

### Backend
- Use database indexes
- Implement pagination
- Use caching (Redis)
- Optimize queries
- Compress responses

### Frontend
- Code splitting
- Lazy loading components
- Image optimization
- CSS-in-JS optimization
- Use Next.js Image component

## Common Pitfalls

1. **Forgetting authMiddleware**
   - Always protect authenticated routes

2. **Not validating input**
   - Always validate user input

3. **Hardcoding URLs**
   - Use environment variables

4. **Not handling errors**
   - Always have try-catch blocks

5. **Blocking operations**
   - Use async/await, not callbacks

6. **Missing type definitions**
   - Define types for all data

7. **Not testing changes**
   - Always test before committing

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Questions?

Check the [Contributing Guide](./CONTRIBUTING.md) for more information.
