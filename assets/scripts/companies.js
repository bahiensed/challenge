import { createTree } from './tree.js';

export const baseUrl = 'https://fake-api.tractian.com/companies';

// Fetch companies
const fetchCompanies = async () => {
  try {
    const response = await fetch(baseUrl);
    const companies = await response.json();
    return companies;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};


// Create companies buttons and trees
const createCompaniesTree = async () => {
  const companies = await fetchCompanies(); // Fetch companies
  const treeContainer = document.getElementById('company'); // Container where to plot buttons
  treeContainer.innerHTML = ''; // Clear container

  // Create company button
  companies.forEach(company => {
    const button = document.createElement('button');
    button.textContent = company.name;
    button.classList.add('company-button'); // Add class

    // Add click event
    button.addEventListener('click', (event) => {
      event.preventDefault();
      createTree(company.id); // Call function to create company tree

      // Show filters
      const filters = document.getElementById('filter'); // Container where to plot filters
      filters.style.display = 'flex'; // Show filters
      const treeSection = document.getElementById('tree'); // Container where to plot tree
      treeSection.style.display = 'flex'; // Show tree
    });

    // Add button to container
    treeContainer.appendChild(button);
  });
};

// currentCompanyId in global scope
window.currentCompanyId = null;

// Get companyId when click on a company
document.querySelectorAll('#company button').forEach(button => {
  button.addEventListener('click', () => {
    const companyId = button.dataset.companyId;
    window.currentCompanyId = companyId; // Load companyId globally
    createTree(companyId); // Create tree
  });
});


// Call function to create companies' buttons on page load
createCompaniesTree();
