var http = require("http");
var https = require("https");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var XML = require('pixl-xml');
var parseString = require('xml2js').parseString;


function SteamMiner(){	


	//profile info, returns object which contains avatar, nickname etc.
	this.getCommunitySummaries = function(appKey, steamID, profileUrl, callback){
		//https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=CFCF2E5C7B55E558C6A60924B99D31FE&steamid=76561198073438638&format=xml
		console.log("key: "+appKey + " 65id: " + steamID );
		http.get('http://api.steampowered.com/IPlayerService/GetBadges/v1/?key='+appKey+'&steamid='+steamID+'&format=xml', function( res ) {
			console.log("res   " + res);
			XMLparse(res, function( response ){


				//console.log("dasd "+response['response']['player_xp']);

			    CommunitySummaries = {
			    	player_xp: response['response']['player_xp'],
			    	player_level: response['response']['player_level'],
			    	Realname: response['response']['realname'],
			    	UserUrl: profileUrl

			    };

			    callback(CommunitySummaries);

			});


		});


	} 

	//returns object vith a main account summaries
	this.GetAccountSummaries = function(steamID, profileUrl, callback){

			http.get('http://steamcommunity.com/profiles/'+steamID+'/profile?tab=all&xml=1', function( res ) {
				XMLparse(res, function( response ){
				    var steamID = response['profile']['steamID64'];

				    console.log("name:  "+response['profile']['steamID']);
				    AccountSummarise = {
				    	id64: response['profile']['steamID64'],
				    	UserName: response['profile']['steamID'],
				    	Realname: response['profile']['realname'],
				    	Avatar: response['profile']['avatarFull'],
				    	MemberSince: response['profile']['memberSince'],
				    	UserUrl: profileUrl

				    };

				    callback(AccountSummarise);

				});


			});


	}

	this.GetAccountSummariesByID = function(userUrl, profileUrl, callback){

			http.get('http://steamcommunity.com/id/'+userUrl+'/profile?tab=all&xml=1', function( res ) {
				XMLparse(res, function( response ){
				    //var steamID = response['profile']['steamID64'];

				   //console.log("name:  "+response['profile']['steamID']);
				    AccountSummarise = {
				    	id64: response['profile']['steamID64'][0],
				    	UserName: response['profile']['steamID'],
				    	Realname: response['profile']['realname'][0],
				    	Avatar: response['profile']['avatarFull'],
				    	MemberSince: response['profile']['memberSince'][0],
				    	UserUrl: profileUrl

				    };

				    callback(AccountSummarise);

				});


			});


	}	


	//get all game info what we need
	this.GetOwnedGames = function(appKey, steam64ID, currentUserUrl ,callback) {

		//console.log(" request " + 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+appKey+'&steamid='+steam64ID+'&format=xml');

	    http.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+appKey+'&steamid='+steam64ID+'&format=xml', function(res){
	    	//get the list of the owned games
			XMLparse(res,function(response){
				var ownedGames = response;
				callback(ownedGames, currentUserUrl, steam64ID );
			});

		});

	}

	//calc the count of achievements
	this.sendAchieventCount = function(appid, key, steam64ID, currentUserUrl, callback){
	    http.get('http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid='+appid+'&key='+key+'&steamid='+steam64ID+'&format=xml', function(res){
			XMLparse(res,function( response ){
				var count = 0;
				if(response.playerstats != undefined){
					if(response.playerstats.achievements != undefined){
						// for(achieve in response.playerstats.achievements){
						// 	console.log(' iside achiev ' + JSON.stringify(response.playerstats.achievements[0].achievement));	
						// }
						var count = response.playerstats.achievements[0].achievement.length;
						//console.log( "number of achievents " + count);

					}
				}
				callback(count, currentUserUrl );
			});

		});
	}

	parser.setMaxListeners(400);
	//parsing returned xml file
	function XMLparse(res, callback){
		//console.log("answer to parse: "+res);	
		try{
			var bodyChunks = [];
			    res.on('data', function(chunk) {
			    bodyChunks.push(chunk);
			    }).on('end', function() {
				    var body = Buffer.concat(bodyChunks);
					parser.parseString(body, function (err, result) {
						//console.log("pasr  " + JSON.stringify(result));

						var response = JSON.parse(JSON.stringify(result));
					    callback(response);

				});
			});
		}catch(err){
			var errorMessage = "unable to find user data";
			console.log(errorMessage);
		}

	}	


	//to clone the object
	function clone(x)
	{
	    if (x === null || x === undefined)
	        return x;
	    if (x.clone)
	        return x.clone();
	    if (x.constructor == Array)
	    {
	        var r = [];
	        for (var i=0,n=x.length; i<n; i++)
	            r.push(clone(x[i]));
	        return r;
	    }
	    return x;
	}

	//quering 64 id from the user account
	this.getUser64ID = function(applicationKey,Url, callback) {
		console.log("getted url: "+Url);

		var match64 = new RegExp(/profiles.(.*)/);
		var matchID = new RegExp(/id.(.*)/);


		var userID = Url.match(match64);
		console.log("ID 64 " + userID);
		if( userID == null ){
			var userID = Url.match(matchID);

			console.log("ID simple "+userID);
			console.log("parsed")

			http.get('http://steamcommunity.com/id/'+userID[1]+'/profile?tab=all&xml=1', function( res ) {
				XMLparse(res, function( response ){
				    var steamID = response['profile']['steamID64'];
				    var userID = response['profile']['customURL'];
	
				    callback(steamID, userID);

				});


			});


		}else{
			
			var steamID = userID[1];
			callback(steamID);

		}

	    //callback(userID);
	};

}

var mySteam = new SteamMiner();

exports.SteamMiner =  mySteam;