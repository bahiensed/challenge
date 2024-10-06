// Display asset / component details
export const displayAssetDetails = (asset, allAssets, allLocations) => {
  try {
    const displaySection = document.getElementById('display');
    displaySection.innerHTML = '';

    // Create a flex container for the properties and the fake upload box
    const detailsContainer = document.createElement('div');
    detailsContainer.style.display = 'flex';
    detailsContainer.style.justifyContent = 'space-between';
    detailsContainer.style.alignItems = 'flex-start';
    detailsContainer.style.width = '100%';
    detailsContainer.style.marginTop = '8px';

    // Create a container for all properties
    const propertiesWrapper = document.createElement('div');
    propertiesWrapper.style.flex = '1';

    // Create the title element
    const title = document.createElement('h2');
    title.id = `asset-${asset.id}`; // Add unique ID to the title
    title.textContent = asset.name;
    title.style.marginTop = '0';
    propertiesWrapper.appendChild(title);

    // Show location if exists
    if (asset.locationId) {
      const locationId = asset.locationId;
      const locationObj = allLocations.find(location => location.id === locationId);
      const locationName = locationObj ? locationObj.name : "N/A";
      const location = document.createElement('p'); // Create paragraph
      const locationLabel = document.createElement('span'); // Create label and add class
      locationLabel.textContent = 'Location: ';
      locationLabel.classList.add('montserrat-700');
      const locationValue = document.createElement('span'); // Create value
      locationValue.textContent = `${locationName}`;

      location.appendChild(locationLabel); // Append both to paragraph
      location.appendChild(locationValue);
      propertiesWrapper.appendChild(location); // Add the property to the properties wrapper
    }

    // Show parent if exists
    if (asset.parentId) {
      const parentId = asset.parentId;
      const parentObj = allAssets.find(parent => parent.id === parentId);
      const parentName = parentObj ? parentObj.name : "N/A";

      const parent = document.createElement('p');
      const parentLabel = document.createElement('span');
      parentLabel.textContent = 'Parent: ';
      parentLabel.classList.add('montserrat-700');
      const parentValue = document.createElement('span');
      parentValue.textContent = `${parentName}`;

      parent.appendChild(parentLabel);
      parent.appendChild(parentValue);
      propertiesWrapper.appendChild(parent);
    }

    // Show sensor ID if exists
    if (asset.sensorId) {
      const sensorId = document.createElement('p');
      const sensorIdLabel = document.createElement('span');
      sensorIdLabel.textContent = 'Sensor ID: ';
      sensorIdLabel.classList.add('montserrat-700');
      const sensorIdValue = document.createElement('span');
      sensorIdValue.textContent = asset.sensorId;

      sensorId.appendChild(sensorIdLabel);
      sensorId.appendChild(sensorIdValue);
      propertiesWrapper.appendChild(sensorId);
    }

    // Show sensor type if exists
    if (asset.sensorType) {
      const sensorType = document.createElement('p');
      const sensorTypeLabel = document.createElement('span');
      sensorTypeLabel.textContent = 'Sensor Type: ';
      sensorTypeLabel.classList.add('montserrat-700');
      const sensorTypeValue = document.createElement('span');
      sensorTypeValue.textContent = asset.sensorType;
      sensorTypeValue.classList.add('capitalize');
      sensorType.appendChild(sensorTypeLabel);
      sensorType.appendChild(sensorTypeValue);
      propertiesWrapper.appendChild(sensorType);
    }

    // Show status if exists
    if (asset.status) {
      const status = document.createElement('p');
      const statusLabel = document.createElement('span');
      statusLabel.textContent = 'Status: ';
      statusLabel.classList.add('montserrat-700');
      const statusValue = document.createElement('span');
      statusValue.textContent = asset.status;
      statusValue.classList.add('capitalize');
      status.appendChild(statusLabel);
      status.appendChild(statusValue);
      propertiesWrapper.appendChild(status);
    }

    // Append the properties wrapper to the details container
    detailsContainer.appendChild(propertiesWrapper);

    // Create the fake upload box aligned to the right
    const uploadBox = document.createElement('div');
    uploadBox.textContent = "Upload asset's image. [Fake upload box]";
    uploadBox.style.border = '2px dashed #d1d5db';
    uploadBox.style.padding = '16px';
    uploadBox.style.width = '180px';
    uploadBox.style.height = '90px';
    uploadBox.style.display = 'flex';
    uploadBox.style.alignItems = 'center';
    uploadBox.style.justifyContent = 'center';
    uploadBox.style.marginLeft = '0px';

    // Add fake upload box to the details container
    detailsContainer.appendChild(uploadBox);

    // Append the details container to the display section
    displaySection.appendChild(detailsContainer);

  } catch (error) {
    console.error('Error displaying asset details:', error);
  }
};
