chrome.runtime.onMessage.addListener(function (data, sender, callback) {
	//console.log('data', data);
	switch(data.action){
		//needs permission to do it
		case 'injectJs':
			//console.log('clicke',sender, chrome.runtime.getURL('js/rank-reciever.js'));
 			injectTabWrp(sender);
			
			//console.log(sender.tab, sender.tab.id);
			break;
		case 'injectJsDelayed':
			//console.log('clicke',sender, chrome.runtime.getURL('js/rank-reciever.js'));
 			setTimeout(function(){

 				injectTabWrp(sender);
 			},2000);
			
			//console.log(sender.tab, sender.tab.id);
			break;

		case 'checkIfNeedRating':
			///console.log('clicke',tab.id, chrome.runtime.getURL('js/rank-reciever.js'));
			callback(!localStorage.getItem('rankRequested'));
			break;
		case 'rankRequested':
			localStorage.setItem('rankRequested', 1);
			break;
	}
});
function injectTabWrp(sender){
	if(!sender.tab){
		injectJsCurrentTab();
	 }
	 else{
		injectJs(sender.tab);
	 }
}
function injectJsCurrentTab(){
	chrome.tabs.query( { active: true, currentWindow: true }, function(tabs){
		//console.log(tabs[0]);
		injectJs(tabs[0]);
	});
}
function injectJs(tab){
	//console.log(tab)
	if(tab){
		chrome.tabs.executeScript(tab.id,{file:'js/extention-data.js'});
		chrome.tabs.executeScript(tab.id,{file:'js/show-popup.js'}, function(){
			chrome.tabs.executeScript(tab.id,{code:"checkIfRankNeededAndAndAddRank()"})
		});
	}
}

chrome.runtime.setUninstallURL(`https://1ce.org?action=remove&ext=1click-history-stats`);

if (!localStorage.getItem('created')) {
  chrome.tabs.create({ url: `https://1ce.org?action=install&ext=1click-history-stats` });
  var manifest = chrome.runtime.getManifest();
  localStorage.setItem('ver', manifest.version);
  localStorage.setItem('created',1);
}