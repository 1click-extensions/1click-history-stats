chrome.runtime.sendMessage({action: "getStats"}, function(data){

    console.log(data);
    $('.times').empty();
    $('.time').append('<div>activeUrl: ' + data.activeUrl + ' </div>');
    $('.time').append('<div>lastUpdated: ' + data.lastUpdated + ' </div>');
    for(let url of Object.keys(data.stats)){
        var time = twoDigits(Math.floor(data.stats[url] / (1000 * 60 ))) + ':' + twoDigits(Math.floor(data.stats[url] / (1000 ))%60);
        $('.times').append('<div class="entry"><span class="url">' + url + '</span><span class="time">' + time + '</span></div>')
    }
});

$('h2').text(chrome.i18n.getMessage('browsing_statistics'));
function twoDigits(str){
    str = '' + str;
    return str.length > 1 ? str : '0' + str;
}
