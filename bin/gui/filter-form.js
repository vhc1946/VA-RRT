var { VHCform } = require("../repo/tools/box/vhc-forms.js");

class FilterForm extends VHCform {
    constructor(cont){
        super(cont);
        this.cont.innerHTML=this.content;
        this.setinputs(this.dom.values);  // register input elements
    }
    dom={
        cont:"filter-cont",
        header:"popup-header",
        values:{
            client:"filter-value-client",
            time:"filter-value-time",
            comp:"filter-value-comp",
            source:"filter-value-source",
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
                <label>Company</label><input class="${this.dom.values.comp}">
                <label>Lead Source</label><select class="${this.dom.values.source}"></select>
                <label>Rewards</label><input class="${this.dom.values.rewards}" type="checkbox">
                <label>Preseted Via</label><input class="${this.dom.values.prstvia}">
            </div>
            <div class="preview-area-sale">
                <label>Financed</label><input class="${this.dom.values.finance}" type="checkbox">
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