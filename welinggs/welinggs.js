document.addEventListener('DOMContentLoaded', () => {
  // Tab functionality
  const initTabs = () => {
    const tabs = document.querySelectorAll('.nav-link');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });

    // Activate first tab by default if none are active
    if (document.querySelectorAll('.nav-link.active').length === 0 && tabs.length > 0) {
      tabs[0].classList.add('active');
      const firstTabId = tabs[0].getAttribute('data-tab');
      document.getElementById(firstTabId).classList.add('active');
    }
  };

  // Initialize tabs
  initTabs();

  // Cart functionality
  const iconCart = document.querySelector('.chrtt');
  const closeCart = document.querySelector('.cart-tab .close');
  const listCart = document.querySelector('.listcart');
  const cartCount = document.querySelector('.chrtt span');
  const checkoutBtn = document.querySelector('.checkout');
  const confirmationPopup = document.getElementById('orderConfirmation');
  const confirmationSummary = document.getElementById('confirmationSummary');
  const confirmOkBtn = document.querySelector('.confirm-ok');
  const estTimeDisplay = document.getElementById('estTime');
  const countdownTimer = document.getElementById('countdownTimer');

  let cart = JSON.parse(localStorage.getItem('welinggsCart')) || [];
  let countdownInterval;
  let remainingTime = 0;

  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem('welinggsCart', JSON.stringify(cart));
  };

  // Open/close cart
  if (iconCart) {
    iconCart.addEventListener('click', () => {
      document.body.classList.toggle('activeTabCart');
    });
  }
  
  if (closeCart) {
    closeCart.addEventListener('click', () => {
      document.body.classList.remove('activeTabCart');
    });
  }

  // Add order functionality
  const attachAddOrderListeners = () => {
    document.querySelectorAll('.js-addorder').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const orderControls = e.target.closest('.order-controls');
        const id = orderControls.dataset.id;
        const name = orderControls.dataset.name;
        const price = parseFloat(orderControls.dataset.price);
        const image = orderControls.dataset.image;

        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex === -1) {
          cart.push({ id, name, price, image, quantity: 1 });
        } else {
          cart[itemIndex].quantity += 1;
        }

        saveCart();
        updateCartUI();
        updateButtonUI(orderControls);
      });
    });
  };

  // Update cart UI
  const updateCartUI = () => {
    if (!listCart) return;
    
    listCart.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>GHc ${item.price.toFixed(2)}</p>
          <p class="qty-info">Qty: <strong>${item.quantity}</strong></p>
          <p class="item-total">Subtotal: GHc ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn minus" data-id="${item.id}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      `;
      listCart.appendChild(cartItem);
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    // Add total to cart
    if (cart.length > 0) {
      const cartTotal = document.createElement('div');
      cartTotal.classList.add('cart-total');
      cartTotal.innerHTML = `<strong>Total: GHc ${totalPrice.toFixed(2)}</strong>`;
      listCart.appendChild(cartTotal);
    }

    if (cartCount) {
      cartCount.textContent = totalItems;
    }
    
    attachCartItemListeners();
  };

  // Update button UI with +1 and -1 buttons
  const updateButtonUI = (orderControls) => {
    const id = orderControls.dataset.id;
    const item = cart.find(item => item.id === id);
    const qty = item ? item.quantity : 0;
    
    orderControls.innerHTML = `
      <div class="addmore-container">
        <button class="qty-btn minus-btn" data-id="${id}">-1</button>
        <span class="qty-display" data-id="${id}">${qty}</span>
        <button class="qty-btn plus-btn" data-id="${id}">+1</button>
      </div>`;
    
    attachQtyButtonListeners();
  };

  // Attach event listeners for quantity adjustment on product tiles
  const attachQtyButtonListeners = () => {
    // Handle +1 buttons on product tiles
    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.removeEventListener('click', handlePlusTile);
      btn.addEventListener('click', handlePlusTile);
    });

    // Handle -1 buttons on product tiles
    document.querySelectorAll('.minus-btn').forEach(btn => {
      btn.removeEventListener('click', handleMinusTile);
      btn.addEventListener('click', handleMinusTile);
    });
  };

  // Handle +1 click on product tile
  const handlePlusTile = (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      cart[itemIndex].quantity += 1;
      saveCart();
      updateCartUI();
    }
  };

  // Handle -1 click on product tile
  const handleMinusTile = (e) => {
    e.preventDefault();
    const id = e.target.dataset.id;
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        cart.splice(itemIndex, 1);
        // Reset button to Add Order
        const orderControls = document.querySelector(`.order-controls[data-id="${id}"]`);
        if (orderControls) {
          orderControls.innerHTML = `<button class="add-order js-addorder">Add Order</button>`;
          attachAddOrderListeners();
        }
      }
      saveCart();
      updateCartUI();
    }
  };

  // Attach event listeners for cart item buttons (+ and -)
  const attachCartItemListeners = () => {
    // Handle quantity adjustment in cart
    listCart.addEventListener('click', (e) => {
      if (e.target.classList.contains('minus')) {
        const id = e.target.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
          } else {
            cart.splice(itemIndex, 1);
            // Update the product tile button back to "Add Order"
            const orderControls = document.querySelector(`.order-controls[data-id="${id}"]`);
            if (orderControls) {
              orderControls.innerHTML = `<button class="add-order js-addorder">Add Order</button>`;
              attachAddOrderListeners();
            }
          }
          saveCart();
          updateCartUI();
        }
      } else if (e.target.classList.contains('plus')) {
        const id = e.target.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          cart[itemIndex].quantity += 1;
          saveCart();
          updateCartUI();
        }
      } else if (e.target.classList.contains('remove-item')) {
        const id = e.target.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          cart.splice(itemIndex, 1);
          // Update the product tile button back to "Add Order"
          const orderControls = document.querySelector(`.order-controls[data-id="${id}"]`);
          if (orderControls) {
            orderControls.innerHTML = `<button class="add-order js-addorder">Add Order</button>`;
            attachAddOrderListeners();
          }
          saveCart();
          updateCartUI();
        }
      }
    });
  };

  // Countdown functions
  const updateCountdown = () => {
    remainingTime--;
    updateCountdownDisplay();
    
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      countdownTimer.textContent = "00:00";
      countdownTimer.style.color = "#e74c3c";
    }
  };

  const updateCountdownDisplay = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    countdownTimer.textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Checkout functionality
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      // Calculate total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Build confirmation summary
      confirmationSummary.innerHTML = '';
      cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-summary-item';
        itemElement.innerHTML = `
          <span>${item.name} x ${item.quantity}</span>
          <span>GHc ${(item.price * item.quantity).toFixed(2)}</span>
        `;
        confirmationSummary.appendChild(itemElement);
      });
      
      // Add total
      const totalElement = document.createElement('div');
      totalElement.className = 'order-total';
      totalElement.innerHTML = `Total: GHc ${total.toFixed(2)}`;
      confirmationSummary.appendChild(totalElement);
      
      // Calculate estimated time (1 minute per item, minimum 10 minutes)
      const estMinutes = Math.max(10, cart.reduce((sum, item) => sum + item.quantity, 0));
      estTimeDisplay.textContent = `${estMinutes}-${estMinutes+5} minutes`;
      
      // Start countdown with maximum estimated time
      remainingTime = (estMinutes + 5) * 60;
      updateCountdownDisplay();
      clearInterval(countdownInterval);
      countdownInterval = setInterval(updateCountdown, 1000);
      
      // Show popup
      confirmationPopup.classList.add('active');
      document.body.classList.remove('activeTabCart');
    });
  }

  // Close confirmation popup
  if (confirmOkBtn) {
    confirmOkBtn.addEventListener('click', () => {
      confirmationPopup.classList.remove('active');
      cart = [];
      saveCart();
      updateCartUI();
      
      // Reset all product tiles to "Add Order" buttons
      document.querySelectorAll('.order-controls').forEach(orderControls => {
        orderControls.innerHTML = `<button class="add-order js-addorder">Add Order</button>`;
      });
      attachAddOrderListeners();
      
      clearInterval(countdownInterval);
      countdownTimer.style.color = "";
    });
  }

  // Initial setup
  attachAddOrderListeners();
  updateCartUI();
});