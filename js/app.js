// Main Application Logic for AeroPure UK — Home, Tech, Kitchen & Garden Store
let cart = [];
let activeCategory = 'all';
let currentDiscount = 0; // percentage
let discountCodeApplied = '';
const FREE_SHIPPING_THRESHOLD = 45.00;
const STANDARD_SHIPPING_FEE = 4.99;
let revealObserver = null;

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Calculate dynamic 3-4 working days delivery date range
function getDeliveryDateRange(minDays = 3, maxDays = 4) {
  const now = new Date();

  function addWorkDays(startDate, days) {
    let count = 0;
    const cur = new Date(startDate);
    while (count < days) {
      cur.setDate(cur.getDate() + 1);
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
    }
    return cur;
  }

  const minDate = addWorkDays(now, minDays);
  const maxDate = addWorkDays(now, maxDays);

  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  const minStr = minDate.toLocaleDateString('en-GB', options);
  const maxStr = maxDate.toLocaleDateString('en-GB', options);

  return { minStr, maxStr, fullRange: `${minStr} – ${maxStr}` };
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  renderDeliveryDatesInUI();
  setupScrollAnimations();
  renderProducts();
  setupEventListeners();
  loadCartFromStorage();
  updateCartUI();
  startCountdownTimer();
  handleDeepLink();
});

// Scroll reveal & sticky header behaviour
function setupScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('site-header');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  observeReveals();
}

function observeReveals() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal:not(.is-visible)');
  if (prefersReducedMotion || !revealObserver) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }
  reveals.forEach(el => revealObserver.observe(el));
}

// Handle ?product=<id> deep link for direct product landing pages
function handleDeepLink() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (!productId) return;

    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => openQuickView(product.id), 150);
  } catch (e) {
    // Ignore malformed query strings
  }
}

// Update static delivery date badges in header / announcement
function renderDeliveryDatesInUI() {
  const dates = getDeliveryDateRange(3, 4);
  const deliveryBadges = document.querySelectorAll('.dynamic-delivery-date');
  deliveryBadges.forEach(el => {
    el.textContent = dates.fullRange;
  });
}

// Render Product Cards
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const dates = getDeliveryDateRange(3, 4);

  const filtered = activeCategory === 'all'
    ? productsData
    : productsData.filter(p => p.category === activeCategory);

  container.innerHTML = filtered.map((product, index) => {
    const primaryImg = product.gallery && product.gallery[0] ? product.gallery[0] : product.image;
    const secondaryImg = product.gallery && product.gallery[1] ? product.gallery[1] : primaryImg;
    const isFreeShippingItem = product.price >= FREE_SHIPPING_THRESHOLD;

    return `
      <article class="reveal product-card group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-sky-300 flex flex-col overflow-hidden relative" style="--d: ${Math.min(index * 60, 360)}ms">
        <!-- Top Badges -->
        <div class="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-center pointer-events-none">
          ${product.badge ? `
            <span class="px-2.5 py-1 text-[11px] font-semibold rounded-full shadow-sm ${product.badgeColor || 'bg-slate-900 text-white'}">
              ${product.badge}
            </span>
          ` : ''}
        </div>

        <span class="absolute top-3 right-3 z-10 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-white/90 backdrop-blur-sm text-slate-600 border border-slate-200/80 shadow-sm pointer-events-none">
          ${product.sku}
        </span>

        <!-- Product Image with Hover Crossfade -->
        <div class="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer" onclick="openQuickView('${product.id}')">
          <img
            src="${primaryImg}"
            alt="${escapeAttr(product.name)}"
            class="img-primary img-fade-in w-full h-full object-cover"
            loading="lazy"
          />
          <img
            src="${secondaryImg}"
            alt="${escapeAttr(product.name)} — alternate view"
            class="img-secondary absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          <!-- Delivery Date Tag overlay -->
          <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            <span>${isFreeShippingItem ? 'Free UK delivery' : '3–4 day UK delivery'}: <strong>${dates.minStr}</strong></span>
          </div>

          <button type="button" class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-md hover:bg-white flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            Quick View
          </button>
        </div>

        <!-- Product Details -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-sky-700">${product.category}</span>

            <h3 class="font-bold text-slate-900 text-lg leading-snug mt-1 group-hover:text-sky-700 transition-colors cursor-pointer font-heading" onclick="openQuickView('${product.id}')">
              ${product.name}
            </h3>
            <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">${product.tagline}</p>

            <!-- Key Feature bullet points -->
            <ul class="mt-3.5 space-y-1.5">
              ${product.features.slice(0, 2).map(f => `
                <li class="text-[12px] text-slate-600 flex items-start gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Price & Add To Cart Button -->
          <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span class="text-2xl font-extrabold text-slate-900 font-heading">£${product.price.toFixed(2)}</span>
              <span class="block text-[11px] font-medium ${isFreeShippingItem ? 'text-emerald-700' : 'text-slate-500'}">
                ${isFreeShippingItem ? '✓ Free Tracked UK Delivery' : '+ £4.99 UK Delivery (Free over £45)'}
              </span>
            </div>

            <button
              type="button"
              onclick="addToCart('${product.id}')"
              class="btn-shine bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span>Add to Basket</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  observeReveals();
}

// Add Item to Cart
function addToCart(productId, quantity = 1) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCartToStorage();
  updateCartUI(true);
  showToast(`Added "${product.name}" to your basket!`, 'success');
  openCart();
}

