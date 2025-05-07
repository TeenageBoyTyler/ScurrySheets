# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview: ScurrySheets

ScurrySheets is a SvelteKit-based web application that allows users to manage and organize document images. It uses Google Drive for storage, Supabase for authentication and database functionality, and Google Cloud Vision API for OCR processing. The application has a minimalist design with a three-panel layout (Upload, Search, Profile).

## Development Setup and Commands

### Environment Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Start the development server and open in browser
npm run dev -- --open
```

### Building and Previewing
```bash
# Build the application for production
npm run build

# Preview the production build
npm run preview
```

### Testing
```bash
# Run all tests (unit + e2e)
npm test

# Run unit tests only
npm run test:unit

# Run unit tests in watch mode
npm run test:unit -- --watch

# Run e2e tests only
npm run test:e2e

# Run a specific test file
npm run test:unit -- path/to/test.ts
```

### Code Quality
```bash
# Check TypeScript types
npm run check

# Watch TypeScript type checking
npm run check:watch

# Format code with Prettier
npm run format

# Lint code
npm run lint
```

## Core Architecture

### Key Technologies
- **Framework**: SvelteKit 2.x with TypeScript 5.x
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth with Google OAuth
- **Storage**: Google Drive API (primary storage), Supabase Storage (temporary)
- **Database**: Supabase Database for metadata and fast queries
- **OCR**: Google Cloud Vision API (user-provided API keys)
- **Testing**: Vitest for unit tests, Playwright for E2E tests

### Application Structure
- Three main sections:
  1. **Upload Flow**: Document upload and processing pipeline
  2. **Document Flow**: Search, viewing, and organization of documents 
  3. **Profile Flow**: User settings and API usage monitoring

### Important Concepts

#### Cloud Storage Model
- Google Drive is the primary storage for all user documents
- Supabase Database stores metadata for fast queries and synchronization
- All document changes sync between Google Drive and Supabase
- Documents are stored in a `.scurrysheets/` folder in the user's Google Drive

#### Tag Management System
- Global tag collection shared across all application areas
- Tags exist in a single, unified namespace
- Tags stored with document metadata
- Each document must have at least one tag
- Tag changes apply globally across all documents

#### Document Processing Pipeline
- All documents converted to standardized JPG format
- Google Cloud Vision API used for OCR extraction
- Text content extracted and stored in document metadata
- Users provide their own Vision API key (stored securely in Supabase)

#### Authentication Flow
- Authentication handled through Supabase Auth with Google OAuth
- Users must provide their own Google Vision API key
- OAuth tokens securely managed through Supabase Authentication

## Project Structure

```
src/
├── lib/               # Shared components and utilities
│   ├── components/    # Reusable UI components
│   ├── stores/        # Svelte stores for state management
│   ├── utils/         # Helper functions
│   └── supabase.js    # Supabase client configuration
├── routes/            # SvelteKit pages and layouts
│   ├── +layout.svelte # Main application layout (three panels)
│   ├── +page.svelte   # Application landing page
│   ├── upload/        # Upload flow routes
│   ├── search/        # Document management routes
│   └── profile/       # User profile and settings routes
└── app.html           # HTML template with font imports
```

## Testing Approach

- **Unit Tests**: Using Vitest with Testing Library for Svelte components
  - Located in the same directory as the component being tested
  - Files use `.svelte.test.ts` extension
  - Run with `npm run test:unit`

- **E2E Tests**: Using Playwright
  - Located in the `e2e/` directory
  - Run with `npm run test:e2e`

## UI/UX Guidelines

- Dark theme with purple primary color (#5f00ed)
- Extreme minimalism with clean interfaces
- Three-panel layout that expands/contracts sections
- Responsive design for both desktop and mobile
- Smooth transitions and animations using Svelte transitions

## Development Tools

- ESLint for linting with TypeScript support
- Prettier for code formatting
- SvelteKit's built-in TypeScript checking
- Tailwind CSS for styling
- Vitest for unit testing
- Playwright for E2E testing