# Overview

A React-based squad management application for Escape from Tarkov players. The application allows teams to coordinate quest progress, plan raids, manage hideout development, and track team statistics. Built with a modern full-stack architecture using React frontend, Express backend, and PostgreSQL database with Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in a Single Page Application (SPA) pattern
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom Tarkov-themed color palette and dark mode support
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API endpoints with JSON communication
- **Data Storage**: In-memory storage interface with plans for PostgreSQL integration
- **Development Setup**: Hot reload with Vite middleware integration for seamless development experience

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Structure**: 
  - Users and authentication system
  - Groups with member management
  - Quest system with progress tracking
  - Raid planning and participation
  - Hideout module progression
- **Data Validation**: Zod schemas for runtime type checking and API validation

## Component Architecture
- **Layout System**: App shell pattern with fixed sidebar navigation
- **Dashboard Pattern**: Modular dashboard with reusable card components for different data views
- **Loading States**: Skeleton components for improved perceived performance
- **Error Handling**: Centralized error handling with toast notifications

## External API Integration
- **Tarkov API**: Integration with tarkov.dev GraphQL API for game data synchronization
- **Data Synchronization**: Planned endpoints for syncing quests, maps, and items from external sources

## Development Environment
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **TypeScript Configuration**: Strict typing with path aliases for clean imports
- **Hot Reload**: Development server with automatic refresh and error overlay

## External Dependencies

- **Database**: PostgreSQL with Neon Database serverless driver for cloud hosting
- **External APIs**: tarkov.dev API for Escape from Tarkov game data
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling approach
- **Date Handling**: date-fns library with Polish locale support
- **Form Management**: React Hook Form with Hookform Resolvers for validation