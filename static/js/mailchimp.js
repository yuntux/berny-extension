//////////////////////////////////////////////////////
////////////////// DATAGRID WIDGET ///////////////////
//////////////////////////////////////////////////////

DevExpress.localization.locale(navigator.language);
function build_datagrid_widget(loadUrlendpoint,showDiplayNameColumn) {

    var url = window.location.protocol + "//" + window.location.hostname;

	
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const filter = urlParams.get('filter');
    const urlFilterValue = JSON.parse(decodeURIComponent(filter));
    if (urlParams.has('filter')) {
        $('#filterText').text(window.location.origin + window.location.pathname + "?filter=" + filter);
    } else {
        $('#filterText').text(window.location.origin + window.location.pathname);
    }


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


     var tagMass = null;

     $("#customActionsToolbar").dxToolbar({
	     items: [
		{
		  location: 'before',
		  widget: 'dxSelectBox', //'dxTagBox',
		  name : 'massActionTagsList',
		  options: {
			dataSource: new DevExpress.data.ArrayStore({
				data: mailchimpMemberTags,
				key: "name"
			}),
			displayExpr: "name",
			valueExpr: "name",
			searchEnabled: true,
			showClearButton: true,
			onValueChanged(data){
				console.log(data);
				tagMass = data.value;
			}
	//		value : 'test-tag',
			//placeholder: "Choissisez un tag...",
		  },
		},
		{
		  location: 'before',
		  widget: 'dxButton',
		  name : 'massAddTagsButton',
		  options: {
		    text: 'Ajouter ce tag sur tous les contacts sélectionnés',
		    icon: 'add',
		    disabled: false,
		    onClick() {
			t = tagMass;
			console.log(t);
			if (t == null){
				alert("Vous devez sélectionner un tag");
				return;
			}
			
		        grid = $("#gridContainer").dxDataGrid("instance"); 
			if (!grid.getSelectedRowsData().length){
				alert("Vous devez sélectionner au moins une ligne");
				return;
			}
			count = 0;
			len = grid.getSelectedRowsData().length;
			grid.getSelectedRowsData().reverse().forEach((row) => {
				var store = grid.getDataSource()._store;
				row.tags.push(t);
				store.update(row.email_address, {'added_tags' : [t], 'tags' : row.tags})
				        .done(function (dataObj, key) {
						count = count + 1;
						if (count == len){
            						grid.getDataSource().reload();
						}
        				})
        				.fail(function (error) { 
						alert('Erreur lors de la mise à jour de '+row.email_address);
					});
              		});
		    },
		  },
		},
		{
		  location: 'before',
		  widget: 'dxButton',
		  name : 'massDeleteTagsButton',
		  options: {
		    text: 'Supprimer ce tag sur tous les contacts sélectionnés',
		    icon: 'trash',
		    disabled: false,
		    onClick() {
			t = tagMass;
			console.log(t);
			if (t == null){
				alert("Vous devez sélectionner un tag");
				return;
			}
		        grid = $("#gridContainer").dxDataGrid("instance"); 
			if (!grid.getSelectedRowsData().length){
				alert("Vous devez sélectionner au moins une ligne");
				return;
			}
			count = 0;
			len = grid.getSelectedRowsData().length;
			grid.getSelectedRowsData().reverse().forEach((row) => {
				var store = grid.getDataSource()._store;
				row.tags = row.tags.filter(function(item) {
					return item !== t
				});
				console.log(row.tags);
				store.update(row.email_address, {'deleted_tags' : [t], 'tags' : row.tags})
				        .done(function (dataObj, key) {
						count = count + 1;
						if (count == len){
            						grid.getDataSource().reload();
						}
        				})
        				.fail(function (error) { 
						alert('Erreur lors de la mise à jour de '+row.email_address);
					});
              		});
		    },
		  },
		},/*
		{
		  widget: 'dxButton',
		  options: {
		    text: 'Marquer à jour tous les contacts sélectionnés',
		    icon: 'trash',
		    disabled: true,
		    onClick() {
		    },
		  },
		},*/
	     ],
     });



     $("#gridContainer").dxDataGrid({
	dataSource: DevExpress.data.AspNet.createStore({
            key: "email_address",
            loadUrl: url +  loadUrlendpoint,
	    insertUrl: url + "/mailchimpAdd",
            updateUrl: url + "/mailchimpUpdate",
            deleteUrl: url + "/mailchimpArchiveMember",
        }),
	/*
	onSelectionChanged(data) {
	      var massActionToolbar = $("#customActionsToolbar").dxToolbar("instance");
		//TODO : trouver comment accéder à un item de la toolbar par son name et non son index dans la liste
		if (!data.selectedRowsData.length){
			console.log('desactiver')
			massActionToolbar.option('items')[1].options.disabled=true;
			massActionToolbar.option('items')[2].options.disabled=true;
			//massActionToolbar.option('items')[3].options.disabled=true;
		} else {
			console.log('activer')
			massActionToolbar.option('items')[1].options.disabled=false;
			massActionToolbar.option('items')[2].options.disabled=false;
			//massActionToolbar.option('items')[3].options.disabled=false;
		}
		massActionToolbar.repaint(); // TODO : accéder aux composant bouton pour ne repaint que les 3 boutons
	},*/
	editing: {
            mode: "popup",
            allowAdding: true,
	    allowDeleting : function (e){
		if (e.row.data['status'] != "subscribed")
		    return false;
		else
		    if (showDiplayNameColumn == true)
			return true;
		    else
			return false;
	    },
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
		/*
		console.log("========= oldData");
		console.log(options.oldData);
		console.log(options.oldData.tags);
		console.log("========= newData");
		console.log(options.newData);
		console.log(options.newData.tags);
		*/
	
		// Créer la liste des deleted_tags
		if (options.oldData.tags) {
			if (options.newData.tags)
				newTags = options.newData.tags;
			else
				newTags = options.oldData.tags;
			oldTags = options.oldData.tags;
			let deleted_tags = oldTags.filter(x => !newTags.includes(x));

			options.newData.deleted_tags = deleted_tags;
		}

		// Créer la liste des added_tags
		if (options.newData.tags) {
			if (options.oldData.tags)
				oldTags = options.oldData.tags;
			else
				oldTags = [];
			newTags = options.newData.tags;
			let added_tags = newTags.filter(x => !oldTags.includes(x));

			options.newData.added_tags = added_tags;
		}

		// Si l'utilisateur modifie un autre champ du formulaire (exemple : le prénom) sans toucher au champ Tags, ces lignes sont nécessaires pour que les tags ne disparaissent pas sur la vue liste
		if (options.newData.tags === undefined) { 
			if (options.oldData.tags){
				options.newData.tags = options.oldData.tags;
			}
		}
		/*
	    	// Pour renvoyer tous les champs, y compris ceux qui n'ont pas modifiés par l'utiisateur (utile pour les adresse postales dans Mailchimp)
		if (options.newData.tags === undefined) { 
       			var new_tags = JSON.parse(JSON.stringify(options.oldData.tags));
		} else {
       			var new_tags = JSON.parse(JSON.stringify(options.newData.tags));
		}
		$.extend(true, options.newData, $.extend(true, {}, options.oldData, options.newData));
		*/

		/*
		console.log("========= AFTER oldData");
		console.log(options.oldData);
		console.log(options.oldData.tags);
		console.log("========= AFTER newData");
		console.log(options.newData);
		console.log(options.newData.tags);
		*/
	},
	  	
	repaintChangesOnly: true,
        columnAutoWidth: false,
	allowColumnResizing: true,
        columnResizingMode: 'nextColumn',
	columnMinWidth: 5,
        allowColumnReordering: true,
        showBorders: true,
	sorting: {
      		mode: 'multiple',
    	},
	columnFixing: {
            enabled: true
        },
	filterBuilder: {
		onValueChanged: function (e) {
		    $('#filterText').text(window.location.origin + window.location.pathname + "?filter=" +  encodeURIComponent(JSON.stringify(e.component.option('value'))));
		},
    	},
	filterValue : urlFilterValue,
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
	selection: {
           mode: 'multiple',
	   selectAllMode: 'allPages', //"page" or "allPages"
	   allowSelectAll: true,
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
             pageSize: 100,
        },
        pager: {
           visible: true,
	   allowedPageSizes: [10, 100, 1000], //, 10000, 'all'
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
                width: 100,
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


