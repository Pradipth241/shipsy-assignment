Throughout this project, Gemini was used as a development partner to accelerate development, debug complex issues, and implement professional features. Here are six examples of prompts that were used.

### 1. Generating a Complex Database Schema
- **Task:** I needed to create a detailed database schema for a logistics application with many fields and relations.
- **Prompt:** "Gemini, create a Prisma schema for a `Shipment` model. It needs shipper details, receiver details, and shipment details including fields like origin, destination, weight, ratePerKg, a `ShipmentStatus` enum, and a calculated `totalFreight`. Also, create a `User` model for authentication and a `ShipmentHistory` model to track status changes."
- **Result:** Gemini provided a complete and well-structured Prisma schema that served as the foundation for the entire backend. This saved significant time and prevented potential errors in data modeling.

### 2. Implementing a Professional Dark Theme
- **Task:** I wanted to add a dark theme to the application that respected the user's operating system preference.
- **Prompt:** "How can I implement a dark theme in my Next.js and Tailwind CSS app? It should be controlled by a 'dark' class on the html tag and automatically detect the user's system settings."
- **Result:** Gemini provided a three-step plan: configuring `tailwind.config.js`, adding a script to `_document.tsx` to check for `prefers-color-scheme`, and providing examples of `dark:` variant classes to update the components. This led to a professional-looking and modern feature.

### 3. Debugging a Persistent Database Sync Error
- **Task:** My Vercel deployment kept failing with the error "The column 'columnName' does not exist in the current database," even after I updated my schema.
- **Prompt:** "I've run `npx prisma migrate reset` and `npx prisma generate`, but my deployed Vercel app is still throwing a 'Column does not exist' error. Here is the log. What could be the cause?"
- **Result:** The AI helped diagnose that this was a stubborn environment issue, not a code issue. It guided me through a "scorched earth" reset process, including clearing the npm cache and creating a brand new project folder, which ultimately solved the deep-seated environmental corruption.

### 4. Fixing a React Infinite Loop Error
- **Task:** The dashboard was crashing with a "Maximum update depth exceeded" error after deleting a shipment.
- **Prompt:** "My React component is stuck in an infinite loop when I delete an item and try to refresh the list. Here is my `dashboard.tsx` code. Can you find and fix the bug?"
- **Result:** Gemini explained that the root cause was an unstable function reference in a `useEffect` dependency array. It provided a more robust solution by rewriting the delete handler to update the local state directly (`setShipments(...)`) instead of re-fetching, which completely and permanently solved the infinite loop.

### 5. Resolving Vercel Build Failures
- **Task:** My Vercel deployment was failing with TypeScript and ESLint errors like "Unexpected any" and "prisma: command not found."
- **Prompt:** "My Vercel build is failing with these linting errors. Here is the log. How do I fix them?"
- **Result:** The AI provided precise fixes for each error, such as moving `prisma` from `devDependencies` to `dependencies` in `package.json` and replacing `any` types with specific TypeScript interfaces, allowing the build to succeed.

### 6. Pivoting to an Emergency Solution
- **Task:** With the deadline approaching, the external database connection on Vercel was still failing. I needed a working project to submit immediately.
- **Prompt:** "The database connection on Vercel has failed. I have one hour left. Is there an emergency alternative to Prisma that will allow me to deploy a working demo?"
- **Result:** Gemini proposed a pragmatic "Plan B": switching to a temporary file-based database using Vercel's `/tmp` directory. It provided all the rewritten API code to use this new system. This showed critical problem-solving under pressure and resulted in a functional application that could be submitted on time.