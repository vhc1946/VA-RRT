var { VHCform } = require("../repo/tools/box/vhc-forms.js");

class trackerform extends VHCform{
    constructor(cont){
        super(cont);
        this.cont.innerHTML = this.content;
    }

    dom={
        cont:"preview-cont",
        header:"preview-header",
        values:{
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
        buttons:{
            save:"preview-button-save"
        }
    }

    content=`
    <div class="${this.dom.cont}">
        <div class="${this.dom.header}">LEAD OVERVIEW</div>
        <div class="preview-area-body">
            <div class="preview-area-client">
                <label>Client Name</label><input id="${this.dom.values.client}">
                <label>Client Street</label><input id="${this.dom.values.street}">
                <label>Client City</label><input id="${this.dom.values.city}">
                <label>Client Zip</label><input id="${this.dom.values.zip}">
                <label>Contact Phone</label><input id="${this.dom.values.phone1}">
                <label>Contact Email</label><input id="${this.dom.values.email}">
            </div>
            <div class="preview-area-appt">
                <label>Lead Date</label><input id="${this.dom.values.date}">
                <label>Time Ran</label><input id="${this.dom.values.time}">
                <label>Company</label><input id="${this.dom.values.comp}">                        
                <label>Lead Source</label><input id="${this.dom.values.source}">
                <label>Lead Generator</label><input id="${this.dom.values.lead}">
                <label>Rewards</label><input id="${this.dom.values.rewards}">
                <label>Preseted Via</label><input id="${this.dom.values.prstvia}">
                <label>Preseted On</label><input id="${this.dom.values.prstdate}">
                <label>Book Price Used</label><input id="${this.dom.values.bookprc}">
            </div>
            <div class="preview-area-sale">
                <div class="preview-sales-misc">
                    <label>Financed</label><input id="${this.dom.values.finance}">
                    <label>Sale Type</label><input id="${this.dom.values.saletype}">
                </div>
                <div class="preview-sales-main">
                    <label>Category</label><input id="${this.dom.values.cat}">
                    <label>Amount</label><input id="${this.dom.values.amount}">
                    <label>Sold?</label><input id="${this.dom.values.sold}">
                </div>
            </div>
            <div class="preview-area-buttons">
                <div id="${this.dom.estimator}"></div>
                <div class="flat-action-button" id="${this.dom.buttons.save}">SAVE</div>
            </div>
        </div>
    </div>
    `
}

module.exports={trackerform}
