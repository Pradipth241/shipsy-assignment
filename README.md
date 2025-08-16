# Shipsy - Shipment Management Portal

A full-stack web application for managing logistics, built for the Shipsy Software Engineer Intern assignment. It allows authenticated users to perform complete CRUD operations on shipments, track their history, and search for specific records.

**Live Demo URL:** [https://shipsy-assignment-1.vercel.app/](https://shipsy-assignment-1.vercel.app/)

---

## Features

- ✅ **Full User Authentication:** Secure registration and login with JWT.
- ✅ **Comprehensive CRUD:** Create, read, update, and delete detailed shipment records.
- ✅ **Shipment Tracking:** Each shipment has a history log that updates with status changes.
- ✅ **Search Functionality:** Users can look up specific shipments by their full ID to view details and history.
- ✅ **Professional UI/UX:** A clean, responsive interface with a dark theme.

## Core Assignment Requirements Checklist

- ✅ **Text field:** Implemented for fields like `shipperName`, `origin`, etc.
- ✅ **Enum (dropdown):** Implemented for `typeOfShipment`, `mode`, etc.
- ✅ **Boolean field:** Implemented as the `isFragile` checkbox.
- ✅ **Calculated field:** `totalFreight` is calculated from `weight * ratePerKg`.

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI
- **Deployment:** Vercel
- **Database:** A persistent, temporary file-based storage system on the Vercel serverless filesystem (`/tmp`) was used as an emergency solution to overcome persistent external database connection issues and meet the project deadline.

## Local Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add a `JWT_SECRET`.
4.  Start the development server: `npm run dev`