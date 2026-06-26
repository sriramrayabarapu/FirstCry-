const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../database/intellitots.db');
const dbDir = path.dirname(dbPath);

// Ensure the database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // 1. Read and execute schema.sql
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    try {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schemaSql, (err) => {
        if (err) {
          console.error('Error executing schema SQL:', err.message);
          return;
        }
        console.log('Database schema checked/created successfully.');
        seedDatabase();
      });
    } catch (err) {
      console.error('Failed to read schema.sql:', err.message);
    }
  });
}

function seedDatabase() {
  // Check if we already have users in the system to decide if we should seed
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (err) {
      console.error('Error checking user count:', err.message);
      return;
    }

    if (row && row.count > 0) {
      console.log('Database already initialized. Skipping seeding.');
      return;
    }

    console.log('Database is empty. Seeding sample data...');
    const sampleDataPath = path.resolve(__dirname, '../../database/sample-data.json');
    
    try {
      const sampleDataJson = fs.readFileSync(sampleDataPath, 'utf8');
      const data = JSON.parse(sampleDataJson);

      db.serialize(() => {
        // Seed admissions
        if (data.admissions && data.admissions.length > 0) {
          const stmt = db.prepare('INSERT INTO admissions (child, parent, program, status, date, counsellor) VALUES (?, ?, ?, ?, ?, ?)');
          data.admissions.forEach(item => stmt.run(item.child, item.parent, item.program, item.status, item.date, item.counsellor));
          stmt.finalize();
          console.log(`Seeded ${data.admissions.length} admissions.`);
        }

        // Seed classrooms
        if (data.classrooms && data.classrooms.length > 0) {
          const stmt = db.prepare('INSERT OR IGNORE INTO classrooms (name, emoji, capacity, filled, waitlist) VALUES (?, ?, ?, ?, ?)');
          data.classrooms.forEach(item => stmt.run(item.name, item.emoji, item.capacity, item.filled, item.waitlist));
          stmt.finalize();
          console.log(`Seeded ${data.classrooms.length} classrooms.`);
        }

        // Seed leads
        if (data.leads && data.leads.length > 0) {
          const stmt = db.prepare('INSERT INTO leads (name, child, phone, program, status, priority, date) VALUES (?, ?, ?, ?, ?, ?, ?)');
          data.leads.forEach(item => stmt.run(item.name, item.child, item.phone, item.program, item.status, item.priority, item.date));
          stmt.finalize();
          console.log(`Seeded ${data.leads.length} leads.`);
        }

        // Seed teachers
        if (data.teachers && data.teachers.length > 0) {
          const stmt = db.prepare('INSERT INTO teachers (name, role, exp, classes, rating) VALUES (?, ?, ?, ?, ?)');
          data.teachers.forEach(item => stmt.run(item.name, item.role, item.exp, item.classes, item.rating));
          stmt.finalize();
          console.log(`Seeded ${data.teachers.length} teachers.`);
        }

        // Seed tours
        if (data.tours && data.tours.length > 0) {
          const stmt = db.prepare('INSERT INTO tours (parent, date, time, program, status, counsellor) VALUES (?, ?, ?, ?, ?, ?)');
          data.tours.forEach(item => stmt.run(item.parent, item.date, item.time, item.program, item.status, item.counsellor));
          stmt.finalize();
          console.log(`Seeded ${data.tours.length} tours.`);
        }

        // Seed fees
        if (data.fees && data.fees.length > 0) {
          const stmt = db.prepare('INSERT INTO fees (child, program, parent, fee, paid, status) VALUES (?, ?, ?, ?, ?, ?)');
          data.fees.forEach(item => stmt.run(item.child, item.program, item.parent, item.fee, item.paid, item.status));
          stmt.finalize();
          console.log(`Seeded ${data.fees.length} fees records.`);
        }

        // Seed referrals
        if (data.referrals && data.referrals.length > 0) {
          const stmt = db.prepare('INSERT OR IGNORE INTO referrals (name, referrals, converted, savings, status) VALUES (?, ?, ?, ?, ?)');
          data.referrals.forEach(item => stmt.run(item.name, item.referrals, item.converted, item.savings, item.status));
          stmt.finalize();
          console.log(`Seeded ${data.referrals.length} referrers.`);
        }

        // Seed festivals
        if (data.festivals && data.festivals.length > 0) {
          const stmt = db.prepare('INSERT OR IGNORE INTO festivals (name, emoji, date, msg) VALUES (?, ?, ?, ?)');
          data.festivals.forEach(item => stmt.run(item.name, item.emoji, item.date, item.msg));
          stmt.finalize();
          console.log(`Seeded ${data.festivals.length} festival campaigns.`);
        }

        // Seed users
        if (data.users && data.users.length > 0) {
          const stmt = db.prepare('INSERT OR IGNORE INTO users (name, role, email, login, status) VALUES (?, ?, ?, ?, ?)');
          data.users.forEach(item => stmt.run(item.name, item.role, item.email, item.login, item.status));
          stmt.finalize();
          console.log(`Seeded ${data.users.length} users.`);
        }

        // Seed prebooks
        if (data.prebooks && data.prebooks.length > 0) {
          const stmt = db.prepare('INSERT INTO prebooks (child, program, date, payment, status) VALUES (?, ?, ?, ?, ?)');
          data.prebooks.forEach(item => stmt.run(item.child, item.program, item.date, item.payment, item.status));
          stmt.finalize();
          console.log(`Seeded ${data.prebooks.length} pre-bookings.`);
        }

        // Seed feedback
        if (data.feedback && data.feedback.length > 0) {
          const stmt = db.prepare('INSERT INTO feedback (name, rating, comment, date, class_name, teacher_rating, facility_rating) VALUES (?, ?, ?, ?, ?, ?, ?)');
          data.feedback.forEach(item => stmt.run(item.name, item.rating, item.comment, item.date, item.class_name, item.teacher_rating, item.facility_rating));
          stmt.finalize();
          console.log(`Seeded ${data.feedback.length} feedback entries.`);
        }

        // Seed announcements
        if (data.announcements && data.announcements.length > 0) {
          const stmt = db.prepare('INSERT INTO announcements (line1, line2) VALUES (?, ?)');
          data.announcements.forEach(item => stmt.run(item.line1, item.line2));
          stmt.finalize();
          console.log('Seeded announcements.');
        }
      });
    } catch (err) {
      console.error('Failed to seed database:', err.message);
    }
  });
}

// Utility to run raw sql queries with promise wrappers
const dbQuery = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = {
  db,
  dbQuery
};
