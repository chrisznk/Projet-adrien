function writeUserData(userId, name, email, imageUrl) {
	const db = getDatabase();
	set(ref(db, 'users/' + userId), {
	username: name,
	email: email,
	codeentreprise : codeentreprise
	});
}