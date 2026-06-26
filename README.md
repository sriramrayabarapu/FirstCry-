# FirstCry Intellitots preschool & daycare management platform

This repository hosts the full-stack version of the FirstCry Intellitots Admission and Occupancy Management Platform.

## Features Included
1. **Admission Dashboard**: High level analytics, KPIs, live pipeline tracking, monthly registrations and occupancy charts.
2. **Occupancy Management**: Live classroom capacity monitors, print-ready base64 PNG check-in QR code generator.
3. **Parent Enquiry Form**: Dynamic enquiry submission, validation, automatic internal and external alert notifications.
4. **Counsellor Lead list**: Manage parent lead stages, live filters, AI assisted script guides, and urgency warnings.
5. **Tour Calendar**: Visual tour booking scheduler, slot tracking, upcoming tours table.
6. **Parent Portal**: Student records, color-coded attendance grids, monthly billing items, and teacher review notes.
7. **Fee Management**: Live fee tracking, payment collection input, automated reminder messages, and dynamic PDF invoice receipts.
8. **Loyalty Referrals**: Track codes, savings earnings, and trigger festival campaign notifications.
9. **Reports**: Counsellor charts and dynamic PDF/CSV spreadsheet exports.
10. **Feedback System**: Collect reviews and display stars metrics.
11. **Admin Panel**: Announcements banner editor, user profiles setup, and center KPI totals.

---

## Folder Structure
```
firstcry-intellitots/
│── frontend/          # React + Vite application
│── backend/           # Node.js + Express API server
│── database/          # SQLite schema.sql and seed-data.json files
│── docs/              # API and Project Report documents
```

---

## Launch Instructions

### 1. Start the Backend API Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not done already):
   ```bash
   npm install
   ```
3. Run the development server (runs database seeding automatically if `intellitots.db` does not exist):
   ```bash
   npm run dev
   ```
The backend server runs at `http://localhost:5000`.

### 2. Start the Frontend React Client
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite client:
   ```bash
   npm run dev
   ```
Open `http://localhost:3000` in your web browser. Requests targeting `/api` are automatically proxied to the backend at port 5000.
