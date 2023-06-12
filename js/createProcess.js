var processFocus = localStorage.getItem('ProcessFocus');

//Initialisation des listes de selection
$(document).ready(function() {
    $('#listeSelectAction').multiselect({
          enableHTML: true
    });
	
	//$('#listeSelectPicto').multiselect({
    //      enableHTML: true
    //});
	
	updateAffichageEtapesFonction();
});


document.getElementById("listeSelectAction").hidden = true;
//document.getElementById("listeSelectPicto").hidden = true;
document.querySelector("#photoEtape").hidden = true;



//Liste des selecteurs et listeners
creerNouveauEtape = document.getElementById("creerNouveauEtape");

//Listeners
creerNouveauEtape.addEventListener("click", creerNouveauEtapeFonction);


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


function affichageEtapesFonction(listeEtapes) {
	console.log(listeEtapes.description)
	var template = `
						<!-- Area Chart -->
							
								<div class="sortable-item card shadow mb-4 card border-left-primary">
									<!-- Card Header - Dropdown -->
									<div
										class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
										<h6 class="m-0 font-weight-bold text-primary">
											<h2 class="featurette-heading">`+listeEtapes.titre+`</h2>
										</h6>
										<div class="dropdown no-arrow">
											<a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
												data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
											</a>
											<div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
												aria-labelledby="dropdownMenuLink">
												<div class="dropdown-header">Action:</div>
												<a class="dropdown-item" href="#">Modifier</a>
												<a class="dropdown-item" href="#">Supprimer</a>
												<div class="dropdown-divider"></div>
												<a class="dropdown-item" href="#">Créer à la suite</a>
											</div>
										</div>
									</div>
									<!-- Card Body -->
									<div class="card-body">
										<div class="row featurette">
										  <div class="col-md-10 order-md-2">
											<div class="p-3 mb-2 bg-secondary  text-white">
												`+listeEtapes.listeAction+`
											</div>
											<p class="font-italic">Crée par Christophe Pauly le 23/05/2023</p>
											<p class="lead">`+listeEtapes.description+`</p>
										  </div>
										  <div class="col-md-2 order-md-1">
										     <img src="`+listeEtapes.imageUrlEtape+`" class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="200" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#eee"/></img>
										  </div>
										</div>
									</div>
								</div>
							
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


					
