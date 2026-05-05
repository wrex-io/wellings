import 'dotenv/config';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = join(__dirname, 'public');
const app = express();
const port = Number(process.env.PORT) || 3000;
const corsOrigin = process.env.CORS_ORIGIN || '*';
const menuTable = process.env.MENU_TABLE || 'menu_items';

const databaseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME
};

const categoryAliases = {
  alcoholic: 'alcoholic-drinks',
  'non-alcoholic': 'non-alcoholic-drinks'
};

if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME) {
  console.warn('PostgreSQL config is not complete. Set DB_USER, DB_HOST, and DB_NAME in .env.');
}

const pool = new Pool({
  ...databaseConfig,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

const simpleRoute = (filename) => (req, res) => {
  res.sendFile(join(publicPath, filename));
};

const mapMenuItem = (row) => ({
  id: String(row.id),
  category: row.category,
  tab: row.tab || null,
  name: row.name,
  price: Number(row.price),
  image: row.image,
  description: row.description || ''
});

const menuItemFields = `
  ${menuTable}.id,
  categories.slug AS category,
  categories.slug AS tab,
  ${menuTable}.name,
  ${menuTable}.price,
  ${menuTable}.image_path AS image,
  ${menuTable}.description
`;

function safeMenuTableName(tableName) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    throw new Error('MENU_TABLE must be a plain table name like menu_items.');
  }
  return tableName;
}

async function getMenuItems({ category, tab } = {}) {
  const table = safeMenuTableName(menuTable);
  const values = [];
  const where = [];
  const categorySlug = categoryAliases[category] || category;
  const tabSlug = categoryAliases[tab] || tab;

  if (categorySlug && categorySlug !== 'drinks') {
    values.push(categorySlug);
    where.push(`categories.slug = $${values.length}`);
  }

  if (tabSlug) {
    values.push(tabSlug);
    where.push(`categories.slug = $${values.length}`);
  }

  where.push(`${table}.is_available = true`);

  const result = await pool.query(
    `
      SELECT ${menuItemFields}
      FROM ${table}
      JOIN categories ON categories.id = ${table}.category_id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY categories.sort_order NULLS LAST, ${table}.sort_order NULLS LAST, ${table}.name
    `,
    values
  );

  return result.rows.map(mapMenuItem);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: corsOrigin }));
app.use(express.static(publicPath));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

app.get('/api/menu', async (req, res) => {
  try {
    const items = await getMenuItems();
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Could not load menu items.', details: error.message });
  }
});

app.get('/api/menu/:category', async (req, res) => {
  try {
    const items = await getMenuItems({ category: req.params.category });
    res.json({ category: req.params.category, items });
  } catch (error) {
    res.status(500).json({ error: 'Could not load menu category.', details: error.message });
  }
});

app.get('/api/menu/:category/:tab', async (req, res) => {
  try {
    const items = await getMenuItems({ category: req.params.category, tab: req.params.tab });
    res.json({ category: req.params.category, tab: req.params.tab, items });
  } catch (error) {
    res.status(500).json({ error: 'Could not load menu tab.', details: error.message });
  }
});

app.get('/', simpleRoute('landing.html'));
app.get('/login', simpleRoute('login.html'));
app.get('/welinggstarters', simpleRoute('welinggstarters.html'));
app.get('/mains', simpleRoute('mainsw.html'));
app.get('/platters', simpleRoute('platters.html'));
app.get('/drinks-tap', simpleRoute('drink tabs.html'));

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  return res.redirect('/landing.html');
});

app.listen(port, () => {
  console.log(`welinggs is running on ${port}`);
});
