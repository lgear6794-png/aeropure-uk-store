// Main Application Logic for UK Premium Air Purifiers Store
let cart = [];
let activeCategory = 'all';
let currentDiscount = 0; // percentage
let discountCodeApplied = '';
const FREE_SHIPPING_THRESHOLD = 45.00;
const STANDARD_SHIPPING_FEE = 4.99;

// Calculate dynamic 3-4 working days delivery date range
function getDeliveryDateRange(minDays = 3, maxDays = 4) {
  const now = new Date();
  
  function addWorkDays(startDate, days) {
    let count = 0;
    let cur = new Date(startDate);
    while (count < days) {
      cur.setDate(cur.getDate() + 1);
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // skip Saturday and Sunday
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
  renderProducts();
  setupEventListeners();
  loadCartFromStorage();
  updateCartUI();
  startSocialProofTicker();
  startCountdownTimer();
  updateAirCalculator();
});

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
    : productsData.filter(p => {
        if (activeCategory === 'whole-home') return p.category.includes('Whole-Home') || p.category.includes('Multifunction');
        if (activeCategory === 'specialist') return p.category.includes('Sterilisation') || p.category.includes('Pet');
        if (activeCategory === 'bedroom') return p.category.includes('Bedroom');
        return true;
      });

  container.innerHTML = filtered.map(product => {
    return `
      <div class="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden relative">
        <!-- Badge -->
        <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          <span class="px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm ${product.badgeColor}">
            ${product.badge}
          </span>
          ${product.inStock <= 10 ? `
            <span class="px-2 py-0.5 text-[11px] font-medium bg-red-100 text-red-700 rounded-md border border-red-200 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Only ${product.inStock} units left in UK
            </span>
          ` : ''}
        </div>

        <!-- Merchant Strategy Pill (Top Right) -->
        <button onclick="openMerchantModal('${product.id}')" title="View Profit Margin & UK Sourcing Data" class="absolute top-3 right-3 z-10 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/85 text-amber-300 hover:bg-slate-900 backdrop-blur-sm transition-colors flex items-center gap-1.5 border border-amber-400/30">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          ${product.merchantInsights.grossProfit.split(' ')[1].replace('(', '').replace(')', '')} margin
        </button>

        <!-- Product Image -->
        <div class="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer" onclick="openQuickView('${product.id}')">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
          
          <!-- Delivery Date Tag overlay on image -->
          <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            <span>Arrives: <strong>${dates.fullRange}</strong> (3-4 Days)</span>
          </div>

          <button class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-slate-800 text-xs font-medium py-1.5 px-3 rounded-lg shadow-md hover:bg-white flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            Quick View
          </button>
        </div>

        <!-- Product Details -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1.5 text-xs text-amber-500 mb-1.5">
              <div class="flex items-center text-amber-400">
                ${renderStars(product.rating)}
              </div>
              <span class="font-bold text-slate-700">${product.rating}</span>
              <span class="text-slate-400">(${product.reviewCount} UK reviews)</span>
            </div>

            <h3 class="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-700 transition-colors cursor-pointer" onclick="openQuickView('${product.id}')">
              ${product.name}
            </h3>
            <p class="text-xs text-slate-500 mt-1 line-clamp-2">${product.tagline}</p>

            <!-- CADR Spec Highlight Badge -->
            <div class="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-800">
              <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span>${product.cadRate}</span>
            </div>

            <!-- Key Feature bullet points -->
            <ul class="mt-3 space-y-1">
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
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-extrabold text-slate-900">£${product.price.toFixed(2)}</span>
                <span class="text-sm font-medium text-slate-400 line-through">£${product.originalPrice.toFixed(2)}</span>
              </div>
              <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save £${(product.originalPrice - product.price).toFixed(2)} (${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
              </span>
            </div>

            <button 
              onclick="addToCart('${product.id}')"
              class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span>Add to Basket</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Star SVGs
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += `<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    } else {
      stars += `<svg class="w-3.5 h-3.5 fill-slate-200" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
  }
  return stars;
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
  updateCartUI();
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
function updateCartUI() {
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
      freeShippingText.innerHTML = `Add items to qualify for <strong>FREE Royal Mail 3–4 Day Delivery</strong> over £45`;
    } else if (discountedSubtotal >= FREE_SHIPPING_THRESHOLD) {
      freeShippingBar.style.width = '100%';
      freeShippingText.innerHTML = `🎉 You've unlocked <strong>FREE Tracked Delivery! (Arrives ${dates.fullRange})</strong>`;
    } else {
      const remaining = (FREE_SHIPPING_THRESHOLD - discountedSubtotal).toFixed(2);
      const percentage = Math.min(100, Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
      freeShippingBar.style.width = `${percentage}%`;
      freeShippingText.innerHTML = `Add <strong>£${remaining}</strong> more for <strong>FREE 3-4 Day UK Delivery</strong>`;
    }
  }

  // Render Cart Items
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
          <svg class="w-16 h-16 stroke-slate-300 mb-3" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <p class="font-semibold text-slate-700">Your basket is empty</p>
          <p class="text-xs text-slate-400 mt-1 max-w-xs">Explore our top 5 medical-grade air purifiers and breathe clean, purified air this week.</p>
          <button onclick="closeCart()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
            Shop Air Purifiers
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

  if (code === 'CLEANAIR15' || code === 'WINTER15') {
    currentDiscount = 15;
    discountCodeApplied = `${code} (15% OFF)`;
    showToast(`Promo code ${code} applied! You get 15% off.`, 'success');
  } else if (code === 'PUREUK') {
    currentDiscount = 10;
    discountCodeApplied = 'PUREUK (10% OFF)';
    showToast('Promo code PUREUK applied! You get 10% off.', 'success');
  } else {
    showToast('Invalid promo code. Try "CLEANAIR15"', 'error');
    return;
  }

  input.value = '';
  updateCartUI();
}

// Storage helpers
function saveCartToStorage() {
  try {
    localStorage.setItem('uk_store_cart_purifiers', JSON.stringify(cart));
  } catch (e) {
    // ignore
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('uk_store_cart_purifiers');
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

// Quick View Modal
function openQuickView(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  if (!modal || !content) return;

  const dates = getDeliveryDateRange(3, 4);

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <!-- Image Gallery -->
      <div>
        <div class="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img id="modal-main-img" src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex gap-2.5 mt-3">
          ${product.gallery.map((img, i) => `
            <button onclick="document.getElementById('modal-main-img').src = '${img}'" class="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-blue-500 focus:border-blue-600 transition-colors">
              <img src="${img}" class="w-full h-full object-cover">
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Info -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${product.badgeColor}">
              ${product.badge}
            </span>
            <span class="text-xs text-slate-500 font-medium">${product.category}</span>
          </div>

          <h2 class="text-2xl font-bold text-slate-900 leading-tight">${product.name}</h2>
          <p class="text-xs text-slate-500 mt-1">${product.tagline}</p>

          <div class="flex items-center gap-2 mt-3">
            <div class="flex text-amber-400">${renderStars(product.rating)}</div>
            <span class="text-sm font-bold text-slate-700">${product.rating}</span>
            <span class="text-xs text-slate-400">(${product.reviewCount} verified UK reviews)</span>
          </div>

          <div class="flex items-baseline gap-3 mt-4">
            <span class="text-3xl font-extrabold text-slate-900">£${product.price.toFixed(2)}</span>
            <span class="text-base text-slate-400 line-through">£${product.originalPrice.toFixed(2)}</span>
            <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">Save £${(product.originalPrice - product.price).toFixed(2)}</span>
          </div>

          <!-- Highlight Delivery Date Box -->
          <div class="mt-4 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <div>
              <div class="font-bold text-slate-900">Guaranteed 3–4 Working Days Delivery</div>
              <div class="text-emerald-700 font-medium">Order today for delivery between <strong>${dates.fullRange}</strong> via Royal Mail Tracked</div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Technical Specifications</h4>
            <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-3">
              <div class="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span class="text-[10px] text-slate-400 block">Clean Air CADR:</span>
                <span class="font-bold text-slate-800">${product.cadRate.split(' ')[0]} ${product.cadRate.split(' ')[1]}</span>
              </div>
              <div class="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span class="text-[10px] text-slate-400 block">Electricity Running Cost:</span>
                <span class="font-bold text-emerald-700">${product.powerUsage.split('(')[1].replace(')', '')}</span>
              </div>
            </div>
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
          <button onclick="addToCart('${product.id}'); closeQuickView();" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>Add To Basket • £${product.price.toFixed(2)}</span>
          </button>
          <button onclick="openMerchantModal('${product.id}')" class="px-3.5 py-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors" title="View Supplier & Margin Breakdown">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Strategy
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

// Merchant & UK Sourcing Strategy Modal
function openMerchantModal(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('merchant-modal');
  const content = document.getElementById('merchant-modal-content');
  if (!modal || !content) return;

  const ins = product.merchantInsights;

  content.innerHTML = `
    <div class="p-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <h3 class="text-xl font-bold text-slate-900">E-Commerce Sourcing & Margin Breakdown</h3>
        </div>
        <span class="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-md">Confidential Merchant View</span>
      </div>

      <div class="mt-4">
        <h4 class="font-bold text-base text-slate-800">${product.name}</h4>
        <p class="text-xs text-slate-500 mt-0.5">Key Product SKU: <code>${product.id}</code></p>
      </div>

      <!-- Financial Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <span class="text-xs font-medium text-slate-500 block">Est. Sourcing Cost</span>
          <span class="text-xl font-extrabold text-slate-900 mt-1 block">${ins.sourcingCost}</span>
          <span class="text-[10px] text-slate-400">FOB / CJ Dropshipping</span>
        </div>
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <span class="text-xs font-medium text-slate-500 block">UK Selling Price (MSRP)</span>
          <span class="text-xl font-extrabold text-blue-600 mt-1 block">${ins.recommendedMSRP}</span>
          <span class="text-[10px] text-emerald-600 font-medium">High Ticket Product</span>
        </div>
        <div class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
          <span class="text-xs font-semibold text-emerald-800 block">Gross Profit</span>
          <span class="text-xl font-extrabold text-emerald-700 mt-1 block">${ins.grossProfit}</span>
          <span class="text-[10px] text-emerald-600">Massive ad spend buffer</span>
        </div>
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <span class="text-xs font-medium text-slate-500 block">UK Shipping Profile</span>
          <span class="text-xs font-bold text-slate-800 mt-2 block">${ins.shippingProfile}</span>
        </div>
      </div>

      <!-- Why It Sells In The UK -->
      <div class="mt-5 p-4 rounded-xl bg-slate-900 text-white">
        <h5 class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Why This Purifier Dominates UK High-Ticket Sales:
        </h5>
        <ul class="space-y-1.5 text-xs text-slate-200">
          ${product.ukSellingPoints.map(pt => `
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-bold">•</span>
              <span>${pt}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Marketing & Ad Creative Angles -->
      <div class="mt-4 p-4 rounded-xl border border-slate-200 bg-amber-50/40">
        <h5 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">High-Converting Ad Hook / Angle:</h5>
        <p class="text-sm font-semibold text-slate-900 italic">${ins.primaryAdAngle}</p>
        <div class="mt-2 text-xs text-slate-600">
          <strong>Ideal Target Demographic:</strong> ${ins.targetAudience}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end gap-3">
        <button onclick="closeMerchantModal()" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50">
          Close Insights
        </button>
        <button onclick="addToCart('${product.id}'); closeMerchantModal();" class="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700">
          Add To Test Basket
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeMerchantModal() {
  const modal = document.getElementById('merchant-modal');
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

  document.getElementById('checkout-summary-total').textContent = `£${total.toFixed(2)}`;
  document.getElementById('checkout-item-count').textContent = `${cart.reduce((s, i) => s + i.quantity, 0)} items`;
  
  const checkoutDeliveryDateEl = document.getElementById('checkout-delivery-date-text');
  if (checkoutDeliveryDateEl) {
    checkoutDeliveryDateEl.textContent = `Arrives: ${dates.fullRange} (3-4 Working Days)`;
  }

  modal.classList.remove('hidden');
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
  const address = form.address.value;
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
          <span class="text-slate-500">Royal Mail Tracking:</span>
          <span class="font-mono font-bold text-blue-600">${trackingNum}</span>
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
          <span class="font-bold text-emerald-700">${dates.fullRange} (3-4 Working Days)</span>
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
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Social Proof Ticker
function startSocialProofTicker() {
  const dates = getDeliveryDateRange(3, 4);
  const locations = [
    { city: 'Manchester', item: 'ApexAir 450 Smart Purifier', mins: '3' },
    { city: 'London', item: 'ThermoFlow 3-in-1 Heater & Purifier', mins: '7' },
    { city: 'Edinburgh', item: 'PetShield Dual-Filter Pet Purifier', mins: '11' },
    { city: 'Bristol', item: 'SterilTower 360 UV-C Purifier', mins: '2' },
    { city: 'Birmingham', item: 'WhisperAir Compact Bedside Purifier', mins: '14' }
  ];

  let index = 0;
  setInterval(() => {
    const loc = locations[index % locations.length];
    index++;

    const ticker = document.getElementById('social-proof-toast');
    if (!ticker) return;

    ticker.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-3 flex items-center gap-3 max-w-sm">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 animate-ping"></span>
        <div class="text-xs">
          <p class="text-slate-800 font-semibold leading-tight">Someone in <strong>${loc.city}, UK</strong></p>
          <p class="text-slate-500 text-[11px]">Purchased <em>${loc.item}</em> • Delivery by <strong>${dates.minStr}</strong></p>
        </div>
      </div>
    `;
    ticker.classList.remove('opacity-0', 'translate-y-4');

    setTimeout(() => {
      ticker.classList.add('opacity-0', 'translate-y-4');
    }, 4500);
  }, 14000);
}

// Category filter setup
function setupEventListeners() {
  const filterButtons = document.querySelectorAll('.category-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow');
      btn.classList.remove('bg-white', 'text-slate-700', 'border');

      activeCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });
}

// 1-Click Super Saver Bundle Adder
function addBundleToCart() {
  const bundleItems = ['apex-air-450', 'whisper-air-compact', 'pet-shield-carbon'];
  bundleItems.forEach(id => {
    const p = productsData.find(item => item.id === id);
    if (p) {
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          quantity: 1
        });
      }
    }
  });

  // Apply 20% bundle discount code automatically
  currentDiscount = 20;
  discountCodeApplied = 'WHOLEHOME20 (20% OFF)';
  saveCartToStorage();
  updateCartUI();
  showToast('Whole-Home Clean Air Bundle added to basket with 20% discount!', 'success');
  openCart();
}

