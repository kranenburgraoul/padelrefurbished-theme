/* PadelRefurbished Theme JS */

/* ── Cart ── */
class CartManager {
  constructor() {
    this.notification = document.getElementById('cart-notification');
    this.countEl = document.querySelector('.cart-count');
    this.init();
  }

  init() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-add-to-cart]');
      if (btn) {
        e.preventDefault();
        this.addToCart(btn);
      }
    });
  }

  async addToCart(btn) {
    const variantId = btn.dataset.variantId || btn.dataset.addToCart;
    if (!variantId) return;

    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Toevoegen…';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      });
      if (!res.ok) throw new Error('Cart add failed');
      const cart = await this.fetchCart();
      this.updateCount(cart.item_count);
      this.showNotification(btn.dataset.productTitle || 'Product');
    } catch (err) {
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  async fetchCart() {
    const res = await fetch('/cart.js');
    return res.json();
  }

  updateCount(n) {
    if (this.countEl) {
      this.countEl.textContent = n;
      this.countEl.style.display = n > 0 ? 'flex' : 'none';
    }
  }

  showNotification(title) {
    if (!this.notification) return;
    const msg = this.notification.querySelector('.cart-notification__message');
    if (msg) msg.textContent = `${title} toegevoegd aan je winkelmandje!`;
    this.notification.classList.add('active');
    clearTimeout(this._notifTimer);
    this._notifTimer = setTimeout(() => {
      this.notification.classList.remove('active');
    }, 3000);
  }
}

/* ── Accordion / FAQ ── */
function initAccordions() {
  document.querySelectorAll('.acc-item, .accordion-item').forEach(item => {
    const trigger = item.querySelector('.acc-trigger, .accordion-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open, .accordion-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Product filters ── */
function initFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.product-card[data-brand], .product-card[data-level]');
  if (!chips.length) return;

  let activeFilters = { brand: 'all', level: 'all' };

  function applyFilters() {
    cards.forEach(card => {
      const brandMatch = activeFilters.brand === 'all' || card.dataset.brand === activeFilters.brand;
      const levelMatch = activeFilters.level === 'all' || card.dataset.level === activeFilters.level;
      card.style.display = brandMatch && levelMatch ? '' : 'none';
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.filterGroup;
      const val = chip.dataset.filter;
      document.querySelectorAll(`.filter-chip[data-filter-group="${group}"]`).forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilters[group] = val;
      applyFilters();
    });
  });
}

/* ── Product gallery ── */
function initGallery() {
  const main = document.querySelector('.gallery-main img');
  if (!main) return;
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src || thumb.querySelector('img')?.src;
      if (src) {
        main.src = src;
        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      }
    });
  });
}

/* ── Variant selector ── */
function initVariants() {
  document.querySelectorAll('.variant-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const group = opt.dataset.optionGroup;
      document.querySelectorAll(`.variant-option[data-option-group="${group}"]`).forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
}

/* ── Wishlist ── */
function initWishlist() {
  document.querySelectorAll('[data-wishlist]').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });
}

/* ── Sticky header shadow ── */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ── Scroll-reveal ── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* ── Mobile nav ── */
function initMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav-menu]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

/* ── Cart notification close ── */
function initCartNotificationClose() {
  const closeBtn = document.querySelector('[data-cart-notification-close]');
  const notif = document.getElementById('cart-notification');
  if (closeBtn && notif) {
    closeBtn.addEventListener('click', () => notif.classList.remove('active'));
  }
}

/* ── Init all ── */
document.addEventListener('DOMContentLoaded', () => {
  new CartManager();
  initAccordions();
  initFilters();
  initGallery();
  initVariants();
  initWishlist();
  initStickyHeader();
  initScrollReveal();
  initMobileNav();
  initCartNotificationClose();
});
