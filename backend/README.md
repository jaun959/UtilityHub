# Backend for Utility Hub

This directory contains the backend services for the Utility Hub application.

## Technologies Used

*   Node.js
*   Express.js
*   MongoDB (via Mongoose)
*   JWT for authentication
*   Supabase for file storage

## Setup and Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in this directory with the following variables:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    BASE_URL=http://localhost:5000
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    ```
    *   `PORT`: The port on which the server will run.
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secret key for JWT token generation and verification.
    *   `BASE_URL`: The base URL of your backend server (e.g., `http://localhost:5000` for local development).
    *   `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project credentials.

3.  **Run the Server:**
    ```bash
    npm start
    ```
    The server will start on the specified PORT (default: 5000).

## API Endpoints

The backend exposes the following main API endpoints:

*   **`/api/auth`**: Handles user authentication (registration, login).
    *   `POST /api/auth/register`
    *   `POST /api/auth/login`
*   **`/shorten`**: Handles URL shortening and redirection.
    *   `POST /shorten` (to create a shortened URL)
    *   `GET /shorten/:code` (to redirect from a shortened URL)
*   **`/api/convert`**: A collection of endpoints for various conversion tools.
    *   `POST /api/convert/png-to-jpg`
    *   `POST /api/convert/image-to-pdf`
    *   `POST /api/convert/resize-image`
    *   `POST /api/convert/compress-image`
    *   `POST /api/convert/convert-image-format`
    *   `POST /api/convert/base64-image`
    *   `POST /api/convert/image-flip`
    *   `POST /api/convert/image-to-base64`
    *   `POST /api/convert/image-grayscale`
    *   `POST /api/convert/pdf-to-word`
    *   `POST /api/convert/word-to-pdf`
    *   `POST /api/convert/excel-to-pdf`
    *   `POST /api/convert/pdf-to-excel`
    *   `POST /api/convert/excel-to-word`
    *   `POST /api/convert/pdf-to-image`
    *   `POST /api/convert/merge-pdfs`
    *   `POST /api/convert/split-pdf`
    *   `POST /api/convert/pdf-to-text`
    *   `POST /api/convert/pdf-rotate`
    *   `POST /api/convert/base64-text`
    *   `POST /api/convert/text-to-pdf`
*   **`/`**: Root endpoint.
    *   `GET /` (simple welcome message)
*   **`/health`**: Health check endpoint.
    *   `GET /health`