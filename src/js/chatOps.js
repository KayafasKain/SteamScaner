(function(){
	var getNode = function(s){
		return document.querySelector(s);
	},
	//include classes
	messages = getNode('.chat-messages'),
	status = getNode('.chat-status span'),
	textarea = getNode('.chat-textarea'),
	chatName = getNode('.chat-name');

	//connecting
	try {
		var socket = io.connect('http://127.0.0.1:8080');
	} catch(e) {
		alert("connection lost");
	}

	//parse smiles
	//setStatus("T");

	if(socket !== undefined){
		//("all well");

		//listen for output
		socket.on('output', function( data ){
			if(data.length){
				//loop resoults
				for(var x = 0;x < data.length; x = x + 1 ) {

					var message = document.createElement('div');
					message.setAttribute('class', 'chat-message');
					message.textContent = data[x].name + ': ' + data[x].message;

						message.innerHTML = parse_video( parse_img( parse_smile( parse_link( message.textContent ) ) ) );
						//(message);													
		


					messages.appendChild(message);
					messages.insertBefore(message, messages.lastChild );
				}

			}
		});




		//listen for message
		textarea.addEventListener('keydown', function( event ) {
			var self  = this,
				name = chatName.value;

		
			//send message
				if(event.which === 13){
					socket.emit('input',{
						name: name,
						message: self.value
					});
				}


			document.getElementById('messageArea').scrollTop = 9999;
		});
	}
})();