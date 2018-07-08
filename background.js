
setInterval(checkBrowserFocus, 1000);  
activeUrl = null, lastUpdated = null;
allUrls = getEntries();
function checkBrowserFocus(){
    addEntry();
    chrome.windows.getCurrent(function(browser){

      if(!browser.focused){
        stopWatching();
      }

    })

}

function saveEntries(allUrls){
  localStorage.setItem('historyStats', JSON.stringify(allUrls));
}

function getEntries(){
  let items;
  try{
    items = JSON.parse(localStorage.getItem('historyStats'));
  }
  catch(e){
    //items = {};
  }
  return items ? items : {};
}

function addEntry(){
  if(activeUrl){
    addEntryTouUrl(activeUrl);
  }
}

function addEntryTouUrl(activeUrlToAdd){
  if(!allUrls[activeUrlToAdd]){
    allUrls[activeUrlToAdd] = 0;
  }
  let now = new Date().getTime();
  allUrls[activeUrlToAdd] += now - lastUpdated ;
  lastUpdated = now;
  saveEntries(allUrls);
}

function startWatchingActive(){
  chrome.tabs.query( { active: true, currentWindow: true }, function(tabs){
      if(tabs && tabs.length){
        startWatching(tabs[0]);
      }
    });
}

function startWatching(tab){
  if(tab.url){
    //chrome.tabs.executeScript(tab.id,{file : 'js/added.js'});

    let origin = tab.url.match('https?:\/\/.+?/');
    origin = origin && origin.length ? origin[0].replace(/\/$/,'') : '';
    //console.log('startWatching',origin);
    if(origin){
       lastUpdated = new Date().getTime();
      activeUrl = origin;
    }
    else{

      stopWatching();
    }
  }
}
function stopWatching(){
  activeUrl = null;
  lastUpdated = null;
  console.log('stopWatching');
}

chrome.tabs.onCreated.addListener(function(tab){
  startWatching(tab);
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  startWatching(tab);
});
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  stopWatching()
});
chrome.tabs.onHighlighted.addListener(function(data){
  //console.log(data, 'onHighlighted');
  if(data.windowId != chrome.windows.WINDOW_ID_NONE){
    startWatchingActive();
  }
});
chrome.windows.onFocusChanged.addListener(function(windowId){
  if(windowId == chrome.windows.WINDOW_ID_NONE){
    stopWatching();
  }
  else{
startWatchingActive();
  }
});


chrome.runtime.onMessage.addListener(function (data, sender, callback) {
  //console.log(data)
  if("getStats" == data.action ){
    callback({stats:allUrls, lastUpdated:lastUpdated,activeUrl:activeUrl});
  }
  
  
});