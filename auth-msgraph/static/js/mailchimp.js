//////////////////////////////////////////////////////
////////////////// DATAGRID WIDGET ///////////////////
//////////////////////////////////////////////////////

function build_datagrid_widget() {

    var url = "https://beta.tasmane.com";

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET",url + "/mailchimpMembersTags", false); // false for synchronous request
    xmlHttp.send( null );
    var mailchimpMemberTags = JSON.parse(xmlHttp.responseText);

    $("#gridContainer").dxDataGrid({
	dataSource: DevExpress.data.AspNet.createStore({
            key: "mail",
            loadUrl: url + "/mailchimpData",
	    insertUrl: url + "/mailchimpAdd",
            /*updateUrl: url + "/UpdateOrder",
            deleteUrl: url + "/DeleteOrder",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }*/
        }),
	editing: {
            mode: "popup",
	    allowUpdating: true
        },
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
	  {
                type: "buttons",
                width: 110,
                buttons: ["edit", "delete", {
                    hint: "Ajouter à mailchimp",
                    text: "Ajouter à mailchimp",
                    //icon: "repeat",
                    visible: function(e) {
                        return e.row.data.status == "new";
                    },
                    onClick: function(e) {
			e.component.getDataSource().store().insert(e.row.data)
			     .done(function (dataObj, key) {
				 alert(dataObj["status"]);
				 e.row.data["status"] = dataObj["status"];
				 alert(e.row.data);
				 e.component.repaintRows([e.row.rowIndex])
			     })
			     .fail(function (error) {
				 alert(error.toString());
			     });
                    }
                }]
              },
            {
                caption: "Statut",
                dataField:"status", 
            },{
                caption: "displayName",
                dataField:"displayName", 
            },{
                caption: "Mail",
                dataField:"mail", 
            },{
                caption: "Tags",
                dataField:"tags", 
		editCellTemplate: function($cell, cellData) {
			var $tagBox = $("<div>").dxTagBox({
				dataSource: new DevExpress.data.ArrayStore({
           				data: mailchimpMemberTags,
            				key: "name"
        			}),
				displayExpr: "name",
        			valueExpr: "name",
				searchEnabled: true,
			     	value: cellData.value,
			     	onValueChanged: function(e) {
                 			cellData.setValue(e.value)
             			},
				placeholder: "Choissisez un tag...",
				multiline:true,
		       });

			$cell.append($tagBox);
		},
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

/*
    $('#exportButton').dxButton({
        icon: 'exportpdf',
        text: 'Export PDF',
        onClick: function() {
          const doc = new jsPDF();
          DevExpress.pdfExporter.exportDataGrid({
            jsPDFDocument: doc,
            component:  $("#gridContainer")
          }).then(function() {
            doc.save('Customers.pdf');
          });
        }
    });
*/
};


