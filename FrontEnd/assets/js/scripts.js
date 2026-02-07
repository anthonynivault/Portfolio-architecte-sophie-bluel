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

                // Filtrage des chantiers
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

    
    
