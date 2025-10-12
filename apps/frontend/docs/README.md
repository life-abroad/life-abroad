# Frontend Documentation

## Quick Reference

- [Architecture](./ARCHITECTURE.md) - Complete system design, API structure, and application flow

## Structure Summary

```bash
src/
├── api/          # Backend communication (auth, posts, contacts, audiences)
├── components/   # Shared components (layout)
├── features/     # Domain modules (auth, posts, profile)
├── styles/       # Global styles and design tokens
├── App.jsx       # Root component with routing
└── main.jsx      # Entry point
```

## Key Concepts

**API Layer**: Split by domain, centralized auth token management

**Features**: Self-contained modules with components, styles, and logic

**Styles**: CSS variables for design tokens, component-scoped styles

## Backend Endpoints

See [ARCHITECTURE.md](./ARCHITECTURE.md#backend-communication) for complete API reference.

## Getting Started

1. Set environment variable: `VITE_API_BASE_URL=http://localhost:8000`
2. Run: `npm run dev`
3. Access: `http://localhost:3000`
