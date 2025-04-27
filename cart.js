// cart.js placeholder; reuse your existing cart logic here
/* -------------------------------------------------
   cart.js – shared cart logic for all pages
   ------------------------------------------------- */
   const CART_KEY = 'earTickleCart';
   
   
   /* ---------- helpers for cart state ---------- */
   function getCart()   { return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); }
   function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }
   
   function updateCartCount() {
     const badge = $('#cartCount');
     if (badge) badge.textContent =
       Object.values(getCart()).reduce((sum, item) => sum + item.qty, 0);
   }
   
   /* ---------- drawer (side panel) -------------- */
   function renderCart() {
     const list = $('#cartItems');
     const totalEl = $('#cartTotal');
     if (!list || !totalEl) return;
   
     const cart = getCart();
     list.innerHTML = '';
     let total = 0;
   
     Object.values(cart).forEach(item => {
       total += item.price * item.qty;
       const row = document.createElement('div');
       row.className = 'cart-item';
       row.innerHTML = `
         <img src="${item.img}" alt="${item.name}">
         <div class="cart-item-details">
           <h4>${item.name}</h4>
           <div class="quantity">
             <button data-id="${item.id}" data-act="dec">−</button>
             <span>${item.qty}</span>
             <button data-id="${item.id}" data-act="inc">+</button>
           </div>
         </div>
         <strong>৳${item.price * item.qty}</strong>`;
       list.appendChild(row);
     });
   
     totalEl.textContent = '৳' + total;
   }
   
   function toggleCart(open) {
     const drawer = $('#cartDrawer');
     if (!drawer) return;
     drawer.classList[open ? 'add' : 'remove']('open');
     if (open) renderCart();
   }
   
   /* ---------- event wiring --------------------- */
   function attachCartListeners() {
     /* open - close */
     $('#cartBtn')?.addEventListener('click', () => toggleCart(true));
     $('#closeCart')?.addEventListener('click', () => toggleCart(false));
   
     /* Add-to-Cart buttons (delegated on #productGrid) */
     $('#productGrid')?.addEventListener('click', e => {
       if (!e.target.matches('button[data-id]')) return;
       const id = e.target.dataset.id;
       const product = (window.PRODUCTS || []).find(p => p.id == id);
       if (!product) return;
   
       const cart = getCart();
       if (!cart[id]) cart[id] = { ...product, qty: 0 };
       cart[id].qty += 1;
       saveCart(cart);
       updateCartCount();
     });
   
     /* quantity +/- inside drawer */
     $('#cartItems')?.addEventListener('click', e => {
       if (e.target.tagName !== 'BUTTON') return;
       const { id, act } = e.target.dataset;
       const cart = getCart();
       if (!cart[id]) return;
   
       cart[id].qty += act === 'inc' ? 1 : -1;
       if (cart[id].qty <= 0) delete cart[id];
       saveCart(cart);
       updateCartCount();
       renderCart();
     });
   
     /* block checkout on empty cart */
     $('#checkoutBtn')?.addEventListener('click', e => {
       if (Object.keys(getCart()).length === 0) {
         alert('Your cart is empty.');
         e.preventDefault();
       }
     });
   }
   
   /* ---------- kick things off ------------------ */
   document.addEventListener('DOMContentLoaded', () => {
     attachCartListeners();
     updateCartCount();
   });
   