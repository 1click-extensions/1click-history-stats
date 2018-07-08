function sortNumber(a,b) {
    return a - b;
}

function toHHMMSS(num) {
    var sec_num = num/1000;//parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    return twoDigits(hours)+':'+twoDigits(minutes)+':'+twoDigits(seconds);
}




function twoDigits(str){
    str = '' + str;
    return str.length > 1 ? str : '0' + str;
}

function addStats(){
    addWatch();
    $('body').removeClass('no-permissions');
    $('h2').text(chrome.i18n.getMessage('browsing_statistics'));
    chrome.runtime.sendMessage({action: "getStats"}, function(data){

        $('.times').empty();
        $('.time').append('<div>activeUrl: ' + data.activeUrl + ' </div>');
        $('.time').append('<div>lastUpdated: ' + data.lastUpdated + ' </div>');
        let dataPerTime = {},   
            times = [];
        for(let url of Object.keys(data.stats)){
            dataPerTime[Number(data.stats[url])] = url;
            times.push(Number(data.stats[url]));
        }
        let newOrder = times.sort(sortNumber).reverse();
        let html = '';
        for(let i =0; i <  times.length; i++){
            let timeNum = times[i],
                timeStr = toHHMMSS(timeNum),
                url = dataPerTime[timeNum].replace(/'|"/g,'');
            if(timeNum &&  '00:00:00' != timeStr ){        
               html += '<div class="entry"><a class="url" target="_blank" href="' + url + '">' + url + '</a><span class="time">' + timeStr + '</span></div>';
            }


        }
        if(!html){
            html = '<div class="no-data">' + chrome.i18n.getMessage('no_data') + '</div>';
        }
        $('.times').html(html);
    });
}

function addWatch(){
    let current = localStorage.getItem('watches');
    current = current ? Number(current) : 0;
    current++;
    localStorage.setItem('watches', current);
    if(current > 3){
        chrome.runtime.sendMessage( {action: 'injectJs'});
    }
}

chrome.permissions.contains({
    permissions: ['tabs']},function(status){
        if(status){
            addStats();
        }
        else{
            $('body').addClass('no-permissions');
            $('.times').append('<div class="explain">' + chrome.i18n.getMessage('permissions_explain') + '</div><button class="button"></button>');
            $('.times button').text(chrome.i18n.getMessage('permissions_grant')).click(function(){
                chrome.permissions.request({
                permissions: ['tabs']},function(status){
                    if(status){
                        addStats();
                    }
                    else{
                        alert(chrome.i18n.getMessage('permissions_cant'))
                    }
            });
            });
        }
    });
