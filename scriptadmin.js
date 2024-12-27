
        const apiUrl = 'http://localhost:3000/Restaurant'; 
        let currentEditingRestaurant = null;
        let restaurants;
        function fetchRestaurants() {
            fetch(`${apiUrl}`)
                .then(response => response.json())
                .then(data => {
                    restaurants = data;
                    const restaurantsList = document.getElementById('restaurants-list');
                    restaurantsList.innerHTML = '';

                    data.forEach(restaurant => {
                        const card = document.createElement('div');
                        card.className = 'restaurant-card';
                        card.innerHTML = `
                            <img src="${restaurant.photo || 'https://via.placeholder.com/250'}" alt="${restaurant.nom}">
                            <h3>${restaurant.nom}</h3>
                            <p><strong>Address:</strong> ${restaurant.adresse}</p>
                            <p><strong>Phone:</strong> ${restaurant.numéro_de_téléphone}</p>
                            <p><strong>Type:</strong> ${restaurant.type_de_cuisine}</p>
                            <p><strong>Rating:</strong> ${restaurant.note_moyenne || 'N/A'}</p>
                            <button onclick="editRestaurant('${restaurant.nom}')">Edit</button>
                            <button id="button" onclick="deleteRestaurant('${restaurant.nom}')">Delete</button>
                        `;
                        restaurantsList.appendChild(card);
                    });
                });
        }
        
        function editRestaurant(nom) {
            fetch(`${apiUrl}/${nom}`)
                .then(response => response.json())
                .then(restaurant => {
                    document.getElementById('form-title').innerText = 'Update Restaurant';
                    document.getElementById('nom').value = restaurant.nom;
                    document.getElementById('adresse').value = restaurant.adresse;
                    document.getElementById('telephone').value = restaurant.numéro_de_téléphone;
                    document.getElementById('email').value = restaurant.email;
                    document.getElementById('type_de_cuisine').value = restaurant.type_de_cuisine;
                    document.getElementById('note_moyenne').value = restaurant.note_moyenne;
                    document.getElementById('site_web').value = restaurant.site_web;
                    document.getElementById('photo').value = restaurant.photo;

                    document.getElementById('submit-button').innerText = 'Update Restaurant';
                    currentEditingRestaurant = restaurant;
                });
        }
        function deleteRestaurant(nom) {
            fetch(`${apiUrl}/${nom}`, {
                method: 'DELETE'  //Had ligne katsend une requête DELETE l’API dyal l’URL li fiha smiya dyal restaurant (nom).
            })
            .then(() => fetchRestaurants())
            .catch(error => console.log('Error deleting restaurant:', error));
        }
        document.getElementById('restaurant-form').addEventListener('submit', function (e) {
            e.preventDefault();//pour stop reflécher la page
            const restaurantData = {
                nom: document.getElementById('nom').value,
                adresse: document.getElementById('adresse').value,
                numéro_de_téléphone: document.getElementById('telephone').value,
                email: document.getElementById('email').value,
                type_de_cuisine: document.getElementById('type_de_cuisine').value,
                note_moyenne: document.getElementById('note_moyenne').value,
                site_web: document.getElementById('site_web').value,
                photo: document.getElementById('photo').value
            };

            const method = currentEditingRestaurant ? 'PUT' : 'POST';
            const url = currentEditingRestaurant ? `${apiUrl}/${currentEditingRestaurant.nom}` : apiUrl;

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(restaurantData)
            })
            .then(() => {
                fetchRestaurants();
                resetForm();
            })
            .catch(error => console.log('Error saving restaurant:', error));
        });

        // Reset the form
        function resetForm() {
            document.getElementById('restaurant-form').reset();
            document.getElementById('form-title').innerText = 'Add New Restaurant';
            document.getElementById('submit-button').innerText = 'Add Restaurant';
            currentEditingRestaurant = null;
        }

        fetchRestaurants();
        function search(){
            let search=document.getElementById("search-bar").value;
            document.getElementById("search-bar").value="";
            document.querySelector('.restaurants-list').innerHTML='';
            console.log(restaurants)
            for(i=0;i<restaurants.length;i++){
                if(restaurants[i].nom.toLowerCase().includes(search.toLowerCase())){ 
                    document.querySelector('.restaurants-list').innerHTML+= createRestaurantCard(restaurants[i]);
            }
            }
            } 
            function clair(){
                document.querySelector('.restaurants-list').innerHTML='';
                fetchRestaurants(restaurants)
            }
            function createRestaurantCard(restaurants) {
                return`
                    <div class="restaurant-card">
                    <img src="${restaurants.photo || 'https://via.placeholder.com/250'}" alt="${restaurants.nom}">
                    <h3>${restaurants.nom}</h3>
                    <p><strong>Address:</strong> ${restaurants.adresse}</p>
                    <p><strong>Phone:</strong> ${restaurants.numéro_de_téléphone}</p>
                    <p><strong>Type:</strong> ${restaurants.type_de_cuisine}</p>
                    <p><strong>Rating:</strong> ${restaurants.note_moyenne || 'N/A'}</p>
                    <button onclick="editRestaurant('${restaurants.nom}')">Edit</button>
                    <button id="button" onclick="deleteRestaurant('${restaurants.nom}')">Delete</button>
                    </div>
                `;
            }