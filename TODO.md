NOCTIS : YOUR LUCID DREAM COMPANION
OWN YOUR NIGHT

You spend one-third of your entire life spent asleep, improve and get your sleep power back

- [ x ] Installer nativewind
- [ x ] Importer logos de l'app
- [ x ] Mettre en place la charte graphique et les couleurs etc
- [ x ] Importer la font -- PROXIMA NOVA
- [ x ] Créer et connecter supabase
- [ x ] Faire un systeme de CI/CD github actions pour que le code soit bien propre et testé a chaque fois
- [ x ] Faire une navbar en bas qui est mise dans le layout dans un component responsive avec une bonne architecture
- [ x ] Implémenter le logo en tant qu'icone de l'application
- [ x ] Add the fact that the keyboard dosn't hide anything and puts the screenup and i can dismiss the keyboard by clicking out of it
- [ x ] welcome screen avec le logo en full size au centre et des petits effets comme des confettis et un texte en guide de courte introduction
- [ x ] Faire un systeme de gestion de reve avec les champs demandés : Date et Heure du rêve
Type de rêve (cauchemar, rêve lucide, rêve ordinaire, etc.)
État émotionnel avant et après le rêve
Personnages présents dans le rêve
Lieu du rêve
Intensité émotionnelle
Clarté du rêve
Tags ou Mots-clés associés au rêve
Qualité du sommeil ressentie
Signification personnelle du rêve
Tonalité globale du rêve (positive, négative, neutre)
et la possibilité de les gérer donc les ajouter les modifier les supprimer et acceder a un historique avec une streak tout les jours ca ajoute un et ca permet de gamifier et que l'utilisateur reste plus sur l'application
- [ x ] Possibilité de modifier ou supprimer un reve après l'avoir ajouté
- [ x ] Inclure plein de stats et des graphiques dans une page dédiée
- [ x ] Calendar avec les jours
- [ x ] Card avec une grande icone en 3d un texte type "Your dream journal awaits" et un bouton call to action qui permet d'ajouter un nouveau reve rapidement
- [ x ] overview de quelques stats comme le nombre total de rêves et la streak actuel et un petit troisième truc + bouton voir plus qui amène sur la page journal
- [ x ] Fix bug quand y'a deux reves le même jour ca reset la streak, si jamais il y en a deux dans la même journée ca compte pour 1
- [ x ] faire en sorte que l'icone de photo de profil dans le header de la home page ammène sur la page profil et remplacer le logo paramètre par un theme switcher
- [ x ] Mettre icone paramètre dans la page profil et pas dans la home page mais c'est la meme qu'avant c'est a dire ronde et en haut a droite
- [ x ] Ajouter un date picker dans l'ajout de reves pour permettre a l'utilisateur de choisir la date de son reve
- [ x ] Implémenter la page de recherche pour rechercher et filtrer les reves par mots clés date ou qualité clareté, qualité du sommeil etc

