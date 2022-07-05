# berny-extension

La page pour ajouter les contacts outlook à l’audience Mailchimp  https://beta.tasmane.com/contact_ms_graph2mailchimp

	* Les contacts qui sont déjà dans Mailchimp ne s’affichent pas sur cette page

	* Les valeurs des champs Nom, Prénom sont des valeurs pré-remplies à partir de l'adresse mail

	* La valeur prémachée pour la société correspond à la valeur de l’attribut société pour le dernier contact dont l’email est sur le même domaine email (@xxx.com) qui a été modifié/ajouté. Si aucun contact avec ce domaine n'est enregistré sur Mailchimp ou que leur attribut Société est vide, alors l'application "pré-remplit" l'attribut société avec le début du nom de domaine de l'adresse email, mis en majuscules.

Comment ajouter un contact à Mailchimp à partir de cette page : 

	* Chercher le contact dans la liste puis cliquer sur « Ajouter à Mailchimp » : le contact est créé au statut « subscribed » dans Mailchimp avec les valeurs déduites au moyen de son adresse mail (donc pas toujours top qualité). Le bouton Ajouter à Mailchimp devient Editer.

	* Cliquer sur « Editer » pour ajuster le nom, le prénom, la société, le rôle et les tags. => Cette étape est techniquement facultative mais fortement recommandée pour avoir une base de qualité.
 
Pour vérifier que le contact est bien dans Mailchimp, cliquer sur Mailchimp dans le menu en haut de page. => Le contact ajouté apparaît en haut de liste. Si l'utilsiateur retourne ensuite sur la page d'ajout de comptacts Mailchim à partir des contact Microsoft, cette fois cette personne n’apparait plus car elle est déjà dans Mailchimp.


La page qui liste tous les contacts de l’audience Mailchimp et permet de chercher, ajouter et modifier un contact (mais pas de les supprimer) : https://beta.tasmane.com/mailchimp
 
 
Pour le moment la page n’autorise pas à changer le statut Mailchimp du contact. A vous de me dire si vous souhaitez que les tasmaniens puissent le faire (avec le risque qu’ils réactivent des contacts qui ont cliqué sur le lien d’opt-out dans nos mails).
 
Lors de l’ajout d’un contact à Mailchimp, beta.tasmane y associe le statut « subscribed » pour qu’ils reçoivent les prochains maillings.
 
Si la propralTeam/comTeam ajoute ou modifie un contact sur l’IHM Mailchimp, la modification se verra dès rechargement de la page sur beta.tasmane.
En revanche, les contacts qui sont archivés ou supprimés sur Mailchimp s’afficheront toujours sur beta.tasmane jusqu’à rafraichissement du cache beta.tasmane. Je pense que ça n’est pas génant car ça ne doit pas arriver très souvent. Il y a un lien tout en bas de la page à gauche pour vider le cache (sur l’audience de production ça prend une minute pour recharger).
