var {VHCform} = require("../../repo/tools/box/vhc-forms.js");
var {SENDrequestapi}=require('../../repo/apis/vapi/vapicore.js');
var {DropNote}=require('../../repo/gui/js/modules/vg-poppers.js');

var {aqtrack}=require('../../back/quote-tracking.js');

class TrackerForm extends VHCform{
    constructor(cont,droplist={},rfrsh=()=>{}){
      super(cont);
      this.cont.innerHTML=this.content;

      this.setinputs(this.dom.values);//register input elements

      this.actions.clear=this.cont.getElementsByClassName(this.dom.actions.clear)[0];
      this.actions.save=this.cont.getElementsByClassName(this.dom.actions.save)[0];
      this.actions.remove=this.cont.getElementsByClassName(this.dom.actions.remove)[0];

      this.actions.clear.addEventListener('click',(ele)=>{
        this.form = undefined;
        this.actions.save.title='insert';
      });
      this.actions.save.addEventListener('click',(ele)=>{
        this.submit(ele.target.title).then(doc=>{if(doc){rfrsh(ele.target.title,doc)}});
      });
      this.actions.remove.addEventListener('click',(ele)=>{
        this.submit('remove').then(doc=>{console.log(doc);if(doc){rfrsh('remove',doc)}});
      });

      for(let d in droplist){
        for(let x=0;x<droplist[d].length;x++){
          var ele = document.createElement('option');
          ele.value = droplist[d][x];
          ele.textContent=droplist[d][x];

          this.inputs[d].appendChild(ele);
        }
      }
    }

    dom={
        cont:"preview-cont",
        header:"popup-header",
        values:{
            _id:"preview-value-id",
            tag:"preview-value-tag",
            client:"preview-value-client",
            street:"preview-value-street",
            city:"preview-value-city",
            zip:"preview-value-zip",
            phone:"preview-value-phone",
            email:"preview-value-email",
            date:"preview-value-date",
            time:"preview-value-time",
            comp:"preview-value-comp",
            source:"preview-value-source",
            lead:"preview-value-lead",
            rewards:"preview-value-rewards",
            prstvia:"preview-value-prstvia",
            prstdate:"preview-value-prstdate",
            bookprc:"preview-value-bookprc",
            finance:"preview-value-finance",
            saletype:"preview-value-saletype",
            cat:"preview-value-cat",
            amount:"preview-value-amount",
            estimator:"preview-value-estimator",
            sold:"preview-value-sold"
        },
        actions:{
            save:"preview-button-save",
            remove:"preview-button-delete",
            clear:"preview-button-clear"
        }
    }

    content=`
    <div class="${this.dom.cont}">
        <div class="${this.dom.header}">LEAD OVERVIEW</div>
        <div class="preview-area-body">
            <div class="${this.dom.values._id}" style="display:none;"></div>
            <div class="preview-area-client">
                <label>Quote Id</label><input class="${this.dom.values.tag}">
                <label>Client Name</label><input class="${this.dom.values.client}">
                <label>Client Street</label><input class="${this.dom.values.street}">
                <label>Client City</label><input class="${this.dom.values.city}">
                <label>Client Zip</label><input class="${this.dom.values.zip}">
                <label>Contact Phone</label><input class="${this.dom.values.phone}">
                <label>Contact Email</label><input class="${this.dom.values.email}">
            </div>
            <div class="preview-area-appt">
                <label>Lead Date</label><input class="${this.dom.values.date}" type="date">
                <label>Time Ran</label><select class="${this.dom.values.time}"></select>
                <label>Company</label><select class="${this.dom.values.comp}"></select>
                <label>Lead Source</label><select class="${this.dom.values.source}"></select>
                <label>Lead Generator</label><select class="${this.dom.values.lead}"></select>
                <label>Rewards</label><input class="${this.dom.values.rewards}" type="checkbox">
                <label>Preseted Via</label><select class="${this.dom.values.prstvia}"></select>
                <label>Preseted On</label><input class="${this.dom.values.prstdate}" type="date">
                <label>Book Price Used</label><input class="${this.dom.values.bookprc}" type="checkbox">
            </div>
            <div class="preview-area-sale">
                <div class="preview-sales-misc">
                    <label>Financed</label><input class="${this.dom.values.finance}" type="checkbox">
                    <label>Sale Type</label><select class="${this.dom.values.saletype}"></select>
                </div>
                <div class="preview-sales-main">
                    <label>Category</label><select class="${this.dom.values.cat}"></select>
                    <label>Amount</label><input class="${this.dom.values.amount}">
                    <label>Sold?</label><input class="${this.dom.values.sold}" type="checkbox">
                </div>
            </div>
            <div class="preview-area-buttons">
                <div class="${this.dom.values.estimator}"></div>
                <img src="../bin/repo/assets/icons/disk.png" class="sm-action-button ${this.dom.actions.save}" title="insert"/>
                <img src="../bin/repo/assets/icons/trash.png" class="sm-action-button ${this.dom.actions.remove}" title="delete"/>
                <img src="../bin/repo/assets/icons/refresh-icon.png" class="sm-action-button ${this.dom.actions.clear}" title="clear"/>
            </div>
        </div>
    </div>
    `

    loadform(info={}){
      this.form = info;
      if(info){this.actions.save.title='update';}
      else{this.actions.save.title='insert';}
    }

    submit(action){
      return new Promise((resolve,reject)=>{
        if(this.validate()){
          let opts = null;
          DropNote('tr',`${action}ing item`,'green');
          switch(action){
            case 'insert':{
              opts={
                docs:aqtrack(this.form)
              }
              break;
            }
            case 'remove':{
              opts={
                query:{_id:this.form._id},
                multi:false
              }
              break;
            }
            case 'update':{
              opts={
                query:{_id:this.form._id},
                update:{$set:aqtrack(this.form)},
                options:{multi:false}
              }
            }
          }
          if(opts){
            SENDrequestapi({
              collect:'apps',
              store:'SUMTRACKER',
              db:'mtracker',
              method:action,
              options:opts
            }).then(
              res=>{
                console.log(res);
                if(!res.body.result.err){
                  DropNote('tr',`item was ${action}ed`,'green');
                  switch(action){
                    case 'remove':{
                      this.form=undefined;
                      this.actions.save.title='insert';
                      break;
                    }
                    case 'insert':{this.actions.save.title='update';break;}
                  }
                  return resolve(res.body.result.doc||'empty');
                }else{
                  DropNote('tr',`item was not ${action}ed`,'yellow');
                  switch(action){
                    case 'insert':{this.actions.save.title='update';}
                    case 'update':{this.actions.save.title='insert';}
                  }
                  return resolve(false);
                }
              }
            )
          }else{console.log('Bad method for server');return resolve(false);}
        }else{console.log('Form Inputs are Bad');return resolve(false);}
      })
    }
}

module.exports={TrackerForm}
