
    /**
     * Handles the sign in button press.
     */
    function toggleSignOut() {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      }
    }



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
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          console.log( JSON.stringify(user, null, '  '));
		  
		  
          //if (!emailVerified) {
            //document.getElementById('quickstart-verify-email').disabled = false;
          //}
        } else {
          // User is signed out.
		  window.location = 'app-auth.html'
        }
     
      });

      document.getElementById('quickstart-sign-out').addEventListener('click', toggleSignOut, false);
      
    }

    window.onload = function() {
      initApp();
    };