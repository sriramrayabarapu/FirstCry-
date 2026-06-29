require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const dbConfig = require('./config/db');
const { dbQuery } = dbConfig;

const admissionRoutes = require('./routes/admissionRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const occupancyRoutes = require('./routes/occupancyRoutes');
const feeRoutes = require('./routes/feeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const tourRoutes = require('./routes/tourRoutes');

const EnquiryModel = require('./models/Enquiry');

const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const QRCodeGenerator = require('./utils/qrCode');
const WhatsappService = require('./services/whatsappService');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually port 5173 or 3000)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadsDir));

// Logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mounting Routes
app.use('/api/admissions', authMiddleware, admissionRoutes);
app.use('/api/enquiries', authMiddleware, enquiryRoutes);
app.use('/api/occupancy', authMiddleware, occupancyRoutes);
app.use('/api/fees', authMiddleware, feeRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/tours', authMiddleware, tourRoutes);

// Miscellaneous Endpoints

// 1. Teachers Dashboard Endpoint
app.get('/api/teachers', authMiddleware, async (req, res, next) => {
  try {
    const teachers = await dbQuery.all('SELECT * FROM teachers');
    res.json({ success: true, data: teachers });
  } catch (err) {
    next(err);
  }
});

// 2. Referrals Analytics
app.get('/api/referrals', authMiddleware, async (req, res, next) => {
  try {
    const referrals = await dbQuery.all('SELECT * FROM referrals ORDER BY referrals DESC');
    const campaigns = await dbQuery.all('SELECT * FROM festivals');
    res.json({ success: true, data: { referrals, campaigns } });
  } catch (err) {
    next(err);
  }
});

// 3. Prebooks (Multer file upload)
app.get('/api/prebooks', authMiddleware, async (req, res, next) => {
  try {
    const bookings = await dbQuery.all('SELECT * FROM prebooks ORDER BY id DESC');
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

app.post('/api/prebooks', authMiddleware, upload.single('photo'), async (req, res, next) => {
  try {
    const { child, program, parent, phone } = req.body;
    if (!child || !program || !parent || !phone) {
      return res.status(400).json({ success: false, message: 'Required details missing' });
    }

    const dateStr = new Date().toLocaleDateString('en-IN');
    const result = await dbQuery.run(
      'INSERT INTO prebooks (child, program, date, payment, status) VALUES (?, ?, ?, ?, ?)',
      [child, program, dateStr, 'Partial', 'Pending']
    );

    // Also store it in enquiries for admin visibility
    try {
      await EnquiryModel.create({
        parent,
        child,
        phone,
        program,
        source: 'Pre-book Web',
        status: 'Pre-booked',
        date: dateStr
      });
    } catch (e) {
      console.error('Failed to store pre-book in enquiries:', e.message);
    }

    // Send pre-booking simulated text with payment link
    try {
      await WhatsappService.sendTemplateMessage(phone, 'prebook_success', {
        parentName: parent,
        childName: child,
        program,
        receiptId: `PBK-${result.id}`
      });
    } catch (e) {
      console.error(e.message);
    }

    res.json({ success: true, id: result.id, message: 'Prebooking submitted, link sent!' });
  } catch (err) {
    next(err);
  }
});

// 4. Feedback
app.get('/api/feedback', authMiddleware, async (req, res, next) => {
  try {
    const reviews = await dbQuery.all('SELECT * FROM feedback ORDER BY id DESC');
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

app.post('/api/feedback', authMiddleware, async (req, res, next) => {
  try {
    const { name, rating, comment, class_name, teacher_rating, facility_rating } = req.body;
    if (!name || !rating) {
      return res.status(400).json({ success: false, message: 'Name and rating are required' });
    }

    const dateStr = new Date().toLocaleDateString('en-IN');
    const result = await dbQuery.run(
      'INSERT INTO feedback (name, rating, comment, date, class_name, teacher_rating, facility_rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, rating, comment || '', dateStr, class_name || 'General', teacher_rating || 5, facility_rating || 5]
    );

    res.status(201).json({ success: true, id: result.id, message: 'Thank you for your feedback!' });
  } catch (err) {
    next(err);
  }
});

// 5. Announcements / Today's Special
app.get('/api/announcements', async (req, res, next) => {
  try {
    const row = await dbQuery.get('SELECT * FROM announcements ORDER BY id DESC LIMIT 1');
    res.json({ success: true, data: row || { line1: '', line2: '' } });
  } catch (err) {
    next(err);
  }
});

app.post('/api/announcements', authMiddleware, async (req, res, next) => {
  try {
    const { line1, line2 } = req.body;
    if (!line1 || !line2) {
      return res.status(400).json({ success: false, message: 'Both Announcement lines are required' });
    }

    await dbQuery.run('INSERT INTO announcements (line1, line2) VALUES (?, ?)', [line1, line2]);
    res.json({ success: true, message: "Today's Special details published successfully" });
  } catch (err) {
    next(err);
  }
});

// 6. Users
app.get('/api/users', authMiddleware, async (req, res, next) => {
  try {
    const users = await dbQuery.all('SELECT * FROM users');
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

app.post('/api/users', authMiddleware, async (req, res, next) => {
  try {
    const { name, role, email } = req.body;
    if (!name || !role || !email) {
      return res.status(400).json({ success: false, message: 'Name, role and email required' });
    }

    await dbQuery.run(
      'INSERT INTO users (name, role, email, login, status) VALUES (?, ?, ?, ?, ?)',
      [name, role, email, 'Never', 'Active']
    );
    res.status(201).json({ success: true, message: 'New system user invited successfully' });
  } catch (err) {
    next(err);
  }
});

// 7. QR Code Image generator for classrooms
app.get('/api/qr/:classroom', authMiddleware, async (req, res, next) => {
  try {
    const { classroom } = req.params;
    const urlPayload = `http://intellitots.in/checkin?class=${encodeURIComponent(classroom)}`;
    const qrDataUri = await QRCodeGenerator.generateQRBase64(urlPayload);
    res.json({ success: true, data: qrDataUri });
  } catch (err) {
    next(err);
  }
});

// Global Error Catch Middleware
app.use(errorHandler);

// Start Listener
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
