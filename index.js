//https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/MultiRowHeadersBands/jQuery/Light/


function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function ClientRestFitnetManager(host, api_root, login_password) {
	this.host = host;
	this.api_root = api_root;
	this.login_password = login_password;
	this.url_appel_api = host+api_root

	this.get_api = async function(target_action, is_compressed = true) {

		var myHeaders = new Headers();

		myHeaders = {
	        'Accept-Encoding': 'gzip, deflate, br',
	        'Authorization' : "Basic "+this.login_password,
	        'Accept': 'application/json',
	        'Host': this.host,
	        //'Connection': 'Keep-Alive',
	        //'User-Agent': '007',
	    };

	var init = { 
			method: 'GET',
	        headers: myHeaders,
	        mode: 'cors',
	        cache: 'default'
	    };


	const response = await fetch(this.url_appel_api+target_action, init);
	const json = await response.json();
	return json;
	};


	this.get_data_to_display = async function(target_action, is_compressed = true) {


		const affaires = await client.get_api("contracts/1");
		///contracts/readByDates/{companyId}/{dateStart}/{dateEnd}
		//synthese_facturation = client.get_api("billing/getConsolidated/1/01-01-2000/31-12-2030/0")
		const factures_clients = await client.get_api("invoices/v2/1/0/01-01-2000/31-12-2030");
		const factures_achats = await client.get_api("monitoringPurchases/1/all/01-2000/12-2030");

		var data_to_display = affaires;

		data_to_display.forEach(function (af) {

			af["factures_clients"] =  {
                "total_factures_clients_hors_taxe" : 0.0,
                "liste_factures_client" : [],
                "cumul_avant_periode_hors_taxe" : 0.0,
                "cumul_periode_hors_taxe" : {},
                "cumul_apres_periode_hors_taxe" : 0.0,
            };

		    af["factures_achats"] = {
                "total_factures_achats_hors_taxe" : 0.0,
                "liste_factures_achats" : [],
                "cumul_avant_periode_hors_taxe" : 0.0,
                "cumul_periode_hors_taxe" : {},
                "cumul_apres_periode_hors_taxe" : 0.0,
		    };

		    factures_clients.forEach(function (fc) {
				if (fc["contractId"] == af["contractId"]) {
					//af["factures_clients"]["total_factures_clients_hors_taxe"] += fc["bTaxBilling"]
		            af["factures_clients"]["liste_factures_client"].push(fc);
				}
		    });

		    factures_achats.forEach(function (fa) {
				if (fa["contractId"] == af["contractId"]) {
					//cible_af["factures_achats"]["total_factures_achats_hors_taxe"] += fa["amountBeforeTax"];
		            af["factures_achats"]["liste_factures_achats"].push(fa);
				}
		    });

			af["commerciaux_texte"] = "";
			if (af["affectedCommercialsList"] != null) {
			    af["affectedCommercialsList"].forEach(function (commercial) {
			    	af["commerciaux_texte"] = af["commerciaux_texte"] + commercial["fullName"]+" ";
			    });
			 }

		    af["managers_texte"] = "";
		    if (af["affectedProjectManagerList"] != null) {
		    	af["affectedProjectManagerList"].forEach(function (manager) {
		    		af["managers_texte"] = af["managers_texte"] + manager["fullName"]+" ";
		    	});
			}

			af["bon_commande"] = "";
			af["proprieteOnDemand"].forEach(function (prop) {
				if (prop["designation"] == "Bon de commande"){
		    		af["bon_commande"] = prop["value"];
		    	}
		    });
		});

		console.log(JSON.stringify(factures_clients));
		//console.log(JSON.stringify(data_to_display));
		return data_to_display;

	};

	this.get_data_factures_pivot = async function(target_action, is_compressed = true) {
		const data_to_display = await this.get_data_to_display();

		var data_factures_pivot = [];

		data_to_display.forEach(function (af) {
			facture_client_ou_achat = false;

			elements_communs_affaire = {
				"type_facture" : null,
				"affaire" : af["contractNumber"] + " - " + af["title"],
				"projet" : af["projectName"],
				"client" : af["customerName"],
				"montant_affaire" : af["contractAmount"],
				"statut_affaire" : af["status"] + "-" + af["statusName"],
				"managers_texte" : af["managers_texte"],
				"commerciaux_texte" : af["commerciaux_texte"],
				"montant_devis" : af["quoteAmount"],

				"montant_ht_facture" : 0,
				"numero_facture" : null,	
				"billingDate" : null,
           		"expectedPaymentDate" : null,
           		"statut_facture" : null,
           		"detail_facture" : null,
           		"billingDueDate" : null,
			};

			if (af["status"]==0){
				elements_communs_affaire["statut_affaire"] = elements_communs_affaire["statut_affaire"] + " ("+af["commercialStatusLevel"]+"%)"; //af["commercialStatusID"]+"-"+
			}
			af["factures_clients"]["liste_factures_client"].forEach(function (fc) {
				facture = elements_communs_affaire;
				facture["type_facture"] = "Factures ventes";
				facture["montant_ht_facture"] = fc["bTaxBilling"];
				facture["numero_facture"] = fc["invoiceNumber"];	
				facture["billingDate"] = fc["billingDate"].split('/')[2]+"-"+fc["billingDate"].split('/')[1]+"-"+fc["billingDate"].split('/')[0];
               	facture["expectedPaymentDate"] = fc["expectedPaymentDate"];
               	facture["statut_facture"] = fc["status"];
               	facture["detail_facture"] = fc;
               	facture["billingDueDate"] = fc["billingDueDate"];

				data_factures_pivot.push(facture);
				facture_client_ou_achat = true;
			});

			af["factures_achats"]["liste_factures_achats"].forEach(function (fa) {
				facture = elements_communs_affaire;
				facture["type_facture"] = "Factures achats";
				facture["montant_ht_facture"] = fa["amountBeforeTax"];
				facture["numero_facture"] = "";
				facture["billingDate"] = fa["date"].split('/')[2]+"-"+fa["date"].split('/')[1]+"-"+fa["date"].split('/')[0];
               	facture["expectedPaymentDate"] = fa["dueDate"];
               	facture["statuts_facture"] = fa["status"];
               	facture["detail_facture"] = fa;
               	facture["billingDueDate"] = "";

				data_factures_pivot.push(facture);
				facture_client_ou_achat = true;
			});

			if (facture_client_ou_achat == false){
				facture = elements_communs_affaire;
				
				facture["type_facture"] = "Factures achats";
				facture["numero_facture"] = "FACTICE POUR IHM FORECAST";
				facture["billingDate"] = af["beginDate"].split('/')[2]+"-"+af["beginDate"].split('/')[1]+"-"+af["beginDate"].split('/')[0];
				//facture["billingDate"] = new Date().getFullYear()+"-01-01";
				//facture["montant_ht_facture"] = 0.0;
				//facture["statuts_facture"] : "";
               	//"expectedPaymentDate" : "",               		
               	//"detail_facture" : null,
               	//"billingDueDate" : "",

				data_factures_pivot.push(facture)
			}
		});
		//console.log(JSON.stringify(data_factures_pivot));
		return data_factures_pivot
	}

}


