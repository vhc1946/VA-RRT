var {ipcRenderer}=require('electron');

var RROOT='../bin/repo/';
var Titlebar = require('../bin/repo/gui/js/modules/vg-titlebar.js');
var {aappuser} = require('../bin/repo/ds/users/vogel-users.js');
var vcontrol = require('../bin/repo/gui/js/layouts/view-controller.js');

var {navroutes}=require('../bin/routes.js');
var {usersls}=require('../bin/gui/storage/lstore.js');

var sumtracker = require('../bin/back/qtrack-metrics.js');


var molist = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var monum = ['01','02','03','04','05','06','07','08','09','10','11','12'];
var today = new Date();

//  TITLE BAR //
try{
  var appuser = JSON.parse(localStorage.getItem(usersls.curruser)).uname;
  document.getElementById(Titlebar.tbdom.info.username).innerText = appuser;
  document.getElementById(Titlebar.tbdom.title).innerText = 'Lead Tracker - Analytics View';
}catch{}

let qactions={
  back:{
    id:'back-to-main',
    src:'../bin/repo/assets/icons/angle-double-left.png'
  },
}

Titlebar.SETUPtitlebar(qactions);

document.getElementById(Titlebar.tbdom.page.user).addEventListener('click',(ele)=>{//GOTO LOGIN
  ipcRenderer.send(navroutes.gotologin,'Opening Login Dash...');
});

document.getElementById('back-to-main').addEventListener('click', (ele)=>{
  ipcRenderer.send('back-to-main', 'Switching to Main Page...');
});

var CREATEanalytics=()=>{  // Creates blank views for analytics
    let ablock = document.getElementById('analytics-view-cont');

    vcontrol.SETUPviews(ablock,'mt');

    let tempblock = document.createElement('div');
    tempblock.classList.add('ana-vhc-sum');
    vcontrol.ADDview('VHC Summary',tempblock,ablock,false);

    tempblock = document.createElement('div');
    tempblock.classList.add('ana-bee-sum');
    vcontrol.ADDview('BEE Summary',tempblock,ablock,false);

    tempblock = document.createElement('div');
    tempblock.classList.add('ana-vhc-monthly');
    vcontrol.ADDview('VHC Monthly',tempblock,ablock,false);

    tempblock = document.createElement('div');
    tempblock.classList.add('ana-bee-monthly');
    vcontrol.ADDview('BEE Monthly',tempblock,ablock,false);
}

var FILLanalytics=(user)=>{  // Fills each analytics view
    document.getElementsByClassName('ana-vhc-sum')[0].innerHTML = '';
    document.getElementsByClassName('ana-vhc-sum')[0].appendChild(CREATEanasummary('vhc',user));

    document.getElementsByClassName('ana-bee-sum')[0].innerHTML = '';
    document.getElementsByClassName('ana-bee-sum')[0].appendChild(CREATEanasummary('bee',user));

    document.getElementsByClassName('ana-vhc-monthly')[0].innerHTML = '';
    document.getElementsByClassName('ana-vhc-monthly')[0].appendChild(CREATEmotable('vhc',user));

    document.getElementsByClassName('ana-bee-monthly')[0].innerHTML = '';
    document.getElementsByClassName('ana-bee-monthly')[0].appendChild(CREATEmotable('bee',user));
}