// Remove or Change Quantity
function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
    showToast('Item removed from basket', 'info');
  }

  saveCartToStorage();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCartToStorage();
  updateCartUI();
  showToast('Item removed from basket', 'info');
}

// Update Cart UI Elements
function updateCartUI(animateBadge = false) {
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartShippingEl = document.getElementById('cart-shipping');
  const cartDiscountEl = document.getElementById('cart-discount');
  const cartTotalEl = document.getElementById('cart-total');
  const freeShippingBar = document.getElementById('free-shipping-progress');
  const freeShippingText = document.getElementById('free-shipping-text');
  const dates = getDeliveryDateRange(3, 4);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItemCount;
    cartBadge.classList.toggle('hidden', totalItemCount === 0);
    if (animateBadge && totalItemCount > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cartBadge.classList.remove('badge-bump');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('badge-bump');
    }
  }

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = rawSubtotal * (currentDiscount / 100);
  const discountedSubtotal = rawSubtotal - discountAmount;

  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || cart.length === 0;
  const shippingFee = (cart.length === 0 || isFreeShipping) ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = cart.length === 0 ? 0 : (discountedSubtotal + shippingFee);

  // Free shipping bar calculation
  if (freeShippingBar && freeShippingText) {
    if (cart.length === 0) {
      freeShippingBar.style.width = '0%';
      freeShippingText.innerHTML = `Add items to qualify for <strong>FREE Tracked UK Delivery</strong> over £45`;
    } else if (discountedSubtotal >= FREE_SHIPPING_THRESHOLD) {
      freeShippingBar.style.width = '100%';
      freeShippingText.innerHTML = `🎉 You've unlocked <strong>FREE Tracked Delivery! (Arrives ${dates.fullRange})</strong>`;
    } else {
      const remaining = (FREE_SHIPPING_THRESHOLD - discountedSubtotal).toFixed(2);
      const percentage = Math.min(100, Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
      freeShippingBar.style.width = `${percentage}%`;
      freeShippingText.innerHTML = `Add <strong>£${remaining}</strong> more for <strong>FREE 3–4 Day UK Delivery</strong>`;
    }
  }

  // Render Cart Items
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
          <svg class="w-16 h-16 stroke-slate-300 mb-3" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <p class="font-semibold text-slate-700">Your basket is empty</p>
          <p class="text-xs text-slate-400 mt-1 max-w-xs">Explore our Home, Tech, Kitchen & Garden essentials with fast 3–4 working day UK delivery.</p>
          <button onclick="closeCart()" class="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-colors">
            Browse Collection
          </button>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 py-3 border-b border-slate-100">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-200">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-slate-800 truncate">${item.name}</h4>
            <div class="text-xs text-slate-500 mt-0.5">£${item.price.toFixed(2)} each</div>
            <div class="text-[11px] text-emerald-600 font-medium mt-0.5">🚚 Arrives: ${dates.fullRange}</div>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <button onclick="updateQuantity('${item.id}', -1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">−</button>
                <span class="w-7 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">+</button>
              </div>
              <button onclick="removeFromCart('${item.id}')" class="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
          </div>
          <div class="text-right">
            <span class="text-sm font-bold text-slate-900">£${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Update Price Breakdown
  if (cartSubtotalEl) cartSubtotalEl.textContent = `£${rawSubtotal.toFixed(2)}`;
  if (cartShippingEl) {
    cartShippingEl.innerHTML = (cart.length > 0 && isFreeShipping)
      ? '<span class="text-emerald-600 font-semibold">FREE (3–4 Day Tracked)</span>'
      : (cart.length === 0 ? '£0.00' : `£${STANDARD_SHIPPING_FEE.toFixed(2)}`);
  }
  if (cartDiscountEl) {
    if (discountAmount > 0) {
      cartDiscountEl.parentElement.classList.remove('hidden');
      cartDiscountEl.textContent = `-£${discountAmount.toFixed(2)} (${discountCodeApplied})`;
    } else {
      cartDiscountEl.parentElement.classList.add('hidden');
    }
  }
  if (cartTotalEl) cartTotalEl.textContent = `£${grandTotal.toFixed(2)}`;
}

// Apply Promo Code
function applyPromoCode() {
  const input = document.getElementById('promo-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'WELCOME15' || code === 'CLEANAIR15' || code === 'WINTER15') {
    currentDiscount = 15;
    discountCodeApplied = `${code} (15% OFF)`;
    showToast(`Promo code ${code} applied! You get 15% off.`, 'success');
  } else if (code === 'PUREUK') {
    currentDiscount = 10;
    discountCodeApplied = 'PUREUK (10% OFF)';
    showToast('Promo code PUREUK applied! You get 10% off.', 'success');
  } else {
    showToast('Invalid promo code. Try "WELCOME15"', 'error');
    return;
  }

  input.value = '';
  updateCartUI();
}

// Storage helpers
function saveCartToStorage() {
  try {
    localStorage.setItem('aeropure_uk_cart', JSON.stringify(cart));
  } catch (e) {
    // ignore
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('aeropure_uk_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }
}

// Drawer & Modal Controllers
function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      drawer.classList.remove('translate-x-full');
    }, 10);
  }
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  }
}

