//////////////////////////////////////////////////////
////////////////// DATAGRID WIDGET ///////////////////
//////////////////////////////////////////////////////

function build_datagrid_widget() {

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

    var url = "https://beta.tasmane.com";

    //var dataGrid = $("#gridContainer").dxDataGrid({
    $("#gridContainer").dxDataGrid({
	dataSource: DevExpress.data.AspNet.createStore({
            key: "mail",
            loadUrl: url + "/mailchimpData",
	    /*insertUrl: url + "/InsertOrder",
            updateUrl: url + "/UpdateOrder",
            deleteUrl: url + "/DeleteOrder",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }*/
        }),
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
        /*
        masterDetail: {
            enabled: true,
            template: masterDetailTemplate
        },
        */
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

        /*
        onEditorPreparing(e) {  
          if (e.dataField === "mentee")  
            e.editorName = "dxTextArea";  
        },*/

        columns: [
            /*{
                caption: "Prénom",
                dataField:"surname", 
            }, {
                caption: "Nom",
                dataField:"name", 
            },*/{
                caption: "displayName",
                dataField:"displayName", 
            },{
                caption: "Mail",
                dataField:"mail", 
            },{
                caption: "Statut",
                dataField:"status", 
            },{
                caption: "Tags",
                dataField:"tags", 
            },/*{
                caption: "Business Domain(s)",
                dataField:"business_domain", 
            },{
                caption: "Grade",
                dataField:"function", 
            },{
                caption: "Affectation envisagee",
                dataField:"affectation_envisagee", 
            },{
                caption: "Souhaits CED",
                dataField:"souhaits_ced", 
            },{
                caption: "Préconisation du dernier DM",
                dataField:"preco_dernier_dm", 
            },*/
       ],

    //}).dxDataGrid('instance');
    });
};


