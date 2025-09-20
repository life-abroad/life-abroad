# Life Abroad Frontend

A simple React frontend for viewing authenticated posts and media.

## Setup

1. Install dependencies:

```bash
npm install
```

1. Start development server:

```bash
npm run dev
```

1. Build for production:

```bash
npm run build
```

## Usage

The app expects to receive a JWT token as a URL parameter:

- `http://localhost:3000/view?token=YOUR_JWT_TOKEN`

The token determines what content is displayed:

- If token contains a specific `post_id`, shows that single post
- If token is for general user access, shows all accessible posts

## Environment

Make sure your backend server is running on `http://localhost:8000` or update the API_BASE_URL in `src/services/api.js`.
