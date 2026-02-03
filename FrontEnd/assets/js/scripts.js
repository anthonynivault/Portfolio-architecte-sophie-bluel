
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

