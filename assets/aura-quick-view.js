/**
 * AURA Store — Quick View Modal Controller
 * Fetches product JSON via Ajax, renders dynamic variant swatches & gallery,
 * and adds to cart with optimistic UI updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('AuraQuickViewModal');
  const bodyContent = document.getElementById('AuraQuickViewContent');

  if (!modal || !bodyContent) return;

  // Listen for Quick View trigger clicks globally
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.aura-quick-view-trigger');
    if (trigger) {
      e.preventDefault();
      const handle = trigger.dataset.productHandle;
      if (handle) {
        openQuickView(handle);
      }
    }

    // Modal Close Triggers
    if (e.target.closest('[data-aura-modal-close]')) {
      closeQuickView();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeQuickView();
    }
  });

  function openQuickView(handle) {
    if (window.auraAnimateModal) {
      window.auraAnimateModal(modal, true);
    } else {
      modal.style.display = 'flex';
    }

    bodyContent.innerHTML = `
      <div class="aura-quick-view__loading">
        <div class="aura-spinner"></div>
      </div>
    `;

    fetch(`/products/${handle}.js`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((product) => {
        renderQuickViewProduct(product);
      })
      .catch((err) => {
        bodyContent.innerHTML = `<p class="aura-error">Unable to load product details.</p>`;
      });
  }

  function closeQuickView() {
    if (window.auraAnimateModal) {
      window.auraAnimateModal(modal, false);
    } else {
      modal.style.display = 'none';
    }
  }

  function renderQuickViewProduct(product) {
    const selectedVariant = product.variants[0];
    const moneyFormat = (cents) => `$${(cents / 100).toFixed(2)}`;

    let imagesHtml = '';
    if (product.images && product.images.length) {
      imagesHtml = `<img id="AuraQVFeaturedImg" src="${product.images[0]}" alt="${product.title}">`;
    }

    let optionsHtml = '';
    product.options.forEach((option, optionIndex) => {
      const optionValues = option.values;
      let valuesHtml = '';

      optionValues.forEach((val, valIndex) => {
        const isSelected = selectedVariant.options[optionIndex] === val;
        valuesHtml += `
          <button type="button" 
            class="aura-pill-btn ${isSelected ? 'is-selected' : ''}" 
            data-option-index="${optionIndex}" 
            data-option-value="${val}">
            ${val}
          </button>
        `;
      });

      optionsHtml += `
        <div class="aura-quick-view__option">
          <label class="aura-quick-view__option-label">${option.name}</label>
          <div class="aura-quick-view__pills">${valuesHtml}</div>
        </div>
      `;
    });

    bodyContent.innerHTML = `
      <div class="aura-quick-view__grid">
        <div class="aura-quick-view__gallery">
          ${imagesHtml}
        </div>
        <div class="aura-quick-view__details">
          <h2 class="aura-quick-view__title">${product.title}</h2>
          <div class="aura-quick-view__price" id="AuraQVPrice">
            ${moneyFormat(selectedVariant.price)}
            ${selectedVariant.compare_at_price > selectedVariant.price ? `<span class="aura-card__price--compare">${moneyFormat(selectedVariant.compare_at_price)}</span>` : ''}
          </div>
          <div class="aura-quick-view__description">
            ${product.description ? product.description.substring(0, 180) + '...' : ''}
          </div>

          <form id="AuraQVForm">
            <input type="hidden" name="id" id="AuraQVVariantId" value="${selectedVariant.id}">
            ${optionsHtml}

            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem;">
              <input type="number" name="quantity" value="1" min="1" style="width: 70px; text-align: center; border-radius: var(--aura-radius-full); border: 1px solid var(--aura-color-border);">
              <button type="submit" id="AuraQVSubmit" class="aura-btn aura-btn--primary" style="flex: 1;">
                Add to Cart &bull; <span id="AuraQVBtnPrice">${moneyFormat(selectedVariant.price)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Handle Option Selection
    const form = document.getElementById('AuraQVForm');
    const pills = form.querySelectorAll('.aura-pill-btn');

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const optionIdx = parseInt(pill.dataset.optionIndex, 10);
        const optionVal = pill.dataset.optionValue;

        // Update pills active state for this option
        form.querySelectorAll(`[data-option-index="${optionIdx}"]`).forEach(p => p.classList.remove('is-selected'));
        pill.classList.add('is-selected');

        // Find matching variant
        const currentSelectedOptions = Array.from(form.querySelectorAll('.aura-pill-btn.is-selected')).map(p => p.dataset.optionValue);
        const matchingVariant = product.variants.find((v) => {
          return v.options.every((opt, idx) => opt === currentSelectedOptions[idx]);
        });

        if (matchingVariant) {
          document.getElementById('AuraQVVariantId').value = matchingVariant.id;
          document.getElementById('AuraQVPrice').innerHTML = `
            ${moneyFormat(matchingVariant.price)}
            ${matchingVariant.compare_at_price > matchingVariant.price ? `<span class="aura-card__price--compare">${moneyFormat(matchingVariant.compare_at_price)}</span>` : ''}
          `;
          document.getElementById('AuraQVBtnPrice').textContent = moneyFormat(matchingVariant.price);
          
          if (matchingVariant.featured_image) {
            document.getElementById('AuraQVFeaturedImg').src = matchingVariant.featured_image.src;
          }
        }
      });
    });

    // Handle Quick View Ajax Add to Cart
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('AuraQVSubmit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Adding...';

      const variantId = document.getElementById('AuraQVVariantId').value;
      const quantity = form.querySelector('[name="quantity"]').value;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: parseInt(quantity, 10) })
      })
        .then((res) => res.json())
        .then((item) => {
          submitBtn.innerHTML = '✓ Added to Cart';
          setTimeout(() => {
            closeQuickView();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Open Cart Drawer if standard cart-drawer exists
            const cartDrawer = document.querySelector('cart-drawer');
            if (cartDrawer && typeof cartDrawer.open === 'function') {
              cartDrawer.open();
            } else if (window.auraOpenCartDrawer) {
              window.auraOpenCartDrawer();
            } else {
              window.location.href = '/cart';
            }
          }, 400);
        })
        .catch((err) => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Error Adding';
        });
    });
  }
});
