
# Welinggs Restaurant Website
A restaurant website for Welinggs with an interactive menu, shopping cart, and order management. Built with HTML, CSS, and JavaScript.

![Welinggs](welinggs%20bg%20removed.png)

## Features

- Interactive menu with categories: Starters, Mains, Platters, and Drinks
- Shopping cart with quantity management
- Cart data persists across page navigation using localStorage
- Order confirmation with estimated preparation time
- Countdown timer for order readiness
- Responsive design

## Menu Categories

- **Starters**: Falafel Wrap, Kelewele, Samosa, Yam Balls, and more
- **Mains**: Ghana Jollof, Waakye, Fufu, Banku and Tilapia, and more
- **Platters**: Akwaaba Platter, Taste Of Tradition, Fufu And Friends, and more
- **Drinks**: Alcoholic and non-alcoholic beverages

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/welinggs.git
cd welinggs
```

2. Open the website:
   - Option 1: Open `landing.html` or `welinggs home.html` in your browser
   - Option 2: Use a local server:
     ```bash
     # Using Node.js (http-server)
     npx http-server
     

3. Navigate to `http://localhost:8000` in your browser

## Project Structure

```
welinggs/
├── desert/              # Starter food images
├── mains/               # Main course images
├── platters/            # Platter images
├── drinks/              # Drink images (alcoholic & non)
├── welinggstarters.html # Starters menu page
├── mainsw.html          # Mains menu page
├── platters.html        # Platters menu page
├── drink tabs.html      # Drinks menu page
├── welinggs.js          # Main JavaScript file (cart functionality)
├── WELLINGS PROTOTYPE.css # Main stylesheet
└── README.md            # This file
```

## Technologies Used

- HTML5
- CSS3 (CSS variables, flexbox)
- JavaScript (ES6+)
- Google Fonts (Poppins & Playfair Display)

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

## Customization

### Adding New Menu Items

1. Add the food image to the appropriate folder (`desert/`, `mains/`, `platters/`, or `drinks/`)
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

