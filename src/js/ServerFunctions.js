var http = require("http");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var XML = require('pixl-xml');
var parseString = require('xml2js').parseString;


function SteamMiner(){	

	//get all what we need
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
				if(response.playerstats.achievements != undefined){
					// for(achieve in response.playerstats.achievements){
					// 	console.log(' iside achiev ' + JSON.stringify(response.playerstats.achievements[0].achievement));	
					// }
					var count = response.playerstats.achievements[0].achievement.length;
					//console.log( "number of achievents " + count);

				}
				callback(count, currentUserUrl );
			});

		});
	}

	//parsing returned xml file
	function XMLparse(res,callback){

		JSON.stringify(""+res);

		var bodyChunks = [];
		    res.on('data', function(chunk) {
		    bodyChunks.push(chunk);
		    }).on('end', function() {
			    var body = Buffer.concat(bodyChunks);
				parser.parseString(body, function (err, result) {
	
					//console.log(""+result);

					//console.log(" WHELL! " +  JSON.stringify(result));
					var response = JSON.parse(JSON.stringify(result));
				    callback(response);

			});
		});		
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


	this.getUser64ID = function(applicationKey,Url, callback) {
		//console.log(Url);


		var userID = Url.match('/profiles.(.*)/');
		if( userID == null ){
			var userID = Url.match('/id.(.*)/s');

			http.get('http://steamcommunity.com/id/'+userID+'/profile?tab=all&xml=1', function( res ) {
				XMLparse(res, function( response ){
				    var steamID = response['profile']['steamID64'];
				    callback(steamID);

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