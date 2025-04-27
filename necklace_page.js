const $ = (q, ctx = document) => ctx.querySelector(q);

function renderProducts () {
  const grid = $('#productGrid');
  if (!grid || !window.PRODUCTS) return;

  grid.innerHTML = '';
  // use the copy that’s definitely on window
  window.PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-details">
        <h2>${p.name}</h2>
        <div class="price">৳${p.price}</div>
        <button class="btn" data-id="${p.id}">Add to Cart</button>
      </div>`;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderProducts);
