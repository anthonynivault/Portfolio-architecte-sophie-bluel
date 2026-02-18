//Récupération dynamique de la galerie
{
    async function recupererTravauxAPI(){
        const response = await fetch ("http://localhost:5678/api/works")
        return await response.json()  
    }

    async function afficherTravauxGallerie(){
        const travaux = await recupererTravauxAPI()
        let gallery = document.querySelector(".gallery")
        
        travaux.forEach(element => {
            let src = element.imageUrl
            let alt = element.title
            let imgTitre = element.title
            let imgCategorieId = element.categoryId
            let fig = `
                <figure class= "chantier categorie_${imgCategorieId} select">
                    <img src="${src}" alt="${alt}">
                    <figcaption>${imgTitre}</figcaption>
                </figure>
                `
            
            gallery.innerHTML +=fig
        });
    }

    afficherTravauxGallerie()
}


{//Récupération dynamique des catégories pour les boutons

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
}


{//Fonctionnement dynamique des filtres

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
}

{//Mode édition
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

//Récupération dynamique de la galerie pour la modale

    async function recupererTravauxAPI(){
        const response = await fetch ("http://localhost:5678/api/works")
        return await response.json()  
    }

    async function afficherTravauxGallerie(){
        const travaux = await recupererTravauxAPI()
        let gallery = document.querySelector(".gallerie_modale")
        
        travaux.forEach(element => {
            let src = element.imageUrl
            let alt = element.title
            let fig = `
                <figure class="photo_modale">
                    <img src="${src}" alt="${alt}">
                    <span class="corbeille">
                <i class="fa-solid fa-trash-can"></i>
                </span>
                </figure>
                `
            
            gallery.innerHTML +=fig
        });
    }

    afficherTravauxGallerie()
}

{//Modale
let modale = null


const page1 = document.querySelector('#page-1_modale');
const page2 = document.querySelector('#page-2_modale');
const boutonAjouter = document.querySelector('.bouton_ajouter');
const boutonRetour = document.querySelector('.retour_modale');

    const ouvrirModale = function (e){
        e.preventDefault()

        const target = document.querySelector('#modale1')
        target.style.display = null
        target.removeAttribute('aria-hidden')
        target.setAttribute ('aria-modal', 'true')
        modale = target
        modale.addEventListener ('click', fermerModale)
        modale.querySelectorAll('.fermer_modale').forEach(btn => btn.addEventListener('click', fermerModale))
        modale.querySelector('.modale-stop').addEventListener('click', stopPropagation)
    }

    const fermerModale = function (e) {
        if(modale === null) return
        e.preventDefault()
        modale.style.display = "none"
        modale.setAttribute('aria-hidden' , 'true')
        modale.removeAttribute ('aria-modal')
        modale.removeEventListener ('click', fermerModale)
        modale.querySelectorAll('.fermer_modale').forEach(btn => btn.removeEventListener('click', fermerModale))
        modale.querySelector('.modale-stop').removeEventListener('click', stopPropagation)
        modale = null
        page2.style.display = 'none'
         page1.style.display = 'block'
        
    }

    const stopPropagation = function (e) {
        e.stopPropagation()
    }

    document.querySelector('.bouton_modifier')
    .addEventListener('click', ouvrirModale);

    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            fermerModale(e)
        }
    })

    boutonAjouter.addEventListener('click', (e) => {
    e.preventDefault();
    page1.style.display = 'none'
    page2.style.display = 'block'
    });

    boutonRetour.addEventListener('click', (e) => {
    e.preventDefault();
    page2.style.display = 'none'
    page1.style.display = 'block'
    });
  }