import { openPathToElement } from './tree.js';

let isFilterActive = {
  energy: false,
  alert: false,
}; // Control filter state

function filterByCriteria(criteria) {
  const treeContainer = document.getElementById('tree-container');
  const errorSpan = document.getElementById('error-message');
  let found = false;

  // Reset tree
  function resetTree(element) {
    if (element.tagName === 'A') {
      element.style.backgroundColor = ''; // Remove highlight
    } else if (element.tagName === 'UL' && element.parentElement !== treeContainer) {
      element.style.display = 'none'; // Close branch, but first level
    }

    for (const child of element.children) {
      resetTree(child);
    }
  }

  // Deactivate filters
  Object.keys(isFilterActive).forEach((key) => {
    if (key !== criteria.value && isFilterActive[key]) {
      isFilterActive[key] = false;
      const otherFilterButton = document.getElementById(`filter-${key}`);
      otherFilterButton.style.backgroundColor = '#2563eb'; // Define o botão como inativo
    }
  });

  // Reset tree if filter is active
  if (isFilterActive[criteria.value]) {
    resetTree(treeContainer);
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
    // Button colors
    const filterButton = document.getElementById(`filter-${criteria.value}`);
    filterButton.style.backgroundColor = '#2563eb';
    // Deactivate filter
    isFilterActive[criteria.value] = false;
    return;
  }

  // Apply filter instead
  resetTree(treeContainer);

  // Search and highlight elements
  function filterElement(element) {
    if (element.tagName === 'A') {
      const assetOrComponent = element.parentNode.classList.contains('component-item') || element.parentNode.classList.contains('asset-item');

      // Verifiy element
      if (assetOrComponent) {
        const typeMatch = criteria.type === 'sensorType' && element.parentNode.dataset.sensorType === criteria.value;
        const statusMatch = criteria.type === 'status' && element.parentNode.dataset.status === criteria.value;

        if (typeMatch || statusMatch) {
          element.style.backgroundColor = criteria.value === 'alert' ? '#fca5a5' : '#fdba74'; // Highlight element
          openPathToElement(element); // Build path
          found = true;
          return true;
        }
      }
    }

    let childFound = false;
    for (const child of element.children) {
      if (filterElement(child)) {
        childFound = true;
      }
    }

    if (childFound && element.tagName === 'UL') {
      element.style.display = 'block'; // Keep branch open
    }

    return childFound;
  }

  filterElement(treeContainer);

  // Show or hide error message
  if (found) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  } else {
    errorSpan.textContent = 'Nothing found.';
    errorSpan.style.display = 'block';
    errorSpan.style.color = 'red';
  }

  // Update button colour
  const filterButton = document.getElementById(`filter-${criteria.value}`);
  filterButton.style.backgroundColor = criteria.value === 'alert' ? (found ? '#ef4444' : '#2563eb') : (found ? '#f97316' : '#2563eb');

  // Change filter state
  isFilterActive[criteria.value] = found;
}

// Event listener to Energy button
const energyButton = document.getElementById('filter').querySelector('button#filter-energy');
energyButton.addEventListener('click', () => {
  filterByCriteria({ type: 'sensorType', value: 'energy' }); // Filtra by sensorType = energy
});

// Event listener to botão Alert button
const alertButton = document.getElementById('filter').querySelector('button#filter-alert');
alertButton.addEventListener('click', () => {
  filterByCriteria({ type: 'status', value: 'alert' }); // Filter by status = alert
});

export { filterByCriteria };
