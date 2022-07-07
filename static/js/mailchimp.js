//////////////////////////////////////////////////////
////////////////// DATAGRID WIDGET ///////////////////
//////////////////////////////////////////////////////

DevExpress.localization.locale(navigator.language);
function build_datagrid_widget(loadUrlendpoint,showDiplayNameColumn) {

    var url = window.location.protocol + "//" + window.location.hostname;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET",url + "/mailchimpMembersTags", false); // false for synchronous request
    xmlHttp.send( null );
    var mailchimpMemberTags = JSON.parse(xmlHttp.responseText);

/*
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET",url + "/static/js/lib/countries.json", false); // false for synchronous request
    xmlHttp.send( null );
    var countries = JSON.parse(xmlHttp.responseText);
*/

    var mailchimpStatus = [
	    {'code' : 'subscribed', 'name' : 'subscribed'},
	    {'code' : 'unsubscribed', 'name' : 'unsubscribed'},
	    {'code' : 'cleaned', 'name' : 'cleaned'},
	    {'code' : 'pending', 'name' : 'pending'},
	    {'code' : 'transactional', 'name' : 'transactional'},
    ];

    $("#gridContainer").dxDataGrid({
	dataSource: DevExpress.data.AspNet.createStore({
            key: "email_address",
            loadUrl: url +  loadUrlendpoint,
	    insertUrl: url + "/mailchimpAddUpdate",
            updateUrl: url + "/mailchimpAddUpdate",
            /*deleteUrl: url + "/DeleteOrder",*/
        }),
	editing: {
            mode: "popup",
            allowAdding: true,
	    allowDeleting: false,
	    allowUpdating: function (e){
		if (e.row.data['status'] == "new")
		    return false;
		return true;
	    },
	    refreshMode:"reshape",
        },
	/*
	onRowUpdating: function (options) {  
		//Mailchimp a besoin de tous les champs d'une adresse pour l'enregistrer : il est donc nécessaire de toujours retourner toutes les valeurs, et pas que celles qui ont été modifiées.
		// https://supportcenter.devexpress.com/ticket/details/t216562/dxdatagrid-it-is-impossible-to-pass-all-item-options-to-the-customstore-update-method
		console.log("========= oldData");
		console.log(options.oldData);
		console.log(options.oldData.tags);
		console.log("========= newData");
		console.log(options.newData.tags);
		console.log(options.newData);
		console.log(options.newData.tags);


		if (options.newData.tags === undefined) {
       			var new_tags = JSON.parse(JSON.stringify(options.oldData.tags));
		} else {
       			var new_tags = JSON.parse(JSON.stringify(options.newData.tags));
		}
		$.extend(true, options.newData, $.extend(true, {}, options.oldData, options.newData));
		options.newData.tags = new_tags;

		console.log("========= AFTER oldData");
		console.log(options.oldData);
		console.log(options.oldData.tags);
		console.log("========= AFTER newData");
		console.log(options.newData);
		console.log(options.newData.tags);
	},
	*/  	
	repaintChangesOnly: true,
        columnAutoWidth: true,
        allowColumnReordering: true,
	sorting: {
      		mode: 'multiple',
    	},
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Rechercher..."
        },
        filterPanel: {
		visible: true
	},
        headerFilter: {
            visible: true,
	    allowSearch: true
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
	summary: {
            groupItems: [
		{
                    column: "Société",
                    summaryType: "count"
            	},
            ]
        },
        loadPanel: {
            enabled: true
        },
        scrolling: {
		mode: "standard" //"infinite"
	},
        paging: {
             pageSize: 1000,
        },
        pager: {
           visible: true,
	   //allowedPageSizes: [5, 10, 'all'],
           showPageSizeSelector: true,
           showInfo: true,
          showNavigationButtons: true,
        },
        export: {
          enabled: true,
          allowExportSelectedData: false
        },
        
        onExporting: function(e) {
          var workbook = new ExcelJS.Workbook();
          var worksheet = workbook.addWorksheet('Liste mailchimp');
          
          DevExpress.excelExporter.exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            autoFilterEnabled: true
          }).then(function() {
            // https://github.com/exceljs@1.7.0/exceljs#writing-xlsx
            workbook.xlsx.writeBuffer().then(function(buffer) {
              saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Contacts.xlsx');
            });
          });
          e.cancel = true;
        },
	onEditorPreparing: function(e) {
            if (e.dataField === "email_address" && e.parentType === "dataRow") {
	 	// L'adresse email est la clé... donc on ne doit pas pouvoir la changer. Sinon mailchimp crée un nouveau contact mais il n'est pas créé sur le front JS... qui pense qu'il est en train d'éditer  
		if (e.row.data && e.row.data.email_address){
                	e.editorOptions.disabled = true;
		} else {
                	e.editorOptions.disabled = false;
		}
            }
        },

        columns: [
	  {
                type: "buttons",
                width: 110,
                buttons: ["edit", "delete", {
                    hint: "Ajouter à Mailchimp",
                    text: "Ajouter à Mailchimp",
                    //icon: "repeat",
                    visible: function(e) {
                        return e.row.data.status == "new";
                    },
                    onClick: function(e) {
			e.component.getDataSource().store().insert(e.row.data)
			     .done(function (dataObj, key) {
				 e.row.data["status"] = dataObj["status"];
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
		allowEditing: false,
                dataField:"status", 
		lookup: {
                    dataSource: mailchimpStatus,
                    displayExpr: "name",
                    valueExpr: "code"
                }
            },{
                caption: "lastChanged",
                dataField:"last_changed", 
		allowHeaderFiltering: false,
		visible:false,
		allowEditing: false,
		sortOrder: 'desc',
	    },{
                caption: "Mail",
                dataField:"email_address", 
		allowHeaderFiltering: false,
	    },{
                caption: "Prénom",
                dataField:"merge_fields.FNAME", 
		allowHeaderFiltering: false,
            },{
                caption: "Nom",
                dataField:"merge_fields.LNAME", 
		allowHeaderFiltering: false,
            },{
                caption: "displayName (Outlook)",
                dataField:"displayName", 
		visible:showDiplayNameColumn, 
		allowEditing: false,
		allowHeaderFiltering: false,
            },{
                caption: "Société",
                dataField:"merge_fields.SOCIETE", 
            },{
                caption: "Rôle",
                dataField:"merge_fields.ROLE", 
            },{
                caption: "Tags",
                dataField:"tags", 
		allowHeaderFiltering: false, /* le headerFilter ne fonctionne pas pour les dxTagBox*/
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
					//console.log(e.value);
                 			cellData.setValue(e.value)
             			},
				placeholder: "Choissisez un tag...",
				multiline:true,
		       });

			$cell.append($tagBox);
		},
            },
       ],
    });

};


