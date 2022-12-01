var vcontrol = require('../repo/gui/js/layouts/view-controller.js');
var vgtables = require('../repo/gui/js/modules/vg-tables.js');
var appset = require('../../app/settings.json');

var {ObjList}=require('../repo/tools/box/vg-lists.js');

var { FilterForm } = require('./filter-form.js');
var { TrackerForm } = require('./tracker-form.js');

var sumtracker = require('./sumtracker.js');
var {GETtlist}= require('..//RRT-requests.js');

var molist = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var monum = ['01','02','03','04','05','06','07','08','09','10','11','12'];
var today = new Date();
var asumtracker = null;
var index = 0;
var currtab = '';

var tableheaders = {
      estimator: "CONSULTANT",
      client: "CLIENT NAME",
      date: "DATE",
      zip: "ZIP",
      saletype: "SALE TYPE",
      amount: "AMOUNT"
}

var tablemap = {
    MAIN:(r=null)=>{
        if(!r||r==undefined){console.log(r);r={}}
        return{
        estimator:r.estimator||'',
        client:r.client||'',
        date:r.date||'',
        zip:r.zip||'',
        saletype:r.saletype||'',
        amount:r.amount||''

        }
    }
}

var CREATEviews=(user)=>{ // Creates monthly views via tabbed view
    let moblock = document.getElementById('tracker-view-cont');
    vcontrol.SETUPviews(moblock,'mt');

    var mocont = document.createElement('div');   //creates CarryOver Tab
    mocont.id = 'CO';
    var v = vcontrol.ADDview('CO',mocont,moblock,false);
    v.appendChild(document.createElement('div'));
    v.lastChild.classList.add('monthly-metrics');
    v.appendChild(document.createElement('div'));
    v.lastChild.classList.add(vgtables.gtdom.table);
    FILLtab(mocont.id, user);

    for(let m in molist){   //loops to create Monthly Tabs and adds Lists as Tables
      mocont = document.createElement('div');
      mocont.id = molist[m];
      v = vcontrol.ADDview(molist[m],mocont,moblock,false);
      v.appendChild(document.createElement('div'));
      v.lastChild.classList.add('monthly-metrics');
      v.appendChild(document.createElement('div'));
      v.lastChild.classList.add(vgtables.gtdom.table);
      FILLtab(mocont.id, user);
    }
    moblock.getElementsByClassName(vcontrol.vcdom.menu.cont)[0].children[0].children[today.getMonth() + 1].click(); //fires a click event to activate this month's tab
}

var CREATEsumtable=(data,label)=>{  // Creates a basic Summary Table
    let tabcont = document.createElement('div');
    tabcont.classList.add('metrics-table-'+label);
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.classList.add('metrics-header');
    tabcont.lastChild.innerText = label;

    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = 'Leads';
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = data.leads;
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = 'Revenue';
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = data.rev;
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = 'Wins';
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = data.wins;
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = 'RpO';
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = data.rpo;
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = 'Close%';
    tabcont.appendChild(document.createElement('div'));
    tabcont.lastChild.innerText = data.close;

    return tabcont;
}

var FILLtab=(tab, user)=>{  // Fills each tab with proper table
    let list={vhc:[],bee:[],comb:[]};
    if(tab == 'CO'){
        for(let i=1;i<10;i++){  //loops through last nine years to create CarryOver List
            year = today.getFullYear() - i;
            list=sumtracker.GENlists(list,asumtracker,year);
        }
    }else{
        for(let m in molist){
            if(molist[m]==tab){
                list=sumtracker.GENlists(list,asumtracker,today.getFullYear()+'-'+monum[m]+'-');
            }
        }
    }

    let cont = document.getElementById(tab).getElementsByClassName(vgtables.gtdom.table)[0];
    cont.innerHTML = '';
    vgtables.BUILDdistable([].concat(tableheaders,list.comb),cont,true,'tracker-row',tablemap['MAIN']);

    cont = document.getElementById(tab).getElementsByClassName('monthly-metrics')[0];

    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.vhc),'Vogel'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.bee),'BEE'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.comb),'Total'));
}

var FILLtop=(user)=>{  // Fills top summary sections
    let list={vhc:[],bee:[],comb:[]};
    let cont = document.getElementById('report-area-metrics-yearly');
    list = sumtracker.GENlists(list,asumtracker);

    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.vhc),'Vogel'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.bee),'BEE'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.comb),'Total'));
}
//// Popups //////////////////////////////////////////////////////////////
var droplist = {
  cat:[],
  source:[],
  comp:[],
  time:[],
  prstvia:[],
  saletype:[]
}

for(let list in droplist){
  for(let c in appset.reporting[list]){droplist[list].push(c);}
}
var editform = new TrackerForm(document.createElement('div'),droplist);
document.getElementById('preview-popup').appendChild(editform.cont);

var filterform = new FilterForm(document.createElement('div'),droplist);  // Creates filter form contianer
document.getElementById('filter-popup').appendChild(filterform.cont);


////////////////////////////////////////////////////////////////////////

var SETsumtracker=(array)=>{
  if(asumtracker){asumtracker.SETlist(array);}
  else{asumtracker = new ObjList(array);}
}

var EDITtracker=(lrow=null)=>{
  if(lrow){
    for(let i=0;i<asumtracker.list.length;i++){
      if(asumtracker.list[i].client == lrow.children[1].innerText){
        index = i;
        currtab = lrow.parentNode.parentNode.id;
        break;
      }
    }
    console.log(asumtracker.list[index])
    editform.loadform(asumtracker.list[index]);
  }else{editform.loadform(undefined);}
  floatv.SELECTview(document.getElementById('preview-center'),'Lead Overview');//open lead preview
}

var SETUPuseryear = (user=null)=>{
  return new Promise((resolve,reject)=>{
    GETtlist(user).then(
      data=>{
        console.log(data.body.result);
        SETsumtracker(data.body.result);
        CREATEviews(appuser);
        FILLtop(appuser);
        return resolve(data.body.result);
      }
    );
  })
}



module.exports={
  SETUPuseryear,
  EDITtracker
}
