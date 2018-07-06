if('undefined' == typeof setted){
	setted = true;
	document.body.addEventListener('click', function(){

		chrome.runtime.sendMessage({action: "getStats"}, function(data){
				console.log(data);
				})
	});
}