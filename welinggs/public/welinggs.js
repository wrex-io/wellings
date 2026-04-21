/* =============================================================
   Welinggs - cart & menu interactions
   Strategy: all clicks are handled by one delegated listener on
   document.body so cart controls continue to work after rerenders.
   ============================================================= */

(function () {
  'use strict';

  var cart = [];
  try { cart = JSON.parse(localStorage.getItem('welinggsCart')) || []; }
  catch (_) { cart = []; }

  function save() {
    localStorage.setItem('welinggsCart', JSON.stringify(cart));
  }

  function getItem(id) {
    return cart.find(function (item) { return item.id === id; });
  }

  function addItem(id, name, price, image) {
    var item = getItem(id);
    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ id: id, name: name, price: price, image: image, quantity: 1 });
    }
    save();
  }

  function increment(id) {
    var item = getItem(id);
    if (!item) return;
    item.quantity += 1;
    save();
  }

  function decrement(id) {
    var idx = cart.findIndex(function (item) { return item.id === id; });
    if (idx === -1) return;
    if (cart[idx].quantity > 1) {
      cart[idx].quantity -= 1;
    } else {
      cart.splice(idx, 1);
    }
    save();
  }

  function removeItem(id) {
    cart = cart.filter(function (item) { return item.id !== id; });
    save();
  }

  function clearCart() {
    cart = [];
    save();
  }

  function refreshTiles() {
    document.querySelectorAll('.order-controls').forEach(function (controls) {
      var id = controls.dataset.id;
      var item = getItem(id);

      if (!item) {
        controls.innerHTML =
          '<button class="add-order" data-action="add" data-id="' + id + '">Add to Cart</button>';
        return;
      }

      controls.innerHTML =
        '<div class="addmore-container">' +
          '<button class="qty-btn" data-action="dec" data-id="' + id + '">-</button>' +
          '<span class="qty-display">' + item.quantity + '</span>' +
          '<button class="qty-btn" data-action="inc" data-id="' + id + '">+</button>' +
        '</div>';
    });
  }

  function refreshCart() {
    var listCart = document.querySelector('.listcart');
    var cartCount = document.querySelector('.chrtt span');
    var totalQty = 0;
    var totalPrice = 0;

    cart.forEach(function (item) {
      totalQty += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    if (cartCount) cartCount.textContent = totalQty;
    if (!listCart) return;

    if (!cart.length) {
      listCart.innerHTML = '<p style="text-align:center;color:#aaa;margin-top:30px;padding:20px;">Your cart is empty</p>';
      return;
    }

    var html = '';
    cart.forEach(function (item) {
      html +=
        '<div class="cart-item">' +
          '<div class="cart-item-image"><img src="' + item.image + '" alt="' + item.name + '"></div>' +
          '<div class="cart-item-details">' +
            '<h3>' + item.name + '</h3>' +
            '<p>GHc ' + item.price.toFixed(2) + '</p>' +
            '<p class="item-total">Subtotal: GHc ' + (item.price * item.quantity).toFixed(2) + '</p>' +
          '</div>' +
          '<div class="cart-item-controls">' +
            '<button class="quantity-btn" data-action="cart-dec" data-id="' + item.id + '">-</button>' +
            '<span class="qty-value">' + item.quantity + '</span>' +
            '<button class="quantity-btn" data-action="cart-inc" data-id="' + item.id + '">+</button>' +
            '<button class="remove-item" data-action="cart-remove" data-id="' + item.id + '">x</button>' +
          '</div>' +
        '</div>';
    });

    html += '<div class="cart-total"><strong>Total: GHc ' + totalPrice.toFixed(2) + '</strong></div>';
    listCart.innerHTML = html;
  }

  function refresh() {
    refreshTiles();
    refreshCart();
  }

  function initTabs() {
    var tabs = document.querySelectorAll('.nav-link');
    var contents = document.querySelectorAll('.tab-content');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (node) { node.classList.remove('active'); });
        contents.forEach(function (node) { node.classList.remove('active'); });

        tab.classList.add('active');
        var target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    if (!document.querySelector('.nav-link.active')) {
      tabs[0].classList.add('active');
      var first = document.getElementById(tabs[0].dataset.tab);
      if (first) first.classList.add('active');
    }
  }

  var countdownInterval = null;

  function startCountdown(seconds) {
    var el = document.getElementById('countdownTimer');
    if (!el) return;

    clearInterval(countdownInterval);
    el.style.color = '';

    var remaining = seconds;
    function tick() {
      var minutes = Math.floor(remaining / 60);
      var secs = remaining % 60;
      el.textContent = String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');

      if (remaining === 0) {
        clearInterval(countdownInterval);
        el.style.color = '#e74c3c';
        return;
      }

      remaining -= 1;
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  function showCheckout() {
    if (!cart.length) {
      alert('Your cart is empty!');
      return;
    }

    var popup = document.getElementById('orderConfirmation');
    var summary = document.getElementById('confirmationSummary');
    var estEl = document.getElementById('estTime');

    if (!popup || !summary) return;

    var total = 0;
    var totalQty = 0;
    var html = '';

    cart.forEach(function (item) {
      var subtotal = item.price * item.quantity;
      total += subtotal;
      totalQty += item.quantity;
      html += '<div class="order-summary-item"><span>' + item.name + ' x ' + item.quantity + '</span><span>GHc ' + subtotal.toFixed(2) + '</span></div>';
    });

    html += '<div class="order-total">Total: GHc ' + total.toFixed(2) + '</div>';
    summary.innerHTML = html;

    var estMins = Math.max(10, totalQty);
    if (estEl) estEl.textContent = estMins + '-' + (estMins + 5) + ' minutes';

    startCountdown((estMins + 5) * 60);
    popup.classList.add('active');
    document.body.classList.remove('activeTabCart');
  }

  document.body.addEventListener('click', function (event) {
    var el = event.target;
    var action = el.dataset.action;
    var id = el.dataset.id;

    if (action === 'add') {
      var controls = el.closest('.order-controls');
      if (!controls) return;
      addItem(id, controls.dataset.name, parseFloat(controls.dataset.price), controls.dataset.image);
      refresh();
      return;
    }

    if (action === 'inc') {
      increment(id);
      refresh();
      return;
    }

    if (action === 'dec') {
      decrement(id);
      refresh();
      return;
    }

    if (action === 'cart-inc') {
      increment(id);
      refresh();
      return;
    }

    if (action === 'cart-dec') {
      decrement(id);
      refresh();
      return;
    }

    if (action === 'cart-remove') {
      removeItem(id);
      refresh();
      return;
    }

    if (el.closest('.chrtt')) {
      document.body.classList.toggle('activeTabCart');
      return;
    }

    if (el.classList.contains('close') && el.closest('.cart-tab')) {
      document.body.classList.remove('activeTabCart');
      return;
    }

    if (el.classList.contains('checkout')) {
      showCheckout();
      return;
    }

    if (el.classList.contains('confirm-ok')) {
      var popup = document.getElementById('orderConfirmation');
      if (popup) popup.classList.remove('active');
      clearInterval(countdownInterval);
      clearCart();
      refresh();
    }
  });

  initTabs();
  refresh();
}());
