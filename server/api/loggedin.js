module.exports  = function(router) {
	router.get('/loggedin', function(request, response) {
		response.send(request.isAuthenticated() ? request.user : '0');
	});
};