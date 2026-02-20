//Récupération dynamique de la galerie

    async function recupererTravauxAPI(){
        const response = await fetch ("http://localhost:5678/api/works")
        return await response.json()  
    }

    async function afficherTravauxGallerie(){
        const travaux = await recupererTravauxAPI()
        let gallery = document.querySelector(".gallery")
        gallery.innerHTML = ""
        
        travaux.forEach(element => {
            let src = element.imageUrl
            let alt = element.title
            let imgTitre = element.title
            let imgCategorieId = element.categoryId
            let fig = `
                <figure class= "chantier categorie_${imgCategorieId} select" data-id="${element.id}">
                    <img src="${src}" alt="${alt}">
                    <figcaption>${imgTitre}</figcaption>
                </figure>
                `
            
            gallery.innerHTML +=fig
        });
    }

    afficherTravauxGallerie()



//Récupération dynamique des catégories pour les boutons

    async function recupererCategoriesAPI(){
        const response = await fetch ("http://localhost:5678/api/categories")
        return await response.json() 
    }

    async function afficherCategories(){
        const categories = await recupererCategoriesAPI()
        let filtres_boutons = document.querySelector(".filtres_boutons")
        filtres_boutons.innerHTML= `<button class="bouton_filtre selectionne" data-cat="0" type="button">Tous</button>`
        categories.forEach(element => {
            let filtre = element.name
            let fig = `
                <button class="bouton_filtre" data-cat="${element.id}" type="button">${filtre}</button>                    
            `
            filtres_boutons.innerHTML +=fig
        }); 

        selectionBoutonFiltre()
    }

    afficherCategories()

//Fonctionnement dynamique des filtres

    function selectionBoutonFiltre (){
        const filtres = document.querySelectorAll(".bouton_filtre")
        filtres.forEach(element => {
            element.addEventListener('click', event =>{
                //Selection du bouton
                filtres.forEach( element => { element.classList.remove('selectionne')})
                event.currentTarget.classList.add('selectionne')

                //Filtrage des chantiers
                const chantiers = document.querySelectorAll(".chantier")
                const catId = event.currentTarget.dataset.cat

                chantiers.forEach(chantier => {
                    const visible = catId === "0" || chantier.classList.contains(`categorie_${catId}`)
                    chantier.classList.toggle("select", visible)
                })
            })
        })
    }


//Mode édition
    function verifierConnexion() {
    const token = localStorage.getItem("token");

    if (token) {
    document.body.classList.add("connecte");
    }
}

verifierConnexion();

    function gererBoutonLoginLogout() {
    const token = localStorage.getItem("token");
    const loginLink = document.querySelector('nav a[href="login.html"]');

    if (token) {
        loginLink.textContent = "logout";

        loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.reload();
        });
    }
    }

gererBoutonLoginLogout();

