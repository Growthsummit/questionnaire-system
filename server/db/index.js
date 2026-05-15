import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database tables if they don't exist
async function initDb() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        participant_name TEXT,
        date TEXT,
        gender TEXT,
        age TEXT,
        education TEXT,
        business_duration TEXT,
        financial_access TEXT,
        financial_services TEXT,
        no_access_reason TEXT,
        business_funding TEXT,
        stock_level TEXT,
        sales_level TEXT,
        sales_growth TEXT,
        microfinance_growth TEXT,
        loans_help_stock TEXT,
        training_improves_management TEXT,
        finance_limits_growth TEXT,
        services_accessible TEXT,
        interest_rates_discourage TEXT,
        business_challenges TEXT,
        finance_challenges TEXT,
        support_needed TEXT,
        suggestions TEXT
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);

    // Add a default admin if none exists
    const adminCheck = await client.execute("SELECT * FROM admin WHERE username = 'BEEKAY'");
    if (adminCheck.rows.length === 0) {
      await client.execute({
        sql: "INSERT INTO admin (username, password) VALUES (?, ?)",
        args: ['BEEKAY', 'LETSOELA']
      });
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDb();

function mapPayloadToDb(payload) {
  return {
    participant_name: payload.name || '',
    date: payload.date || '',
    gender: payload.gender || '',
    age: payload.age || '',
    education: payload.education || '',
    business_duration: payload.years_in_business || '',
    financial_access: payload.has_financial_access || '',
    financial_services: Array.isArray(payload.financial_services) ? payload.financial_services.join(', ') : '',
    no_access_reason: payload.no_access_reason || '',
    business_funding: payload.funding_source || '',
    stock_level: payload.stock_per_week || '',
    sales_level: payload.business_sales || '',
    sales_growth: payload.sales_trend || '',
    microfinance_growth: payload.likert?.q1 || '',
    loans_help_stock: payload.likert?.q2 || '',
    training_improves_management: payload.likert?.q3 || '',
    finance_limits_growth: payload.likert?.q4 || '',
    services_accessible: payload.likert?.q5 || '',
    interest_rates_discourage: payload.likert?.q6 || '',
    business_challenges: Array.isArray(payload.challenges_growth) ? payload.challenges_growth.join(', ') : '',
    finance_challenges: Array.isArray(payload.challenges_microfinance) ? payload.challenges_microfinance.join(', ') : '',
    support_needed: Array.isArray(payload.support_needed) ? payload.support_needed.join(', ') : '',
    suggestions: payload.comments || ''
  };
}

function mapDbToPayload(row) {
  return {
    id: row.id,
    timestamp: row.submitted_at,
    name: row.participant_name,
    date: row.date,
    gender: row.gender,
    age: row.age,
    education: row.education,
    years_in_business: row.business_duration,
    has_financial_access: row.financial_access,
    financial_services: row.financial_services ? row.financial_services.split(', ') : [],
    no_access_reason: row.no_access_reason || '',
    funding_source: row.business_funding,
    stock_per_week: row.stock_level,
    business_sales: row.sales_level,
    sales_trend: row.sales_growth,
    likert: {
      q1: parseInt(row.microfinance_growth) || 0,
      q2: parseInt(row.loans_help_stock) || 0,
      q3: parseInt(row.training_improves_management) || 0,
      q4: parseInt(row.finance_limits_growth) || 0,
      q5: parseInt(row.services_accessible) || 0,
      q6: parseInt(row.interest_rates_discourage) || 0
    },
    challenges_growth: row.business_challenges ? row.business_challenges.split(', ') : [],
    challenges_microfinance: row.finance_challenges ? row.finance_challenges.split(', ') : [],
    support_needed: row.support_needed ? row.support_needed.split(', ') : [],
    comments: row.suggestions
  };
}

export async function getAllResponses() {
  const result = await client.execute('SELECT * FROM responses ORDER BY id DESC');
  return result.rows.map(mapDbToPayload);
}

export async function addResponse(payload) {
  const dbData = mapPayloadToDb(payload);
  const keys = Object.keys(dbData);
  const values = Object.values(dbData);
  const placeholders = keys.map(() => '?').join(', ');
  
  const result = await client.execute({
    sql: `INSERT INTO responses (${keys.join(', ')}) VALUES (${placeholders})`,
    args: values
  });
  
  return { id: Number(result.lastInsertRowid), ...payload };
}

export async function getAdminByUsername(username) {
  const result = await client.execute({
    sql: 'SELECT * FROM admin WHERE username = ?',
    args: [username]
  });
  return result.rows[0];
}