// Switch Quick View Gallery Image
function selectQuickViewImage(src, btnEl) {
  const mainImg = document.getElementById('modal-main-img');
  if (mainImg) mainImg.src = src;

  document.querySelectorAll('.qv-thumb').forEach(thumb => {
    thumb.classList.remove('border-sky-600', 'ring-2', 'ring-sky-200');
    thumb.classList.add('border-slate-200');
  });
  if (btnEl) {
    btnEl.classList.remove('border-slate-200');
    btnEl.classList.add('border-sky-600', 'ring-2', 'ring-sky-200');
  }
}

// Quick View Modal
function openQuickView(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  if (!modal || !content) return;

  const dates = getDeliveryDateRange(3, 4);
  const isFreeShippingItem = product.price >= FREE_SHIPPING_THRESHOLD;

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <!-- Image Gallery -->
      <div>
        <div class="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img id="modal-main-img" src="${product.image}" alt="${escapeAttr(product.name)}" class="w-full h-full object-cover">
        </div>
        <div class="flex gap-2.5 mt-3">
          ${product.gallery.map((img, i) => `
            <button type="button" onclick="selectQuickViewImage('${img}', this)" class="qv-thumb w-16 h-16 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-sky-600 ring-2 ring-sky-200' : 'border-slate-200'} hover:border-sky-500 transition-colors">
              <img src="${img}" alt="${escapeAttr(product.name)} thumbnail ${i + 1}" class="w-full h-full object-cover">
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Info -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2 pr-10">
            ${product.badge ? `
              <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${product.badgeColor || 'bg-slate-900 text-white'}">
                ${product.badge}
              </span>
            ` : ''}
            <span class="text-xs text-slate-500 font-medium">${product.category}</span>
            <span class="text-[11px] font-mono text-slate-400">SKU: ${product.sku}</span>
          </div>

          <h2 class="text-2xl font-bold text-slate-900 leading-tight font-heading">${product.name}</h2>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">${product.description}</p>

          <div class="flex items-baseline gap-3 mt-4">
            <span class="text-3xl font-extrabold text-slate-900 font-heading">£${product.price.toFixed(2)}</span>
            <span class="text-xs font-semibold ${isFreeShippingItem ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-600 bg-slate-100 border border-slate-200'} px-2 py-0.5 rounded-md">
              ${isFreeShippingItem ? 'Free UK Delivery' : '£4.99 UK Delivery (Free over £45)'}
            </span>
          </div>

          <!-- Highlight Delivery Date Box -->
          <div class="mt-4 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <div>
              <div class="font-bold text-slate-900">Tracked ${product.deliveryDays || '3–4 Working Days'} UK Delivery</div>
              <div class="text-emerald-700 font-medium">Order today for estimated delivery between <strong>${dates.fullRange}</strong></div>
            </div>
          </div>

          <!-- Specifications Table -->
          <div class="mt-4 pt-4 border-t border-slate-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Specifications</h4>
            <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-3">
              ${product.specs.map(spec => `
                <div class="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span class="text-[10px] text-slate-400 block">${spec.label}</span>
                  <span class="font-semibold text-slate-800">${spec.value}</span>
                </div>
              `).join('')}
            </div>

            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 mt-3">Highlights</h4>
            <ul class="space-y-1.5 text-xs text-slate-700">
              ${product.features.map(f => `
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
          <button type="button" onclick="addToCart('${product.id}'); closeQuickView();" class="btn-shine flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>Add To Basket • £${product.price.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.add('hidden');
}

// Checkout Modal Flow
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your basket is empty. Add a product first!', 'warning');
    return;
  }
  closeCart();

  const modal = document.getElementById('checkout-modal');
  const dates = getDeliveryDateRange(3, 4);
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = rawSubtotal * (currentDiscount / 100);
  const discountedSubtotal = rawSubtotal - discountAmount;
  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;

  const summaryTotalEl = document.getElementById('checkout-summary-total');
  const itemCountEl = document.getElementById('checkout-item-count');
  const totalItemCount = cart.reduce((s, i) => s + i.quantity, 0);
  if (summaryTotalEl) summaryTotalEl.textContent = `£${total.toFixed(2)}`;
  if (itemCountEl) itemCountEl.textContent = `${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'}`;

  const checkoutDeliveryDateEl = document.getElementById('checkout-delivery-date-text');
  if (checkoutDeliveryDateEl) {
    checkoutDeliveryDateEl.textContent = `Arrives: ${dates.fullRange} (3–4 Working Days)`;
  }

  if (modal) modal.classList.remove('hidden');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.fullName.value;
  const email = form.email.value;
  const postcode = form.postcode.value.toUpperCase();
  const dates = getDeliveryDateRange(3, 4);

  const orderNum = 'UK-' + Math.floor(100000 + Math.random() * 900000);
  const trackingNum = 'RM' + Math.floor(100000000 + Math.random() * 900000000) + 'GB';

  // Clear cart
  cart = [];
  currentDiscount = 0;
  discountCodeApplied = '';
  saveCartToStorage();
  updateCartUI();
  closeCheckoutModal();

  // Show Order Confirmed Modal
  const successModal = document.getElementById('order-success-modal');
  const detailsEl = document.getElementById('order-success-details');
  if (successModal && detailsEl) {
    detailsEl.innerHTML = `
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 mt-4">
        <div class="flex justify-between">
          <span class="text-slate-500">Order Reference:</span>
          <span class="font-bold text-slate-900">${orderNum}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Tracked Reference:</span>
          <span class="font-mono font-bold text-sky-600">${trackingNum}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Recipient:</span>
          <span class="font-semibold text-slate-800">${name} (${postcode})</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Confirmation Sent To:</span>
          <span class="font-semibold text-slate-800">${email}</span>
        </div>
        <div class="flex justify-between border-t border-slate-200 pt-2">
          <span class="text-slate-500">Delivery Window:</span>
          <span class="font-bold text-emerald-700">${dates.fullRange} (3–4 Working Days)</span>
        </div>
      </div>
    `;
    successModal.classList.remove('hidden');
  }
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('order-success-modal');
  if (modal) modal.classList.add('hidden');
}

