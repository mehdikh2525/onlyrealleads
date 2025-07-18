# LeadBouncer - AI-Powered Lead Filtering SaaS

## Overview

LeadBouncer is a modern SaaS application designed to help service businesses automatically filter out spam, bots, and fake lead inquiries. The application features a conversion-focused landing page built with React and TypeScript, backed by a Node.js/Express server with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: TSX for TypeScript execution

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Currently includes user authentication tables

## Key Components

### UI Components
- Comprehensive shadcn/ui component library implementation
- Radix UI primitives for accessible, unstyled components
- Custom component variants using class-variance-authority
- Responsive design with mobile-first approach

### Authentication System
- User registration and login capabilities
- Password-based authentication
- Session management with PostgreSQL storage
- User schema with username/password fields

### API Layer
- RESTful API structure with Express.js
- Request/response logging middleware
- Error handling middleware
- CORS and JSON parsing support

### Development Tools
- Hot module replacement with Vite
- TypeScript compilation checking
- Tailwind CSS processing
- PostCSS with autoprefixer

## Data Flow

1. **Client Requests**: React frontend makes API calls to Express backend
2. **Server Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: TanStack Query manages client-side caching and state
5. **UI Updates**: React components re-render based on data changes

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM)
- UI libraries (Radix UI, Lucide React icons)
- State management (TanStack Query)
- Styling (Tailwind CSS, class-variance-authority)
- Form handling (React Hook Form with Zod validation)
- Date utilities (date-fns)

### Backend Dependencies
- Express.js framework
- Database (Drizzle ORM, @neondatabase/serverless)
- Session management (express-session, connect-pg-simple)
- Development tools (TSX, esbuild)

### Development Dependencies
- Vite for build tooling
- TypeScript for type safety
- Various Replit-specific plugins for development environment

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: esbuild bundles TypeScript server code
3. **Database Setup**: Drizzle migrations ensure schema is up-to-date

### Production Configuration
- **Environment**: Node.js production environment
- **Database**: PostgreSQL with connection pooling
- **Static Files**: Served through Express static middleware
- **Process Management**: Single Node.js process serving both API and static files

### Development Workflow
- Local development with hot reloading
- Database migrations with `npm run db:push`
- TypeScript checking with `npm run check`
- Combined frontend/backend development server

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment designation (development/production)

The application follows a monorepo structure with clear separation between client, server, and shared code, enabling efficient development and deployment workflows.

## Recent Changes: Latest modifications with dates

### January 14, 2025
- **Authentication Flow Implementation**: Added hard-coded authentication system
  - Created login and signup pages with form validation
  - Implemented localStorage-based session management
  - Connected all CTA buttons throughout landing page to authentication flow
  - Added authentication guard for dashboard access
  - Integrated theme provider with dark/light mode toggle

- **SaaS Dashboard Creation**: Built comprehensive dashboard interface
  - Sidebar navigation with main sections (Dashboard, Forms, Settings, Billing)
  - Metrics cards showing key performance indicators
  - Interactive charts displaying leads activity and blocking reasons
  - Lead management table with filtering, search, and pagination
  - Responsive design optimized for desktop and mobile
  - Professional color scheme with LeadBouncer branding