var { VHCform } = require("../repo/tools/box/vhc-forms.js");

class FilterForm extends VHCform {
    constructor(cont,droplist={}){
        super(cont);
        this.cont.innerHTML=this.content;
        
        this.setinputs(this.dom.values);  // register input elements

        for(let d in droplist){
            if(this.inputs[d]){
                let ele = document.createElement('option');
                ele.value = " ";
                ele.textContent= " ";
    
                this.inputs[d].appendChild(ele);

                for(let x=0;x<droplist[d].length;x++){
                let ele = document.createElement('option');
                ele.value = droplist[d][x];
                ele.textContent=droplist[d][x];
        
                this.inputs[d].appendChild(ele);
                }
            }
        }
    }
    dom={
        cont:"filter-cont",
        header:"popup-header",
        values:{
            client:"filter-value-client",
            time:"filter-value-time",
            comp:"filter-value-comp",
            source:"filter-value-source",
            lead:"filter-value-lead",
            rewards:"filter-value-rewards",
            prstvia:"filter-value-prstvia",
            financed:"filter-value-financed",
            saletype:"filter-value-saletype",
            cat:"filter-value-cat"
        },
        actions:{
            submit:"filter-action-submit"
        }
    }
    content=`
    <div class="${this.dom.cont}">
        <div class="${this.dom.header}">FILTER OPTIONS</div>
        <div class="preview-area-body">
            <div class="preview-area-client">
                <label>Client Name</label><input class="${this.dom.values.client}">
            </div>
            <div class="preview-area-appt">
                <label>Time Ran</label><select class="${this.dom.values.time}"></select>
                <label>Company</label><select class="${this.dom.values.comp}"></select>
                <label>Lead Source</label><select class="${this.dom.values.source}"></select>
                <label>Preseted Via</label><select class="${this.dom.values.prstvia}"></select>
            </div>
            <div class="preview-area-sale">
                <label>Sale Type</label><select class="${this.dom.values.saletype}"></select>
                <label>Category</label><select class="${this.dom.values.cat}"></select>
            </div>
            <div class="preview-area-buttons">
                <div class="flat-action-button ${this.dom.actions.submit}">Submit</div>
            </div>
        </div>
    </div>
    `
}

module.exports={FilterForm}