- [  ] When i add a dream it dosn't say day streak 1 it stays at 0
- [  ] In the dream graph i want the node info when clicked to display above the dream types so the user can easially see the dreams, i want the graph naviguation section to have a little bit less height
- [  ] Make the WeekCalendar clickable do display the dreams you had that specific day or display none if you didn't register any dream and let you add one for this specific day
- [  ] Diagramme de Kiviat avec les différents types de sommeil a mettre dans la page journal de reves pour avoir une stat supplémentaire
- [  ] card bibliothèque avec une icone de livre qui amène vers la documentation sur les reves et les reves lucides et les tutoriels, pour l'instant ne rempli pas cette page j'ai juste besoin de la card sur la home page tout en bas
- [  ] Feature + nouvelle page "your dream forecast" qui permet en fonction des cycles lunaires (Api: https://docs.stormglass.io/#/astronomy) avec une localisation fixe a BORDEAUX pour permettre de faire un seul call api par jour pour avoir les cycles de la lune et un peu d'aléatoire de "prévoir" les reves des utilisateurs avec end la date du jour lat = 44.8667 lng = -0.5597 MAXIMUM 10 REQUETES par jour optimiser les requetes au maximum car je suis en version gratuit donc MAX 10 REQUETES PAR JOUR

example usage : 

GET https://api.stormglass.io/v2/astronomy/point
Retrieve sunrise, sunset, moonrise, moonset and moon phase for a single coordinate.

const lat = 58.7984;
const lng = 17.8081;
const end = 2020-02-25;

fetch(`https://api.stormglass.io/v2/astronomy/point?lat=${lat}&lng=${lng}&end=${end}`, {
  headers: {
    'Authorization': 'example-api-key'
  }
}).then((response) => response.json()).then((jsonData) => {
  // Do something with response data.
});

{
    "data": [
        {
            "astronomicalDawn": "2018-11-22T04:29:13+00:00",
            "astronomicalDusk": "2018-11-22T16:43:25+00:00",
            "civilDawn": "2018-11-22T06:07:58+00:00",
            "civilDusk": "2018-11-22T15:04:39+00:00",
            "moonFraction": 0.9773405348657047,
            "moonPhase": {
                "closest": {
                    "text": "Full moon",
                    "time": "2018-11-23T10:05:00+00:00",
                    "value": 0.5
                },
                "current": {
                    "text": "Waxing gibbous",
                    "time": "2018-11-22T00:00:00+00:00",
                    "value": 0.45190179144442527
                }
            },
            "moonrise": "2018-11-22T13:58:41.948883+00:00",
            "moonset": "2018-11-22T05:04:59.690726+00:00",
            "nauticalDawn": "2018-11-22T05:17:04+00:00",
            "nauticalDusk": "2018-11-22T15:55:34+00:00",
            "sunrise": "2018-11-22T06:56:32+00:00",
            "sunset": "2018-11-22T14:16:06+00:00",
            "time": "2018-11-22T00:00:00+00:00"
        },
        ...
    ],
    "meta": {
        "cost": 1,
        "dailyQuota": 50,
        "lat": 58.7984,
        "lng": 17.8081,
        "requestCount": 1,
        "start": "2018-11-22T00:00:00+00:00"
    }
}

Available Query Parameters
Parameter	Required	Default	Description
lat	✔	n/a	Latitude of the desired coordinate.
lng	✔	n/a	Longitude of the desired coordinate.
start		Today at 00.00	Timestamp in UTC for first forecast hour - UNIX format or URL encoded ISO format.
end		Tomorrow at 00.00	For how many days ahead to receive data. max 10 days.
Response Format
The response will be sent back in the form of a JSON object. The resource root contains two objects, data and meta.

Meta

The meta object contains information about the API request. Such as requested latitude and longitude, your daily quota and how many requests you’ve made so far today.

Data

The data object contains the actual data on a daily basis. One item in the data list contains:

key	value
time	Timestamp in UTC indicating the day for the data
sunrise	Timestamp for sunrise in UTC. Will return null if no sunsrise occurs on the given day
sunset	Timestamp for sunset in UTC. Will return null if no sunset occurs on the given day
moonrise	Timestamp for moonrise in UTC. Will return null if no moonrise occurs on the given day
moonset	Timestamp for moonset in UTC. Will return null if no moonset occurs on the given day
moonFraction	A float number between 0 and 1 indicating how much of the moon is illuminated
moonPhase	Objects describing the current and the closest moon phase
astronomicalDawn	Timestamp in UTC. Will return null if no dawn occurs on the given day
astronomicalDusk	Timestamp in UTC. Will return null if no dusk occurs on the given day
civilDawn	Timestamp for sunset in UTC. Will return null if no dawn occurs on the given day
civilDusk	Timestamp for sunset in UTC. Will return null if no dusk occurs on the given day
nauticalDawn	Timestamp for sunset in UTC. Will return null if no dawn occurs on the given day
nauticalDusk	Timestamp for sunset in UTC. Will return null if no dusk occurs on the given day
A moon phase is described by an object with the structure according to the table below. current describes the current moon phase and closest gives you the timestamp for the closest phase being one of New moon, First quarter, Full moon or Third quarter.

key	value
time	Timestamp in UTC showing what time the moon phase object describes
text	A string describing the moon phase. The possible values are: New moon, Waxing crescent, First quarter, Waxing gibbous, Full moon, Vaning gibbous, Third quarter, Vaning crescent
value	A float value for the phase of the given time.
The value parameter gives you a float value for the given time where 0.0 or 1.0 equals New moon, 0.25 equals First Quarter, 0.5 equals Full moon and 0.75 equals Third quarter.

Definition Of Dusk And Dawn
Astronomical Dawn occurs when the sun reaches 18° below the horizon, Nautical at 12° and Civil at 6°. The same degrees apply for the Dusk definitions.


- [  ] Notificatons pour rappeler d'ajouter ses reves tout les jours
- [  ] Afficher les notifications dans le notifications tab et permttre de les marquer comme lu ou de les supprimer
- [  ] Afficher un badge rouge a cote de l'icone bell dans la navbar quand il y a des notifications non lues
- [  ] Faire un light et un dark theme switcher -- juste échanger background et foreground pas besoin de modifier la couleur d'accent
- [  ] Ajouter un form de retour feedback et des pages légales dans la page de settings
- [  ] Défis : ex. “Note tes rêves 7 jours d’affilée”.
- [  ] Succès / badges : “Premier rêve lucide enregistré ! 🏆”. Voir tout les badges collectés dans la page de profil
- [  ] Visualisation automatique : l’app génère une image AI inspirée de ton rêve.
- [  ] Audio journal : possibilité d’enregistrer à la voix ton rêve (utile au réveil quand tu es trop fatigué pour écrire). EN SPEECH TO TEXT
- [  ] Forecast de thèmes de rêve (ex. : “Cette semaine tu risques de rêver de voyages car…”).
- [  ] Dream-graph : réseau interactif en 2D de tous tes rêves connectés par symboles communs. A REMPLACER DANS LA HOMEPAGE A LA PLACE DE LA CARD TOTAL DREAMS
- [  ] Conseils personnalisés : “Essaie de te coucher 30 min plus tôt pour favoriser les rêves lucides.”
- [  ] Connecter une api 100% gratuite qui permet de voir le cycle lunaire actuel afin de voir comment est ce que l'utilisateur devrait dormir cette nuit
- [  ] Possibilité de changer la langue mais celle par défaut est le francais il y a aussi de l'anglais disponible pour l'instant i18n
- [  ] Possibilité d'exporter les reves dans un fichier a télécharger ou dans le cloud choisi par l'utilisateur
- [  ] Buy me a coffee in the settings
- [  ] Faire le readme pour bien expliquer le projet, expliquer que dans le futur se projet sera encore amélioré notamment avec un spabase afin de le présenter durant l'oral de 2h du bts sio
- [  ] Faire une pres canva pour présentation orale bien détaillée sur l'app
- [  ] 🧠 Fonctions psychologiques / introspection

Cartographie des émotions : chaque rêve noté avec une émotion dominante → stats (ex. : 40% joyeux, 30% anxieux).

Analyse de symboles : ex. “Tu rêves souvent d’eau, ce symbole peut être lié à…”.

Journal parallèle : possibilité d’ajouter ce que tu vivais la veille (stress, activité, repas) → pour détecter corrélations.

Détection des personnages récurrents : l’app identifie les “personnages clés” de tes rêves.
- [  ] 🌀 Fonctions pour les rêves lucides

Rappels via notifications de “tests de réalité” (notifications aléatoires → “Es-tu en train de rêver ?”).

Checklists lucides : suivi des méthodes utilisées (MILD, WBTB, etc.).

Suivi de progression : “Tu as eu 3 rêves lucides ce mois-ci, +50% par rapport au précédent.”

Bibliothèque de techniques : explications rapides pour s’entraîner à rêver lucide.
- [  ] REMOVE COMMENTS
- [  ] Remake home made comments
- [  ] POSTER DANS LE PLAY STORE





POST PRES -> BTS : 

- [  ] Supabase connecter créer un compte utilisateur
- [  ] Comparaison anonyme : voir les thèmes les plus communs des autres utilisateurs (genre “Cette semaine, 25% des gens ont rêvé de voyages”).
- [  ] Partage optionnel (privé ou communauté) : publier un rêve anonymisé pour comparer.
- [  ] Marketing la la mettre sur les stores