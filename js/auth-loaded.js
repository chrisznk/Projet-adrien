
    /**
     * Handles the sign in button press.
     */
    function toggleSignOut() {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      }
    }

	var displayName;
    var email;
    var emailVerified;
    var photoURL;
    var isAnonymous;
    var uid;
	var userId;
    var providerData;
	var database =firebase.database();

    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
      // Listening for auth state changes.
      firebase.auth().onAuthStateChanged(function(user) {
        //document.getElementById('quickstart-verify-email').disabled = true;
        if (user) {
          // User is signed in.
          displayName = user.displayName;
          email = user.email;
          emailVerified = user.emailVerified;
          photoURL = user.photoURL;
          isAnonymous = user.isAnonymous;
          uid = user.uid;
		  userId = user.uid;
          providerData = user.providerData;
          console.log( JSON.stringify(user, null, '  '));
		  
		  
          //if (!emailVerified) {
            //document.getElementById('quickstart-verify-email').disabled = false;
          //}
        } else {
          // User is signed out.
		  window.location = 'login.html'
        }
     
      });

      document.getElementById('logout').addEventListener('click', toggleSignOut, false);
      
    }

    window.onload = function() {
      initApp();
    };