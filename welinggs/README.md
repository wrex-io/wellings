
# Welinggs Restaurant Website
A restaurant website for Welinggs with an interactive menu, shopping cart, and order management. Built with HTML, CSS, and JavaScript with Node.js/Express backend.

![Welinggs](public/welinggs%20bg%20removed.png)

## Features

- Interactive menu with categories: Starters, Mains, Platters, and Drinks
- Shopping cart with quantity management
- Cart data persists across page navigation using localStorage
- Order confirmation with estimated preparation time
- Countdown timer for order readiness
- Responsive design
- Server-side routing with Express.js

## Menu Categories

- **Starters**: Falafel Wrap, Kelewele, Samosa, Yam Balls, and more
- **Mains**: Ghana Jollof, Waakye, Fufu, Banku and Tilapia, and more
- **Platters**: Akwaaba Platter, Taste Of Tradition, Fufu And Friends, and more
- **Drinks**: Alcoholic and non-alcoholic beverages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

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

3. Start the server:
```bash
node server.js
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
welinggs/
├── public/                    # Static files served by Express
│   ├── landing.html          # Home page
│   ├── welinggstarters.html  # Starters menu page
│   ├── mainsw.html           # Mains menu page
│   ├── platters.html         # Platters menu page
│   ├── drink tabs.html       # Drinks menu page
│   ├── welinggs.js           # Main JavaScript file (cart functionality)
│   ├── WELLINGS PROTOTYPE.css # Main stylesheet
│   ├── desert/               # Starter food images
│   ├── mains/                # Main course images
│   ├── platters/             # Platter images
│   ├── drinks/               # Drink images (alcoholic & non)
│   ├── images.png            # Asset
│   ├── welgg.png.jpeg        # Asset
│   └── welinggs bg removed.png # Asset
├── server.js                  # Express.js server configuration
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3 (CSS variables, flexbox), JavaScript (ES6+)
- **Backend**: Node.js, Express.js, Body Parser
- **Fonts**: Google Fonts (Poppins & Playfair Display)
- **Storage**: Browser localStorage for cart persistence

## Key Features

### Shopping Cart System
- Items persist across page navigation using localStorage
- Unique item IDs prevent duplicate entries
- Quantity management with +/- buttons
- Real-time cart count updates

### Order Management
- Order confirmation popup
- Estimated preparation time calculation
- Countdown timer for order readiness
- Order summary with itemized pricing

## Server Routes

- `GET /` - Landing page
- `GET /welinggstarters` - Starters menu
- `GET /mains` - Mains menu
- `GET /platters` - Platters menu
- `GET /drinks tab` - Drinks menu
- `POST /login` - Login route (in development)

## Customization

### Adding New Menu Items

1. Add the food image to the appropriate folder in `public/` (`desert/`, `mains/`, `platters/`, or `drinks/`)
2. Add a new tile in the corresponding HTML file:
```html
<div class="tile">
  <img src="path/to/image.jpg" alt="Food Name">
  <h3>Food Name</h3>
  <p>GHc 25.00 <span class="info" data-tooltip="Description">ℹ</span></p>
  <div class="order-controls" data-id="unique-id" data-name="Food Name" data-price="25.00" data-image="path/to/image.jpg">
    <button class="add-order js-addorder">Add Order</button>
  </div>
</div>
```

### Styling
- Modify CSS variables in `WELLINGS PROTOTYPE.css` to change color scheme
- Update fonts in the HTML `<head>` section

## Notes

- Cart data is stored in browser localStorage
- Item IDs are prefixed by category (starter-, main-, platter-) to ensure uniqueness
- Frontend-only (no backend integration)

## Contributing

Contributions, issues, and feature requests are welcome.

## License

This project is open source and available under the MIT License.

## Author

Your wrx414
- GitHub: @wrex-io (https://github.com/wrex-io)

## Acknowledgments

- Food images sourced from various culinary websites
- Fonts provided by Google Fonts
- Icons from Heroicons

