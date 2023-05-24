var urlUserData = database.ref('/users/' + userId);
var urlUserName = database.ref('users/' + userId + '/username');

function setUserData(name, email) {
	urlUserData.set({
		username: name,
		email: email
	});
}

function getUserData() {
	return urlUserData.once('value').then((snapshot) => {
	  displayName = (snapshot.val() && snapshot.val().username) || 'Anonymous';
	});
}

//Update on change
urlUserName.on('value', (snapshot) => {
  const data = snapshot.val();
  document.getElementById("userName").textContent=data;
});

//Load one time
urlUserName.once('value').then((snapshot) => {
  document.getElementById("userName").textContent = ( snapshot.val()) || 'Anonymous';
});