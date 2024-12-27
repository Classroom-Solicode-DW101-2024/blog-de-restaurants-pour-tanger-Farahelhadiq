const express = require('express');
const fs = require('fs');// File System
const app = express();
const cors = require('cors');//pour importer le module CORS
const PORT = 3000;
app.use(express.json());
app.use(cors());
let Restaurant = require('./fichier.json');
function saveData(data) {
    fs.writeFileSync('fichier.json', JSON.stringify(data, null, 2));
}
app.get('/Restaurant', (req, res) => {
    res.json(Restaurant);
});
app.get('/Restaurant/:nom', (req, res) => {
    const resto = Restaurant.find(r => r.nom.toLowerCase() === req.params.nom.toLowerCase());
    if (!resto) return res.status(404).send('Restaurant non trouvé');
    res.json(resto);
});

app.post('/Restaurant', (req, res) => {
    const nouvelRestaurant = {
        nom: req.body.nom,
        adresse: req.body.adresse || "Non spécifiée",
        type_de_cuisine: req.body.type_de_cuisine || "Non spécifiée",
        note_moyenne: req.body.note_moyenne || null,
        numéro_de_téléphone: req.body.numéro_de_téléphone || null,
        email: req.body.email || null,
        site_web: req.body.site_web || null,
        photo: req.body.photo || null
    };

    if (Restaurant.some(r => r.nom.toLowerCase() === nouvelRestaurant.nom.toLowerCase())) {
        return res.status(400).send('Un restaurant avec ce nom existe déjà.');
    }

    Restaurant.push(nouvelRestaurant);
    saveData(Restaurant);
    res.status(201).json(nouvelRestaurant);
});

app.put('/Restaurant/:nom', (req, res) => {
    const resto = Restaurant.find(r => r.nom.toLowerCase() === req.params.nom.toLowerCase());
    if (!resto) return res.status(404).send('Restaurant non trouvé');

    resto.nom = req.body.nom || resto.nom;
    resto.adresse = req.body.adresse || resto.adresse;
    resto.type_de_cuisine = req.body.type_de_cuisine || resto.type_de_cuisine;
    resto.note_moyenne = req.body.note_moyenne || resto.note_moyenne;
    resto.numéro_de_téléphone = req.body.numéro_de_téléphone || resto.numéro_de_téléphone;
    resto.email = req.body.email || resto.email;
    resto.site_web = req.body.site_web || resto.site_web;
    resto.photo = req.body.photo || resto.photo;

    saveData(Restaurant);
    res.json(resto);
});

app.delete('/Restaurant/:nom', (req, res) => {
    const index = Restaurant.findIndex(r => r.nom.toLowerCase() === req.params.nom.toLowerCase());
    if (index === -1) return res.status(404).send('Restaurant non trouvé');

    Restaurant.splice(index, 1);
    saveData(Restaurant);
    res.sendStatus(204);
});

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon API!');
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
