const galleryGrid = document.getElementById('galleryGrid');
const appLogo = document.getElementById('appLogo');

let folderName = 'images';

async function checkImageFolder() {
    try {
        const testRes = await fetch('images/logo.jpg');
        if (!testRes.ok) {
            folderName = 'Images';
        }
    } catch(e) {
        folderName = 'Images';
    }
    
    if (appLogo) appLogo.src = `${folderName}/logo.jpg`;
    renderGallery();
}

function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${folderName}/${i}.jpg" alt="Mahadev Wallpaper ${i}" loading="lazy">
            <a href="${folderName}/${i}.jpg" download="Mahadev_Wallpaper_${i}.jpg" class="download-link">Download</a>
        `;
        galleryGrid.appendChild(card);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    checkImageFolder();
});
