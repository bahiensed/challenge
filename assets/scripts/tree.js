import { baseUrl } from './companies.js';
import { displayAssetDetails } from './details.js';

// Fetch Locations
const fetchLocations = async (companyId) => {
  try {
    const response = await fetch(`${baseUrl}/${companyId}/locations`);
    const locations = await response.json();
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

// Fetch Assets
const fetchAssets = async (companyId) => {
  try {
    const response = await fetch(`${baseUrl}/${companyId}/assets`);
    const assets = await response.json();
    return assets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
};

// Create location item
const createLocationItem = (location, allLocations, allAssets) => {
  const li = document.createElement('li');
  const link = document.createElement('a');
  link.textContent = location.name;
  li.classList.add('location-item');

  const children = allLocations.filter(loc => loc.parentId === location.id);
  const assets = allAssets.filter(asset => asset.locationId === location.id);

  if (children.length > 0 || assets.length > 0) {
    const sublist = document.createElement('ul');
    sublist.style.display = 'none';

    children.forEach(child => sublist.appendChild(createLocationItem(child, allLocations, allAssets)));
    assets.forEach(asset => sublist.appendChild(createAssetItem(asset, allAssets, allLocations)));

    li.appendChild(link);
    li.appendChild(sublist);

    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleSelection(link);
      sublist.style.display = sublist.style.display === 'none' ? 'block' : 'none';
    });
  } else {
    li.appendChild(link);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleSelection(link);
    });
  }

  return li;
};

// Create asset item
const createAssetItem = (asset, allAssets, allLocations) => {
  const li = document.createElement('li');
  const link = document.createElement('a');
  link.textContent = asset.name;

  if (asset.sensorType) {
    li.classList.add('component-item');
    li.dataset.sensorType = asset.sensorType;
    const icon = document.createElement('img');
    icon.src = asset.sensorType === 'vibration' ? './assets/imgs/wave.svg' : './assets/imgs/bolt.svg';
    icon.alt = asset.sensorType === 'vibration' ? 'Vibration' : 'Energy';
    icon.style.width = '16px';
    icon.style.height = '16px';
    icon.style.marginLeft = '4px';
    link.appendChild(icon);
  } else {
    li.classList.add('asset-item');
  }

  if (asset.status) {
    li.dataset.status = asset.status;
    const circle = document.createElement('div');
    circle.style.display = 'inline-block';
    circle.style.width = '10px';
    circle.style.height = '10px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = asset.status === 'operating' ? 'hsl(142.1, 70.6%, 45.3%)' : 'hsl(0, 84.2%, 60.2%)';
    circle.style.marginLeft = '5px';
    link.appendChild(circle);
  }

  li.appendChild(link);

  const children = allAssets.filter(a => a.parentId === asset.id);

  if (children.length > 0) {
    const sublist = document.createElement('ul');
    sublist.style.display = 'none';
    children.forEach(child => sublist.appendChild(createAssetItem(child, allAssets, allLocations)));
    li.appendChild(sublist);

    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleSelection(link);
      sublist.style.display = sublist.style.display === 'none' ? 'block' : 'none';

      // Show section display and call asset details function
      const displaySection = document.getElementById('display');
      displaySection.style.display = 'block';
      displayAssetDetails(asset, allAssets, allLocations);

      // Scroll to the asset anchor
      window.location.hash = `#asset-${asset.id}`;
    });
  } else {
    // Add event to show the display section for assets without children
    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleSelection(link);

      // Show section display and call asset details function
      const displaySection = document.getElementById('display');
      displaySection.style.display = 'block';
      displayAssetDetails(asset, allAssets, allLocations);

      // Scroll to the asset anchor
      window.location.hash = `#asset-${asset.id}`;
    });
  }

  return li;
};

// Handle item selection and background highlight
const handleSelection = (selectedLink) => {
  // Remove the 'selected-item' class from all links
  const allLinks = document.querySelectorAll('#tree-container a');
  allLinks.forEach(link => {
    link.classList.remove('selected-item');
  });

  // Add the 'selected-item' class to the clicked link
  selectedLink.classList.add('selected-item');
};

// Open path to a specific element
const openPathToElement = (element) => {
  let parent = element.parentNode;
  while (parent && parent.tagName !== 'LI') {
    if (parent.tagName === 'UL') {
      parent.style.display = 'block';
    }
    parent = parent.parentNode;
  }
};

// Create tree
const createTree = async (companyId) => {
  const locations = await fetchLocations(companyId);
  const assets = await fetchAssets(companyId);
  const treeContainer = document.getElementById('tree-container');
  treeContainer.innerHTML = '';
  const ul = document.createElement('ul');

  // Reset and hide section display whenever tree loads
  const displaySection = document.getElementById('display');
  displaySection.style.display = 'none';
  const topLevelLocations = locations.filter(location => location.parentId === null);
  const topLevelAssets = assets.filter(asset => asset.locationId === null && asset.parentId === null);

  topLevelLocations.forEach(location => ul.appendChild(createLocationItem(location, locations, assets)));
  topLevelAssets.forEach(asset => ul.appendChild(createAssetItem(asset, assets, locations)));

  treeContainer.appendChild(ul);
};

export { openPathToElement, createTree };
