(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function tileTemplate(item) {
    var price = Number(item.price || 0);
    var description = escapeHtml(item.description || item.name);

    return (
      '<div class="tile">' +
        '<div class="tile-img">' +
          '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">' +
          '<span class="info" data-tooltip="' + description + '">i</span>' +
        '</div>' +
        '<h3>' + escapeHtml(item.name) + '</h3>' +
        '<p>GHc ' + price.toFixed(2) + '</p>' +
        '<div class="order-controls" data-id="' + escapeHtml(item.id) + '" data-name="' + escapeHtml(item.name) + '" data-price="' + price.toFixed(2) + '" data-image="' + escapeHtml(item.image) + '">' +
          '<button class="add-order" data-action="add" data-id="' + escapeHtml(item.id) + '">Add Order</button>' +
        '</div>' +
      '</div>'
    );
  }

  async function loadMenu(container) {
    var category = container.dataset.menuCategory;
    var tab = container.dataset.menuTab;
    var endpoint = '/api/menu/' + encodeURIComponent(category);

    if (tab) endpoint += '/' + encodeURIComponent(tab);

    container.innerHTML = '<p class="menu-loading">Loading menu...</p>';

    try {
      var response = await fetch(endpoint);
      if (!response.ok) throw new Error('Request failed with status ' + response.status);

      var data = await response.json();
      var items = data.items || [];

      if (!items.length) {
        container.innerHTML = '<p class="menu-loading">No menu items found.</p>';
        return;
      }

      container.innerHTML = items.map(tileTemplate).join('');
      document.dispatchEvent(new CustomEvent('welinggs:menu-loaded'));
    } catch (error) {
      container.innerHTML = '<p class="menu-loading">Menu could not be loaded. Please try again.</p>';
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-menu-category]').forEach(loadMenu);
  });
}());