// Toast notification helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600' : (type === 'error' ? 'bg-red-600' : 'bg-slate-900');
  toast.className = `${bg} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transform transition-all duration-300 translate-y-3 opacity-0`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Programmatic category filter (used by tabs and "Shop by category" tiles)
function filterByCategory(category, scrollToProducts = true) {
  const filterButtons = document.querySelectorAll('.category-filter-btn');
  const activeClasses = 'category-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow transition-all';
  const inactiveClasses = 'category-filter-btn px-4 py-2 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all';

  filterButtons.forEach(b => {
    const isMatch = b.getAttribute('data-category') === category;
    b.className = isMatch ? activeClasses : inactiveClasses;
  });

  activeCategory = category;
  renderProducts();

  if (scrollToProducts) {
    const section = document.getElementById('products-section');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Category filter setup
function setupEventListeners() {
  const filterButtons = document.querySelectorAll('.category-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterByCategory(btn.getAttribute('data-category'), false);
    });
  });
}

// Interactive FAQ Accordion
function toggleFaq(id) {
  const ans = document.getElementById(`faq-ans-${id}`);
  const icon = document.getElementById(`faq-icon-${id}`);
  if (!ans || !icon) return;

  const isHidden = ans.classList.contains('hidden');
  if (isHidden) {
    ans.classList.remove('hidden');
    icon.textContent = '−';
    icon.classList.add('text-sky-600');
  } else {
    ans.classList.add('hidden');
    icon.textContent = '+';
    icon.classList.remove('text-sky-600');
  }
}

