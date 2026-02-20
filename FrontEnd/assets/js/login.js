//Récupération mail et mode passe
    const login = document.querySelector('#login');
    login.addEventListener("submit", async (event) => {
        event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = await envoyerLogin(email, password)
    traiterReponseLogin(data)
    });

    
  
//Envoi du login au serveur
    async function envoyerLogin (email, password){
       const reponse = await fetch("http://localhost:5678/api/users/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
         });
    return await reponse.json() 
    }

//Traitement de la réponse serveur
    function traiterReponseLogin(data) {

     if (data.token && data.userId) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    window.location.href = "index.html";
     } else {
    alert("Erreur dans l’identifiant ou le mot de passe");
    }
    }
