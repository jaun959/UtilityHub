To run the Utility Hub

This is a web-based utility platform that provides users with multiple everyday tools in one place. It is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with TailwindCSS for styling.

## Features Implemented:

1.  **PNG to JPG Converter (Bulk)**
2.  **Image to PDF Converter (Bulk)**
3.  **PDF to Image Converter (All Pages)**
4.  **Link Shortener**
5.  **Text to PDF Generator**
6.  **PDF Merger**
7.  **PDF Splitter**
8.  **Word to PDF Converter**
9.  **PDF to Word Converter (Placeholder)**
10. **Excel to PDF Converter (Placeholder)**
11. **PDF to Excel Converter (Placeholder)**
12. **Text Case Converter (UPPERCASE, lowercase, Title Case)**
13. **QR Code Generator (Text/Link to QR)**
14. **QR Code Scanner (Upload image -> Extract data)**
15. **Image Resizer (Bulk)**
16. **Image Compressor (Bulk)**
17. **Image Format Converter (WebP, PNG, JPG, GIF, etc.)**
18. **Base64 Encoder/Decoder (Text or Image)**
19. **Markdown to HTML Converter**
20. **HTML to Markdown Converter**
21. **JSON Formatter & Validator**
22. **CSV to JSON Converter (and vice versa)**
23. **Password Generator (customizable rules)**
24. **Hash Generator (MD5, SHA256, etc.)**
25. **Text Difference Checker (Compare two texts)**

## Authentication:

This application includes JWT-based authentication. Some premium/bulk features are protected and require a user to be logged in. You can register and log in using the provided forms.

## How to Run the Application:



**1. Start the Application (Frontend & Backend):**
   Navigate to the root directory of the project in your terminal:
   ```bash
   npm install
   npm start
   ```
   This will install all root dependencies (including `concurrently`) and then start both the backend and frontend servers. The backend server will run on `http://localhost:5000` and the frontend application will open in your browser, usually at `http://localhost:3000`.

**Alternatively, start servers individually:**

**1. Start the Backend Server:**
   Navigate to the `backend` directory in your terminal:
   ```bash
   cd backend
   ```
   Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
   Start the server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:5000`.

**2. Start the Frontend Development Server:**
   Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
   Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
   Start the development server:
   ```bash
   npm start
   ```
   The frontend application will open in your browser, usually at `http://localhost:3000`.

**3. Cloudinary Configuration:**
   This application uses Cloudinary for file storage. You need to set up a free Cloudinary account and obtain your API credentials (Cloud Name, API Key, API Secret).
   Update the `backend/.env` file with your Cloudinary credentials:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

**4. MongoDB:**
   Ensure you have a MongoDB instance running. The application is configured to connect to `mongodb://localhost:27017/utilityhub`. If your MongoDB is running on a different port or location, update the `MONGO_URI` in `backend/.env` accordingly.

**Note:** For features like "PDF to Word Converter", "Excel to PDF Converter", and "PDF to Excel Converter", placeholder implementations are in place. These would require integration with external APIs or specialized libraries for full functionality.