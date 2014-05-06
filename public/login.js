function LoginController($scope, $http) {
	$scope.loggedIn = false;
	$scope.name = "";
	$scope.photoUrl = "";

	var refresh = function() {
		$http.get("/api/loggedin", {withCredentials: true})
			.success(function(user, status, headers, config) {
				console.log("logged in user: ");
				console.log(user);
				if(user != 0) {
					$scope.loggedIn = true;
					$scope.name = user.name;
					$scope.photoUrl = user.photoUrl;
				}
				else {
					$scope.loggedIn = false;
				}
			});
	};
	refresh();
}