// Interactive Clean Air Room Coverage Calculator
let selectedRoomSize = 35; // m²

function setCalcRoomSize(size, buttonEl) {
  const buttons = document.querySelectorAll('.calc-room-btn');
  buttons.forEach(b => {
    b.classList.remove('active', 'border-2', 'border-blue-600', 'bg-blue-50/60', 'text-slate-900');
    b.classList.add('border', 'border-slate-200', 'text-slate-700');
  });

  buttonEl.classList.add('active', 'border-2', 'border-blue-600', 'bg-blue-50/60', 'text-slate-900');
  buttonEl.classList.remove('border-slate-200', 'text-slate-700');

  selectedRoomSize = size;
  updateAirCalculator();
}

function updateAirCalculator() {
  const slider = document.getElementById('calc-hours-slider');
  const hoursDisplay = document.getElementById('calc-hours-display');
  const recommendedModelEl = document.getElementById('calc-recommended-model');
  const airChangesEl = document.getElementById('calc-air-changes');
  const dailyCostEl = document.getElementById('calc-daily-cost');
  const targetCadrEl = document.getElementById('calc-target-cadr');

  const hours = slider ? parseInt(slider.value, 10) : 8;
  if (hoursDisplay) hoursDisplay.textContent = `${hours} Hours/Day`;

  // Standard UK ceiling height is 2.4m
  const roomVolume = selectedRoomSize * 2.4; // m³
  let modelName = "ApexAir 450 Smart Purifier (450 m³/h)";
  let cadr = 450;
  let productId = "apex-air-450";
  let watts = 38;

  if (selectedRoomSize <= 20) {
    modelName = "WhisperAir Compact (180 m³/h)";
    cadr = 180;
    productId = "whisper-air-compact";
    watts = 12;
  } else if (selectedRoomSize <= 50) {
    modelName = "SterilTower 360 UV-C (380 m³/h)";
    cadr = 380;
    productId = "steril-tower-uvc";
    watts = 32;
  } else {
    modelName = "ApexAir 450 Smart Purifier (450 m³/h)";
    cadr = 450;
    productId = "apex-air-450";
    watts = 38;
  }

  const airChangesPerHour = (cadr / roomVolume).toFixed(1);
  const kwhRate = 0.28; // ~28p per kWh UK energy price cap
  const dailyRunningCost = ((watts * hours) / 1000) * kwhRate;

  if (recommendedModelEl) recommendedModelEl.textContent = modelName;
  if (airChangesEl) airChangesEl.textContent = `${airChangesPerHour}x per hour`;
  if (dailyCostEl) dailyCostEl.textContent = `${(dailyRunningCost * 100).toFixed(1)}p / day`;
  if (targetCadrEl) targetCadrEl.textContent = `${cadr} m³/h Clean Air`;

  const ctaBtn = document.getElementById('calc-buy-cta');
  if (ctaBtn) {
    ctaBtn.setAttribute('onclick', `addToCart('${productId}'); openCart();`);
  }
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
    icon.classList.add('text-blue-600');
  } else {
    ans.classList.add('hidden');
    icon.textContent = '+';
    icon.classList.remove('text-blue-600');
  }
}