//Récupération dynamique de la galerie pour la modale et suppression

    async function recupererTravauxAPI_modale(){
        const response = await fetch ("http://localhost:5678/api/works")
        return await response.json()  
    }

    async function afficherTravauxGallerie_modale(){
        const travaux = await recupererTravauxAPI_modale()
        const gallery = document.querySelector(".gallerie_modale")
        gallery.innerHTML = ""
        
        travaux.forEach(element => {
            let src = element.imageUrl
            let alt = element.title
            let fig = `
                <figure class="photo_modale" data-id="${element.id}">
                    <img src="${src}" alt="${alt}">
                    <span class="corbeille">
                <i class="fa-solid fa-trash-can"></i>
                </span>
                </figure>
                `
            
            gallery.innerHTML +=fig
        });

        activerSuppression()
    }

    afficherTravauxGallerie_modale()

    async function supprimerTravail(id) {
    const token = localStorage.getItem("token")

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`}
    })

     return response.ok
    }

    function activerSuppression() {
        const corbeilles = document.querySelectorAll(".corbeille")

        corbeilles.forEach(corbeille => {
            corbeille.addEventListener("click", async (e) => {
                e.stopPropagation()

                const figure = corbeille.closest(".photo_modale")
                const id = figure.dataset.id

                const success = await supprimerTravail(id)

                if (success) {
                    figure.remove()
                    supprimerTravailGaleriePrincipale(id)
                }
                else {
                    alert("Erreur lors de la suppression du projet.")
    }
            })
        })
    }

   

    function supprimerTravailGaleriePrincipale(id) {
        const chantier = document.querySelector(`.gallery figure[data-id="${id}"]`)
        if (chantier) {
            chantier.remove()
        }
    }


//Modale
    let modale = null

    //Sélection des éléments principaux
    const page1 = document.querySelector('#page-1_modale');
    const page2 = document.querySelector('#page-2_modale');
    const boutonAjouter = document.querySelector('.bouton_ajouter');
    const boutonRetour = document.querySelector('.retour_modale');

    //Ouverture de la modale
    const ouvrirModale = function (e){
        e.preventDefault()

        const target = document.querySelector('#modale1')
        target.style.display = null
        target.removeAttribute('aria-hidden')
        target.setAttribute ('aria-modal', 'true')
        modale = target

        //Fermeture en cliquant à l'extérieur ou sur les croix
        modale.addEventListener ('click', fermerModale)
        modale.querySelectorAll('.fermer_modale').forEach(btn => btn.addEventListener('click', fermerModale))
        modale.querySelector('.modale-stop').addEventListener('click', stopPropagation)
    }

    //Fermeture de la modale
    const fermerModale = function (e) {
        if(modale === null) return
        e.preventDefault()

        modale.style.display = "none"
        modale.setAttribute('aria-hidden' , 'true')
        modale.removeAttribute ('aria-modal')

        //Suppression des events
        modale.removeEventListener ('click', fermerModale)
        modale.querySelectorAll('.fermer_modale').forEach(btn => btn.removeEventListener('click', fermerModale))
        modale.querySelector('.modale-stop').removeEventListener('click', stopPropagation)

        modale = null

        //Retour page 1 par défaut
        page2.style.display = 'none'
        page1.style.display = 'block'
    }

    //Empêche la fermeture en cliquant dans la modale
    const stopPropagation = function (e) {
        e.stopPropagation()
    }

    //Bouton "modifier"
    document.querySelector('.bouton_modifier')
    .addEventListener('click', ouvrirModale);

    //Fermeture avec ESC
    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            fermerModale(e)
        }
    })

    //Navigation page 1 -> page 2
    boutonAjouter.addEventListener('click', (e) => {
        e.preventDefault();
        page1.style.display = 'none'
        page2.style.display = 'block'
    });

    //Navigation page 2 -> page 1
    boutonRetour.addEventListener('click', (e) => {
        e.preventDefault();
        page2.style.display = 'none'
        page1.style.display = 'block'
    });

    //Catégories dynamiques dans le formulaire d'ajout (modale)

    //Récupération des catégories via API
    async function recupererCategoriesAPI_select(){
        const response = await fetch("http://localhost:5678/api/categories")
        return await response.json()
    }

    //Affichage des catégories dans le select
    async function afficherCategoriesDansSelect(){
        const categories = await recupererCategoriesAPI_select()

        const select = document.querySelector("#categorie")
        if (!select) return

        //Reset du select (évite les doublons)
        select.innerHTML = `<option value="">-- Sélectionner une catégorie --</option>`

        categories.forEach(element => {
            select.innerHTML += `<option value="${element.id}">${element.name}</option>`
        })
    }

    afficherCategoriesDansSelect()

    //Preview image (modale)

    const inputFile = document.querySelector("#input_fichier")
    const zoneImage = document.querySelector("#zone_image")
    const boutonFichier = document.querySelector("#zone_image .bouton_fichier")
    const texteInfo = document.querySelector("#zone_image .texte_info")
    const symboleImg = document.querySelector("#zone_image .symbole_img")

    if (inputFile && zoneImage) {
        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0]
            if (!file) return

            const typesOk = ["image/jpeg", "image/png"]
            if (!typesOk.includes(file.type)) {
                alert("Format invalide. Choisis un jpg ou png.")
                inputFile.value = ""
                return
            }

            if (file.size > 4 * 1024 * 1024) {
                alert("Fichier trop lourd. 4 Mo max.")
                inputFile.value = ""
                return
            }

            const anciennePreview = zoneImage.querySelector("img.preview_image")
            if (anciennePreview) anciennePreview.remove()

            if (symboleImg) symboleImg.style.display = "none"
            if (boutonFichier) boutonFichier.style.display = "none"
            if (texteInfo) texteInfo.style.display = "none"

            const img = document.createElement("img")
            img.classList.add("preview_image")
            img.alt = "Aperçu de l'image"
            img.src = URL.createObjectURL(file)

            zoneImage.appendChild(img)
        })
    }
    

 //Activation du bouton Valider + envoi formulaire

const formModale = document.querySelector(".form_modale")
const inputTitre = document.querySelector("#titre")
const selectCategorie = document.querySelector("#categorie")
const boutonValider = document.querySelector(".bouton_valider")

function formulaireOk() {
    const imageOk = inputFile && inputFile.files.length > 0
    const titreOk = inputTitre.value.trim() !== ""
    const categorieOk = selectCategorie.value !== ""
    return imageOk && titreOk && categorieOk
}

function messageErreur() {
    const erreurs = []
    if (!inputFile || inputFile.files.length === 0) erreurs.push("- Ajouter une image")
    if (inputTitre.value.trim() === "") erreurs.push("- Renseigner un titre")
    if (selectCategorie.value === "") erreurs.push("- Sélectionner une catégorie")
    return erreurs.length ? "Formulaire incomplet :\n\n" + erreurs.join("\n") : ""
}

function verifierFormulaire() {
    boutonValider.classList.toggle("active", formulaireOk())
}

inputFile.addEventListener("change", verifierFormulaire)
inputTitre.addEventListener("input", verifierFormulaire)
selectCategorie.addEventListener("change", verifierFormulaire)
verifierFormulaire()

async function envoyerNouveauTravailAPI() {
    const token = localStorage.getItem("token")
    if (!token) {
        alert("Vous devez être connecté.")
        return null
    }

    const formData = new FormData()
    formData.append("image", inputFile.files[0])
    formData.append("title", inputTitre.value.trim())
    formData.append("category", Number(selectCategorie.value))

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    })

    if (!response.ok) {
        if (response.status === 401) alert("Non autorisé (token invalide ou expiré).")
        else if (response.status === 400) alert("Requête invalide : vérifie image/titre/catégorie.")
        else alert("Erreur serveur lors de l'ajout.")
        return null
    }

    return await response.json()
}

function resetFormAjout() {
    inputFile.value = ""
    inputTitre.value = ""
    selectCategorie.value = ""

    const anciennePreview = zoneImage.querySelector("img.preview_image")
    if (anciennePreview) anciennePreview.remove()

    if (symboleImg) symboleImg.style.display = ""
    if (boutonFichier) boutonFichier.style.display = ""
    if (texteInfo) texteInfo.style.display = ""

    boutonValider.classList.remove("active")
}

async function rafraichirGaleries() {
    await afficherTravauxGallerie()
    await afficherTravauxGallerie_modale()
}

if (formModale) {
    formModale.addEventListener("submit", async (e) => {
        e.preventDefault()

        if (!formulaireOk()) {
            alert(messageErreur())
            return
        }

        const nouveauTravail = await envoyerNouveauTravailAPI()
        if (!nouveauTravail) return

        await rafraichirGaleries()

        resetFormAjout()
        page2.style.display = "none"
        page1.style.display = "block"

        alert("Projet ajouté !")
    })
}