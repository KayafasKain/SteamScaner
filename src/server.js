var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;
	var http = require("http");
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser();
	var SteamMiner = require('./js/ServerFunctions.js');

	//user serve function
	function executeUser(socket, profUrl, applicationKey, callback){

		SteamMiner['SteamMiner'].getUser64ID(applicationKey, profUrl, function(steamID, userID){

			//get account summaries
			console.log(userID);
			if (userID != null) {
				console.log("  by superid!");
				SteamMiner['SteamMiner'].GetAccountSummariesByID(userID, profUrl, function( AccountSummarise ){
					socket.emit('outputAccountSummaries', [AccountSummarise]);
				});
			}else{
				SteamMiner['SteamMiner'].GetAccountSummaries(steamID, profUrl, function( AccountSummarise ){
					socket.emit('outputAccountSummaries', [AccountSummarise]);
				});
			}

			//get community achievements https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=CFCF2E5C7B55E558C6A60924B99D31FE&format=xml&steamid=76561198073438638
			SteamMiner['SteamMiner'].getCommunitySummaries(applicationKey, steamID, profUrl, function( CommunitySummaries ){
				socket.emit('outputCommunitySummaries', CommunitySummaries);
			});			


			//quering game info and achievements
			SteamMiner['SteamMiner'].GetOwnedGames(applicationKey,steamID,profUrl,function( ownedGames, currentUserUrl, steam64ID){

				//calculate and send games/hours played ratio
					var playedHours = 0;
					for(var i = 0; i < ownedGames.response.game_count; i++){
						playedHours += ownedGames.response.games[0].message[i].playtime_forever;
					}

					var gamePlayed = {
						GameCount: ownedGames.response.game_count,
						TotalHoursPlayed: playedHours
					}

					socket.emit('outputGamePlayedInfo', [gamePlayed]);

				//calculate and send achievements count 
					for(var i = 0; i < ownedGames.response.game_count; i++){
						var appid = ownedGames.response.games[0].message[i].appid;

						SteamMiner['SteamMiner'].sendAchieventCount(appid, applicationKey, steam64ID, currentUserUrl, function(count, curUserUrl ){

							var sendObject = {
								curUserUrl: curUserUrl,
								GameAchievementsCount: count
							};
							
							socket.emit('outputAchieveCount', [sendObject]);

						});
					}

			});

		});
		var message = "user executed!";
		callback(message);
	}



	var applicationKey = "CFCF2E5C7B55E558C6A60924B99D31FE";

	console.log("server turns up!");
	client.on('connection', function(socket){

		console.log('Connection spoted!');
		socket.on('input',function(data){

			//profUrl = 'http://steamcommunity.com/id/mfguy';
			var firstURL = data.firstURL;
			var secondURL = data.secondURL;

			console.log("process begin...");
			console.log("first url is: "+firstURL);
			console.log("second url is: "+secondURL);
			//executing first user
			executeUser(socket, firstURL, applicationKey, function( message ){
				console.log( message );
			});

			// //executing second user
			// executeUser(socket, secondURL, applicationKey, function( message ){
			// 	console.log( message );
			// });

		});

});