// Live Dispatch Countdown Timer
function startCountdownTimer() {
  const timerEl = document.getElementById('dispatch-timer');
  if (!timerEl) return;

  let totalSeconds = 3 * 3600 + 48 * 60 + 12; // 03h 48m 12s
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

// Google Merchant Center & Store Legal Policy Modals
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
        <p>AeroPure UK is committed to protecting your personal information. When you place an order on aeropur.shop, we collect your name, shipping address, email address, and phone number solely to process and deliver your order via Royal Mail Tracked or DPD.</p>
        <p><strong>Payment Processing:</strong> We do not store full credit/debit card numbers. All payments are encrypted and securely processed via Stripe in compliance with PCI-DSS standards.</p>
        <p><strong>Cookies & Analytics:</strong> We use essential session cookies for your shopping cart and anonymous analytics to improve user experience. We never sell your personal data to third parties.</p>
        <p><strong>Your Rights:</strong> Under UK GDPR, you have the right to access, rectify, or request deletion of your personal data by contacting us at support@aeropur.shop.</p>
      </div>
    `;
  } else if (type === 'terms') {
    title = 'Terms of Service';
    body = `
      <p class="text-xs text-slate-500 mb-4">Effective Date: November 2026</p>
      <div class="space-y-3 text-xs text-slate-700 leading-relaxed">
        <p>By visiting aeropur.shop and purchasing products from AeroPure UK, you agree to be bound by the following terms and conditions.</p>
        <p><strong>Pricing & Availability:</strong> All prices are displayed in British Pounds Sterling (GBP £) and include applicable taxes. We reserve the right to modify prices or discontinue items without notice.</p>
        <p><strong>Product Representation:</strong> We make every effort to display accurate product specifications, CADR ratings, dimensions, and filter capabilities. All purifiers come with standard UK 3-pin fused plugs complying with BS 1363 safety standards.</p>
        <p><strong>Governing Law:</strong> These terms are governed by and construed in accordance with the laws of England and Wales.</p>
      </div>
    `;
  } else if (type === 'returns') {
    title = '30-Day UK In-Home Trial & Refund Policy';
    body = `
      <div class="space-y-3 text-xs text-slate-700 leading-relaxed">
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium">
          ✓ 30-Day Money Back Guarantee: Test your air purifier at home for 30 days. If you are not completely satisfied, return it for a full refund.
        </div>
        <h4 class="font-bold text-slate-900 text-sm mt-3">How to Return:</h4>
        <ol class="list-decimal pl-5 space-y-1.5">
          <li>Email our UK support team at <a href="mailto:support@aeropur.shop" class="text-blue-600 underline font-semibold">support@aeropur.shop</a> with your order number.</li>
          <li>We will provide a prepaid Royal Mail return label and RMA tracking number.</li>
          <li>Repackage the purifier in its original box with all accessories and power cables.</li>
          <li>Drop off at any Royal Mail post office or schedule a free home collection.</li>
        </ol>
        <p><strong>Refund Timeline:</strong> Once inspected at our Midlands distribution facility, your refund is processed back to your original payment method within 2-4 working days.</p>
      </div>
    `;
  } else if (type === 'shipping') {
    title = 'UK 3-4 Working Days Shipping Policy';
    body = `
      <div class="space-y-3 text-xs text-slate-700 leading-relaxed">
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-medium">
          🚚 Free UK Tracked Delivery on all orders over £45. Orders under £45 are charged a flat £4.99 standard delivery fee.
        </div>
        <p><strong>Dispatch Time:</strong> Orders placed before 2:00 PM GMT Monday through Friday are processed and dispatched the same working day from our Midlands logistics hub.</p>
        <p><strong>Delivery Timeframe:</strong> 3 to 4 working days throughout England, Scotland, Wales, and Northern Ireland via Royal Mail Tracked 48 or DPD Express.</p>
        <p><strong>Tracking:</strong> You will receive an SMS and email notification with your tracking link as soon as your parcel is scanned into the courier network.</p>
      </div>
    `;
  } else if (type === 'contact') {
    title = 'Contact AeroPure UK Customer Support';
    body = `
      <div class="space-y-4 text-xs text-slate-700 leading-relaxed">
        <p>Our dedicated customer care team is available Monday to Friday from 9:00 AM to 6:00 PM GMT.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span class="font-bold text-slate-900 block text-sm">Customer Support Email</span>
            <a href="mailto:support@aeropur.shop" class="text-blue-600 font-medium mt-1 block">support@aeropur.shop</a>
            <span class="text-slate-400 text-[11px] mt-1 block">Average response time: &lt; 2 hours</span>
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
