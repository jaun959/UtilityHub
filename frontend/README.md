# Frontend for Utility Hub

This directory contains the frontend application for the Utility Hub, built with React and Vite.

## Technologies Used

*   React.js
*   Vite (as the build tool)
*   TailwindCSS
*   Axios for API requests

## Setup and Running

1.  **Install Dependencies:**
    Navigate to this directory in your terminal and run:
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in this directory with the following variable:
    ```
    VITE_API_BASE_URL=http://localhost:5000
    ```
    *   `VITE_API_BASE_URL`: The base URL of your backend API. This should match the `BASE_URL` in your backend's `.env` file.

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173` (or another available port).

## Project Structure

*   `src/components`: Reusable React components.
*   `src/pages`: Top-level page components.
*   `src/context`: React Context for global state management (e.g., authentication).
*   `src/utils`: Utility functions.

## Build for Production

To create a production-ready build of the frontend application, run:

```bash
npm run build
```

The build artifacts will be placed in the `dist` directory.