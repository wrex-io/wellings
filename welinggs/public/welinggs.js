document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_ALIASES = {
    starters: ["starters", "starter"],
    mains: ["mains", "main"],
    platters: ["platters", "platter"],
    drinks: ["drinks", "drink", "alcoholic-drinks", "non-alcoholic-drinks", "water"],
  };

  const normalize = (value = "") => String(value).toLowerCase().trim();
  const toSafeText = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const formatPrice = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
  };

  const isCategoryMatch = (itemCategory, targetCategory) => {
    const normalizedItemCategory = normalize(itemCategory);
    const normalizedTargetCategory = normalize(targetCategory);
    const aliases = CATEGORY_ALIASES[normalizedTargetCategory] || [normalizedTargetCategory];
    return aliases.includes(normalizedItemCategory);
  };

  const isSubcategoryMatch = (itemSubcategory, targetSubcategory) => {
    if (!targetSubcategory) return true;
    return normalize(itemSubcategory) === normalize(targetSubcategory);
  };

  const buildTileMarkup = (item) => {
    const id = toSafeText(item.id || `item-${Date.now()}-${Math.random()}`);
    const name = toSafeText(item.name || "Unnamed Item");
    const description = toSafeText(item.description || "No description available.");
    const image = toSafeText(item.image || "");
    const price = formatPrice(item.price);

    return `
      <div class="tile">
        <img src="${image}" alt="${name}">
        <h3>${name}</h3>
        <p>GHc ${price} <span class="info" data-tooltip="${description}">i</span></p>
        <div class="order-controls" data-id="${id}" data-name="${name}" data-price="${price}" data-image="${image}">
          <button class="add-order js-addorder">Add Order</button>
        </div>
      </div>
    `;
  };

  const initTabs = () => {
    const tabs = document.querySelectorAll(".nav-link");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.remove("active"));

        tab.classList.add("active");
        const tabId = tab.getAttribute("data-tab");
        const target = document.getElementById(tabId);
        if (target) target.classList.add("active");
      });
    });

    if (tabs.length > 0 && document.querySelectorAll(".nav-link.active").length === 0) {
      tabs[0].classList.add("active");
      const firstTabId = tabs[0].getAttribute("data-tab");
      const firstContent = document.getElementById(firstTabId);
      if (firstContent) firstContent.classList.add("active");
    }
  };

  initTabs();

  const iconCart = document.querySelector(".chrtt");
  const closeCart = document.querySelector(".cart-tab .close");
  const listCart = document.querySelector(".listcart");
  const cartCount = document.querySelector(".chrtt span");
  const checkoutBtn = document.querySelector(".checkout");
  const confirmationPopup = document.getElementById("orderConfirmation");
  const confirmationSummary = document.getElementById("confirmationSummary");
  const confirmOkBtn = document.querySelector(".confirm-ok");
  const estTimeDisplay = document.getElementById("estTime");
  const countdownTimer = document.getElementById("countdownTimer");

  let cart = JSON.parse(localStorage.getItem("welinggsCart")) || [];
  let countdownInterval;
  let remainingTime = 0;
  let cartListenersAttached = false;

  const saveCart = () => {
    localStorage.setItem("welinggsCart", JSON.stringify(cart));
  };

  if (iconCart) {
    iconCart.addEventListener("click", () => {
      document.body.classList.toggle("activeTabCart");
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      document.body.classList.remove("activeTabCart");
    });
  }

  const updateButtonUI = (orderControls) => {
    const id = orderControls.dataset.id;
    const item = cart.find((cartItem) => cartItem.id === id);
    const qty = item ? item.quantity : 0;

    orderControls.innerHTML = `
      <div class="addmore-container">
        <button class="qty-btn minus-btn" data-id="${id}">-1</button>
        <span class="qty-display" data-id="${id}">${qty}</span>
        <button class="qty-btn plus-btn" data-id="${id}">+1</button>
      </div>
    `;

    attachQtyButtonListeners();
  };

  const restoreAddOrderButton = (id) => {
    const orderControls = document.querySelector(`.order-controls[data-id="${id}"]`);
    if (!orderControls) return;
    orderControls.innerHTML = '<button class="add-order js-addorder">Add Order</button>';
    attachAddOrderListeners();
  };

  const updateCartUI = () => {
    if (!listCart) return;

    listCart.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
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
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      `;
      listCart.appendChild(cartItem);
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    if (cart.length > 0) {
      const cartTotal = document.createElement("div");
      cartTotal.classList.add("cart-total");
      cartTotal.innerHTML = `<strong>Total: GHc ${totalPrice.toFixed(2)}</strong>`;
      listCart.appendChild(cartTotal);
    }

    if (cartCount) {
      cartCount.textContent = totalItems;
    }

    attachCartItemListeners();
  };

  const handlePlusTile = (event) => {
    event.preventDefault();
    const id = event.target.dataset.id;
    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;
    cart[itemIndex].quantity += 1;
    saveCart();
    updateCartUI();
    syncTileButtonsWithCart();
  };

  const handleMinusTile = (event) => {
    event.preventDefault();
    const id = event.target.dataset.id;
    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
      restoreAddOrderButton(id);
    }

    saveCart();
    updateCartUI();
    syncTileButtonsWithCart();
  };

  const attachQtyButtonListeners = () => {
    document.querySelectorAll(".plus-btn").forEach((button) => {
      button.removeEventListener("click", handlePlusTile);
      button.addEventListener("click", handlePlusTile);
    });

    document.querySelectorAll(".minus-btn").forEach((button) => {
      button.removeEventListener("click", handleMinusTile);
      button.addEventListener("click", handleMinusTile);
    });
  };

  const attachAddOrderListeners = () => {
    document.querySelectorAll(".js-addorder").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const orderControls = event.target.closest(".order-controls");
        const id = orderControls.dataset.id;
        const name = orderControls.dataset.name;
        const price = Number(orderControls.dataset.price);
        const image = orderControls.dataset.image;

        const itemIndex = cart.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
          cart.push({ id, name, price, image, quantity: 1 });
        } else {
          cart[itemIndex].quantity += 1;
        }

        saveCart();
        updateCartUI();
        updateButtonUI(orderControls);
      }, { once: true });
    });
  };

  const attachCartItemListeners = () => {
    if (!listCart || cartListenersAttached) return;
    cartListenersAttached = true;

    listCart.addEventListener("click", (event) => {
      if (event.target.classList.contains("minus")) {
        const id = event.target.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === id);
        if (itemIndex === -1) return;

        if (cart[itemIndex].quantity > 1) {
          cart[itemIndex].quantity -= 1;
        } else {
          cart.splice(itemIndex, 1);
          restoreAddOrderButton(id);
        }

        saveCart();
        updateCartUI();
        syncTileButtonsWithCart();
      } else if (event.target.classList.contains("plus")) {
        const id = event.target.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === id);
        if (itemIndex === -1) return;
        cart[itemIndex].quantity += 1;
        saveCart();
        updateCartUI();
        syncTileButtonsWithCart();
      } else if (event.target.classList.contains("remove-item")) {
        const id = event.target.dataset.id;
        const itemIndex = cart.findIndex((item) => item.id === id);
        if (itemIndex === -1) return;
        cart.splice(itemIndex, 1);
        restoreAddOrderButton(id);
        saveCart();
        updateCartUI();
        syncTileButtonsWithCart();
      }
    });
  };

  const updateCountdownDisplay = () => {
    if (!countdownTimer) return;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    countdownTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const updateCountdown = () => {
    remainingTime -= 1;
    updateCountdownDisplay();

    if (remainingTime <= 0 && countdownTimer) {
      clearInterval(countdownInterval);
      countdownTimer.textContent = "00:00";
      countdownTimer.style.color = "#e74c3c";
    }
  };

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        window.alert("Your cart is empty!");
        return;
      }

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      confirmationSummary.innerHTML = "";

      cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "order-summary-item";
        row.innerHTML = `
          <span>${item.name} x ${item.quantity}</span>
          <span>GHc ${(item.price * item.quantity).toFixed(2)}</span>
        `;
        confirmationSummary.appendChild(row);
      });

      const totalRow = document.createElement("div");
      totalRow.className = "order-total";
      totalRow.innerHTML = `Total: GHc ${total.toFixed(2)}`;
      confirmationSummary.appendChild(totalRow);

      const estMinutes = Math.max(10, cart.reduce((sum, item) => sum + item.quantity, 0));
      if (estTimeDisplay) estTimeDisplay.textContent = `${estMinutes}-${estMinutes + 5} minutes`;

      remainingTime = (estMinutes + 5) * 60;
      updateCountdownDisplay();
      clearInterval(countdownInterval);
      countdownInterval = setInterval(updateCountdown, 1000);

      if (confirmationPopup) confirmationPopup.classList.add("active");
      document.body.classList.remove("activeTabCart");
    });
  }

  if (confirmOkBtn) {
    confirmOkBtn.addEventListener("click", () => {
      if (confirmationPopup) confirmationPopup.classList.remove("active");
      cart = [];
      saveCart();
      updateCartUI();

      document.querySelectorAll(".order-controls").forEach((orderControls) => {
        orderControls.innerHTML = '<button class="add-order js-addorder">Add Order</button>';
      });

      attachAddOrderListeners();
      clearInterval(countdownInterval);
      if (countdownTimer) countdownTimer.style.color = "";
    });
  }

  const syncTileButtonsWithCart = () => {
    document.querySelectorAll(".order-controls").forEach((orderControls) => {
      const id = orderControls.dataset.id;
      const item = cart.find((cartItem) => cartItem.id === id);
      if (item && !orderControls.querySelector(".addmore-container")) {
        updateButtonUI(orderControls);
      }
    });
  };

  const renderMenuForContainer = (container, items) => {
    const targetCategory = container.dataset.category;
    const targetSubcategory = container.dataset.subcategory || "";

    const filteredItems = items.filter(
      (item) =>
        isCategoryMatch(item.category, targetCategory) &&
        isSubcategoryMatch(item.subcategory, targetSubcategory)
    );

    if (filteredItems.length === 0) {
      container.innerHTML = '<p class="menu-empty">No menu items found for this section.</p>';
      return;
    }

    container.innerHTML = filteredItems.map(buildTileMarkup).join("");
  };

  const renderMenus = async () => {
    const containers = document.querySelectorAll("[data-menu-container]");
    if (containers.length === 0) return;

    try {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      const items = await response.json();
      containers.forEach((container) => renderMenuForContainer(container, items));
      attachAddOrderListeners();
      syncTileButtonsWithCart();
    } catch (error) {
      containers.forEach((container) => {
        container.innerHTML = '<p class="menu-empty">Could not load menu items from the API.</p>';
      });
      console.error("Failed to load menu from /api/menu:", error);
    }
  };

  updateCartUI();
  renderMenus();
});
