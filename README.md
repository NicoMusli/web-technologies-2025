# Web Technologies Project

## Project Overview
This project is a comprehensive **E-commerce & Order Management System** developed to meet real-world client requirements. It was designed to handle complex business logic, including custom product configurations, secure payments, and a robust role-based administration dashboard.

The application serves three distinct user roles:
- **Visitors**: Can browse products, customize items, and place orders via a secure checkout.
- **Clients**: Have a dedicated dashboard to track orders, view history, and request order modifications or cancellations.
- **Admins**: Possess full control over the system, including product management, order processing, and user administration.

## Key Features
- **Custom E-commerce Flow**: Users can upload files and specify custom configurations for products.
- **Secure Payments**: Integrated with **Stripe** for secure, PCI-compliant transaction processing.
- **Order Management**: sophisticated state machine for order lifecycle (Pending -> Paid -> Shipped -> Completed/Cancelled).
- **Modification Requests**: A unique feature allowing clients to request changes to their orders, which admins can approve or reject.
- **Role-Based Access Control (RBAC)**: Strict security policies ensuring users can only access authorized resources.

## Technology Stack

### Frontend
- **React.js**: For building a dynamic, responsive Single Page Application (SPA).
- **Tailwind CSS**: For a modern, utility-first design system.
- **Axios**: For efficient HTTP requests and API interaction.

### Backend
- **Node.js & Express**: Robust RESTful API architecture.
- **Prisma ORM**: Type-safe database access and schema management.
- **PostgreSQL**: Reliable relational database for data persistence.

### Security & Infrastructure
- **Authentication**: JWT-based stateless authentication with secure cookie storage.
- **Security**: Comprehensive protection against XSS, SQL Injection, and IDOR attacks.
- **Hosting**: Designed for cloud deployment (Vercel/Render) with CI/CD pipelines.

## System Architecture & User Flows

The application is structured around clear user journeys and a hierarchical route map, ensuring a logical and intuitive experience for all user roles.

### 🗺️ User Flowcharts
We have mapped out the complete user journeys for Visitors, Clients, and Admins. These flowcharts visualize the logic from landing on the homepage to complex actions like checkout, order modification, and administrative management.

- **[View User Flowcharts](./flowchart.md)**: Detailed diagrams showing decision points, authentication checks, and state transitions.

### 🌳 Application Structure
The project follows a strict hierarchical structure, organized by user role and functionality. This "Tree of Contents" provides a bird's-eye view of the entire application's routing and component organization.

- **[View Tree of Contents](./tree_of_contents.md)**: A comprehensive map of all application routes, categorized by Visitor, Client, and Admin areas.

## Documentation
For detailed technical information, please refer to the following reports:

- 🔒 **[Security Implementation Report](./SECURITY_REPORT.md)**: Details on authentication, authorization, and data security strategies.
- 🏗️ **[Infrastructure & Deployment](./INFRASTRUCTURE.md)**: Overview of the hosting architecture and external services.

---
*This project was developed as a final project for the Web Technologies course, demonstrating proficiency in full-stack development and software engineering best practices.*