//////////////////////////////////////////////////////
////////////////// DATAGRID WIDGET ///////////////////
//////////////////////////////////////////////////////

async function build_datagrid_widget() {

	var data = await client.get_data_to_display();

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

	        onCellPrepared: function(e) {	        	
	        	var status_color = {
	        		"0-Opportunity" : "lightYellow",
	        		"1-In-progress" : "lightGreen",
	        		"-1-Canceled " : "lightRed",
	        		"2-Terminated" : "lightBlue",
	        	}
	        	if (Object.keys(status_color).includes(e.cell.text)) {
	        		e.cellElement.css("backgroundColor", status_color[e.cell.text]);
	        	}
	        },

	        onCellClick: function(e) {
	            if(e.area == "data") {
	                var pivotGridDataSource = e.component.getDataSource(),
	                    rowPathLength = e.cell.rowPath.length,
	                    rowPathName = e.cell.rowPath[rowPathLength - 1],
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
	                caption: "Bon commande",
	                //width: 120,
	                dataField: "bon_commande",
	                area: "row" 
	            },{
	                caption: "Montant HT",
	                //width: 120,
	                dataField: "montant_affaire",
	                dataType: "number",
	                format: { style: "currency", currency: "EUR", useGrouping: false },
	                area: "row" 
	            },  {
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
	                    columns: ["type_facture", "numero_facture", "montant_ht", "billingDate", "expectedPaymentDate", "statut_facture"]
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
    	dataSource.expandHeaderItem("column", ["Factures achats"]);
    	dataSource.expandHeaderItem("column", ["Factures ventes"]);
    	//dataSource.expandHeaderItem("row", ["North America"]);
    	//dataSource.expandHeaderItem("column", [2013]);
    }
    
   build_pivottable_widget();

   //pivottable.expandHeaderItem("column", [2015, 2]);
   
});


//var host = "https://sandbox-standard.fitnetmanager.com";
//var login_password = "";

var host = atob(findGetParameter("host"));
var login_password = findGetParameter("login_password");
var api_root = "/FitnetManager/rest/";
var client = new ClientRestFitnetManager(host, api_root, login_password);
//data_factures_pivot = client.get_data_factures_pivot();
//console.log(JSON.stringify(data_factures_pivot));

//build_datagrid_widget();
