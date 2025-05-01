# Portfolio - Abhinav Kumar Choudhary

A modern, responsive personal portfolio website built with Next.js, React, TypeScript, and Firebase. This portfolio showcases my skills, experience, projects, and literary works with a sleek purple/neon design aesthetic.

![Portfolio Screenshot](/public/portfolio.jpeg)

## 📝 Project Documentation

This document serves as technical documentation for my personal portfolio website. It details the architecture, technologies, and implementation approaches used in creating this project.

## 🌟 Features & Implementation

- **Interactive UI** with smooth animations and transitions using Framer Motion for animating components and scroll-triggered effects
- **Responsive design** implemented with Tailwind CSS and custom media queries to ensure proper display across all device sizes
- **Dark mode** implemented using next-themes for theme persistence
- **Section-based layout** including:
  - **Hero section** with dynamic text animation using custom React hooks for typing effects and Three.js particles animation
  - **About section** with spotlight cards using mouse-following highlight effects and CSS gradients
  - **Experience timeline** with scroll-driven animations using Framer Motion's useScroll and useTransform hooks
  - **Projects showcase** with filtering capability using React state management
  - **Skills showcase** with horizontal scrolling animation and opposing movement direction
  - **Education history** with card-based layout and expandable details
  - **Literary works section** with Firebase backend for content management
  - **Contact form** with EmailJS integration for serverless form submission

## 🛠️ Technical Architecture

### Frontend Technologies
- **Next.js 15** - App Router architecture with server and client components
- **React 19** - Using the latest React features including hooks and server components
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For utility-first styling with custom theme configuration
- **Shadcn UI** - For accessible and customizable UI components
- **Framer Motion** - For scroll-based and interactive animations
- **OGL** - For 3D effects and particle animations
- **EmailJS** - For serverless email sending directly from client-side

### Backend Services & Implementation
- **Firebase**
  - Firestore - NoSQL database storing works, comments, and user interactions
  - Authentication - Managing user authentication state
  - Storage - Storing and serving images and other assets
- **Next-Auth** - Handling authentication flow with various providers and session management

### State Management
- React's Context API for global state management
- Custom hooks for component-specific state logic
- Server components for data fetching and initial state population

### API Architecture
- API routes implemented using Next.js App Router
- RESTful API endpoints for CRUD operations on works and comments
- Protected routes using Next-Auth session validation

## 📋 Project Structure & Code Organization

```
/src
  /app              # Next.js app directory with route structure
    /api            # API routes for data operations
      /auth         # Authentication endpoints
      /works        # Literary works CRUD endpoints
    /works          # Literary works pages and dynamic routes
    globals.css     # Global styles and Tailwind directives
    layout.tsx      # Root layout with providers
    page.tsx        # Home page component
  /components       # React components organized by feature
    /ui             # Reusable UI components
    *-section.tsx   # Section components for main page
  /lib              # Utility functions and service configurations
    firebase.ts     # Firebase client configuration
    firebase-admin.ts # Firebase admin SDK for server operations
    auth.ts         # Authentication utilities
    utils.ts        # General utilities for formatting, etc.
/public             # Static assets
  /Skills-logos     # SVG icons for skills section
```

## 🔍 Implementation Details

### Animation System
The animation system is built using Framer Motion with custom hooks for scroll-based triggers. Key implementations:
- Timeline animation in the Experience section uses `useScroll` and `useTransform` to create a growing line effect
- Particles in the hero section use Three.js with custom shaders for the starfield effect
- Card animations use variants with staggered children for sequential reveals

### Data Management
- Works and interactions are stored in Firebase Firestore with the following structure:
  - `works` collection: Contains documents for each literary work
  - `comments` subcollection: Nested under each work for comment storage
  - `likes` field: Counter for tracking like interactions

### Responsive Design Strategy
The UI adapts to different screen sizes through:
- Mobile-first approach with responsive classes in Tailwind
- Custom breakpoints for complex layout shifts
- Component-specific media query handling for specialized behaviors

### Authentication Flow
1. User signs in through Next-Auth providers
2. Session is established and stored in cookies
3. Protected actions check session validity before execution
4. Admin-only routes verify user roles before allowing access

### Literary Works System
The literary works system implements:
- Categorization and tagging for content organization
- Full text storage with formatting preservation
- Client-side filtering and search capabilities
- Admin panel for content management with CRUD operations

## 📊 Performance Considerations

- Images are optimized using Next.js Image component with proper sizing
- Component code splitting for better initial load performance
- Strategic use of React.lazy and dynamic imports for less critical components
- Server components for data-heavy sections to reduce client bundle size

## 🔒 Security Implementation

- Firebase security rules restrict access to sensitive operations
- Input validation on both client and server side
- Protected API routes with proper authentication checks
- Rate limiting on comment and interaction endpoints
- Sanitization of user-generated content before storage and display

## 🏎️ Deployment Architecture

The project is deployed on Vercel with the following configuration:
- Automatic preview deployments for branches
- Edge functions for API routes
- CDN caching for static assets
- Environment variable management for service credentials
- Analytics for performance monitoring

## 💻 Development Environment

This project was developed using:
- Visual Studio Code with TypeScript and ESLint integration
- Node.js v20.x
- npm for package management
- Git for version control
- Chrome DevTools for performance profiling

---

Built by Abhinav Kumar Choudhary | Last updated: April 2025