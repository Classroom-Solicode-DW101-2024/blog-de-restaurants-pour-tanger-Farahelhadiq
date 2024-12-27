let restaurants=[]
async function getData() {
    try {
        const response = await fetch('http://localhost:3000/Restaurant');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        restaurants=data;
        displayRestaurants(data);
    } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        showError('Unable to load restaurants. Please try again later.');
    }
}
function displayRestaurants(restaurants) {
    const container = document.querySelector('.contenus');
    container.innerHTML = restaurants.map(restaurant => createRestaurantCard(restaurant)).join('');
}

function createRestaurantCard(restaurant) {
    const { photo, nom, type_de_cuisine, note_moyenne, adresse, email } = restaurant;
    
    return `
        <div class="resto">
            <img src="${restaurant.photo}" alt="${restaurant.nom}" onerror="this.src='placeholder.jpg'">
            <div class="card-content">
                <h2>${restaurant.nom}</h2>
                <p class="job-title">${restaurant.type_de_cuisine}</p>
                <p class="description">
                <a href="#" class="fas fa-star"></a><a href="#" class="fas fa-star"></a><a href="#" class="fas fa-star"></a><a href="#" class="fas fa-star"></a><a href="#" class="fas fa-star"></a>${restaurant.note_moyenne}
                </p>
                <p class="description">
                    ${restaurant.adresse}<br>
                    <a id="email" href="mailto:${restaurant.email}">${restaurant.email}</a>
                </p>
                <button class="button" onclick="showDetails('${restaurant.nom}')">Détail</button>
            </div>
        </div>
    `;
}
function showDetails(restaurantName) {
    window.location.href = `detail.html?nom=${encodeURIComponent(restaurantName)}`;//detail or restaurantName
}
getData();
function search(){
let search=document.getElementById("inputSearch").value;
document.querySelector('.contenus').innerHTML='';
for(i=0;i<restaurants.length;i++){
    if(restaurants[i].nom.toLowerCase().includes(search.toLowerCase())){ 
        document.querySelector('.contenus').innerHTML+=createRestaurantCard(restaurants[i]);
}
}
} 
function clair(){
    document.getElementById("inputSearch").value='';
    document.querySelector('.contenus').innerHTML='';
    displayRestaurants(restaurants)
}