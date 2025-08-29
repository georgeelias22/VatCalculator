# VAT Calculator

## Overview

A modern VAT (Value Added Tax) calculator web application built with React and Express. The application provides a clean, responsive interface for calculating VAT on amounts with support for adding or removing VAT at different rates. Features include preset UK VAT rates, custom rate input, calculation history, dark/light theme toggle, and local storage persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React router alternative)
- **TanStack Query** for state management and API interactions
- **Tailwind CSS** with **shadcn/ui** components for styling and UI primitives
- **Radix UI** primitives for accessible, unstyled components

### Backend Architecture
- **Express.js** server with TypeScript
- **In-memory storage** using a Map-based implementation for user data
- Modular storage interface allowing easy switching between storage backends
- RESTful API structure with `/api` prefix for all endpoints
- Centralized error handling middleware

### Data Storage
- **PostgreSQL** configured via Drizzle ORM for production database
- **Neon Database** as the serverless PostgreSQL provider
- **In-memory storage** implementation for development/testing
- Schema definitions shared between client and server via the `/shared` directory
- Database migrations managed through Drizzle Kit

### Client-Side Features
- **Local storage** for persisting user preferences (theme, calculation history)
- Custom React hooks for localStorage management, theme switching, and mobile detection
- Real-time VAT calculations with input validation
- Toast notifications for user feedback
- Responsive design with mobile-first approach

### Development Tooling
- **TypeScript** configuration with path aliases for clean imports
- **ESBuild** for production server bundling
- **PostCSS** with Autoprefixer for CSS processing
- **Replit-specific** plugins for development environment integration
- Hot module replacement in development mode

### Key Design Patterns
- Separation of client/server/shared code into distinct directories
- Interface-based storage abstraction for easy backend switching
- Custom hook pattern for reusable client-side logic
- Component composition using Radix UI and shadcn/ui patterns
- Environment-based configuration for database connections

## External Dependencies

### Database Services
- **Neon Database** - Serverless PostgreSQL hosting
- **Drizzle ORM** - Type-safe database queries and migrations
- **connect-pg-simple** - PostgreSQL session store

### UI Framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Development Tools
- **Vite** - Frontend build tool and dev server
- **TypeScript** - Static type checking
- **ESBuild** - Fast JavaScript bundler
- **Replit integrations** - Development environment plugins

### Client Libraries
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling and validation
- **Wouter** - Lightweight React router
- **date-fns** - Date utility functions
- **Zod** - Schema validation

### Backend Framework
- **Express.js** - Web application framework
- **TSX** - TypeScript execution environment