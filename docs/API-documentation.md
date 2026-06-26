# FirstCry Intellitots API Documentation

This backend service provides a REST API to manage enquiries, classroom capacity levels, billing collection receipts, reports summaries, and announcements.

## Base URL
`http://localhost:5000/api`

---

## Endpoints

### 1. Admissions

* **GET `/admissions`**
  * Description: Retrieve all registered admissions
  * Response:
    ```json
    {
      "success": true,
      "data": [
        { "id": 1, "child": "Aarohi Sharma", "parent": "Priya Sharma", "program": "Nursery", "status": "Confirmed", "date": "2 Jun 2025", "counsellor": "Priya K." }
      ]
    }
    ```

* **POST `/admissions`**
  * Description: Create a new admission entry
  * Body parameters: `child` (string), `parent` (string), `program` (string), `status` (string), `date` (string), `counsellor` (string)

* **PUT `/admissions/:id/status`**
  * Description: Modify admission status (e.g. `Confirmed`, `Pending`, `Waitlisted`)
  * Body parameters: `status` (string)
  * Note: Transitioning a student to `Confirmed` automatically increments the corresponding classroom filled occupancy count.

---

### 2. Enquiries & Leads

* **GET `/enquiries`**
  * Description: List parent enquiries

* **POST `/enquiries`**
  * Description: Capture new enquiry form submission
  * Body parameters: `parent`, `child`, `age`, `phone`, `email`, `program`, `visit_date`, `source`, `notes`
  * Action: Inserts enquiry record, generates lead entry for the counsellor list, and schedules simulated WhatsApp welcome message to parent.

* **GET `/enquiries/leads`**
  * Description: Retrieve leads list for the counsellor dashboard view.

* **PUT `/enquiries/leads/:id/status`**
  * Description: Update lead routing phase (e.g. `Tour Booked`, `Follow-up Pending`, `Converted`).

---

### 3. Occupancy

* **GET `/occupancy`**
  * Description: Retrieve live classroom counts and capacity sizes.

* **PUT `/occupancy/:id`**
  * Description: Admin adjustment of capacity indicators.

* **GET `/qr/:classroom`**
  * Description: Generate base64 PNG data URI of check-in QR Code for a classroom.

---

### 4. Billing & Fees

* **GET `/fees`**
  * Description: List all invoice balances.

* **POST `/fees/:id/payment`**
  * Description: Record a tuition payment installment.
  * Body parameters: `amount` (number).

* **POST `/fees/:id/remind`**
  * Description: Dispatch simulated fee payment warning notification to parent WhatsApp.

* **GET `/fees/:id/receipt`**
  * Description: Generate and download PDF receipt for parent payments.

---

### 5. Reports

* **GET `/reports/stats`**
  * Description: Aggregate counts of students, vacancies, active leads, and revenues.

* **GET `/reports/download/pdf/:type`**
  * Description: Generate and export PDF tabular records. Type can be `admissions`, `enquiries`, or `occupancy`.

* **GET `/reports/download/csv/:type`**
  * Description: Generate and export CSV files.

---

### 6. Announcements

* **GET `/announcements`**
  * Description: Retrieve latest banner alerts.

* **POST `/announcements`**
  * Description: Update the menu and parent notices.
