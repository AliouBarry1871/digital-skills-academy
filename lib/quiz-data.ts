export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface CourseQuiz {
  courseIdPattern: string; // id exact ou mot-clé de catégorie
  title: string;
  questions: QuizQuestion[];
}

export const QUIZ_DATABASE: CourseQuiz[] = [
  // =========================================================================
  // 1. CYBERSÉCURITÉ & PROTECTION NUMÉRIQUE
  // =========================================================================
  {
    courseIdPattern: 'cyber',
    title: 'Examen de Validation : Cybersécurité & Hygiène Informatique',
    questions: [
      {
        id: 1,
        question: 'Qu\'est-ce que l\'attaque par hameçonnage (phishing) ?',
        options: [
          'Un virus qui détruit physiquement le processeur de l\'ordinateur',
          'Une technique frauduleuse visant à tromper l\'utilisateur pour lui dérober ses identifiants ou données bancaires',
          'Une méthode d\'accélération de la vitesse de la connexion Internet',
          'Un protocole officiel de mise à jour de Windows',
        ],
        correctAnswer: 1,
        explanation: 'Le phishing utilise des courriels ou faux sites imitant des services de confiance pour voler des identifiants.',
      },
      {
        id: 2,
        question: 'Quelle est la règle fondamentale pour un mot de passe robuste selon l\'ANSSI ?',
        options: [
          'Utiliser son prénom suivi de son année de naissance',
          'Avoir au moins 12 à 14 caractères combinant majuscules, minuscules, chiffres et caractères spéciaux, unique pour chaque service',
          'Garder le même mot de passe partout pour éviter de l\'oublier',
          'Changer de mot de passe tous les jours avec un seul mot du dictionnaire',
        ],
        correctAnswer: 1,
        explanation: 'La longueur et la diversité des caractères couplées à l\'unicité garantissent une résistance face aux attaques par force brute.',
      },
      {
        id: 3,
        question: 'En quoi consiste l\'authentification à deux facteurs (2FA / MFA) ?',
        options: [
          'Taper son mot de passe deux fois de suite très rapidement',
          'Avoir deux ordinateurs allumés en même temps',
          'Exiger deux preuves d\'identité distinctes (ex: mot de passe + code éphémère reçu sur mobile)',
          'Partager son mot de passe avec un collègue de confiance',
        ],
        correctAnswer: 2,
        explanation: 'Le 2FA combine ce que vous savez (mot de passe) et ce que vous possédez (smartphone / clé de sécurité).',
      },
      {
        id: 4,
        question: 'Quelle est la première action réflexe recommandée en cas d\'infection par un ransomware (rançongiciel) ?',
        options: [
          'Payer immédiatement la rançon demandée par les pirates',
          'Déconnecter immédiatement la machine du réseau (Wi-Fi, câble Ethernet) pour éviter la propagation',
          'Éteindre l\'écran et continuer à travailler sur un autre fichier',
          'Formater immédiatement le disque dur sans sauvegarder les preuves',
        ],
        correctAnswer: 1,
        explanation: 'Isoler l\'équipement du réseau empêche le rançongiciel d\'infecter les serveurs et postes partagés.',
      },
      {
        id: 5,
        question: 'Que signifie le protocole HTTPS avec le cadenas vert dans le navigateur ?',
        options: [
          'Que le site web est certifié sans virus et 100% honnête',
          'Que les échanges entre votre navigateur et le serveur sont chiffrés et protégés contre l\'interception',
          'Que le site est hébergé par Google',
          'Que la page web s\'ouvre plus vite que les autres',
        ],
        correctAnswer: 1,
        explanation: 'HTTPS garantit la confidentialité et l\'intégrité des échanges grâce au protocole TLS.',
      },
      {
        id: 6,
        question: 'Quelle est la règle de sauvegarde reconnue dite règle "3-2-1" ?',
        options: [
          'Sauvegarder 3 fois par jour à 2h et 1h du matin',
          '3 copies de vos données, sur 2 supports différents, dont 1 copie conservée hors site (ex: Cloud ou site distant)',
          'Garder 3 mots de passe sur 2 clés USB avec 1 antivol',
          'Créer 3 dossiers dans son dossier Téléchargements',
        ],
        correctAnswer: 1,
        explanation: 'La règle 3-2-1 protège contre les incendies, vols, pannes matérielles et attaques de rançongiciels.',
      },
      {
        id: 7,
        question: 'Pourquoi est-il crucial d\'installer régulièrement les mises à jour de sécurité de son système d\'exploitation ?',
        options: [
          'Pour changer le fond d\'écran de l\'ordinateur',
          'Pour corriger des failles de sécurité connues qui sont activement exploitées par des cybercriminels',
          'Pour vider automatiquement la corbeille',
          'Les mises à jour ne servent qu\'à ralentir les ordinateurs anciens',
        ],
        correctAnswer: 1,
        explanation: 'Les mises à jour comblent les failles logicielles dès qu\'elles sont rendues publiques.',
      },
      {
        id: 8,
        question: 'Qu\'est-ce que l\'ingénierie sociale (Social Engineering) en cybersécurité ?',
        options: [
          'La conception ergonomique des réseaux sociaux',
          'La manipulation psychologique de personnes pour les pousser à divulguer des informations confidentielles',
          'Le paramétrage des pare-feu réseau',
          'La création de câbles Ethernet industriels',
        ],
        correctAnswer: 1,
        explanation: 'L\'ingénierie sociale exploite la confiance, la peur ou l\'urgence humaine plutôt que les failles techniques.',
      },
      {
        id: 9,
        question: 'Quel est le rôle d\'un pare-feu (Firewall) ?',
        options: [
          'Refroidir la carte graphique lorsque l\'ordinateur surchauffe',
          'Filtrer et contrôler les flux de données entrants et sortants d\'un réseau selon des règles de sécurité',
          'Sauvegarder les fichiers supprimés par erreur',
          'Augmenter le débit de téléchargement de la connexion 4G/5G',
        ],
        correctAnswer: 1,
        explanation: 'Le pare-feu bloque les connexions suspectes ou non autorisées vers et depuis votre machine.',
      },
      {
        id: 10,
        question: 'Pourquoi est-il déconseillé de se connecter à ses comptes bancaires sur un Wi-Fi public ouvert sans VPN ?',
        options: [
          'Parce que le Wi-Fi public consomme trop de batterie',
          'Parce que les données en transit non sécurisées peuvent être écoutées ou interceptées par un pirate sur le même réseau',
          'Parce que les banques interdisent techniquement l\'accès aux ordinateurs portables',
          'Parce que le Wi-Fi public supprime automatiquement l\'historique',
        ],
        correctAnswer: 1,
        explanation: 'Un attaquant sur un réseau ouvert peut intercepter le trafic via des attaques de type Man-in-the-Middle.',
      },
    ],
  },

  // =========================================================================
  // 2. HACKING ÉTHIQUE & PENTESTING
  // =========================================================================
  {
    courseIdPattern: 'hacking',
    title: 'Examen de Validation : Hacking Éthique, Pentesting & Audit',
    questions: [
      {
        id: 1,
        question: 'Quelle est la différence fondamentale entre un hacker éthique ("White Hat") et un cybercriminel ("Black Hat") ?',
        options: [
          'Le hacker éthique utilise Linux et le cybercriminel utilise Windows',
          'Le hacker éthique dispose d\'une autorisation formelle écrite (mandat) et agit pour corriger les failles en toute légalité',
          'Le hacker éthique ne connaît pas les techniques d\'intrusion',
          'Il n\'y a aucune différence, seul le nom change',
        ],
        correctAnswer: 1,
        explanation: 'La légalité, le consentement explicite de la cible et l\'objectif de sécurisation définissent le hacking éthique.',
      },
      {
        id: 2,
        question: 'Quelle est la première étape indispensable d\'un test d\'intrusion professionnel (Pentest) ?',
        options: [
          'Lancer immédiatement des attaques par déni de service (DDoS)',
          'La phase de reconnaissance et collecte d\'informations (OSINT / Footprinting)',
          'Supprimer les sauvegardes du client pour tester sa réaction',
          'Envoyer la facture avant de commencer l\'audit',
        ],
        correctAnswer: 1,
        explanation: 'La reconnaissance permet de cartographier les cibles, technologies et surfaces d\'attaque.',
      },
      {
        id: 3,
        question: 'À quoi sert principalement l\'outil open-source Nmap ?',
        options: [
          'À éditer des vidéos de formation',
          'À scanner un réseau pour découvrir les hôtes actifs, les ports ouverts et les services en écoute',
          'À déchiffrer instantanément tous les mots de passe du monde',
          'À héberger un site web statique',
        ],
        correctAnswer: 1,
        explanation: 'Nmap est le scanner de réseau de référence pour l\'énumération des ports et l\'identification d\'OS.',
      },
      {
        id: 4,
        question: 'Qu\'est-ce qu\'une injection SQL (SQLi) ?',
        options: [
          'Une mise à jour rapide de la base de données',
          'L\'insertion malveillante de requêtes SQL dans un formulaire ou paramètre pour manipuler ou voler la base de données',
          'Un protocole d\'optimisation de la mémoire vive',
          'Un outil de nettoyage de disque dur',
        ],
        correctAnswer: 1,
        explanation: 'La SQLi permet à un assaillant d\'exécuter des commandes arbitraires sur la base de données de l\'application.',
      },
      {
        id: 5,
        question: 'Quel est l\'intérêt de déployer un laboratoire virtuel sous VirtualBox ou VMware pour s\'entraîner ?',
        options: [
          'Pour regarder des films en haute définition',
          'Pour créer un environnement sécurisé et totalement isolé du réseau réel, sans risque de dégâts extérieurs',
          'Pour pirater les voisins sans laisser de traces',
          'Pour économiser de la mémoire vive',
        ],
        correctAnswer: 1,
        explanation: 'L\'isolation garantit qu\'aucun paquet d\'attaque n\'atteigne des cibles non autorisées sur le réseau réel.',
      },
      {
        id: 6,
        question: 'Qu\'est-ce que le projet OWASP (Open Web Application Security Project) ?',
        options: [
          'Un fabricant d\'ordinateurs portables',
          'Une fondation de référence mondiale publiant les standards et le Top 10 des vulnérabilités web les plus critiques',
          'Un fournisseur d\'accès à Internet',
          'Un antivirus payant pour smartphone',
        ],
        correctAnswer: 1,
        explanation: 'Le Top 10 OWASP est le baromètre mondial des risques de sécurité sur les applications web.',
      },
      {
        id: 7,
        question: 'Dans le cadre d\'un pentest, que désigne un "exploit" ?',
        options: [
          'La réussite d\'une mise à jour logicielle',
          'Un programme ou script exploitant une vulnérabilité spécifique pour provoquer un comportement imprévu ou obtenir un accès',
          'Un certificat officiel de fin d\'études',
          'Un type de câble de transmission optique',
        ],
        correctAnswer: 1,
        explanation: 'L\'exploit est le mécanisme technique qui tire parti d\'une vulnérabilité pour en tirer avantage.',
      },
      {
        id: 8,
        question: 'Que mesure le score CVSS (Common Vulnerability Scoring System) ?',
        options: [
          'La vitesse de connexion d\'un serveur',
          'La gravité et le niveau de sévérité d\'une vulnérabilité de sécurité sur une échelle de 0 à 10',
          'Le nombre d\'heures travaillées par l\'auditeur',
          'Le prix de vente d\'un logiciel',
        ],
        correctAnswer: 1,
        explanation: 'Le CVSS permet d\'évaluer objectivement l\'urgence d\'une correction selon l\'impact et la facilité d\'exploitation.',
      },
      {
        id: 9,
        question: 'Qu\'est-ce qu\'une attaque XSS (Cross-Site Scripting) ?',
        options: [
          'Une coupure d\'électricité dans un centre de données',
          'L\'injection de scripts malveillants (souvent JavaScript) dans des pages web consultées par d\'autres utilisateurs',
          'Une attaque physique sur un routeur Wi-Fi',
          'Un format de compression de fichiers audio',
        ],
        correctAnswer: 1,
        explanation: 'Le XSS permet d\'exécuter du code malveillant dans le navigateur de la victime (vol de session, redirection).',
      },
      {
        id: 10,
        question: 'Quel document officiel clôture obligatoirement une mission de test d\'intrusion ?',
        options: [
          'Un simple message WhatsApp confirmant que tout est fini',
          'Le rapport d\'audit détaillé contenant le résumé exécutif, la liste des failles, leur criticité CVSS et les préconisations correctives',
          'La liste des mots de passe des employés publiée publiquement',
          'Une capture d\'écran du terminal uniquement',
        ],
        correctAnswer: 1,
        explanation: 'Le rapport d\'audit est le livrable clé permettant au client de comprendre ses risques et de corriger ses systèmes.',
      },
    ],
  },

  // =========================================================================
  // 3. ALGORITHMES & PYTHON
  // =========================================================================
  {
    courseIdPattern: 'python',
    title: 'Examen de Validation : Algorithmes & Programmation Python',
    questions: [
      {
        id: 1,
        question: 'Quelle fonction native Python permet d\'afficher du texte dans la console ?',
        options: [
          'echo()',
          'print()',
          'System.out.println()',
          'console.log()',
        ],
        correctAnswer: 1,
        explanation: 'En Python, print() est la fonction standard d\'affichage sur la sortie standard.',
      },
      {
        id: 2,
        question: 'Quel type de données Python est représenté par la valeur `3.14` ?',
        options: [
          'int (entier)',
          'float (nombre à virgule flottante)',
          'str (chaîne de caractères)',
          'bool (booléen)',
        ],
        correctAnswer: 1,
        explanation: 'Les nombres décimaux en Python sont du type float.',
      },
      {
        id: 3,
        question: 'Comment déclare-t-on une fonction personnalisée en Python ?',
        options: [
          'function ma_fonction():',
          'def ma_fonction():',
          'void ma_fonction() {}',
          'create ma_fonction():',
        ],
        correctAnswer: 1,
        explanation: 'Le mot-clé `def` (pour define) introduit la définition d\'une fonction en Python.',
      },
      {
        id: 4,
        question: 'Quelle est la syntaxe correcte pour une liste ordonnée et modifiable en Python ?',
        options: [
          'liste = (1, 2, 3)',
          'liste = [1, 2, 3]',
          'liste = {1, 2, 3}',
          'liste = <1, 2, 3>',
        ],
        correctAnswer: 1,
        explanation: 'Les crochets `[...]` définissent une liste modifiable (list). Les parenthèses `(...)` forment un tuple.',
      },
      {
        id: 5,
        question: 'Que vaut l\'expression `10 // 3` en Python 3 ?',
        options: [
          '3.3333333333333335',
          '3 (division entière, quotient)',
          '1 (le reste)',
          'Erreur de syntaxe',
        ],
        correctAnswer: 1,
        explanation: 'L\'opérateur `//` réalise la division euclidienne (quotient entier). Le reste s\'obtient avec `%` (modulo).',
      },
      {
        id: 6,
        question: 'Quelle est la particularité indispensable de la syntaxe Python pour délimiter les blocs de code ?',
        options: [
          'L\'utilisation obligatoire d\'accolades `{}` comme en C/Java',
          'L\'indentation (espaces au début des lignes) qui est obligatoire et structure le code',
          'Terminer chaque instruction par un point-virgule `;`',
          'Écrire tout le code en majuscules',
        ],
        correctAnswer: 1,
        explanation: 'Python utilise l\'indentation (généralement 4 espaces) pour délimiter les boucles, conditions et fonctions.',
      },
      {
        id: 7,
        question: 'Comment écrit-on une boucle qui s\'exécute 5 fois (avec des indices de 0 à 4) ?',
        options: [
          'for i in range(5):',
          'repeat 5 times:',
          'while i < 5 then:',
          'loop(0, 5):',
        ],
        correctAnswer: 0,
        explanation: '`range(5)` génère la suite 0, 1, 2, 3, 4 et la boucle `for i in range(5):` est l\'idiome Python standard.',
      },
      {
        id: 8,
        question: 'Que retourne la fonction `len("Digital Skills")` ?',
        options: [
          'Le nombre de voyelles dans la chaîne',
          '14 (le nombre total de caractères, espace inclus)',
          '12',
          'Une erreur car les espaces ne sont pas admis',
        ],
        correctAnswer: 1,
        explanation: 'La fonction native `len()` compte le nombre total d\'éléments ou de caractères, y compris les espaces.',
      },
      {
        id: 9,
        question: 'En Programmation Orientée Objet (POO) Python, quelle méthode sert de constructeur d\'une classe ?',
        options: [
          'def constructor(self):',
          'def __init__(self):',
          'def create(self):',
          'def build(self):',
        ],
        correctAnswer: 1,
        explanation: '`__init__` est la méthode spéciale automatiquement appelée lors de l\'instanciation d\'un objet.',
      },
      {
        id: 10,
        question: 'Quel bloc d\'instructions permet de capturer et gérer une exception en Python ?',
        options: [
          'try ... except',
          'catch ... throw',
          'if ... error',
          'test ... fallback',
        ],
        correctAnswer: 0,
        explanation: 'Le bloc `try ... except` intercepte les erreurs d\'exécution pour éviter que le programme ne plante brutalement.',
      },
    ],
  },

  // =========================================================================
  // 4. DÉVELOPPEMENT WEB (HTML, CSS & JAVASCRIPT)
  // =========================================================================
  {
    courseIdPattern: 'web',
    title: 'Examen de Validation : Développement Web Moderne',
    questions: [
      {
        id: 1,
        question: 'Quelle balise HTML5 représente la section principale et unique du contenu d\'une page web ?',
        options: [
          '<section>',
          '<main>',
          '<content>',
          '<body>',
        ],
        correctAnswer: 1,
        explanation: 'La balise sémantique `<main>` regroupe le contenu central et unique de la page, favorisant l\'accessibilité et le SEO.',
      },
      {
        id: 2,
        question: 'Quelle propriété CSS permet de créer une disposition flexible moderne sur un conteneur ?',
        options: [
          'float: left;',
          'display: flex;',
          'position: absolute;',
          'text-align: center;',
        ],
        correctAnswer: 1,
        explanation: '`display: flex` active le modèle Flexbox pour aligner et répartir facilement les éléments enfants.',
      },
      {
        id: 3,
        question: 'Comment lie-t-on une feuille de style externe `style.css` à une page HTML ?',
        options: [
          '<style src="style.css">',
          '<link rel="stylesheet" href="style.css">',
          '<script href="style.css">',
          '<include path="style.css">',
        ],
        correctAnswer: 1,
        explanation: 'La balise `<link rel="stylesheet" href="style.css">` dans la section `<head>` est le standard web.',
      },
      {
        id: 4,
        question: 'En JavaScript moderne, quel mot-clé déclare une variable dont la valeur ne doit pas être réassignée ?',
        options: [
          'var',
          'const',
          'let',
          'static',
        ],
        correctAnswer: 1,
        explanation: '`const` déclare une constante avec portée de bloc, empêchant toute réassignation ultérieure.',
      },
      {
        id: 5,
        question: 'Quelle méthode JavaScript permet de sélectionner un élément HTML par son identifiant ?',
        options: [
          'document.selectId("monId")',
          'document.getElementById("monId")',
          'window.find("monId")',
          'HTML.get("monId")',
        ],
        correctAnswer: 1,
        explanation: '`document.getElementById()` ou `document.querySelector("#monId")` accèdent au nœud du DOM correspondant.',
      },
      {
        id: 6,
        question: 'À quoi servent les Media Queries (`@media`) en CSS ?',
        options: [
          'À lire des vidéos YouTube dans la feuille de style',
          'À adapter le design et la mise en page selon les caractéristiques de l\'écran (mobile, tablette, desktop)',
          'À télécharger des fichiers audio en arrière-plan',
          'À changer la langue du texte',
        ],
        correctAnswer: 1,
        explanation: 'Les Media Queries sont le cœur du responsive design (RWD) pour s\'adapter aux différentes résolutions.',
      },
      {
        id: 7,
        question: 'Comment attacher un écouteur d\'événement (par exemple un clic sur un bouton) en JavaScript ?',
        options: [
          'element.onClickEvent("clic")',
          'element.addEventListener("click", callback)',
          'element.listenClick()',
          'element.trigger("mouse")',
        ],
        correctAnswer: 1,
        explanation: '`addEventListener("click", fn)` est la méthode standard pour réagir aux actions de l\'utilisateur.',
      },
      {
        id: 8,
        question: 'Quel attribut d\'une image `<img />` est obligatoire pour l\'accessibilité et le référencement (SEO) ?',
        options: [
          'title',
          'alt (texte alternatif décrivant l\'image)',
          'style',
          'loading',
        ],
        correctAnswer: 1,
        explanation: 'L\'attribut `alt` fournit une description textuelle aux lecteurs d\'écran et aux robots de recherche.',
      },
      {
        id: 9,
        question: 'Quel format textuel standard d\'échange de données est utilisé entre un client JavaScript et une API serveur ?',
        options: [
          'DOCX',
          'JSON (JavaScript Object Notation)',
          'MP4',
          'EXE',
        ],
        correctAnswer: 1,
        explanation: 'JSON est le format léger et universel pour structurer les données transmises via HTTP/HTTPS.',
      },
      {
        id: 10,
        question: 'Que signifie l\'acronyme DOM dans le développement web ?',
        options: [
          'Data Optimization Model',
          'Document Object Model (représentation arborescente de la page manipulable en code)',
          'Digital Output Module',
          'Direct Operating Memory',
        ],
        correctAnswer: 1,
        explanation: 'Le DOM est l\'interface de programmation qui représente le document HTML sous forme d\'arbre d\'objets.',
      },
    ],
  },

  // =========================================================================
  // 5. BUREAUTIQUE & EXCEL
  // =========================================================================
  {
    courseIdPattern: 'excel',
    title: 'Examen de Validation : Bureautique & Maîtrise d\'Excel',
    questions: [
      {
        id: 1,
        question: 'Par quel symbole commence obligatoirement toute formule de calcul dans Microsoft Excel ?',
        options: [
          '?',
          '=',
          '#',
          '@',
        ],
        correctAnswer: 1,
        explanation: 'Le signe égal `=` signale à Excel qu\'il doit interpréter le contenu de la cellule comme une formule.',
      },
      {
        id: 2,
        question: 'Quelle formule permet d\'additionner rapidement la plage de cellules allant de B2 à B10 ?',
        options: [
          '=PLUS(B2:B10)',
          '=SOMME(B2:B10)',
          '=ADDITIONNER(B2..B10)',
          '=TOTAL(B2:B10)',
        ],
        correctAnswer: 1,
        explanation: '`=SOMME(B2:B10)` est la fonction standard d\'addition de plages de cellules en français.',
      },
      {
        id: 3,
        question: 'Quel est l\'intérêt majeur d\'un Tableau Croisé Dynamique (TCD) dans Excel ?',
        options: [
          'Changer la police de caractères de toutes les feuilles',
          'Synthétiser, filtrer et analyser des milliers de lignes de données brutes en quelques secondes',
          'Envoyer un courriel à tous ses contacts Outlook',
          'Verrouiller le classeur avec un mot de passe',
        ],
        correctAnswer: 1,
        explanation: 'Le TCD est l\'outil roi d\'Excel pour regrouper, sommer et croiser des dimensions statistiques rapidement.',
      },
      {
        id: 4,
        question: 'Que fait la fonction `=RECHERCHEV(valeur_cherchee, table_matrice, no_index_col, [valeur_proche])` ?',
        options: [
          'Elle recherche un mot dans le dictionnaire en ligne',
          'Elle cherche une valeur dans la première colonne d\'un tableau et renvoie une valeur située sur la même ligne dans une autre colonne',
          'Elle supprime les doublons d\'une feuille',
          'Elle imprime le tableau en recto-verso',
        ],
        correctAnswer: 1,
        explanation: 'RECHERCHEV est la formule historique pour lier des données entre deux tables via une clé commune.',
      },
      {
        id: 5,
        question: 'Que permet de faire le symbole dollar `$` dans une référence de cellule (ex: `$A$1`) ?',
        options: [
          'Convertir le chiffre en devise dollars américains',
          'Figer (bloquer) la référence lors de l\'étirement ou de la copie de la formule',
          'Multiplier la valeur par 100',
          'Déclarer que la cellule contient une somme d\'argent',
        ],
        correctAnswer: 1,
        explanation: 'Les références absolues `$A$1` empêchent la ligne ou la colonne de changer lorsqu\'on étire la formule.',
      },
      {
        id: 6,
        question: 'Quelle fonction conditionnelle teste une condition et affiche un résultat différent selon qu\'elle est vraie ou fausse ?',
        options: [
          '=TEST()',
          '=SI()',
          '=CHOISIR()',
          '=CONDITION()',
        ],
        correctAnswer: 1,
        explanation: '`=SI(test_logique; valeur_si_vrai; valeur_si_faux)` applique une règle de décision binaire.',
      },
      {
        id: 7,
        question: 'À quoi sert l\'outil Power Query intégré à Excel ?',
        options: [
          'À retoucher des photographies de produits',
          'À importer, nettoyer, transformer et fusionner des données issues de multiples sources de façon automatisée',
          'À traduire des textes en plusieurs langues',
          'À installer des jeux vidéo sur son ordinateur',
        ],
        correctAnswer: 1,
        explanation: 'Power Query automatise l\'ETL (Extract, Transform, Load) sans avoir besoin d\'écrire de macros VBA.',
      },
      {
        id: 8,
        question: 'Quel raccourci clavier universel permet d\'enregistrer immédiatement son classeur de travail ?',
        options: [
          'Ctrl + Z',
          'Ctrl + S',
          'Ctrl + P',
          'Alt + F4',
        ],
        correctAnswer: 1,
        explanation: '`Ctrl + S` (sur Windows) ou `Cmd + S` (sur Mac) sauvegarde immédiatement les modifications du fichier.',
      },
      {
        id: 9,
        question: 'Quelle fonction compte le nombre de cellules contenant des nombres dans une plage ?',
        options: [
          '=COMPTER()',
          '=NB()',
          '=NOMBRE()',
          '=COUNT_ALL()',
        ],
        correctAnswer: 1,
        explanation: '`=NB()` compte les cellules contenant des valeurs numériques. Pour compter toutes les cellules non vides, on utilise `=NBVAL()`.',
      },
      {
        id: 10,
        question: 'Qu\'est-ce qu\'une macro dans Excel ?',
        options: [
          'Un fichier Excel qui pèse plus de 100 Mo',
          'Une séquence d\'instructions enregistrée qui permet d\'automatiser des actions répétitives en un clic',
          'Une faute de calcul dans une cellule',
          'Un graphique à barres 3D',
        ],
        correctAnswer: 1,
        explanation: 'Les macros enregistrent vos manipulations pour les réexécuter automatiquement à la demande.',
      },
    ],
  },

  // =========================================================================
  // 6. MARKETING DIGITAL & GROWTH HACKING
  // =========================================================================
  {
    courseIdPattern: 'marketing',
    title: 'Examen de Validation : Marketing Digital & Acquisition Client',
    questions: [
      {
        id: 1,
        question: 'En marketing numérique, que représente un "Buyer Persona" ?',
        options: [
          'Le numéro de compte bancaire de l\'acheteur',
          'Le profil semi-fictif représentant le client idéal, basé sur des données démographiques, motivations et comportements',
          'Un logiciel d\'espionnage publicitaire',
          'L\'employé chargé de livrer les colis',
        ],
        correctAnswer: 1,
        explanation: 'Le persona aide à adapter son offre, son discours et ses canaux de communication aux besoins réels de sa cible.',
      },
      {
        id: 2,
        question: 'Quelle est la différence fondamentale entre le SEO et le SEA ?',
        options: [
          'Le SEO est payant et le SEA est gratuit',
          'Le SEO désigne le référencement naturel (organique) gratuit sur les moteurs, tandis que le SEA désigne la publicité payante aux enchères',
          'Le SEO concerne uniquement les vidéos et le SEA concerne les photos',
          'Il n\'y a aucune différence, ce sont deux termes synonymes',
        ],
        correctAnswer: 1,
        explanation: 'SEO = Search Engine Optimization (naturel/durable), SEA = Search Engine Advertising (liens sponsorisés payants).',
      },
      {
        id: 3,
        question: 'Que signifie l\'indicateur clé "CAC" en marketing ?',
        options: [
          'Chiffre d\'Affaires Cumulé',
          'Coût d\'Acquisition Client (montant total investi pour convertir un nouveau client)',
          'Compte d\'Accès Commercial',
          'Coefficient d\'Achat Constant',
        ],
        correctAnswer: 1,
        explanation: 'Le CAC calcule la rentabilité : Dépenses Marketing & Ventes divisées par le nombre de nouveaux clients acquis.',
      },
      {
        id: 4,
        question: 'Que désigne l\'optimisation du taux de conversion (CRO - Conversion Rate Optimization) ?',
        options: [
          'L\'achat massif de followers sur les réseaux sociaux',
          'L\'amélioration continue d\'un site web pour transformer un plus grand pourcentage de visiteurs en acheteurs ou prospects',
          'La conversion de devises (ex: Francs CFA en Euros)',
          'Le changement d\'hébergeur web',
        ],
        correctAnswer: 1,
        explanation: 'Le CRO permet d\'augmenter ses ventes sans devoir dépenser plus en publicité, en optimisant l\'expérience utilisateur.',
      },
      {
        id: 5,
        question: 'Quelles sont les 5 étapes du framework Growth Hacking "AARRR" ?',
        options: [
          'Acheter, Analyser, Répéter, Réduire, Réussir',
          'Acquisition, Activation, Rétention, Recommandation (Referral), Revenu',
          'Attention, Action, Réaction, Reprise, Ristourne',
          'Affichage, Appel, Relance, Réception, Remise',
        ],
        correctAnswer: 1,
        explanation: 'Le framework Pirate AARRR modélise l\'ensemble du cycle de vie client pour stimuler une croissance rapide.',
      },
      {
        id: 6,
        question: 'Qu\'est-ce qu\'une page de destination (Landing Page) efficace ?',
        options: [
          'Une page contenant tous les articles de blog de l\'entreprise sans distinction',
          'Une page web ciblée, sans distractions superflues, conçue pour inciter le visiteur à réaliser une action précise (Call to Action)',
          'La page des mentions légales d\'un site',
          'La page d\'erreur 404 du serveur',
        ],
        correctAnswer: 1,
        explanation: 'Une landing page maximise la conversion en concentrant toute l\'attention sur une promesse unique et un appel à l\'action.',
      },
      {
        id: 7,
        question: 'Quel est l\'avantage majeur de l\'Email Marketing par rapport aux réseaux sociaux ?',
        options: [
          'Les emails sont plus faciles à pirater',
          'Vous possédez directement votre liste de contacts sans être dépendant des algorithmes changeants des plateformes tierces',
          'Les emails ne nécessitent aucune connexion Internet pour être envoyés',
          'L\'email marketing est interdit en entreprise',
        ],
        correctAnswer: 1,
        explanation: 'La base e-mail est un actif propriétaire offrant un retour sur investissement (ROI) parmi les plus élevés du secteur.',
      },
      {
        id: 8,
        question: 'Qu\'est-ce qu\'un test A/B (A/B Testing) ?',
        options: [
          'Un examen scolaire de rattrapage',
          'Une méthode comparative consistant à présenter deux versions d\'une page (A et B) à deux échantillons d\'utilisateurs pour mesurer la plus performante',
          'Un test de vitesse de connexion réseau',
          'Un contrôle technique de conformité informatique',
        ],
        correctAnswer: 1,
        explanation: 'L\'A/B testing permet de prendre des décisions d\'optimisation basées sur des données statistiques réelles.',
      },
      {
        id: 9,
        question: 'Que mesure le taux de rebond (Bounce Rate) d\'un site internet ?',
        options: [
          'Le nombre de fois où le serveur redémarre',
          'Le pourcentage de visiteurs qui quittent le site après avoir vu une seule page sans effectuer d\'interaction',
          'La vitesse de chargement des images',
          'Le nombre de clics sur les boutons de partage social',
        ],
        correctAnswer: 1,
        explanation: 'Un taux de rebond élevé peut indiquer une page non pertinente ou une mauvaise expérience utilisateur.',
      },
      {
        id: 10,
        question: 'Que désigne le nouveau terme GEO (Generative Engine Optimization) dans l\'écosystème IA ?',
        options: [
          'La géolocalisation des téléphones par GPS',
          'L\'optimisation des contenus et données d\'une marque pour qu\'elle soit citée et recommandée par les moteurs d\'IA (ChatGPT, Gemini, Perplexity)',
          'La création de cartes géographiques interactives',
          'L\'achat d\'espaces publicitaires dans les journaux locaux',
        ],
        correctAnswer: 1,
        explanation: 'Le GEO est l\'évolution du SEO pour assurer la visibilité des entreprises dans les réponses générées par l\'Intelligence Artificielle.',
      },
    ],
  },
];

