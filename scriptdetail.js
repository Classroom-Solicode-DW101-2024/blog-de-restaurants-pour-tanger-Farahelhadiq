
class RestaurantDetails {
    constructor() {
        this.detailsContainer = document.getElementById('restaurant-details');
        this.restaurantName = new URLSearchParams(window.location.search).get('nom');
        this.init();
    }

    async init() {
        if (!this.detailsContainer) {
            console.error('Details container not found');
            return;
        }

        if (!this.restaurantName) {
            this.showError('Aucun restaurant sélectionné');
            return;
        }

        await this.fetchAndDisplayDetails();
    }

    async fetchAndDisplayDetails() {
        try {
            // Fetching from the correct endpoint
            const response = await fetch(`http://localhost:3000/Restaurant/?nom=${encodeURIComponent(this.restaurantName)}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const restaurants = await response.json();
            const restaurant = restaurants.find(r => r.nom === this.restaurantName);

            if (!restaurant) {
                throw new Error('Restaurant introuvable');
            }

            this.renderDetails(restaurant);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            this.showError('Impossible de charger les détails du restaurant');
        }
    }

    renderDetails(restaurant) {
        const stars = this.generateStars(restaurant.note_moyenne);

        this.detailsContainer.innerHTML = `
            <div class="restaurant-card">
                <!-- Première partie: Photo principale et description -->
                <div class="section-top">
                    <img 
                        class="restaurant-photo" 
                        src="${this.escapeHtml(restaurant.photo)}" 
                        alt="${this.escapeHtml(restaurant.nom)}"
                        onerror="this.src='placeholder.jpg'"
                    >
                    <div class="description">
                        <h2>${this.escapeHtml(restaurant.nom)}</h2>
                        <p>${this.escapeHtml(restaurant.description)}</p>
                    </div>
                </div>

                <!-- Deuxième partie: Informations et photo secondaire -->
                <div class="section-middle">
                    <div class="info-section">
                        <div class="restaurant-address">
                            <i class="fas fa-map-marker-alt"></i> 
                            ${this.escapeHtml(restaurant.adresse)}
                        </div>
                        <div class="restaurant-specialty">
                            <i class="fas fa-utensils"></i> 
                            ${this.escapeHtml(restaurant.type_de_cuisine)}
                        </div>
                        <div class="restaurant-rating">
                            ${stars} (${this.escapeHtml(restaurant.note_moyenne)})
                        </div>
                        <div class="restaurant-contact">
                            <i class="fas fa-phone"></i> ${this.escapeHtml(restaurant.telephone)}<br>
                            <i class="fas fa-envelope"></i> ${this.escapeHtml(restaurant.email)}
                        </div>
                    </div>
                    <img 
                        class="restaurant-photo-secondary" 
                        src="${this.escapeHtml(restaurant.photo1)}" 
                        alt="${this.escapeHtml(restaurant.nom)}"
                        onerror="this.src='placeholder.jpg'"
                    ><button class="visitesite"><a href="${this.escapeHtml(restaurant.site_web)}"><i class="fa-solid fa-shuffle"></i></button>
                </div>

                <iframe src=${restaurant.map}></iframe>
                <div class="section-bottom">
                    <div class="location-map">
                        <i class="fas fa-map"></i> Localisation non disponible en image.
                    </div>

                    ${restaurant.site_web ?
                `<a class="visit-site-button" href="${this.escapeHtml(restaurant.site_web)}" 
                            target="_blank">
                            <i class="fas fa-external-link-alt"></i> Visiter le site
                        </a>` : ''
            }
                </div>

                <!-- Quatrième partie: Avis -->
                <div class="reviews-section">
                    <h3>Avis des clients</h3>
                    ${this.escapeHtml(restaurant.avis)}
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        return Array(5).fill('').map((_, i) => {
            if (i < fullStars) return '<i class="fas fa-star"></i>';
            if (i === fullStars && halfStar) return '<i class="fas fa-star-half-alt"></i>';
            return '<i class="far fa-star"></i>';
        }).join('');
    }
    
  showError(message) {
        if (this.detailsContainer) {
            this.detailsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    ${this.escapeHtml(message)}
                </div>
            `;
        }
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}
const restaurantDetails = new RestaurantDetails();
