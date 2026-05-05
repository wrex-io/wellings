DROP TABLE IF EXISTS menu_items_import;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  image_path TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_name ON menu_items(name);

INSERT INTO categories (slug, name, sort_order) VALUES
('starters', 'Starters', 1),
('mains', 'Mains', 2),
('platters', 'Platters', 3),
('alcoholic-drinks', 'Alcoholic Drinks', 4),
('non-alcoholic-drinks', 'Non-Alcoholic Drinks', 5),
('water', 'Water', 6);
