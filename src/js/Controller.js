
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
		GameCount: 0,
		TotalHoursPlayed: 0,
		GameAchievementsCount: 0,
		HoursPerGame: 0,
		AchievementsPerGame: 0,
		TotalScore: 0		
	}

	DATA.secondUSER = {
		ProfileURL: "",
		player_xp: "",
		player_level: "",
		Realname: "",
		UserName: "",
		Avatar: "",
		MemberSince: "",
		GameCount: 0,
		TotalHoursPlayed: 0,
		GameAchievementsCount: 0,
		HoursPerGame: 0,
		AchievementsPerGame: 0,
		TotalScore: 0
	}
	console.log(DATA.firstUSER.ProfileURL);


	//connecting to the server
	try {
		console.log("connect;")
		var socket = io.connect('http://127.0.0.1:8899');
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

//LISTEN SERVER OUTPUT SECTION =====================================
	if(socket !== undefined){
		console.log("connection stable...");

		//gathering player summeries
		socket.on('outputAccountSummaries', function( data ){			

				switch(data.UserUrl){
					case DATA.firstUSER.ProfileURL:

						DATA.firstUSER.UserName = data.UserName[0];
						DATA.firstUSER.Avatar = data.Avatar[0];
						DATA.firstUSER.MemberSince = data.MemberSince[0];
						DATA.firstUSER.Realname = data.Realname[0];

						break;

					case DATA.secondUSER.ProfileURL:
	
						DATA.secondUSER.UserName = data.UserName[0];
						DATA.secondUSER.Avatar = data.Avatar[0];
						DATA.secondUSER.MemberSince = data.MemberSince[0];
						DATA.secondUSER.Realname = data.Realname[0];						
						break;			
				}

				$scope.$apply();
				DATA.calculateUserScore();
				//console.log(data);

			
		});

		//gathering community player summeries
		socket.on('outputCommunitySummaries', function( data ){			

				switch(data.UserUrl){
					case DATA.firstUSER.ProfileURL:

						DATA.firstUSER.player_xp = data.player_xp[0];
						DATA.firstUSER.player_level = data.player_level[0];

						break;

					case DATA.secondUSER.ProfileURL:
	
						DATA.secondUSER.player_xp = data.player_xp[0];
						DATA.secondUSER.player_level = data.player_level[0];	

						break;			
				}

				$scope.$apply();
				DATA.calculateUserScore();
				//console.log(data);

			
		});

		//gathering games player summeries
			//get hours and games
			socket.on('outputGamePlayedInfo', function( data ){			

					switch(data.UserUrl){
						case DATA.firstUSER.ProfileURL:

							DATA.firstUSER.GameCount = data.GameCount[0];
							DATA.firstUSER.TotalHoursPlayed = data.TotalHoursPlayed;
							DATA.firstUSER.HoursPerGame = DATA.calcHoursPerGame(data.GameCount, data.TotalHoursPlayed);

							break;

						case DATA.secondUSER.ProfileURL:
		
							DATA.secondUSER.GameCount = data.GameCount[0];
							DATA.secondUSER.TotalHoursPlayed = data.TotalHoursPlayed;
							DATA.secondUSER.HoursPerGame = DATA.calcHoursPerGame(data.GameCount, data.TotalHoursPlayed);

							break;			
					}

					$scope.$apply();
					DATA.calculateUserScore();
					//console.log(data);

				
			});

			//get count of achievements per game, total achievements count calculated at the client side
			socket.on('outputAchieveCount', function( data ){			

					switch(data.UserUrl){
						case DATA.firstUSER.ProfileURL:

							DATA.firstUSER.GameAchievementsCount += data.GameAchievementsCount;
							DATA.firstUSER.AchievementsPerGame += DATA.calcAchievementsPerGame(DATA.firstUSER.GameCount, data.GameAchievementsCount);

							break;

						case DATA.secondUSER.ProfileURL:
		
							DATA.secondUSER.GameAchievementsCount += data.GameAchievementsCount;
							DATA.secondUSER.AchievementsPerGame += DATA.calcAchievementsPerGame(DATA.secondUSER.GameCount, data.GameAchievementsCount);

							break;			
					}
					DATA.calculateUserScore();

					$scope.$apply();
					//console.log(data);

				
			});			


	}
//THE END OF THE LISTEN SERVER OUTPUT SECTION =====================================
//CALCULATING AREA ================================================================
	//calculate user HoursPerGame
	DATA.calcHoursPerGame = function(games, hours){
		return (parseInt(hours, 10)/parseInt(games, 10));
	}

	//calculate user achievem
	DATA.calcAchievementsPerGame = function(games, achievements){
		console.log("ach " + achievements + " games " + games);
		return (parseInt(achievements, 10)/parseInt(games, 10));
	}

	//calculate total score !WORKS WITH A GLOBAL VARIABLES!
	//calls in the every listener
	//score calculation formula:
	//TotalScore = player_xp + ((GameCount + TotalHoursPlayed + AchievementsPerGame)*HoursPerGame*AchievementsPerGame)
	DATA.calculateUserScore = function(){
		//calculate first user score
		DATA.firstUSER.TotalScore = DATA.firstUSER.player_xp + ((DATA.firstUSER.GameCount + DATA.firstUSER.TotalHoursPlayed + DATA.firstUSER.AchievementsPerGame)*DATA.firstUSER.HoursPerGame*DATA.firstUSER.AchievementsPerGame);

		DATA.secondUSER.TotalScore = DATA.secondUSER.player_xp + ((DATA.secondUSER.GameCount + DATA.secondUSER.TotalHoursPlayed + DATA.secondUSER.AchievementsPerGame)*DATA.secondUSER.HoursPerGame*DATA.secondUSER.AchievementsPerGame);

	}



});