# Quizzio Web

Modern web application for Quizzio built with Next.js, React, and TypeScript. This frontend provides an intuitive interface for uploading PDFs, generating quizzes, and taking interactive tests.

![Quizzio Hero](public/hero.png)

## Overview

The Quizzio web application is a single-page application that allows users to:
- Upload PDF documents with drag-and-drop support
- Choose between interactive quiz mode and PDF export mode
- Generate AI-powered quizzes from document content
- Take interactive quizzes with instant scoring
- Export quizzes as PDFs with answer keys

## Tech Stack

- **Next.js 15**: React framework with App Router for optimal performance
- **React 19**: Latest React features and improvements
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Axios**: Promise-based HTTP client
- **TSParticles**: Interactive particle effects

## Project Structure

```
web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Homepage
│   │   ├── quiz/
│   │   │   └── page.tsx         # Quiz creation and taking page
│   │   └── globals.css          # Global styles
│   │
│   └── components/               # React components
│       ├── Navbar.tsx           # Navigation bar
│       ├── Footer.tsx           # Footer component
│       ├── Logo.tsx             # Logo component
│       ├── AnimatedBackground.tsx # Particle background animation
│       ├── home/
│       │   ├── hero.tsx         # Hero section
│       │   ├── about.tsx        # About section
│       │   ├── features.tsx     # Features section
│       │   ├── howItWorks.tsx   # How it works section
│       │   └── cta.tsx          # Call-to-action section
│       └── quiz/
│           ├── uploadSection.tsx    # PDF upload interface
│           ├── createQuizSection.tsx # Quiz creation interface
│           ├── quizDisplay.tsx      # Quiz display and interaction
│           ├── pdfExport.tsx        # PDF export functionality
│           └── errorDisplay.tsx     # Error handling display
│
├── public/                       # Static assets
│   └── hero.png                 # Hero image
│
├── package.json                 # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## Getting Started

### Prerequisites

- **Node.js 18+** (recommended: Node.js 20+)
- **npm** or **yarn** package manager

### Installation

1. **Navigate to the web directory**:
```bash
cd apps/web
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Features

### Homepage (`/`)
- **Hero Section**: Eye-catching introduction with call-to-action
- **About Section**: Description of the application
- **Features Section**: Key features highlighted
- **How It Works**: Step-by-step guide
- **Call-to-Action**: Encouragement to start creating quizzes

### Quiz Page (`/quiz`)
- **PDF Upload**:
  - Drag-and-drop file upload
  - Click to browse files
  - Upload progress indicator
  - File validation (PDF only)

- **Quiz Mode Selection**:
  - **Give Quiz**: Interactive mode with instant scoring
  - **Create Quiz**: Generate printable PDF quiz

- **Quiz Generation**:
  - Loading states with animated steps
  - AI-powered question generation
  - Error handling and user feedback

- **Interactive Quiz Mode**:
  - Question display with multiple-choice options
  - Answer selection interface
  - Submit button with validation
  - Instant scoring with detailed feedback
  - Explanations for each question

- **Create Quiz Mode**:
  - Question and answer display
  - PDF export functionality
  - Separate question and answer key sections

## API Integration

The web app communicates with the Quizzio API backend. Default API endpoint:
- Development: `http://localhost:8000`
- Production: Configure via environment variable

### API Endpoints Used

1. **PDF Upload**: `POST /upload-pdf`
2. **Set Quiz Mode**: `POST /api/quiz/mode`
3. **Generate Quiz (Interactive)**: `POST /api/quiz/generate/give`
4. **Generate Quiz (Export)**: `POST /api/quiz/generate/create`
5. **Submit Answers**: `POST /api/quiz/submit`
6. **Delete Session**: `POST /delete-session/{session_id}`

## Configuration

### Environment Variables

Create a `.env.local` file in the `apps/web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, the app defaults to `http://localhost:8000` for API requests.

## Styling

### Tailwind CSS

The project uses Tailwind CSS 4 with:
- Custom color palette
- Responsive design utilities
- Dark mode support (if configured)
- Custom animations

### Framer Motion

Animations are powered by Framer Motion for:
- Page transitions
- Component entrance animations
- Loading states
- Interactive feedback

### TSParticles

Interactive particle effects used for:
- Background animations
- Hero section visual effects

## Component Architecture

### Pages

- **Home Page** (`page.tsx`): Landing page with marketing sections
- **Quiz Page** (`quiz/page.tsx`): Main application functionality

### Reusable Components

- **Navbar**: Consistent navigation across pages
- **Footer**: Site footer with links
- **AnimatedBackground**: Configurable particle background
- **Quiz Components**: Modular quiz-related functionality

## State Management

The application uses React's built-in state management:
- `useState` for component-level state
- `useEffect` for side effects and cleanup
- `useRef` for DOM references
- Session cleanup on component unmount

## Error Handling

- Network errors are caught and displayed to users
- Form validation prevents invalid submissions
- Loading states prevent duplicate requests
- Session expiration is handled gracefully

## Performance Optimizations

- **Next.js Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components load when needed
- **Memoization**: Expensive computations are memoized where appropriate

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Hot Module Replacement

Next.js provides instant feedback during development. Changes to components update immediately without full page reload.

### TypeScript

All components are typed for better developer experience:
- IntelliSense support
- Compile-time error checking
- Better refactoring capabilities

### Debugging

- Use React DevTools for component inspection
- Next.js provides helpful error messages in development
- Browser console shows API request/response details

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy automatically on push

### Other Platforms

Build the application and serve the `out` directory (if using static export) or deploy as a Node.js application.

```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Verify the API server is running
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Verify CORS settings on the API

2. **Build Errors**:
   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **TypeScript Errors**:
   - Run `npm run lint` to see specific issues
   - Ensure all dependencies are installed
   - Check `tsconfig.json` configuration

4. **Styling Issues**:
   - Verify Tailwind CSS is properly configured
   - Check that classes are not purged in production
   - Clear browser cache

## Contributing

When contributing to the frontend:
1. Follow TypeScript best practices
2. Maintain component modularity
3. Write self-documenting code
4. Test responsive design on multiple screen sizes
5. Ensure accessibility standards

## License

This project is open source and available for personal and educational use.