// Fonction pour récupérer le quiz associé à un cours
export function getQuizForCourse(courseId: string, courseTitle?: string, courseCategory?: string): CourseQuiz {
  const cId = courseId.toLowerCase();
  const cTitle = (courseTitle || '').toLowerCase();
  const cCat = (courseCategory || '').toLowerCase();

  const found = QUIZ_DATABASE.find(q => {
    const pat = q.courseIdPattern.toLowerCase();
    return cId.includes(pat) || cTitle.includes(pat) || cCat.includes(pat);
  });

  if (found) return found;

  // Fallback selon les thématiques
  if (cId.includes('python') || cTitle.includes('python') || cCat.includes('python') || cTitle.includes('algorithme')) {
    return QUIZ_DATABASE.find(q => q.courseIdPattern === 'python')!;
  }
  if (cId.includes('web') || cTitle.includes('web') || cId.includes('html') || cTitle.includes('javascript') || cCat.includes('développement')) {
    return QUIZ_DATABASE.find(q => q.courseIdPattern === 'web')!;
  }
  if (cId.includes('excel') || cTitle.includes('excel') || cCat.includes('bureau') || cTitle.includes('collaboratif')) {
    return QUIZ_DATABASE.find(q => q.courseIdPattern === 'excel')!;
  }
  if (cId.includes('market') || cTitle.includes('market') || cTitle.includes('growth')) {
    return QUIZ_DATABASE.find(q => q.courseIdPattern === 'marketing')!;
  }
  if (cId.includes('hack') || cTitle.includes('hack') || cTitle.includes('pentest')) {
    return QUIZ_DATABASE.find(q => q.courseIdPattern === 'hacking')!;
  }

  // Par défaut : Cybersécurité
  return QUIZ_DATABASE[0];
}
