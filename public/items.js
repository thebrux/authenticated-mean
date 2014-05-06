function ItemsController($scope, $http) {
  $scope.items = [];
  $scope.newName = "";
 
  var refresh = function() {
	  $http.get("/api/items").success(function(items){
	  	$scope.items = items;
	  });
  }
  refresh();
 
  $scope.add = function() {
	  if($scope.newName === "") return;

	  $http.post("/api/items", {name: $scope.newName});
	  $scope.newName = "";
	  
	  refresh();
  };
}