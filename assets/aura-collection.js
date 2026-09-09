/**
 * AURA Store — Real-Time Collection Filtering & Sorting Engine
 * Fetches filtered grid HTML via Ajax without page reloads, updates browser URL,
 * and triggers GSAP entrance animations on new product cards.
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('ProductGridContainer');
  if (!container) return;

  // Delegate filter form changes
  document.addEventListener('change', (e) => {
    const filterForm = e.target.closest('#FacetFiltersForm, #FacetSortForm');
    if (filterForm) {
      e.preventDefault();
      fetchFilteredGrid(filterForm);
    }
  });

  // Filter form reset buttons
  document.addEventListener('click', (e) => {
    const resetTrigger = e.target.closest('.aura-facet-reset');
    if (resetTrigger) {
      e.preventDefault();
      const url = resetTrigger.getAttribute('href') || window.location.pathname;
      fetchUrlGrid(url);
    }
  });

  function fetchFilteredGrid(form) {
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);
    const searchUrl = `${window.location.pathname}?${params.toString()}`;
    fetchUrlGrid(searchUrl);
  }

  function fetchUrlGrid(url) {
    const gridContainer = document.getElementById('ProductGridContainer');
    if (!gridContainer) return;

    gridContainer.classList.add('is-loading');
    gridContainer.style.opacity = '0.5';

    fetch(url)
      .then((res) => res.text())
      .then((htmlText) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(htmlText, 'text/html');

        const newGrid = html.getElementById('ProductGridContainer');
        const newCount = html.getElementById('ProductCount');
        const newFacets = html.getElementById('main-collection-filters');

        if (newGrid) {
          gridContainer.innerHTML = newGrid.innerHTML;
        }

        const currentCount = document.getElementById('ProductCount');
        if (currentCount && newCount) {
          currentCount.innerHTML = newCount.innerHTML;
        }

        const currentFacets = document.getElementById('main-collection-filters');
        if (currentFacets && newFacets) {
          currentFacets.innerHTML = newFacets.innerHTML;
        }

        // Update URL bar
        window.history.pushState({ path: url }, '', url);

        gridContainer.classList.remove('is-loading');
        gridContainer.style.opacity = '1';

        // Trigger GSAP reveal on updated grid items
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.from('#ProductGridContainer .grid__item, #ProductGridContainer .aura-card', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'all'
          });
        }
      })
      .catch((err) => {
        gridContainer.classList.remove('is-loading');
        gridContainer.style.opacity = '1';
      });
  }
});
