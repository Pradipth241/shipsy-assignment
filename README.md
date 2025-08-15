# Shipsy - Shipment Management Portal

A full-stack web application for managing logistics, built for the Shipsy Software Engineer Intern assignment. It allows authenticated users to perform complete CRUD operations on shipments, track their history, search for specific records, and view the interface in a light or dark theme.

**Live Demo URL:** [https://shipsy-assignment-1.vercel.app/](https://shipsy-assignment-1.vercel.app/)

*(Optional but highly recommended: Create a short GIF of your application in action and replace the line below)*
`![Project Demo GIF](link-to-your-demo.gif)`

---

## Features

- ✅ **Full User Authentication:** Secure registration and login with JWT.
- ✅ **Comprehensive CRUD:** Create, read, update, and delete detailed shipment records.
- ✅ **Shipment Tracking:** Each shipment has a history log that updates with status changes.
- ✅ **Search Functionality:** Users can look up specific shipments by their full ID to view details and history, complete with a dynamically generated barcode.
- ✅ **Professional UI/UX:** A clean, responsive interface with a dark theme that respects the user's system preferences.
- ✅ **Modern Tech Stack:** Built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Core Assignment Requirements Checklist

- ✅ **Text field:** Implemented for fields like `shipperName`, `origin`, `product`, etc.
- ✅ **Enum (dropdown selection):** Implemented for `typeOfShipment`, `paymentMode`, and `status`.
- ✅ **Boolean field:** Implemented as the `isFragile` checkbox.
- ✅ **Calculated field:** The `totalFreight` is automatically calculated from two inputs: `weight * ratePerKg`.

## Tech Stack

- **Framework:** Next.js (with Pages Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI
- **Deployment:** Vercel

## Local Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Pradipth241/shipsy-assignment.git](https://github.com/Pradipth241/shipsy-assignment.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd shipsy-assignment
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up environment variables:**
    * Create a new file named `.env` in the root of the project.
    * Add the following variables, replacing the placeholder values:
        ```env
        DATABASE_URL="your_postgresql_connection_string_from_supabase"
        JWT_SECRET="your_super_secret_key_for_json_web_tokens"
        ```
5.  **Run database migrations:**
    This command will set up your local database schema.
    ```bash
    npx prisma migrate dev
    ```
6.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.
