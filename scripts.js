// Global state
let dataStore = {
    publications: [],
    projects: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Publications
    setupSection('publications', 'publications.json');
    
    // Initialize Projects
    setupSection('projects', 'projects.json');

    // Section entry animations
    document.querySelectorAll('section').forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
});

/**
 * Generic setup for any section (publications, projects, etc.)
 */
function setupSection(type, jsonUrl) {
    const container = document.getElementById(`${type}-container`);
    const toggleBtn = document.getElementById(`toggle-${type}`);
    let showingSelected = true;

    fetch(jsonUrl)
        .then(res => res.json())
        .then(data => {
            dataStore[type] = data[type]; // Store in global object
            renderItems(type, showingSelected);

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    showingSelected = !showingSelected;
                    renderItems(type, showingSelected);
                    toggleBtn.textContent = showingSelected ? 'Show All' : 'Show Selected';
                });
            }
        })
        .catch(err => {
            console.error(`Error loading ${type}:`, err);
            container.innerHTML = `Error loading ${type}.`;
        });
}

/**
 * Generic renderer for list items
 */
function renderItems(type, selectedOnly) {
    const container = document.getElementById(`${type}-container`);
    container.innerHTML = '';
    
    const items = dataStore[type];
    const filtered = selectedOnly ? items.filter(i => i.selected === 1) : items;

    filtered.forEach(item => {
        container.appendChild(createItemElement(item));
    });
}

/**
 * Shared element creator for both Projects and Publications
 */
function createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'publication-item'; // Keep CSS class consistent
    
    // Format authors with highlighting
    const authorsHTML = item.authors.map(author => 
        author.includes('Steve Xing') // Change to your name
            ? `<span class="highlight-name">${author}</span>` 
            : author
    ).join(', ');

    div.innerHTML = `
        <div class="pub-thumbnail" onclick="openModal('${item.thumbnail}')">
            <img src="${item.thumbnail}" alt="${item.title} thumbnail">
        </div>
        <div class="pub-content">
            <div class="pub-title">${item.title}</div>
            <div class="pub-authors">${authorsHTML}</div>
            <div class="pub-venue-container">
                <div class="pub-venue">${item.venue || ''}</div>
                ${item.award ? `<div class="pub-award">${item.award}</div>` : ''}
            </div>
            <div class="pub-links">
                ${item.links?.pdf ? `<a href="${item.links.pdf}">[PDF]</a>` : ''}
                ${item.links?.code ? `<a href="${item.links.code}">[Code]</a>` : ''}
                ${item.links?.project ? `<a href="${item.links.project}">[Project Page]</a>` : ''}
                ${item.links?.video? `<a href="${item.links.video}">[Video]</a>` : ''}
                ${item.links?.cad_files? `<a href="${item.links.cad_files}">[CAD Files]</a>` : ''}
                ${item.links?.blog? `<a href="${item.links.blog}">[Blog]</a>` : ''}
            </div>
        </div>
    `;
    return div;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
}
