var {ipcRenderer}=require('electron');

var appset = require('../app/settings.json');
var RROOT='../bin/repo/';
var Titlebar = require('../bin/repo/gui/js/modules/vg-titlebar.js');
var {aappuser} = require('../bin/repo/ds/users/vogel-users.js');
var vcontrol = require('../bin/repo/gui/js/layouts/view-controller.js');

var {navroutes}=require('../bin/routes.js');
var {usersls}=require('../bin/gui/storage/lstore.js');

var sumtracker = require('../bin/back/qtrack-metrics.js');
const {GETtlist} = require('../bin/back/RRT-requests.js');

//  TITLE BAR //
try{
  var appuser = JSON.parse(localStorage.getItem(usersls.curruser)).uname;
  document.getElementById(Titlebar.tbdom.info.username).innerText = appuser;
  document.getElementById(Titlebar.tbdom.title).innerText = 'Lead Tracker - Commissions View';
}catch{}

let qactions={
  back:{
    id:'back-to-main',
    src:'../bin/repo/assets/icons/angle-double-left.png'
  },
}
let qalist=Titlebar.CREATEactionbuttons(qactions);

Titlebar.ADDqactions(qalist);

document.getElementById(Titlebar.tbdom.page.user).addEventListener('click',(ele)=>{//GOTO LOGIN
  ipcRenderer.send(navroutes.gotologin,'Opening Login Dash...');
});

document.getElementById(qactions.back.id).addEventListener('click', (ele)=>{
  ipcRenderer.send('back-to-main', 'Switching to Main Page...');
});

var CREATEcommissions=()=>{
    let cblock = document.getElementById('commish-view-cont');

    vcontrol.SETUPviews(cblock,'mt');

    let tempblock = null;
    for(let key in appset.users){
        if(appset.users[key].group == "CONS"){
            tempblock = document.createElement('div');
            block = tempblock.appendChild(document.getElementById('commish-table-temp').cloneNode(true));
            block.id = '';

            let list={vhc:[],bee:[],comb:[]};
            list = sumtracker.GENlists(list,key);
            let metrics = sumtracker.GENcommish(list.comb);

            console.log(metrics);

            for(let key in metrics.commish){
              if(key != "other"){
                for(let bit in metrics.commish[key]){
                    block.getElementsByClassName(`${key}-${bit}`)[0].innerText = metrics.commish[key][bit];
                }
              }
            }

            block.getElementsByClassName(`comm-stotal`)[0].innerText = metrics.commsub;
            block.getElementsByClassName(`dr-sales`)[0].innerText = metrics.direct.sales;
            block.getElementsByClassName(`dr-rate`)[0].innerText = (metrics.direct.rate * 100) + '%';
            block.getElementsByClassName(`dr-comm`)[0].innerText = metrics.direct.comm;
            block.getElementsByClassName(`spec-sales`)[0].innerText = metrics.spec.sales;
            block.getElementsByClassName(`spec-rate`)[0].innerText = (metrics.spec.rate * 100) + '%';
            block.getElementsByClassName(`spec-comm`)[0].innerText = metrics.spec.comm;
            block.getElementsByClassName(`bp-percent`)[0].innerText = metrics.book.percent + '%';
            block.getElementsByClassName(`bp-rate`)[0].innerText = (metrics.book.rate * 100) + '%';
            block.getElementsByClassName(`bp-comm`)[0].innerText = metrics.book.comm;
            block.getElementsByClassName(`comm-total`)[0].innerText = metrics.comm;

            block.getElementsByClassName(`bee-rev`)[0].innerText = metrics.env;
            block.getElementsByClassName(`bee-rate`)[0].innerText = metrics.beerate;
            block.getElementsByClassName(`bee-commish`)[0].innerText = metrics.beecommish;

            block.getElementsByClassName(`total-commish`)[0].innerText = metrics.comm + metrics.beecommish;

            vcontrol.ADDview(appset.users[key].name,tempblock,cblock,false);
        }
    }
}

GETtlist(appset.users[appuser].group!='MAN'?appset.users[appuser].name:undefined).then(
  data=>{
    console.log(data.body.result);
    creator.SETsumtracker(data.body.result);
    CREATEcommissions();
  }
);
