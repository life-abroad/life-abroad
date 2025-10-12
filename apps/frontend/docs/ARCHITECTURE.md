# Frontend Architecture

## Project Structure

```bash
src/
├── api/                    # Backend communication layer
│   ├── client.js           # Base HTTP client with authentication
│   ├── auth.api.js         # /auth/* endpoints
│   ├── posts.api.js        # /posts/*, /media-items/* endpoints
│   ├── contacts.api.js     # /contacts/* endpoints
│   ├── audiences.api.js    # /audiences/* endpoints
│   └── index.js            # Barrel exports
│
├── components/             # Shared components
│   └── layout/
│       └── ScreenTemplate/ # Application shell wrapper
│
├── features/               # Domain-specific modules
│   ├── auth/
│   │   └── components/
│   │       └── AuthForm/   # Login/Registration
│   ├── posts/
│   │   └── components/
│   │       ├── PostsList/  # Grid view of posts
│   │       └── PostView/   # Single post detail
│   └── profile/
│       └── components/
│           └── Profile/    # User dashboard
│
├── styles/                 # Global styles
│   ├── reset.css           # CSS reset
│   ├── variables.css       # Design tokens
│   ├── global.css          # Base styles
│   ├── layout.css          # Layout patterns
│   └── index.css           # Entry point
│
├── App.jsx                 # Root component, routing logic
└── main.jsx                # React mount point
```

## Backend Communication

### API Client (`api/client.js`)

Provides centralized HTTP client with:

- Base URL configuration via `VITE_API_BASE_URL`
- Automatic JWT token injection from localStorage
- Request/response interceptors

### API Modules

Each module maps to a backend domain:

### auth.api.js

```bash
POST   /auth/register
POST   /auth/jwt/login
POST   /auth/jwt/logout
GET    /auth/me
```

### posts.api.js

```bash
GET    /posts/
GET    /frontend/view?token={token}&post_id={id}
GET    /media-items/{id}/stream
```

### contacts.api.js

```bash
GET    /contacts/
POST   /contacts/
PUT    /contacts/{id}
DELETE /contacts/{id}
```

### audiences.api.js

```bash
GET    /audiences/
GET    /audiences/{id}
POST   /audiences/
PUT    /audiences/{id}
DELETE /audiences/{id}
```

## Application Flow

### Authentication Flow

```bash
User Action → AuthForm Component
    ↓
authAPI.login(email, password)
    ↓
POST /auth/jwt/login
    ↓
Token stored in localStorage
    ↓
App.jsx detects auth state
    ↓
Renders Profile Component
```

### Post Viewing Flow (Token-based)

```bash
URL with ?token=xxx&post_id=yyy
    ↓
App.jsx extracts params
    ↓
postsAPI.fetchWithToken(token, postId)
    ↓
GET /frontend/view?token=xxx&post_id=yyy
    ↓
Renders PostView or PostsList
```

### Authenticated User Flow

```bash
App.jsx checks authAPI.isAuthenticated()
    ↓
Profile Component loads
    ↓
Parallel requests:
  - authAPI.getCurrentUser()
  - postsAPI.fetchPosts()
  - audiencesAPI.fetchAudiences()
  - contactsAPI.fetchContacts()
    ↓
Renders dashboard with tabs
```

## Component Organization

### Feature-Based Structure

Each feature is self-contained:

```bash
features/{domain}/
└── components/
    └── {ComponentName}/
        ├── {ComponentName}.jsx
        ├── {ComponentName}.css
        └── index.js
```

Benefits:

- Related code co-located
- Easy to add/remove features
- Clear boundaries between domains

### Component Naming Convention

To avoid CSS collisions, component-specific classes are prefixed:

- PostView: `.post-view-header`, `.view-all-button`
- PostsList: `.post-card`, `.posts-grid`
- Profile: `.profile-post-card`, `.profile-contact-card`

## Styling System

### CSS Variables (styles/variables.css)

```css
--color-primary         # Orange (#d2691e)
--color-secondary       # Tan (#c7b299)
--color-background      # Beige (#ddd0ba)
--color-text            # Dark brown (#5a4a3a)

--spacing-{xs,sm,md,lg,xl}
--font-size-{sm,base,md,lg}
--radius-{sm,md,lg,pill}
```

### Style Hierarchy

1. `reset.css` - CSS reset
2. `variables.css` - Design tokens
3. `global.css` - Base element styles
4. `layout.css` - Layout patterns
5. Component CSS - Feature-specific styles

## State Management

Currently uses React component state. Key patterns:

### App.jsx

- `viewMode`: 'token-view' | 'profile' | 'login'
- `isAuthenticated`: boolean
- Route logic based on URL params

### Profile.jsx

- `activeTab`: 'posts' | 'contacts' | 'audiences'
- Fetches and caches user data

## Environment Configuration

Required environment variable:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Import Patterns

```javascript
// API imports
import { authAPI, postsAPI } from './api';

// Component imports (via barrel exports)
import ScreenTemplate from './components/layout/ScreenTemplate';
import AuthForm from './features/auth/components/AuthForm';

// Global styles
import './styles/index.css';
```
