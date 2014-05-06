module.exports  = function(router, auth, Item) {
	router.route('/items')
		.post(auth.requireLogin, function(request, response) {
			var item = new Item();
			item.userId = request.user._id;
			item.name = request.body.name;

			item.save(function(error) {
				if(error) {
					response.send(error);
				}
			});
		})
		.get(auth.requireLogin, function(request, response) {
			Item.find({userId: request.user._id}, function(error, items) {
				if(error) {
					response.send(error);
				}
				response.json(items);
			});
		});
};