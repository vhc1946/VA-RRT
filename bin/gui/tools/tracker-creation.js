

var appset = require('../../../app/settings.json');
var vcontrol = require('../../repo/gui/js/layouts/view-controller.js');
var vgtables = require('../../repo/gui/js/modules/vg-tables.js');
var floatv = require('../../repo/gui/js/modules/vg-floatviews.js');
var {ObjList}=require('../../repo/tools/box/vg-lists.js');

var { FilterForm } = require('../forms/filter-form.js');
var { TrackerForm } = require('../forms/tracker-form.js');

var sumtracker = require('../../back/qtrack-metrics.js');
var {GETtlist}= require('../../back/RRT-requests.js');

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
      status: "STATUS",
      saletype: "SALE TYPE",
      amount: "AMOUNT"
}

var tablemap = {
    MAIN:(r=null)=>{
        if(!r||r==undefined){r={}}
        return{
        _id:r._id||'',
        estimator:r.estimator||'',
        client:r.client||'',
        date:r.date||'',
        zip:r.zip||'',
        status:r.status||'',
        saletype:r.saletype||'',
        amount:r.amount||''

        }
    }
}

var CREATEviews=(reset=false)=>{ // Creates monthly views via tabbed view

    let moblock = document.getElementById('tracker-view-cont');

    if(!reset){
      vcontrol.SETUPviews(moblock,'mt');

      let mocont = document.createElement('div');   //creates CarryOver Tab
      mocont.id = 'CO';
      let v = vcontrol.ADDview('CO',mocont,moblock,false);
      v.appendChild(document.createElement('div'));
      v.lastChild.classList.add('monthly-metrics');
      v.appendChild(document.createElement('div'));
      v.lastChild.classList.add(vgtables.gtdom.table);
      for(let m in molist){   //loops to create Monthly Tabs and adds Lists as Tables
        mocont = document.createElement('div');
        mocont.id = molist[m];
        v = vcontrol.ADDview(molist[m],mocont,moblock,false);
        v.appendChild(document.createElement('div'));
        v.lastChild.classList.add('monthly-metrics');
        v.appendChild(document.createElement('div'));
        v.lastChild.classList.add(vgtables.gtdom.table);
      }
      moblock.getElementsByClassName(vcontrol.vcdom.menu.cont)[0].children[0].children[today.getMonth() + 1].click(); //fires a click event to activate this month's tab
    }
    
    FILLtop();

    let port = moblock.getElementsByClassName(vcontrol.vcdom.port.cont)[0].children;
    for(let x=0;x<port.length;x++){FILLtab(port[x].id);}
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

var FILLtab=(tab)=>{  // Fills each tab with proper table
    let list={
      vhc:[],
      bee:[],
      comb:[]
    };
    if(tab == 'CO'){
        for(let i=1;i<10;i++){  //loops through last nine years to create CarryOver List
            year = today.getFullYear() - i;
            list=GENlists(list,year);
        }
    }else{
        for(let m in molist){
            if(molist[m]==tab){
                list=GENlists(list,today.getFullYear()+'-'+monum[m]+'-');
            }
        }
    }

    let cont = document.getElementById(tab).getElementsByClassName(vgtables.gtdom.table)[0];
    cont.innerHTML = '';
    vgtables.BUILDtruetable([].concat(tableheaders,list.comb),cont,true,'tracker-row',tablemap['MAIN']);

    cont = document.getElementById(tab).getElementsByClassName('monthly-metrics')[0];
    cont.innerHTML = '';

    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.vhc),'Vogel'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.bee),'BEE'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.comb),'Total'));
}

var FILLtop=()=>{  // Fills top summary sections
    let list={vhc:[],bee:[],comb:[]};
    let cont = document.getElementById('report-area-metrics-yearly');
    list = GENlists(list);
    cont.innerHTML='';
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.vhc),'Vogel'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.bee),'BEE'));
    cont.appendChild(CREATEsumtable(sumtracker.GENmetrics(list.comb),'Total'));
}
//// Popups //////////////////////////////////////////////////////////////
var droplist = {
  cat:[],
  source:[],
  lead:[],
  comp:[],
  time:[],
  prstvia:[],
  saletype:[],
  status:[]
}

for(let list in droplist){
  for(let c in appset.reporting[list]){droplist[list].push(c);}
}
var editform = new TrackerForm(document.createElement('div'),droplist,(action,doc=null)=>{
  console.log(asumtracker.list.length);
  switch(action){
    case 'remove':{
      let tlist = [];
      for(let x=0;x<asumtracker.list.length;x++){
        if(x!=index){tlist.push(asumtracker.list[x])}
      }
      asumtracker.list=tlist;
      break;
    }
    case 'insert':{
      if(doc){asumtracker.list.push(doc);}
      break;
    }
    case 'update':{
      console.log(asumtracker.list[index]);
      console.log(editform.form);
      asumtracker.list[index]=editform.form;
    }
  }
  console.log(asumtracker.list.length);
  CREATEviews(true);
});
document.getElementById('preview-popup').appendChild(editform.cont);

var filterform = new FilterForm(document.createElement('div'),droplist);  // Creates filter form contianer
document.getElementById('filter-popup').appendChild(filterform.cont);
filterform.actions.submit.addEventListener('click',(ele)=>{
  console.log(filterform.filterform);
  CREATEviews(true);
  floatv.RESETframe(document.getElementById('preview-center'));
});

////////////////////////////////////////////////////////////////////////

var SETsumtracker=(array)=>{
  if(asumtracker){asumtracker.SETlist(array);}
  else{asumtracker = new ObjList(array);}
}

var EDITtracker=(lrow=null)=>{
  if(lrow){
    let obj = vgtables.GETrowTOobject(lrow);
    for(let i=0;i<asumtracker.list.length;i++){
      if(asumtracker.list[i]._id === obj._id){
        index = i;
        currtab = lrow.parentNode.parentNode.id;
        break;
      }
    }
    editform.loadform(asumtracker.list[index]);
  }else{editform.loadform(undefined);}
  floatv.SELECTview(document.getElementById('preview-center'),'Lead Overview');//open lead preview
}

var GENlists=(list,date=null)=>{
  let data=new ObjList(asumtracker.TRIMlist(filterform.filterform));
  list.vhc = list.vhc.concat(data.TRIMlist({comp:'VHC', date:date}, date?true:false));
  list.bee = list.bee.concat(data.TRIMlist({comp:'BEE', date:date}, date?true:false));
  list.comb = list.bee.concat(data.TRIMlist({ date:date}, date?true:false));
  return list;
}

var SETUPuseryear = (user=null)=>{
  return new Promise((resolve,reject)=>{
    GETtlist(user).then(
      data=>{
        SETsumtracker(data.body.result);
        CREATEviews();
        return resolve(data.body.result);
      }
    );
  })
}


module.exports={
  SETUPuseryear,
  EDITtracker
}
