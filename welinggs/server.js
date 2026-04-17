import express from "express";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdir, readFile, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, "public");
const dataDir = join(__dirname, "data");
const menuDbPath = join(dataDir, "menu.json");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(filepath));

const simproute = (filename) => (req, res) => {
  res.sendFile(join(filepath, filename));
};

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const readMenuItems = async () => {
  const raw = await readFile(menuDbPath, "utf8");
  return JSON.parse(raw);
};

const writeMenuItems = async (items) => {
  await mkdir(dataDir, { recursive: true });
  await writeFile(menuDbPath, JSON.stringify(items, null, 2));
};

// ROUTES
app.get("/", simproute("landing.html"));
app.get("/login", simproute("login.html"));
app.get("/welinggstarters", simproute("welinggstarters.html"));
app.get("/mains", simproute("mainsw.html"));
app.get("/platters", simproute("platters.html"));
app.get("/drinks-tap", simproute("drink-tabs.html"));
app.get("/admin", simproute("admin.html"));

app.get("/api/menu", async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const items = await readMenuItems();

    const filteredItems = items.filter((item) => {
      const categoryMatch = category ? item.category === category : true;
      const subcategoryMatch = subcategory ? item.subcategory === subcategory : true;
      return categoryMatch && subcategoryMatch;
    });

    res.json(filteredItems);
  } catch (error) {
    res.status(500).json({ error: "Unable to load menu items." });
  }
});

app.post("/api/menu", async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      subcategory = "",
      image = "",
      description = "",
      alt = "",
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        error: "name, price, and category are required.",
      });
    }

    const items = await readMenuItems();
    const safeName = name.trim();
    const newItem = {
      id: `${category}-${slugify(subcategory || safeName)}-${Date.now()}`,
      name: safeName,
      price: Number(price),
      category: category.trim(),
      subcategory: subcategory.trim(),
      image: image.trim(),
      description: description.trim(),
      alt: alt.trim() || safeName,
    };

    items.push(newItem);
    await writeMenuItems(items);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Unable to save menu item." });
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  return res.redirect("/landing.html");
});

app.listen(port, () => {
  console.log(`welinggs is runnin on ${port}`);
});
