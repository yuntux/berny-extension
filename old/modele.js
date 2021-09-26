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

    this.get_proprieteOnDemand = function(obj, prop_designation){
        var res = "";
        obj["proprieteOnDemand"].forEach(function (prop) {
            if (prop["designation"] == prop_designation){
                res = prop["value"];
                console.log(res + " is type "+typeof res);
                if (typeof res === 'string') {
                    console.log("ok");
                    res = res.replace(/[\n]/g,', ');
                }
            }        
        });
        return res;
    };

    this.get_consultants = async function() {
        const consultants = await this.get_api("employees/1");
        consultants.forEach(function (consult){
            consult["club"] = client.get_proprieteOnDemand(consult, "Club");
            consult["mentor"] = client.get_proprieteOnDemand(consult, "Mentor");
            consult["mentee"] = client.get_proprieteOnDemand(consult, "Mentee");
            consult["business_domain"] = client.get_proprieteOnDemand(consult, "Business Domain");
            consult["affection_envisagee"] = "";
            consult["souhaits_ced"] = "";
            consult["preco_dernier_dm"] = "";
        });
        console.log(consultants);
        return consultants;
    };


    this.get_appel_affectation = async function(cible) {
        const affectations_mois = await client.get_api("assignments/onContract/1/"+cible);
        return affectations_mois;
    };

    this.get_besoins_staffing = async function() {
        var liste_affectations = {};
        var liste_mois = [-1,0,1,2]; //on prend les affectations qui ont au moins un jours sur la période [M-1;M+2]
        for (const i_mois of liste_mois){
            cible = Date.today().add(i_mois).months().toString("MM/yyyy") 
            const affectations_mois = await client.get_appel_affectation(cible);
            affectations_mois.forEach(function (affectation){
                if (!(Object.keys(liste_affectations).includes(affectation["assignmentOnContractID"]))) {
                    liste_affectations[affectation["assignmentOnContractID"]] = affectation;
                }
            });
        };

        res = [];
        liste_profils_generiques = ["DOE John","DOE Jane"];
        for (const affect of  Object.values(liste_affectations)){ //ne conserver que les affectations sur profil générique
            if (liste_profils_generiques.includes(affect["employee"])){
                res.push(affect);
            }
        }
        return res;
    };

    this.get_affaires_avec_factures_clients_achats = async function() {
        const affaires = await client.get_api("contracts/1");
        ///contracts/readByDates/{companyId}/{dateStart}/{dateEnd}
        //synthese_facturation = client.get_api("billing/getConsolidated/1/01-01-2000/31-12-2030/0")
        //invoices/getInvoicesToBeIssued/{companyId}/{customerId}/{dateStart}/{dateEnd}
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

            af["bon_commande"] = client.get_proprieteOnDemand(af,"Bon de commande");


        });

        //console.log(JSON.stringify(factures_clients));
        console.log(JSON.stringify(data_to_display));
        return data_to_display;

    };

    this.get_data_factures_pivot = async function() {
        const data_to_display = await this.get_affaires_avec_factures_clients_achats();

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
        "total_factures_client" : af["billedAmount"],
        "reste_a_facturer_client" : af["contractAmount"] - af["billedAmount"],
                "montant_ht_facture" : 0,
                "bon_commande" : af["bon_commande"],
                "numero_facture" : null,    
                "billingDate" : null,
                "expectedPaymentDate" : null,
                "statut_facture" : null,
                "detail_facture" : null,
                "billingDueDate" : null,
            };


            if (af["status"]==0){
                elements_communs_affaire["statut_affaire"] = elements_communs_affaire["statut_affaire"] + " ("+af["commercialStatusLevel"]+"% x "+ af["quoteAmount"] +"€)"; //af["commercialStatusID"]+"-"+
            }

            af["factures_clients"]["liste_factures_client"].forEach(function (fc) {
                var facture = JSON.parse(JSON.stringify(elements_communs_affaire));
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
                var facture = JSON.parse(JSON.stringify(elements_communs_affaire));
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
                var facture = JSON.parse(JSON.stringify(elements_communs_affaire));
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


var host = atob(findGetParameter("host"));
var login_password = findGetParameter("login_password");
var api_root = "/FitnetManager/rest/";
var client = new ClientRestFitnetManager(host, api_root, login_password);
//data_factures_pivot = client.get_data_factures_pivot();
//console.log(JSON.stringify(data_factures_pivot));
