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

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET",url + "/static/js/lib/countries.json", false); // false for synchronous request
    xmlHttp.send( null );
    var countries = JSON.parse(xmlHttp.responseText);


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
            /*deleteUrl: url + "/DeleteOrder",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }*/
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
	onRowUpdating: function (options) {  
		//Mailchimp a besoin de tous les champs d'une adresse pour l'enregistrer : il est donc nécessaire de toujours retourner toutes les valeurs, et pas que celles qui ont été modifiées.
		// https://supportcenter.devexpress.com/ticket/details/t216562/dxdatagrid-it-is-impossible-to-pass-all-item-options-to-the-customstore-update-method
		console.log("========= oldData");
		console.log(options.oldData);
		console.log(options.oldData.tags);
		console.log("========= newData");
		console.log(options.newData.tags);
		console.log(options.newData); // le soucis viens probablement que options.newData.tags ne vaut pas la même chose que lorsque l'on inspecte/deplie l'objet newdata
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
	repaintChangesOnly: true,
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
          var worksheet = workbook.addWorksheet('Liste mailchimp');
          
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
                caption: "Mail",
                dataField:"email_address", 
            },{
                caption: "displayName (Outlook)",
		allowEditing: false,
                dataField:"displayName", 
		visible:showDiplayNameColumn, 
            },{
                caption: "Prénom",
                dataField:"merge_fields.FNAME", 
            },{
                caption: "Nom",
                dataField:"merge_fields.LNAME", 
            },{
                caption: "Société",
                dataField:"merge_fields.SOCIETE", 
            },{
                caption: "Rôle",
                dataField:"merge_fields.ROLE", 
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
					console.log(e.value);
                 			cellData.setValue(e.value)
             			},
				placeholder: "Choissisez un tag...",
				multiline:true,
		       });

			$cell.append($tagBox);
		},
		    /*
    cellTemplate: function (container, options) {  
        var html = "";  
        for (var i = 0; i < options.value.length; i++) {  
            html += (html != "" ? ", " : "") + options.value[i];  
        }  
        container.html(html);  
    }, 
    calculateFilterExpression: function (filterValue, selectedFilterOperation) {  
        if (!filterValue) return;  
        var filterValues = filterValue.split(",");  
        return function (data) {  
            var arr = $.grep(data.categories, function (item, index) {  
                return ($.inArray(item.toString(), filterValues) >= 0 ? true : false);  
            })  
            return arr.length > 0;  
        }  
    },  */
	/*
	      calculateDisplayValue: function(rowData) {
		var filterExpression = [],
		values = rowData.tags;
		for (var i = 0; i < values.length; i++) {
		  if (i > 0) {
		    filterExpression.push('or');
		  }
		  filterExpression.push(['name', values[i]]);
		}
		var result = $.map(DevExpress.data.query(mailchimpMemberTags).filter(filterExpression).toArray(), function(item) {
		  return item.name;
		}).join(',');
		return result;
	      },
	      calculateFilterExpression: function(filterValues, selectedFilterOperation) {
		var filterExpression = [];
		for (var i = 0; i < filterValues.length; i++) {
		  var filterExpr = [this.dataField, selectedFilterOperation || '=', filterValues[i]];
		  if (i > 0) {
		    filterExpression.push('or');
		  }
		  filterExpression.push(filterExpr);
		}
		return filterExpression;
	      },
	*/
            },/*{
                caption: "Téléphone",
                dataField:"merge_fields.PHONE", 
            },{
                caption: "VIP",
                dataField:"vip", 
            },{
                caption: "Adresse L1",
                dataField:"merge_fields.ADDRESS.addr1", 
            },{
                caption: "Adresse L2",
                dataField:"merge_fields.ADDRESS.addr2", 
            },{
                caption: "Code postal",
                dataField:"merge_fields.ADDRESS.zip", 
            },{
                caption: "Ville",
                dataField:"merge_fields.ADDRESS.city", 
            },{
                caption: "Pays",
                dataField:"merge_fields.ADDRESS.country", 
		lookup: {
                    dataSource: countries,
                    displayExpr: "name",
                    valueExpr: "code"
                }
            },{
                caption: "Région",
                dataField:"merge_fields.ADDRESS.state", 
            },*/
       ],
	    /*
	    onEditorPreparing: function(e) {
	      if ((e.parentType === "dataRow" || e.parentType === "filterRow") && e.dataField === "tags") {
		e.editorName = "dxTagBox"
		e.editorOptions.dataSource = mailchimpMemberTags;
		e.editorOptions.showSelectionControls = true;
		e.editorOptions.displayExpr = "name";
		e.editorOptions.valueExpr = "name";
		e.editorOptions.value = e.value || [];
		e.editorOptions.tagTemplate = function (value, container) {
            	  container.text(value.name);
        	}
		e.editorOptions.onValueChanged = function(args) {
		  //e.setValue(args.value);
		  e.setValue(args.values.join(","));
		}
	      }
	    },
	    */
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


