import { openPathToElement } from './tree.js';

// Search
function searchTree(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  const treeContainer = document.getElementById('tree-container');
  const errorSpan = document.getElementById('error-message');

  // Reset search, remove highlight and close branches
  function resetTree(element) {
    if (element.tagName === 'A') {
      element.style.backgroundColor = ''; // Remove highlight
    } else if (element.tagName === 'UL') {
      // Close branch
      element.style.display = 'none';
    }

    // Reset tree
    for (const child of element.children) {
      resetTree(child);
    }

    // Hide section display
    const displaySection = document.getElementById('display');
    displaySection.style.display = 'none';
  }

  // Clean search results
  resetTree(treeContainer);

  // Search result
  function searchElement(element) {
    if (element.tagName === 'A' && element.textContent.toLowerCase().includes(searchTerm)) {
      element.style.backgroundColor = '#fde047'; // yellow
      openPathToElement(element);

      // Add anchor to found item
      const elementId = `search-result-${element.textContent.toLowerCase().replace(/ /g, '-')}`;
      element.id = elementId;

      // Roll to last found item
      window.location.hash = `#${elementId}`;

      return true;
    }

    let childFound = false;
    for (const child of element.children) {
      if (searchElement(child)) {
        childFound = true;
      }
    }

    if (childFound && element.tagName === 'UL') {
      element.style.display = 'block';
    }

    return childFound;
  }

  const found = searchElement(treeContainer);

  if (found) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  } else {
    errorSpan.textContent = 'Nothing to display. Please refine your search.';
    errorSpan.style.display = 'block';
    errorSpan.style.color = '#ef4444'; // red
  }
}


// Search form
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', () => {
  if (searchInput.value.trim() !== "") {
    searchTree(searchInput.value);
  }
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && searchInput.value.trim() !== "") {
    searchTree(searchInput.value);
  }
});
