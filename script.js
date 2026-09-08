const galleryGrid = document.getElementById('galleryGrid');
const appLogo = document.getElementById('appLogo');

const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'PNG'];

// Automatic Image Loader Function
async function loadImage(imageIndex) {
    for (let ext of supportedExtensions) {
        let imgPath = `images/${imageIndex}.${ext}`;
        try {
            let response = await fetch(imgPath, { method: 'HEAD' });
            if (response.ok) {
                return imgPath;
            }
        } catch (e) {
            // Ignore error and try next extension
        }
    }
    return `images/${imageIndex}.jpg`; // Fallback path
}

async function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    // Load Logo
    if (appLogo) {
        let logoPath = await loadImage('logo');
        appLogo.src = logoPath;
    }

    // Load Wallpapers (1 to 20)
    for (let i = 1; i <= 20; i++) {
        let finalImgPath = await loadImage(i);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${finalImgPath}" alt="Mahadev Wallpaper ${i}" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x400?text=Image+Not+Found';">
            <a href="${finalImgPath}" download="Mahadev_Wallpaper_${i}" class="download-link">Download</a>
        `;
        galleryGrid.appendChild(card);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});
