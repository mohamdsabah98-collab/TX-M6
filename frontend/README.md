# TX-M6 Frontend

Modern, responsive React/Next.js frontend for TX-M6 file hosting platform.

## Features

- 📱 Mobile-first responsive design
- 🌓 Dark/Light mode support
- ⚡ Fast performance with Next.js 14
- 🎨 Beautiful UI with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 📤 Drag & drop file upload
- 🔗 Easy file sharing
- 📊 User dashboard
- 🔐 Secure authentication

## Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP**: Axios
- **Theme**: next-themes

## Quick Start

### Prerequisites

```bash
node --version  # v20.0.0+
npm --version   # v10.0.0+
```

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Update environment variables**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend runs at `http://localhost:3000`

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Pages

- `/` - Landing page
- `/register` - User registration
- `/login` - User login
- `/dashboard` - File dashboard
- `/download/[shareId]` - Download page

## Components

- **ShareModal** - File sharing dialog
- **DashboardLayout** - Main dashboard layout

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Format Code
```bash
npm run format
```

## Docker

```bash
docker build -t tx-m6-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:5000 tx-m6-frontend
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── dashboard/           # Dashboard layout and pages
│   └── download/            # Download pages
├── components/              # Reusable components
├── hooks/                   # Custom hooks
├── utils/                   # Utility functions
└── styles/                  # Global styles
```

## Performance

- Image optimization
- Code splitting
- Lazy loading
- CSS-in-JS optimization
- Next.js Image component

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
