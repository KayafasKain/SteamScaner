var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;
	var http = require("http");
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser();
	var SteamMiner = require('./js/ServerFunctions.js');

	var applicationKey = "CFCF2E5C7B55E558C6A60924B99D31FE";
	console.log("server turns up!");
client.on('connection', function(socket){
	console.log('Connection spoted!');
	socket.on('input',function(data){

		data.profUrl = 'http://steamcommunity.com/id/magnettoman';

		console.log("process begin...");

		SteamMiner['SteamMiner'].getUser64ID(applicationKey,data.profUrl,function( steamID ){
			SteamMiner['SteamMiner'].GetOwnedGames(applicationKey,steamID,data.profUrl,function( ownedGames, currentUserUrl, steam64ID){

				//calculate and send games/hours played ratio
				

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
		

	});

});