// Live Dispatch Countdown Timer
function startCountdownTimer() {
  const timerEl = document.getElementById('dispatch-timer');
  if (!timerEl) return;

  let totalSeconds = 3 * 3600 + 48 * 60 + 12;
  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(totalSeconds % 60).padStart(2, '0');
      timerEl.textContent = `${h}h ${m}m ${s}s`;
    } else {
      timerEl.textContent = 'Same-day cutoff reached';
    }
  }, 1000);
}

// Store Legal & Shipping Policy Modals
function openPolicyModal(type) {
  const modal = document.getElementById('policy-modal');
  const container = document.getElementById('policy-modal-content');
  if (!modal || !container) return;

  let title = '';
  let body = '';

  if (type === 'privacy') {
    title = 'Privacy Policy';
    body = `
      <p class="text-xs text-slate-500 mb-4">Last Updated: November 2026</p>
      <div class="space-y-3 text-xs text-slate-700 leading-relaxed">
        <p>AeroPure UK is committed to protecting your personal information. When you place an order on aeropur.shop, we collect your name, shipping address, email address, and phone number solely to process and deliver your order via our UK courier partners.</p>
        <p><strong>Payment Processing:</strong> We do not store full credit or debit card numbers. Checkout transactions are encrypted using SSL.</p>
        <p><strong>Cookies & Preferences:</strong> We use essential local storage for your shopping basket so items remain saved while you browse. We never sell your personal data to third parties.</p>
        <p><strong>Your Rights:</strong> Under UK GDPR, you have the right to access, rectify, or request deletion of your personal data by contacting us at support@aeropur.shop.</p>
      </div>
    `;
  } else if (type === 'terms') {
    title = 'Terms of Service';
    body = `
      <p class="text-xs text-slate-500 mb-4">Effective Date: November 2026</p>
      <div class="space-y-3 text-xs text-slate-700 leading-relaxed">
        <p>By visiting aeropur.shop and ordering from AeroPure UK, you agree to the following terms and conditions.</p>
        <p><strong>Pricing & Availability:</strong> All prices are displayed in British Pounds Sterling (GBP £) and include applicable UK VAT. All products listed are brand new unless explicitly stated otherwise.</p>
        <p><strong>Product Descriptions:</strong> We take care to display accurate dimensions, materials, technical specifications, and photography for every item across our Home, Tech, Kitchen, and Garden range.</p>
        <p><strong>Governing Law:</strong> These terms are governed by and construed in accordance with the laws of England and Wales.</p>
      </div>
    `;
  } else if (type === 'returns') {
    title = '30-Day UK Returns & Refund Policy';
    body = `
      <div class="space-y-3 text-xs text-slate-700 leading-relaxed">
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium">
          ✓ 30-Day Money-Back Guarantee: Return any unused item in its original packaging within 30 days of delivery for a full refund.
        </div>
        <h4 class="font-bold text-slate-900 text-sm mt-3">How to Return:</h4>
        <ol class="list-decimal pl-5 space-y-1.5">
          <li>Email our UK support team at <a href="mailto:support@aeropur.shop" class="text-sky-600 underline font-semibold">support@aeropur.shop</a> with your order number.</li>
          <li>We will provide return instructions and a tracked return label.</li>
          <li>Repackage the item securely in its original box with all included accessories.</li>
          <li>Drop off at your nearest parcel point or arrange collection for larger furniture and garden items.</li>
        </ol>
        <p><strong>Refund Timeline:</strong> Once received and inspected at our UK distribution centre, your refund is issued to your original payment method within 2–4 working days.</p>
      </div>
    `;
  } else if (type === 'shipping') {
    title = 'UK 3–4 Working Days Shipping Policy';
    body = `
      <div class="space-y-3 text-xs text-slate-700 leading-relaxed">
        <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 font-medium">
          🚚 Free Tracked UK Delivery on all orders over £45. Orders under £45 are charged a flat £4.99 standard delivery fee.
        </div>
        <p><strong>Dispatch Time:</strong> Orders placed before 2:00 PM GMT Monday through Friday are processed and dispatched the same working day from our UK distribution hub.</p>
        <p><strong>Delivery Timeframe:</strong> 3 to 4 working days throughout England, Scotland, Wales, and Northern Ireland via Royal Mail Tracked or specialist courier for larger home and garden items.</p>
        <p><strong>Tracking:</strong> You will receive an email and SMS notification with your tracking link as soon as your order leaves our warehouse.</p>
      </div>
    `;
  } else if (type === 'contact') {
    title = 'Contact AeroPure UK Customer Support';
    body = `
      <div class="space-y-4 text-xs text-slate-700 leading-relaxed">
        <p>Our customer care team is available Monday to Friday from 9:00 AM to 6:00 PM GMT.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span class="font-bold text-slate-900 block text-sm">Customer Support Email</span>
            <a href="mailto:support@aeropur.shop" class="text-sky-600 font-medium mt-1 block">support@aeropur.shop</a>
            <span class="text-slate-400 text-[11px] mt-1 block">Typical response time: under 2 business hours</span>
          </div>
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span class="font-bold text-slate-900 block text-sm">Registered UK Address</span>
            <p class="text-slate-600 mt-1">AeroPure UK Ltd<br>71-75 Shelton Street, Covent Garden<br>London, WC2H 9JQ, United Kingdom</p>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <h3 class="text-xl font-extrabold text-slate-900 font-heading mb-2">${title}</h3>
    ${body}
  `;

  modal.classList.remove('hidden');
}

function closePolicyModal() {
  const modal = document.getElementById('policy-modal');
  if (modal) modal.classList.add('hidden');
}
