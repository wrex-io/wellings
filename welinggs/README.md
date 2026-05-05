# Welinggs Restaurant Website

A restaurant website for Welinggs with dynamic menus, a shopping cart, and order confirmation. The frontend is built with HTML, CSS, and JavaScript, and the backend uses Express with a PostgreSQL database.

![Welinggs](public/welinggs%20bg%20removed.png)

## Features

- Dynamic menu pages powered by the Express API
- PostgreSQL-backed menu categories and items
- Menu categories: Starters, Mains, Platters, and Drinks
- Shopping cart with quantity management
- Cart data persists across page navigation using localStorage
- Order confirmation with estimated preparation time
- Countdown timer for order readiness
- Server-side routing with Express.js

## Menu Categories

- **Starters**: Falafel Wrap, Kelewele, Samosa, Yam Balls, and more
- **Mains**: Ghana Jollof, Waakye, Fufu, Banku and Tilapia, and more
- **Platters**: Akwaaba Platter, Taste Of Tradition, Fufu And Friends, and more
- **Drinks**: Alcoholic, non-alcoholic, and water tabs

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL database with the `categories` and `menu_items` tables

### Installation

1. Clone the repository:

```bash
git clone https://github.com/wrex-io/wellings.git
cd wellings/welinggs
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=welinggs
MENU_TABLE=menu_items
CORS_ORIGIN=*
PGSSL=false
```

4. Start the server:

```bash
npm start
```

5. Open `http://localhost:3000`.

## API Routes

- `GET /api/health` - Checks the API and database connection
- `GET /api/menu` - Returns all available menu items
- `GET /api/menu/:category` - Returns menu items for a category, such as `starters`
- `GET /api/menu/:category/:tab` - Returns menu items for a tab, such as `drinks/alcoholic`

## Page Routes

- `GET /` - Landing page
- `GET /login` - Login page
- `GET /welinggstarters` - Starters menu
- `GET /mains` - Mains menu
- `GET /platters` - Platters menu
- `GET /drinks-tap` - Drinks menu
- `POST /login` - Login route

## Project Structure

```text
welinggs/
|-- public/
|   |-- landing.html
|   |-- welinggstarters.html
|   |-- mainsw.html
|   |-- platters.html
|   |-- drink tabs.html
|   |-- menu-api.js
|   |-- welinggs.js
|   |-- WELLINGS_PROTOTYPE.css
|   |-- desert/
|   |-- mains/
|   `-- platters/
|-- db-schema.sql
|-- package.json
|-- server.js
`-- README.md
```

## Database

The API expects:

- `categories`: stores category slugs like `starters`, `mains`, `platters`, `alcoholic-drinks`, `non-alcoholic-drinks`, and `water`
- `menu_items`: stores menu item names, prices, descriptions, image paths, availability, and category relationships

The menu pages fetch from the API and render items dynamically with `public/menu-api.js`.

## Adding New Menu Items

Add new items to the PostgreSQL `menu_items` table instead of editing the HTML pages. Each item should include:

- `category_id`
- `name`
- `price`
- `description`
- `image_path`
- `is_available`
- `sort_order`

Place the food image inside the appropriate folder in `public/`, then store the relative path in `image_path`.

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Environment config**: dotenv
- **Storage**: Browser localStorage for cart persistence

## Notes

- Cart data is stored in browser localStorage.
- Menu tiles are rendered dynamically from the API.
- Drink page tabs map to database slugs like `alcoholic-drinks`, `non-alcoholic-drinks`, and `water`.

## License

This project is open source and available under the MIT License.

## Author

Your wrx414

- GitHub: @wrex-io (https://github.com/wrex-io)
