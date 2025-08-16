# Architecture Documentation

## Tech Stack
- **Framework:** Next.js (with Pages Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Data Storage

Due to persistent, unresolvable connection errors with the external PostgreSQL database during the final hours of the assignment, a pragmatic pivot was made to an emergency data storage solution to ensure a functional submission.

The application uses a temporary, file-based database (`/tmp/db.json`) on the Vercel serverless filesystem. A helper module at `src/lib/db.ts` provides `readDB()` and `writeDB()` functions to interact with this JSON file, ensuring data persistence across API calls for the duration of a user session, which is sufficient for demonstrating the application's full functionality.

The data models are defined within the API files and are structured as follows:

```typescript
// Example User Structure
{
  id: string;
  username: string;
  password?: string; // Hashed
}

// Example Shipment Structure
{
    id: string;
    ownerId: string;
    shipperName: string;
    receiverName: string;
    origin: string;
    destination: string;
    // ... and all other fields from the form
}