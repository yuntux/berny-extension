//////////////////////////////////////////////////////
////////////////// DATAGRID WIDGET ///////////////////
//////////////////////////////////////////////////////

async function build_datagrid_widget() {

    var data = await client.get_affaires_avec_factures_clients_achats();

    $('#exportButton').dxButton({
        icon: 'exportpdf',
        text: 'Export PDF',
        onClick: function() {
          const doc = new jsPDF();
          DevExpress.pdfExporter.exportDataGrid({
            jsPDFDocument: doc,
            component: dataGrid
          }).then(function() {
            doc.save('Customers.pdf');
          });
        }
    });

    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: data,
        columnAutoWidth: true,
        allowColumnReordering: true,
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Rechercher..."
        },
        filterPanel: { visible: true },
        headerFilter: {
            visible: true
        },
        filterBuilderPopup: {
            position: { of: window, at: "top", my: "top", offset: { y: 10 } },
        },
        showBorders: true,
        columnChooser: {
            enabled: true,
            mode: "select", //"dragAndDrop"
        },
        grouping: {
            contextMenuEnabled: true
        },
        groupPanel: {
            visible: true   // or "auto"
        },
        loadPanel: {
            enabled: true
        },
        scrolling: { mode: "infinite" },
        masterDetail: {
            enabled: true,
            template: masterDetailTemplate
        },

        export: {
          enabled: true,
          allowExportSelectedData: true
        },
        
        onExporting: function(e) {
          var workbook = new ExcelJS.Workbook();
          var worksheet = workbook.addWorksheet('Employees');
          
          DevExpress.excelExporter.exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            autoFilterEnabled: true
          }).then(function() {
            // https://github.com/exceljs@1.7.0/exceljs#writing-xlsx
            workbook.xlsx.writeBuffer().then(function(buffer) {
              saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Employees.xlsx');
            });
          });
          e.cancel = true;
        },
       

        columns: [
        {
            caption: "Statut",
            dataField:"statusName", 
        }, {
            caption: "Numéro",
            dataField:"contractNumber", 
        }, {
            caption: "Client",
            dataField:"customerName", 
        }, {
            caption: "Affaire",
            dataField:"title", 
            //type: "adaptive",
            
        },  {
            caption: "DM",
            dataField:"", 
        }, {
            caption: "Manager",
            dataField:"", 
        },{
            caption: "Commande",
            columns: [{
                caption: "Bon commande",
                dataField: ""
            }, {
                caption: "BD",
                dataField: "customerSegment"
            }, {
                caption: "BDL",
                dataField: ""
            }, {
                caption: "Commentaire",
                dataField: ""
            }, {
                caption: "Commanditaire",
                dataField: "",
            }]
        }, {
            caption: "Factures S/T",
            columns: [{
                caption: "Total à facturé",
                dataField: "contractAmount",
            }, {
                caption: "Reste à facturer",
                dataField: "",
            }]
        }, {
            caption: "Factures Clients",
            columns: [{
                caption: "",
                dataField: "",
            }, {
                caption: "",
                dataField: "",
            }]
        }, {
            caption: "Double boook",
            columns: [{
                caption: "",
                dataField: "",
            }, {
                caption: "",
                dataField: "",
            }]
        }, {
            caption: "Marge",
            columns: [{
                caption: "",
                dataField: "",
            }, {
                caption: "",
                dataField: "",
            }]
        }
        ]
    }).dxDataGrid('instance');
};


function masterDetailTemplate(_, masterDetailOptions) {
    return $("<div>").dxTabPanel({
        items: [{
            title: "Factures et avoirs clients",
            template: createFacturesClientsTabTemplate(masterDetailOptions.data)
        }, 
        ]
    });
}


function createFacturesClientsTabTemplate(masterDetailData) {
    return function() {
        
        return $("<div>").dxDataGrid({
            dataSource: masterDetailData.factures_clients.liste_factures_client,
            showBorders: true,
            
            columns: [
                "invoiceNumber",
                {
                    caption: "Date facture",
                    dataField:"billingDate", 
                }, {
                    caption: "Échéance paiement",
                    dataField:"billingDUEDate", 
                }, {
                    caption: "Montant H.T.",
                    dataField:"bTaxBilling",
                    valueFormat: {
                        format: "currency",
                        precision: 2
                    } 
                },{
                    caption: "Statut",
                    dataField:"status", 
                },
            ], 
            summary: {
                totalItems: [{
                    column: "bTaxBilling",
                    summaryType: "sum",
                    valueFormat: {
                        format: "currency",
                        precision: 2
                    }
                }],
            }
        });
    };
}

