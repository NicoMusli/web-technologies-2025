# Infrastructure & Deployment

This document provides an overview of the infrastructure and hosting strategy for the **Web Technologies** project.

## Architecture Overview

The application follows a modern **Client-Server** architecture:

- **Frontend**: Single Page Application (SPA) built with React.
- **Backend**: RESTful API built with Node.js and Express.
- **Database**: Relational database managed via Prisma ORM.

## Hosting Strategy

### Frontend Hosting
- **Provider**: **Vercel**
- **Configuration**:
    - Connects directly to the GitHub repository.
    - Automatically builds and deploys on every push to the `main` branch.
    - Serves static assets via a global CDN for low latency.
    - Handles client-side routing rewrites (e.g., all routes redirect to `index.html`).

### Backend Hosting
- **Provider**: **Vercel (Serverless Functions)**
- **Configuration**:
    - The Node.js/Express API is deployed as a serverless function.
    - **Express Serverless**: The entire Express app is wrapped to run within a serverless environment, allowing for infinite scalability and zero maintenance.
    - Environment variables (`.env`) injected securely via the Vercel dashboard.

### Database
- **Provider**: **Managed PostgreSQL** (e.g., Vercel Postgres / Neon / Supabase)
- **Configuration**:
    - **Prisma ORM**: Used for all database interactions, ensuring type safety and efficient query generation.
    - Connection pooling enabled for efficient handling of concurrent serverless requests.
    - SSL connections enforced for security.

## External Services

### Stripe (Payments)
- Handles all PCI-DSS sensitive data.
- Processes credit card transactions securely.
- Webhooks configured to notify the backend of payment events (success, failure).

### Cloudinary (Media)
- Stores and serves user-uploaded images and files.
- Optimizes images on-the-fly for performance.
- Offloads storage requirements from the main application server.

## CI/CD Pipeline

1.  **Code Commit**: Developer pushes code to GitHub.
2.  **Automated Build**: Hosting provider triggers a build script (`npm run build`).
3.  **Deployment**:
    - Frontend assets are distributed to the CDN.
    - Backend server is restarted with the new code.
4.  **Health Check**: Automated checks verify the service is up and responding.
