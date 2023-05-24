//Initialisation des listes de selection
$(document).ready(function() {
    $('#listeSelectEquipement').multiselect({
          enableHTML: true
    });
	
	$('#listeSelectLigne').multiselect({
          enableHTML: true
    });
	
	updateAffichageProcessFonction();
});


document.getElementById("listeSelectEquipement").hidden = true;
document.getElementById("listeSelectLigne").hidden = true;



//Liste des selecteurs et listeners
creerNouveauProcess = document.getElementById("creerNouveauProcess");

//Listeners
creerNouveauProcess.addEventListener("click", creerNouveauProcessFonction);


//Liste des fonctions  userId


function creerNouveauProcessFonction() {
	
	creerNouveauProcessDataFonction();
		  
		  

	$('#CreerProcessModal').modal('hide');
}


function creerNouveauProcessDataFonction() {
  titreProcess =document.getElementById("TitreProcess").value;
  descriptionProcess  =document.getElementById("DescriptionProcess").value;
  dureeProcess  =document.getElementById("dureeProcess").value;
  listeEquipement = $('#listeSelectEquipement').val()
  listeLigne = $('#listeSelectLigne').val()
  
  //Reception du nombre de valeurs
  firebase.database().ref('procedures').once('value').then((snapshot) => {
		  var position=1;
		  const data = snapshot.val();
		  
		  try {
		    position +=Object.keys(data.etapes).length;
		  } catch (error) {
		    //console.error(error);

		  }
		  
		  
		  //Ajout Etape
		  firebase.database().ref('procedures/').push({
			titre: titreProcess,
			description: descriptionProcess,
			dureeProcess: dureeProcess,
			listeLigne: listeLigne,
			listeEquipement: listeEquipement,
			position: position,
			datecreation:dateFormat()
		  });
		  
		  //Actualisation de l'affichage
		  updateAffichageProcessFonction();
	 
  });

}
function updateAffichageProcessFonction() {
	
	purgerAffichage(document.getElementById("listeDesProcess"));
	//Reception des étapes
		firebase.database().ref('procedures').once('value').then((snapshot) => {
		  
		  const etapes = snapshot.val();
		  
		  snapshot.forEach(element => affichageProcessFonction(element.val(),element.key));
	 
  });
}


function purgerAffichage(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function focusProcess(variable) {
    localStorage.setItem('ProcessFocus', variable);
	console.log(localStorage.getItem('ProcessFocus'));
	document.location.href="Process.html"; 
}

function affichageProcessFonction(listeProcess,processKey) {
	console.log(listeProcess.description)
	var template = `
						<!-- Area Chart -->
							
								<div class="card shadow mb-4 card border-left-primary">
									<!-- Card Header - Dropdown -->
									<div
										class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
										<h6 class="m-0 font-weight-bold text-primary">
											<h2 class="featurette-heading">`+listeProcess.titre+`</h2>
										</h6>
										<div class="dropdown no-arrow">
											<a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
												data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
											</a>
											<div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
												aria-labelledby="dropdownMenuLink">
												<div class="dropdown-header">Action:</div>
												<a class="dropdown-item" href="#" onclick="focusProcess('`+processKey+`')">Modifier</a>
												<a class="dropdown-item" href="#">Supprimer</a>
											</div>
										</div>
									</div>
									<!-- Card Body -->
									<div class="card-body">
										<div class="row featurette">
										  <div class="col-md-10 order-md-2">
											<div class="p-3 mb-2 bg-warning text-white">
												Element à vérifier
											</div>
											<p class="font-italic">Crée par Christophe Pauly le 23/05/2023</p>
											<p class="lead">`+listeProcess.description+`</p>
										  </div>
										  <div class="col-md-2 order-md-1">
										     <img  class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="200" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#eee"/></img>
										  </div>
										</div>
									</div>
								</div>
							
	  `
	
	var listeDesProcess = document.getElementById('listeDesProcess');
	listeDesProcess.insertAdjacentHTML('beforeend', template);
 

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


					