var CREATEanasummary=(comp, user)=>{    // Creates Overall Summary Analytics tables
    let list={vhc:[],bee:[],comb:[]};
    list = sumtracker.GENlists(list,user);
    let yrana = sumtracker.GENanalytics(list[comp]);

    let spot = document.createElement('div');
    spot.classList.add('overall-ana-cont')
    let cont = spot.appendChild(document.createElement('div'));
    cont.classList.add('overall-ana-table');
    cont.appendChild(document.createElement('div')).innerText = 'Number of Sales Calls';
    cont.appendChild(document.createElement('div')).innerText = yrana.leads;
    cont.appendChild(document.createElement('div')).innerText = 'Sales Calls Won';
    cont.appendChild(document.createElement('div')).innerText = yrana.wins;
    cont.appendChild(document.createElement('div')).innerText = 'Closing Percentage';
    cont.appendChild(document.createElement('div')).innerText = yrana.close;
    cont.appendChild(document.createElement('div')).innerText = 'Revenue per Opportunity';
    cont.appendChild(document.createElement('div')).innerText = yrana.rpo;
    cont.appendChild(document.createElement('div')).innerText = 'Total Revenue';
    cont.appendChild(document.createElement('div')).innerText = yrana.rev;

    if(comp == 'vhc'){
        cont.appendChild(document.createElement('div')).innerText = 'Replacement Revenue';
        cont.appendChild(document.createElement('div')).innerText = yrana.replace;
        cont.appendChild(document.createElement('div')).innerText = `"Project" Revenue`;
        cont.appendChild(document.createElement('div')).innerText = yrana.projects;
        cont.appendChild(document.createElement('div')).innerText = 'IAQ Revenue';
        cont.appendChild(document.createElement('div')).innerText = yrana.opts.iaq.total;
        cont.appendChild(document.createElement('div')).innerText = 'Repair Revenue';
        cont.appendChild(document.createElement('div')).innerText = yrana.opts.repair.total;
        cont.appendChild(document.createElement('div')).innerText = 'Envelope Revenue';
        cont.appendChild(document.createElement('div')).innerText = yrana.env;
    }

    cont = spot.appendChild(document.createElement('div'));
    cont.classList.add('overall-ana-table');
    cont.appendChild(document.createElement('div')).innerText = 'Total Leads';
    cont.appendChild(document.createElement('div')).innerText = yrana.gleads;
    cont.appendChild(document.createElement('div')).innerText = 'Cancelled Leads';
    cont.appendChild(document.createElement('div')).innerText = yrana.gleads - yrana.leads;
    cont.appendChild(document.createElement('div')).innerText = 'Net Leads Ran';
    cont.appendChild(document.createElement('div')).innerText = yrana.leads;

    cont = spot.appendChild(document.createElement('div'));
    cont.classList.add('breakdown-ana-table');
    for(let key in yrana.opts){
        cont.appendChild(document.createElement('div')).innerText = key.toUpperCase();
        cont.appendChild(document.createElement('div')).innerText = yrana.opts[key].count;
        cont.appendChild(document.createElement('div')).innerText = Math.trunc(yrana.opts[key].total / yrana.opts[key].count);
        cont.appendChild(document.createElement('div')).innerText = Math.floor((yrana.opts[key].count / yrana.wins) * 100);
    }


    return spot;
}

var CREATEmotable=(comp,user)=>{  // Creates Monthly Summary Analytics table
    let list={vhc:[],bee:[],comb:[]};
    let analytics = [];
    let spot = document.createElement('div');
    let cont = spot.appendChild(document.createElement('div'));
    cont.classList.add('monthly-ana-table');

    for(let i=1;i<10;i++){  //loops through last nine years to create CarryOver List
        let year = today.getFullYear() - i;
        list=sumtracker.GENlists(list,user,year);
    }
    analytics.CO = sumtracker.GENanalytics(list[comp]);

    for(let m in molist){
        list={vhc:[],bee:[],comb:[]};
        list=sumtracker.GENlists(list,user,today.getFullYear()+'-'+monum[m]+'-');
        analytics[molist[m]] = sumtracker.GENanalytics(list[comp]);
    }

    let row = cont.appendChild(document.createElement('div'));   // creates header row for monthly table
    row.classList.add('monthly-ana-row');
    row.appendChild(document.createElement('div')).innerText = 'MONTH';
    row.appendChild(document.createElement('div')).innerText = 'REVENUE';
    row.appendChild(document.createElement('div')).innerText = 'LEADS';
    for(let y in analytics['CO'].opts){
        row.appendChild(document.createElement('div')).innerText = y.toUpperCase();
    }

    for(let key in analytics){  // creates individual rows for each month
        row = cont.appendChild(document.createElement('div'));
        row.classList.add('monthly-ana-row');
        row.appendChild(document.createElement('div')).innerText = key;
        row.appendChild(document.createElement('div')).innerText = analytics[key].rev;
        row.appendChild(document.createElement('div')).innerText = analytics[key].leads;
        for(let y in analytics[key].opts){
            row.appendChild(document.createElement('div')).innerText = analytics[key].opts[y].total;
        }
    }

    return spot;
}

ipcRenderer.send('get-user-tlist','Analytic request');

ipcRenderer.on('get-user-tlist', (eve,data)=>{
  console.log('Data list>',data.data);

  sumtracker.SETsumtracker(data.data);

  CREATEanalytics();
  FILLanalytics(appuser);
});
