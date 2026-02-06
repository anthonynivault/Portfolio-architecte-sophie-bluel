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
            let fig = `
                <figure>
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
        filtres_boutons.innerHTML= `<button class="bouton_filtre" type="button">Tous</button>`
        categories.forEach(element => {
            let filtre = element.name
            let fig = `
                <button class="bouton_filtre" type="button">${filtre}</button>                    
            `
            filtres_boutons.innerHTML +=fig
        });
        
    }

    afficherCategories()
}
