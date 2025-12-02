# Security Implementation Report

This document outlines the comprehensive security strategies implemented in the **Web Technologies** project to ensure data integrity, user privacy, and secure transactions.

## 1. Authentication & Authorization

### JWT (JSON Web Tokens)
- **Implementation**: We use `jsonwebtoken` to generate signed tokens upon user login.
- **Strategy**: Tokens are used to statelessy authenticate requests.
- **Storage**: Tokens are securely stored (e.g., `httpOnly` cookies or local storage with appropriate security measures) to prevent XSS attacks from easily accessing them.

### Role-Based Access Control (RBAC)
- **Implementation**: Middleware functions (`authenticateToken`, `authorizeRole`) intercept requests to protected routes.
- **Strategy**:
    - **Visitors**: Can access public pages (Home, Products).
    - **Clients**: Can access their own dashboard, orders, and profile.
    - **Admins**: Have full access to management dashboards (Products, Orders, Users).
- **Enforcement**: Routes are explicitly protected, e.g., `router.get('/admin/dashboard', authenticateToken, authorizeRole('ADMIN'), ...)`

### IDOR (Insecure Direct Object References) Protection
- **Implementation**: Backend controllers explicitly verify resource ownership.
- **Strategy**: When a user requests a specific resource (e.g., `GET /api/orders/:id`), the system checks if the `userId` of the order matches the authenticated user's ID (unless the user is an Admin).
- **Example**:
  ```javascript
  if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
  }
  ```

## 2. Secure Transactions & Payments

### Backend-Driven Price Calculation
- **Implementation**: The frontend sends only product IDs and quantities.
- **Strategy**: The backend **never** trusts prices sent from the client. It fetches the authoritative price from the database for every item in the cart/order.
- **Benefit**: Prevents malicious users from manipulating HTML/JS to send fake prices (e.g., buying a €100 item for €1).

### Stripe Integration
- **Implementation**: We use Stripe Payment Intents API.
- **Strategy**:
    - The payment intent is created on the server-side with the calculated total.
    - The client only receives a `clientSecret` to complete the UI flow.
    - Webhooks (optional/planned) or server-side confirmation ensure the payment actually succeeded before finalizing the order status.

## 3. Data Validation & Sanitization

### Input Sanitization
- **Implementation**: A utility function `sanitize()` is used on request bodies.
- **Strategy**: Inputs are stripped of potentially dangerous characters or scripts to prevent NoSQL Injection or XSS attacks before being processed by the database or rendered.

### Database Security (Prisma ORM)
- **Implementation**: We use Prisma ORM for all database interactions.
- **Strategy**: Prisma uses parameterized queries by default, effectively neutralizing SQL Injection attacks.

## 4. Infrastructure Security

### HTTPS / TLS
- **Strategy**: All data in transit is encrypted using standard HTTPS protocols (enforced by hosting provider).

### Environment Variables
- **Implementation**: Sensitive keys (Stripe Secret Key, Database URL, JWT Secret) are stored in `.env` files and never committed to version control.
- **Strategy**: `dotenv` is used to load these variables at runtime.

## 5. Order Management Logic

### State Integrity
- **Implementation**: Strict state machine logic for order statuses (PENDING -> PAID -> SHIPPED -> COMPLETED/CANCELLED).
- **Strategy**: Users cannot arbitrarily change order status. Modification requests are blocked if a request is already pending, preventing race conditions or logic bypasses.
