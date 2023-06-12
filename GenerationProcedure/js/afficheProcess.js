var processFocus = localStorage.getItem('ProcessFocus');

//Initialisation des listes de selection
$(document).ready(function() {

	
	updateAffichageEtapesFonction();
});






//Liste des selecteurs et listeners


//Listeners


//Liste des fonctions  userId


function creerNouveauEtapeFonction() {
	if( document.querySelector("#photo").files.length == 0 ){
		console.log("no files selected");
		creerNouveauEtapeDataFonction("");
	}else{
		  const ref = firebase.storage().ref();
		  const file = document.querySelector("#photo").files[0];
		  const name = +new Date() + "-" + file.name;
		  const metadata = {
			 contentType: file.type
		  };
		  const task = ref.child(name).put(file, metadata);task
		  .then(snapshot => snapshot.ref.getDownloadURL())
		  .then(url => {
			
			document.querySelector("#photoEtape").hidden = false;
			document.querySelector("#photoEtape").src = url;
		  creerNouveauEtapeDataFonction(url);
		  
		  
		  
	   })
	   .catch(console.error);
	}
	$('#CreerEtapeModal').modal('hide');
}


function creerNouveauEtapeDataFonction(imageUrlEtape) {
  titreEtape =document.getElementById("TitreEtape").value;
  descriptionEtape  =document.getElementById("DescriptionEtape").value;;
  listeAction = $('#listeSelectAction').val()
  //listePicto = $('#listeSelectPicto').val()
  
    var els = document.getElementsByClassName("imageListe selected");
	listePicto=[];

	Array.prototype.forEach.call(els, function(el) {
		// Do stuff here
		console.log(el.children[0].src);
		listePicto.push(el.children[0].src);
	});
	console.log(listePicto);
  
  //Reception du nombre de valeurs
  firebase.database().ref('procedures/'+processFocus).once('value').then((snapshot) => {
		  var position=1;
		  const data = snapshot.val();
		  
		  try {
		    position +=Object.keys(data.etapes).length;
		  } catch (error) {
		    //console.error(error);

		  }
		  
		  
		  //Ajout Etape
		  console.log(imageUrlEtape);
		  firebase.database().ref('procedures/'+processFocus+'/etapes').push({
			titre: titreEtape,
			description: descriptionEtape,
			imageUrlEtape : imageUrlEtape,
			listeAction: listeAction,
			listePicto: listePicto,
			position: position,
			datecreation:dateFormat()
		  });
		  
		  //Actualisation de l'affichage
		  updateAffichageEtapesFonction();
	 
  });

}
function updateAffichageEtapesFonction() {
	
	purgerAffichage(document.getElementById("listeDesEtapes"));
	//Reception des étapes
		firebase.database().ref('procedures/'+processFocus+'/etapes').once('value').then((snapshot) => {
		  
		  const etapes = snapshot.val();
		  snapshot.forEach(element => affichageEtapesFonction(element.val()));
	 
  });
}


function purgerAffichage(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function affichageEtapesFonction(listeProcess) {
	console.log(listeProcess.description)
	var template = `
	<div class="row featurette">
      <div class="col-md-7 `
	  
	  console.log(listeProcess.position);
	  console.log(listeProcess.position%2 == 0);
			if(listeProcess.position%2 == 0)
              {
                     template+=`order-md-1`;
					 
              }
              else
              {
                     template+=`order-md-2`;
              }
	  
	  template+=`">
	    <div class="p-3 mb-2 bg-secondary text-white">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
			  <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z"/>
			</svg>
		    `+listeProcess.listeAction+`
		</div>
		<div class="row row-cols-3 row-cols-sm-4 row-cols-md-6 g-3">`
			
			try {
				listeProcess.listePicto.forEach(function (snapshot) {

					template+=`<div class="col-md-2">
						  <div class="card shadow-sm">
							<img src="`+snapshot+`" class="bd-placeholder-img card-img-top" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/></img>
						  </div>
					   </div>`
				});
			} catch (error) {
			 
			  
			}
			
			
		template+=`</div>
        <h2 class="featurette-heading">`+listeProcess.titre+`</span></h2>
        <p class="lead">`+listeProcess.description+`</p>
      </div>
      <div class="col-md-5 `;
			if(listeProcess.position%2 == 0)
              {
                     template+=`order-md-2`;
					 
              }
              else
              {
                     template+=`order-md-1`;
              }
	  
	  template+=`">
        <img src= `+listeProcess.imageUrlEtape+` class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img"  preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"/></img>
      </div>
    </div>
	
	<hr class="featurette-divider">
	  `
	
	var listeDesEtapes = document.getElementById('listeDesEtapes');
	listeDesEtapes.insertAdjacentHTML('beforeend', template);
 

}

function dateFormat(){
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1; // Months start at 0!
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const formattedToday = dd + '/' + mm + '/' + yyyy;
	
	return formattedToday;
}


					
