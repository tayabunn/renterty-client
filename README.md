# Renterty: Property Rental & Booking Platform

> [!IMPORTANT]
> **Deployment & Submission Information**
> - **Front-End Live Link**: [Renterty Live Website](https://renterty-client.vercel.app)
> - **Client Repository Link**: [Client GitHub Repository](https://github.com/tayabunn/renterty-client)


### Default Test Credentials
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@renterty.com` | `adminpassword123` |
| **Owner (Landlord)** | `owner@renterty.com` | `ownerpassword123` |
| **Tenant (Renter)** | `tenant@renterty.com` | `tenantpassword123` |

Renterty is a transparent, secure, and modern full-stack rental marketplace connecting tenants and property owners. The system features role-based access control, comprehensive property listing flows, Stripe reservation fee checkouts, interactive tenant ratings and reviews, and owner analytics.

## Purpose
The platform allows tenants to discover, filter, and instantly book listed apartments, villas, and cabins. Owners can list their rentals, track their monthly earnings and bookings through data visualizations, and manage booking requests. Admins moderate listing requests, manage system roles, and audit transactions.

## Key Features
- **Role-Based Access Control (RBAC)**: Distinct layouts, views, and dashboards for `Tenant`, `Owner`, and `Admin` users.
- **Advanced Filtering and Search**: Search properties by location (city/state), filter by property type, and sort by rent price (Low to High, High to Low) dynamically with backend pagination.
- **Secure Reservation Checkout**: Stripe payment gateway integration charging reservation fees in cents and producing receipts.
- **Tenant Reviews and Ratings**: Vetted rating systems for tenants to write comments and stars on verified listings.
- **Analytics Visualization**: Interactive Recharts line charts representing monthly earnings for owners over the last 12 months.
- **PDF Reports Download**: Automated server-side PDFKit report generator compiling owner transactions and booking tables.
- **Google Social Sign-In**: Seamless authentication setting social accounts as Tenants by default.
- **Responsive Layout**: Designed for mobile, tablet, and desktop views using Tailwind CSS.
- **Dark/Light Mode Switcher**: Eye-pleasing theme toggle with local storage persistence.

## Technologies and Packages Used

### Client Side (Next.js App Router)
- **Framework**: `Next.js 16 (Turbopack)`
- **Styling**: `Tailwind CSS v4`
- **Animations**: `Framer Motion`
- **Charts**: `Recharts`
- **Stripe**: `@stripe/stripe-js` & `@stripe/react-stripe-js`
- **Authentication**: `Firebase Client SDK` (Google Auth Provider)
- **Notifications**: `React Hot Toast`
- **Icons**: `Lucide React`

### Server Side (Node.js & Express)
- **Framework**: `Express.js`
- **Database Connection**: `Mongoose` & `MongoDB Atlas`
- **Authentication**: `jsonwebtoken` (JWT) & `bcryptjs`
- **Stripe SDK**: `stripe`
- **PDF Generation**: `pdfkit`
- **CORS**: `cors`
- **Environment config**: `dotenv`

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18+`
- **MongoDB**: Access to a MongoDB Atlas cluster or local database instance.

### 2. Setting Up the Server
Navigate to the `renterty-server` directory:
```bash
cd renterty-server
npm install
```
Create a `.env` file in the `renterty-server` root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Run the database seed script to populate default users (Admin, Owner, Tenant) and sample listings:
```bash
node seed.js
```

Start the API server in development mode:
```bash
npm run dev
```

### 3. Setting Up the Client
Navigate to the `renterty-client` directory:
```bash
cd renterty-client
npm install
```
Create a `.env.local` file in the `renterty-client` root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the Renterty rental application.
