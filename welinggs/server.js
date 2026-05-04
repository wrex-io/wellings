import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pg from "pg"
import { dirname, join } from "path";
import { fileURLToPath } from "url";
 
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "public");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(filepath));

const simproute = (filename) => (req, res) => {
  res.sendFile(join(filepath, filename));
};

//DB Pool
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

async function testConnection() {
  try {
    await pool.query('SELECT * FROM menu_items');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
}


// ROUTES
app.get("/", simproute("landing.html"));
app.get("/login", simproute("login.html"));
app.get("/welinggstarters", simproute("welinggstarters.html"));
app.get("/mains", simproute("mainsw.html"));
app.get("/platters", simproute("platters.html"));
app.get("/drinks-tap", simproute("drink-tabs.html"));
app.get("/drinks-tab", simproute("drink-tabs.html"));
app.get("/drinks", simproute("drink-tabs.html"));
app.get("/admin", simproute("admin.html"));


app.get("/api/menu", async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    const results = await pool.query(
      `SELECT
        m.id,
        m.name,
        m.price,
        m.description,
        m.image_path,
        c.slug AS category_slug
      FROM menu_items m
      JOIN categories c ON c.id = m.category_id
      WHERE m.is_available = true
      ORDER BY c.sort_order ASC, m.sort_order ASC, m.id ASC`
    );

    let items = results.rows.map((row) => {
      const isDrinkSubcategory = [
        "alcoholic-drinks",
        "non-alcoholic-drinks",
        "water",
      ].includes(row.category_slug);

      return {
        id: String(row.id),
        name: row.name,
        price: Number(row.price),
        description: row.description || "",
        image: row.image_path || "",
        category: isDrinkSubcategory ? "drinks" : row.category_slug,
        subcategory: isDrinkSubcategory ? row.category_slug : "",
      };
    });

    if (category) {
      items = items.filter((item) => item.category === String(category).trim());
    }

    if (subcategory) {
      items = items.filter((item) => item.subcategory === String(subcategory).trim());
    }

    res.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error.message);
    res.status(500).json({ error: "Unable to load menu items." });
  }
});

app.get("/menu", async (req, res) => {
  res.redirect("/api/menu");
});


/*app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  return res.redirect("/landing.html");
});*/

app.listen(port, async () => {
  console.log(`welinggs is running on https://localhost:${port}`);
  await testConnection();
});
