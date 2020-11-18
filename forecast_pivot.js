//////////////////////////////////////////////////////
///////////////// PIVOTTABLE WIDGET //////////////////
//////////////////////////////////////////////////////

//async function build_pivottable_widget() {
$(function(){

    async function build_pivottable_widget(){
        var drillDownDataSource = {};

        var client = new ClientRestFitnetManager(host, api_root, login_password);
        const data_factures_pivot = await client.get_data_factures_pivot();
        //const data_factures_pivot = await client.get_data_to_display();    

    $("#sales").dxPivotGrid({
            columnFixing: {
                enabled: true
            },
            export: {
                enabled: true
            },
            allowSortingBySummary: true,
            allowSorting: true,
            allowFiltering: true,
            allowExpandAll: true,
            showBorders: true,
            showColumnGrandTotals: false,
            showRowTotals: false,
            //rowHeaderLayout : "tree",
            headerFilter: {
                allowSearch: true,
                showRelevantValues: true,
                //width: 300,
                //height: 400
            },
            fieldPanel: {
                  visible: true  
            },
            fieldChooser: {
                enabled: true,
                applyChangesMode: "instantly",
                allowSearch: true
            },
            loadPanel: {
                enabled: true
            },
            //rowAlternationEnabled : true,
            onExporting: function(e) {

                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('Sales');
                
                DevExpress.excelExporter.exportPivotGrid({
                component: e.component,
                worksheet: worksheet
                }).then(function() {
                workbook.xlsx.writeBuffer().then(function(buffer) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
                });
                });
                e.cancel = true;
            },
            onCellPrepared: function(e) {                
                var status_color = {
                    "0-Opportunity" : "lightYellow",
                    "1-In-progress" : "lightGreen",
                    "-1-Canceled" : "red",
                    "2-Terminated" : "lightBlue",
                }
                if (Object.keys(status_color).includes(e.cell.text)) {
                    e.cellElement.css("backgroundColor", status_color[e.cell.text]);
                }
            },

            onCellClick: function(e) {
                if(e.area == "data") {
                    var pivotGridDataSource = e.component.getDataSource(),
                        //rowPathLength = e.cell.rowPath.length,
                        rowPathName = e.cell.rowPath[0] + " > " + e.cell.rowPath[1] + " > " + e.cell.rowPath[2],
                        popupTitle = (rowPathName ? rowPathName : "Total");
        
                    drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
                    salesPopup.option("title", popupTitle);
                    salesPopup.show();
                }
            },

            
            dataSource: {
                    
                fields: [{
                    caption: "Affaire",
                    //width: "600px",
                    dataField: "affaire",
                    area: "row",
                    fixed: true,
                       fixedPosition: "left"
                }, {
                    caption: "Projet",
                    //width: 120,
                    dataField: "projet",
                    area: "row" 
                }, {
                    caption: "Client affaire",
                    //width: 120,
                    dataField: "client",
                    area: "row" 
                },{
                    caption: "Statut affaire",
                    //width: 120,
                    dataField: "statut_affaire",
                    area: "row" 
                }, {
                    caption: "Managers",
                    //width: 120,
                    dataField: "managers_texte",
                    area: "row" 
                }, {
                    caption: "Commerciaux",
                    //width: 120,
                    dataField: "commerciaux_texte",
                    area: "row" 
                }, {
                    caption: "État BC",
                    //width: 120,
                    dataField: "bon_commande",
                    area: "row" 
                },{
                    caption: "Mnt HT",
                    //width: 120,
                    dataField: "montant_affaire",
                    dataType: "number",
                    format: { style: "currency", currency: "EUR", useGrouping: true},
                    area: "row" 
                },  {
                    caption: "RAF HT",
                    //width: 120,
                    dataField: "reste_a_facturer_client",
                    dataType: "number",
                    format: { style: "currency", currency: "EUR", useGrouping: true},
                    area: "row" 
                }, {
                    dataField: "type_facture",
                    area: "column"
                }, {
                    dataField: "billingDate",
                    dataType: "date",
                    area: "column"
                }, {
                    groupName: "billingDate",
                    groupInterval: "quarter",
                    visible: false
                },{
                    caption : "Factures",
                    dataField: "montant_ht_facture",
                    dataType: "number",
                    summaryType: "sum",
                    format: { style: "currency", currency: "EUR", useGrouping: false },
                    area: "data"
                },
                ],
                store: data_factures_pivot,
                //width : "6000px",
            }
        });

        
        var salesPopup = $("#sales-popup").dxPopup({
            width: 900,
            height: 500,
            contentTemplate: function(contentElement) {
                $("<div />")
                    .addClass("drill-down")
                    .dxDataGrid({
                        width: 800,
                        height: 450,
                        columns: ["type_facture", "numero_facture", "montant_ht_facture", "billingDate", "expectedPaymentDate", "statut_facture"]
                    })
                    .appendTo(contentElement);
            },
            onShowing: function() {
                $(".drill-down")
                    .dxDataGrid("instance")
                    .option("dataSource", drillDownDataSource);
            },
            onShown: function() {
                $(".drill-down")
                    .dxDataGrid("instance")
                    .updateDimensions();
            }
        }).dxPopup("instance"); 
        

        var dataSource = $("#sales").dxPivotGrid("getDataSource");
        dataSource.expandAll("affaire");
        dataSource.expandAll("projet");
        dataSource.expandAll("client");
        dataSource.expandAll("statut_affaire");
        dataSource.expandAll("managers_texte");
        dataSource.expandAll("commerciaux_texte");
        dataSource.expandAll("bon_commande");
        dataSource.expandAll("montant_affaire");
        dataSource.expandHeaderItem("column", ["Factures achats"]);
        dataSource.expandHeaderItem("column", ["Factures ventes"]);
        //dataSource.expandHeaderItem("row", ["North America"]);
        //dataSource.expandHeaderItem("column", [2013]);
    }
    
   if (findGetParameter("submit") == "Forecast"){
       build_pivottable_widget();
   }
});

