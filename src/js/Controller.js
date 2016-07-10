
var app = angular.module('myApp', []);
app.controller('Control', function($scope, $http) {
	DATA = this;

	DATA.firstUSER = {
		ProfileURL: "",
		player_xp: "",
		player_level: "",
		Realname: "",
		UserName: "",
		Avatar: "",
		MemberSince: "",
		GameCount: "",
		TotalHoursPlayed: "",
		GameAchievementsCount: ""
	}

	DATA.secondUSER = {
		ProfileURL: "",
		player_xp: "",
		player_level: "",
		Realname: "",
		UserName: "",
		Avatar: "",
		MemberSince: "",
		GameCount: "",
		TotalHoursPlayed: "",
		GameAchievementsCount: ""
	}
	console.log(DATA.firstUSER.ProfileURL);


	//connecting to the server
	try {
		console.log("connect;")
		var socket = io.connect('http://127.0.0.1:8080');
	} catch(e) {
		alert("connection lost");
	}

	DATA.test = function(){
		console.log(DATA.firstUSER.ProfileURL);
		socket.emit('input',{
			firstURL: DATA.firstUSER.ProfileURL,
			secondURL: DATA.secondUSER.ProfileURL
		});			
	}

	if(socket !== undefined){
		console.log("connection stable...");

		//gathering player summeries
		socket.on('outputAccountSummaries', function( data ){			
				// DATA.goods = data;
				// DATA.firstUSER.
				// if(data.)

				$scope.$apply();
				console.log(data);

			
		});

		//gathering orders list from the database
		socket.on('outputOrders', function( data ){			
				DATA.orders = data;
				$scope.$apply();
				console.log(DATA.orders);

			
		});

	}



});