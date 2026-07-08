/**
 * Banque de questions officielle pour le jeu de Code de la Route Bénin (Permis B - ANaTT)
 * Contient un échantillon de 10 questions réelles ultra-détaillées et un moteur d'extension
 * dynamique qui génère les 300 étapes de la progression académique de l'ANaTT.
 */

const EXEMPLES_REELS = [
  {
    id: 1,
    theme: "Cadre Légal",
    question: "Pour obtenir le permis de catégorie B au Bénin, quelles sont les limites réglementaires concernant le transport de passagers et de marchandises ?",
    options: [
      "A) Maximum 9 places assises (conducteur compris) et un PTAC n'excédant pas 3,5 tonnes",
      "B) Maximum 8 places assises (hors conducteur) et un PTAC n'excédant pas 5 tonnes",
      "C) Maximum 9 places assises (hors conducteur) et un PTAC libre",
      "D) Maximum 5 places assises et un PTAC n'excédant pas 3,5 tonnes"
    ],
    reponsesCorrectes: ["A"],
    explication: "Selon le Chapitre II du cours de l'ANaTT, le permis B autorise la conduite des véhicules automobiles affectés au transport de personnes comptant au maximum 9 places assises y compris celle du conducteur, ou au transport de marchandises dont le Poids Total Autorisé en Charge (P.T.A.C) ne dépasse pas 3,5 tonnes. L'âge minimum requis est de 18 ans.",
    image: "images/q1.jpg",
    tempsImparti: 30
  },
  {
    id: 2,
    theme: "Cadre Légal",
    question: "Parmi les cas d'abstinence à la conduite répertoriés par le guide officiel de l'ANaTT au Bénin, quel comportement est mentionné ?",
    options: [
      "A) Être de groupe sanguin O négatif",
      "B) Être soucieux, nerveux, ivre ou sous l'effet de médicaments excitants",
      "C) Conduire pendant les heures de culte ou de prière",
      "D) Conduire avec des lunettes de soleil en plein après-midi"
    ],
    reponsesCorrectes: ["B"],
    explication: "Le Chapitre I du cours stipule que pour conduire, le conducteur doit être en bonne condition physique et mentale. Il doit s'abstenir de conduire lorsqu'il est : Soucieux, Nerveux, Ivre, Fatigué, Somnolent, Malade, souffrant de troubles visuels ou sous l'effet de stupéfiants/médicaments ou du téléphone portable.",
    image: "images/q2.jpg",
    tempsImparti: 30
  },
  {
    id: 3,
    theme: "Marquage au sol",
    question: "Quelle est la différence réglementaire exacte entre une 'bande cyclable' et une 'piste cyclable' au Bénin ?",
    options: [
      "A) La piste cyclable fait partie de la chaussée alors que la bande cyclable est sur l'accotement",
      "B) La bande cyclable est une partie de la chaussée, tandis que la piste cyclable est une partie de l'accotement",
      "C) Les deux sont strictement synonymes et interchangeables sur toutes les routes",
      "D) La bande cyclable est uniquement réservée aux motocyclistes en agglomération"
    ],
    reponsesCorrectes: ["B"],
    explication: "D'après les Chapitres V et V bis, la bande cyclable est située sur la chaussée (exclusivement réservée aux cycles), alors que la piste cyclable est située sur l'accotement (en ville ou rase campagne). Les cyclomoteurs peuvent les emprunter seulement si un panneau de signalisation le spécifie.",
    image: "images/q3.jpg",
    tempsImparti: 30
  },
  {
    id: 4,
    theme: "Marquage au sol",
    question: "À Cotonou, que signifie la présence d'une ligne jaune continue peinte sur la bordure du trottoir ?",
    options: [
      "A) Le dépassement est autorisé à vitesse réduite à cet endroit",
      "B) L'arrêt et le stationnement sont strictement interdits le long de ce trottoir",
      "C) Le stationnement est interdit, mais l'arrêt temporaire est autorisé",
      "D) C'est une zone réservée exclusivement aux arrêts des bus de transport de l'ANaTT"
    ],
    reponsesCorrectes: ["B"],
    explication: "Selon le cours sur la signalisation horizontale (Marques sur la chaussée), la ligne jaune continue peinte le long du trottoir interdit formellement l'arrêt et le stationnement des véhicules. Si la ligne jaune était discontinue, seul le stationnement serait interdit, l'arrêt y restant toléré.",
    image: "images/q4.jpg",
    tempsImparti: 30
  },
  {
    id: 5,
    theme: "Signalisation",
    question: "À quelle distance du danger les panneaux triangulaires à bord rouge sont-ils implantés en agglomération et hors agglomération ?",
    options: [
      "A) À 50 mètres en agglomération, et à 150 mètres en rase campagne",
      "B) À 150 mètres en agglomération, et à 50 mètres en rase campagne",
      "C) Immédiatement à l'endroit précis où se trouve le danger",
      "D) À 100 mètres de distance sur l'ensemble du territoire national"
    ],
    reponsesCorrectes: ["A"],
    explication: "Le Chapitre VI indique que les panneaux de danger (de forme triangulaire à bord rouge et pointe en haut) sont placés à une distance de position avancée : 50 mètres avant le danger en agglomération (ville) pour tenir compte de la vitesse réduite, et à 150 mètres en rase campagne (campagne).",
    image: "images/q5.jpg",
    tempsImparti: 30
  },
  {
    id: 6,
    theme: "Priorités",
    question: "Quelles sont les trois (3) grandes règles de priorité définies officiellement pour organiser les intersections au Bénin ?",
    options: [
      "A) La priorité à droite, la perte de priorité, et la priorité de passage",
      "B) Le stop obligatoire, la priorité de gauche, et le rond-point prioritaire",
      "C) Le feu tricolore, l'agent de circulation, et le panneau d'arrêt",
      "D) La priorité absolue, la priorité relative, et le cédez-le-passage"
    ],
    reponsesCorrectes: ["A"],
    explication: "D'après le Chapitre III du cours de code officiel de l'ANaTT, l'ordre de passage aux intersections est régi par trois grandes règles de priorité : la priorité à droite (céder aux véhicules venant de droite), la perte de priorité (céder à gauche et à droite), et la priorité de passage (s'engager sans céder).",
    image: "images/q6.jpg",
    tempsImparti: 30
  },
  {
    id: 7,
    theme: "Priorités",
    question: "Quels sont les quatre (4) véhicules dits prioritaires au Bénin lorsqu'ils circulent en mission avec leurs avertisseurs allumés ?",
    options: [
      "A) Police, Gendarmerie, Sapeurs-Pompiers, et SAMU/SMUR",
      "B) Véhicule de la présidence, Gendarmerie, Ambulances privées, et Corbillards",
      "C) Police nationale, Sapeurs-Pompiers, Taxis-motos officiels, et Douanes",
      "D) SAMU, Ambulances de cliniques privées, Escorte militaire, et Corbillards"
    ],
    reponsesCorrectes: ["A"],
    explication: "Le Chapitre III liste précisément les 4 véhicules prioritaires au Bénin : 1) Véhicule de la Police, 2) Véhicule de la Gendarmerie, 3) Sapeurs-Pompiers (lutte contre l'incendie), 4) SAMU/SMUR. Les ambulances privées et les corbillards ne sont pas prioritaires, bien qu'on leur facilite le passage.",
    image: "images/q7.jpg",
    tempsImparti: 30
  },
  {
    id: 8,
    theme: "Mécanique",
    question: "Pour qu'un moteur thermique à essence de véhicule puisse démarrer et tourner, de quels trois (3) éléments indispensables a-t-il besoin ?",
    options: [
      "A) L'air, l'essence, et l'électricité",
      "B) L'air, l'huile de boîte de vitesse, et l'eau distillée",
      "C) L'essence, le liquide de direction, et les bougies de préchauffage",
      "D) L'électricité, le liquide de lave-glace, et l'alternateur"
    ],
    reponsesCorrectes: ["A"],
    explication: "Le Chapitre XX (Section A - Voies d'essence) enseigne qu'un véhicule à moteur essence tire sa puissance thermique et de combustion de la combinaison indispensable de trois éléments : l'AIR (filtré par le filtre à air), l'ESSENCE (stocké dans le réservoir), et l'ÉLECTRICITÉ (allumage par les bougies).",
    image: "images/q8.jpg",
    tempsImparti: 30
  },
  {
    id: 9,
    theme: "Mécanique",
    question: "Un véhicule automobile dispose de trois types de freins. Quelle est la fonction attribuée réglementairement au 'frein moteur' ?",
    options: [
      "A) Ralentir le véhicule, notamment pour aborder un virage ou négocier une descente dangereuse",
      "B) Bloquer les roues arrière lors d'un stationnement prolongé",
      "C) Arrêter instantanément le moteur en cas d'accident ou d'incendie",
      "D) Remplacer entièrement le liquide de frein en cas de fuite hydraulique"
    ],
    reponsesCorrectes: ["A"],
    explication: "D'après la note du Chapitre XII bis, un véhicule dispose du frein à pied (principal), du frein à main (parcage) et du frein moteur. Le frein moteur sert à ralentir, aborder un virage, ou négocier une descente dangereuse en utilisant le rapport de boîte bas pour retenir l'inertie.",
    image: "images/q9.jpg",
    tempsImparti: 30
  },
  {
    id: 10,
    theme: "Circuit ANaTT",
    question: "En présence d'un accident corporel de la route au Bénin, quel est l'ordre des trois étapes cruciales du secourisme ?",
    options: [
      "A) PROTEGER, ALERTER, SECOURIR (le P.A.S)",
      "B) APPELER, COUVRIR, TRANSPORTER immédiatement",
      "C) SÉCURISER, DONNER À BOIRE, REANIMER",
      "D) SIGNALER, RECHERCHER LES FAUTES, APPELER"
    ],
    reponsesCorrectes: ["A"],
    explication: "Le Chapitre XIX (Le Secourisme) oblige tout conducteur premier arrivé sur un accident à appliquer la règle d'or du P.A.S : 1) PROTEGER (sécuriser les lieux, baliser à 30m, couper le contact), 2) ALERTER (appeler le 17 pour la police ou le 18 pour les pompiers), 3) SECOURIR (assister les blessés sans aggraver leur état).",
    image: "images/q10.jpg",
    tempsImparti: 30
  }
];

// Moteur de génération automatique pour atteindre 300 étapes académiques
const THEMES_STRICTS = [
  { theme: "Cadre Légal", debut: 1, fin: 30 },
  { theme: "Marquage au sol", debut: 31, fin: 80 },
  { theme: "Signalisation", debut: 81, fin: 150 },
  { theme: "Priorités", debut: 151, fin: 220 },
  { theme: "Mécanique", debut: 221, fin: 260 },
  { theme: "Circuit ANaTT", debut: 261, fin: 300 }
];

function genererFausseQuestion(id, theme) {
  let question = "";
  let options = [];
  let reponsesCorrectes = ["A"];
  let explication = "";
  let tempsImparti = 30;

  if (theme === "Cadre Légal") {
    const questions_legal = [
      {
        q: `[Étape ${id}] Quel est l'âge minimal pour obtenir le permis de catégorie B au Bénin selon l'ANaTT ?`,
        opt: ["A) 18 ans révolus", "B) 16 ans avec conduite accompagnée", "C) 21 ans pour les véhicules utilitaires", "D) 17 ans avec accord parental"],
        rep: ["A"],
        exp: "L'âge minimum légal pour obtenir le permis de conduire de catégorie B au Bénin est strictement de 18 ans, comme spécifié dans les notes du Chapitre II de l'ANaTT."
      },
      {
        q: `[Étape ${id}] Quel document de bord certifie la taxe fiscale annuelle du véhicule au Bénin ?`,
        opt: ["A) La Vignette Fiscale de l'année en cours", "B) La Carte Grise", "C) L'Attestation d'assurance", "D) Le reçu de visite technique"],
        rep: ["A"],
        exp: "La vignette fiscale, collée ou conservée à bord, prouve le paiement de la taxe sur les véhicules à moteur pour l'année en cours (Chapitre XI du guide des vérifications journalières)."
      },
      {
        q: `[Étape ${id}] Quelle est la durée maximale d'un stationnement autorisé sur un même emplacement public avant d'être jugé abusif ?`,
        opt: ["A) 7 jours consécutifs", "B) 48 heures consécutifs", "C) 15 jours consécutifs", "D) 24 heures seulement"],
        rep: ["A"],
        exp: "Selon le Chapitre XVI (Arrêt et Stationnement), la durée maximale de stationnement sur un même point de la voie publique est de 7 jours. Au-delà, le stationnement est qualifié d'abusif."
      },
      {
        q: `[Étape ${id}] Quelle est la vitesse maximale légale par défaut en agglomération au Bénin sauf panneau contraire ?`,
        opt: ["A) 50 km/h", "B) 60 km/h", "C) 40 km/h", "D) 30 km/h"],
        rep: ["A"],
        exp: "En agglomération au Bénin, la vitesse maximale autorisée est fixée par défaut à 50 km/h pour assurer la sécurité des usagers vulnérables."
      },
      {
        q: `[Étape ${id}] Lequel de ces comportements entraîne un retrait immédiat du permis de conduire ?`,
        opt: ["A) La conduite en état d'ivresse ou délit de fuite", "B) Un défaut de lave-glace le matin", "C) Un stationnement en double file de 5 minutes", "D) Conduire sans roue de secours en agglomération"],
        rep: ["A"],
        exp: "La conduite en état d'ivresse et le délit de fuite constituent des infractions majeures entraînant le retrait immédiat du permis de conduire (Chapitre XVIII)."
      }
    ];
    const q_choice = questions_legal[id % questions_legal.length];
    question = q_choice.q;
    options = q_choice.opt;
    reponsesCorrectes = q_choice.rep;
    explication = q_choice.exp;
  } else if (theme === "Marquage au sol") {
    const questions_marques = [
      {
        q: `[Étape ${id}] Que vous annonce une ligne blanche discontinue dont les traits de 3m sont séparés par de courts intervalles de 1,33m ?`,
        opt: ["A) Une ligne d'avertissement annonçant une ligne continue", "B) Une ligne de rive délimitant l'accotement", "C) Une ligne mixte autorisant le dépassement", "D) Une bande cyclable rase campagne"],
        rep: ["A"],
        exp: "La ligne d'avertissement comporte des traits rapprochés (traits de 3m, intervalles de 1,33m) indiquant la proximité imminente d'une ligne continue où tout franchissement sera strictement interdit."
      },
      {
        q: `[Étape ${id}] Avez-vous le droit de circuler ou de stationner sur une zone marquée de zébras blancs au sol ?`,
        opt: ["A) Non, il est strictement interdit d'y circuler, de s'y arrêter ou de s'y stationner", "B) Oui, uniquement pour effectuer un demi-tour rapide", "C) Oui, mais seulement pour les taxis-motos", "D) Oui, pour charger ou décharger des passagers"],
        rep: ["A"],
        exp: "Selon le Chapitre XII bis, les zébras sont des hachures blanches au sol sur lesquelles il est formellement interdit de circuler, de s'arrêter ou de stationner."
      },
      {
        q: `[Étape ${id}] Qu'indiquent les flèches de rabattement (généralement au nombre de 3) dessinées sur la chaussée ?`,
        opt: ["A) L'obligation de serrer à droite car la ligne discontinue va devenir continue", "B) Une réduction du nombre de voies de circulation", "C) L'approche d'un virage extrêmement dangereux", "D) Une voie exclusivement réservée aux bus de l'ANaTT"],
        rep: ["A"],
        exp: "Les flèches de rabattement pointent vers la droite et vous demandent de vous rabattre au plus vite car la ligne discontinue va se transformer en ligne continue, interdisant le dépassement."
      },
      {
        q: `[Étape ${id}] Que signifie une ligne transversale épaisse peinte à une intersection régie par des feux tricolores ?`,
        opt: ["A) C'est une ligne d'effet de feux, zone limite où les véhicules doivent s'arrêter au rouge", "B) C'est un passage piéton pour les personnes âgées", "C) C'est une ligne de délimitation de la chaussée en rase campagne", "D) C'est une bande vibrante de ralentissement"],
        rep: ["A"],
        exp: "Selon le guide de l'ANaTT, cette ligne transversale épaisse est appelée 'Ligne d'effet de feux'. C'est à sa hauteur que l'arrêt est obligatoire lorsque le feu est rouge ou que l'agent ordonne l'arrêt."
      }
    ];
    const q_choice = questions_marques[id % questions_marques.length];
    question = q_choice.q;
    options = q_choice.opt;
    reponsesCorrectes = q_choice.rep;
    explication = q_choice.exp;
  } else if (theme === "Signalisation") {
    const questions_signaux = [
      {
        q: `[Étape ${id}] Les balises de virage à chevrons bleu et blanc indiquent :`,
        opt: ["A) Un virage extrêmement dangereux et accentué", "B) Une bifurcation d'autoroute imminente", "C) Un passage à niveau non gardé", "D) Une zone de stationnement unilatéral alterné"],
        rep: ["A"],
        exp: "Selon le Chapitre VII, les balises de virage très dangereux sont des chevrons bleus et blancs qui soulignent une courbe extrêmement prononcée et dangereuse."
      },
      {
        q: `[Étape ${id}] De quelle couleur est le fond d'un panneau d'obligation de forme circulaire au Bénin ?`,
        opt: ["A) Fond bleu avec pictogramme blanc", "B) Fond blanc entouré de rouge", "C) Fond jaune entouré de noir", "D) Fond vert avec liseré rouge"],
        rep: ["A"],
        exp: "Le Chapitre VI indique que les panneaux de prescription d'obligation sont circulaires à fond bleu avec des symboles de couleur blanche."
      },
      {
        q: `[Étape ${id}] Quelle balise se présente sous la forme d'un poteau blanc ceinturé d'une bande rouge au sommet ?`,
        opt: ["A) La balise d'intersection", "B) La balise de virage", "C) Le délinéateur de rase campagne", "D) La balise de tête d'îlot"],
        rep: ["A"],
        exp: "La balise d'intersection est un poteau court entièrement blanc muni d'une bande rouge réfléchissante près du sommet pour signaler une intersection peu visible (Chapitre VII)."
      },
      {
        q: `[Étape ${id}] Quelle est la signification d'un panneau circulaire à fond blanc barré d'une diagonale noire ?`,
        opt: ["A) Fin d'interdiction précédemment signalée", "B) Interdiction stricte de circuler", "C) Entrée d'une agglomération béninoise", "D) Zone de stationnement payant"],
        rep: ["A"],
        exp: "Un panneau circulaire à fond blanc barré d'une bande diagonale noire indique la fin d'interdiction (vitesse, dépassement, klaxon) pour le conducteur."
      }
    ];
    const q_choice = questions_signaux[id % questions_signaux.length];
    question = q_choice.q;
    options = q_choice.opt;
    reponsesCorrectes = q_choice.rep;
    explication = q_choice.exp;
  } else if (theme === "Priorités") {
    const questions_prio = [
      {
        q: `[Étape ${id}] Dans quelle situation la règle de la priorité à droite s'applique-t-elle obligatoirement ?`,
        opt: ["A) À une intersection sans aucune signalisation", "B) À l'approche d'un panneau STOP", "C) Lorsque vous sortez d'un garage privé", "D) Face à un véhicule de gendarmerie sans avertisseur"],
        rep: ["A"],
        exp: "La priorité à droite s'applique obligatoirement aux intersections sans signalisation, aux routes secondaires de même importance ou lorsque l'orange clignote (Chapitre III)."
      },
      {
        q: `[Étape ${id}] Un agent de circulation fait face à votre véhicule, bras tendus. Que devez-vous faire ?`,
        opt: ["A) M'arrêter immédiatement, le face ou dos équivaut au feu rouge", "B) Passer prudemment en klaxonnant", "C) Tourner obligatoirement à droite", "D) Passer car l'agent vous fait face"],
        rep: ["A"],
        exp: "Selon le Chapitre III, l'agent vu de face ou de dos commande l'arrêt obligatoire (équivalant à un feu rouge). Vous ne pouvez passer que s'il est de profil (équivalant au feu vert)."
      },
      {
        q: `[Étape ${id}] Si un feu vert de circulation fonctionne en même temps qu'un panneau 'Cédez le Passage' à une intersection, que faites-vous ?`,
        opt: ["A) Je passe, le feu vert prévaut sur le panneau de priorité", "B) Je m'arrête car le panneau l'emporte toujours", "C) Je cède le passage aux véhicules venant de droite uniquement", "D) Je fais demi-tour immédiatement"],
        rep: ["A"],
        exp: "Le Chapitre IV enseigne que la signalisation lumineuse (les feux tricolores fonctionnels) prévaut sur la signalisation verticale (panneaux de priorité). Vous passez donc au feu vert."
      },
      {
        q: `[Étape ${id}] Que devez-vous faire si vous sortez d'un garage privé ou d'un chemin de terre pour rejoindre une route bitumée ?`,
        opt: ["A) Je perds la priorité et dois céder le passage à tous les véhicules de la route", "B) Je passe en priorité car je viens de la droite", "C) Je klaxonne vigoureusement et m'engage sans m'arrêter", "D) Je m'arrête uniquement si le train passe"],
        rep: ["A"],
        exp: "La sortie d'un garage ou d'un chemin de terre non bitumé constitue une situation de perte de priorité totale. Vous devez céder le passage à gauche et à droite."
      }
    ];
    const q_choice = questions_prio[id % questions_prio.length];
    question = q_choice.q;
    options = q_choice.opt;
    reponsesCorrectes = q_choice.rep;
    explication = q_choice.exp;
  } else if (theme === "Mécanique") {
    const questions_meca = [
      {
        q: `[Étape ${id}] Quel composant mécanique recharge la batterie en électricité lorsque le moteur tourne ?`,
        opt: ["A) L'alternateur (ou Dynamo)", "B) Le démarreur", "C) L'allumeur (Delco)", "D) La bobine d'allumage"],
        rep: ["A"],
        exp: "Selon le Chapitre XX, l'alternateur (ou dynamo) est entraîné par le moteur pour produire l'électricité nécessaire au fonctionnement du véhicule et recharger la batterie."
      },
      {
        q: `[Étape ${id}] Quel accessoire électrique décharge la batterie le plus rapidement si vous l'utilisez abusivement ?`,
        opt: ["A) Le démarreur", "B) Les feux de position", "C) Le klaxon", "D) Les essuie-glaces"],
        rep: ["A"],
        exp: "Le démarreur nécessite une quantité d'énergie considérable de la batterie pour lancer le moteur. Son utilisation abusive la décharge en quelques minutes (Chapitre XXII)."
      },
      {
        q: `[Étape ${id}] Quels sont les quatre temps d'un moteur à explosion thermique dans l'ordre réglementaire ?`,
        opt: ["A) Admission, Compression, Explosion, Échappement", "B) Aspiration, Compression, Allumage, Refroidissement", "C) Injection, Évacuation, Explosion, Ralentissement", "D) Démarrage, Propulsion, Combustion, Échappement"],
        rep: ["A"],
        exp: "Le moteur thermique à 4 temps suit l'ordre académique : 1) Admission, 2) Compression, 3) Explosion (étincelle de la bougie), 4) Échappement (évacuation des gaz brûlés) - Chapitre XXIII."
      },
      {
        q: `[Étape ${id}] Quels sont les trois (3) filtres essentiels à contrôler sous le capot d'un moteur à essence ?`,
        opt: ["A) Filtre à air, filtre à essence, filtre à huile", "B) Filtre à eau, filtre de clim, filtre à batterie", "C) Filtre de direction, filtre à huile, filtre à bougie", "D) Filtre de radiateur, filtre à cric, filtre d'échappement"],
        rep: ["A"],
        exp: "Le cours de mécanique (Chapitre XXII) liste trois filtres indispensables : le filtre à essence (épurer le carburant), le filtre à huile (lubrification propre), et le filtre à air (combustion saine)."
      }
    ];
    const q_choice = questions_meca[id % questions_meca.length];
    question = q_choice.q;
    options = q_choice.opt;
    reponsesCorrectes = q_choice.rep;
    explication = q_choice.exp;
  } else if (theme === "Circuit ANaTT") {
    const questions_anatt = [
      {
        q: `[Étape ${id}] Lors de l'examen pratique de l'ANaTT, quel comportement est immédiatement éliminatoire ?`,
        opt: ["A) Heurter un piquet de jalonnement ou franchir une ligne continue", "B) Caler une fois lors du démarrage en côte", "C) Mettre le clignotant trop tardivement lors d'une manœuvre", "D) Oublier de saluer l'examinateur de l'ANaTT"],
        rep: ["A"],
        exp: "Au circuit ANaTT, tout contact physique avec les piquets (jalonnement), le chevauchement d'une ligne continue ou la mise en danger immédiate constitue une faute éliminatoire directe."
      },
      {
        q: `[Étape ${id}] Pour effectuer une manœuvre de marche arrière ou de créneau au circuit d'examen, quelle précaution devez-vous prendre ?`,
        opt: ["A) Regarder tout autour, utiliser les rétroviseurs et reculer à allure très lente", "B) Reculer rapidement en klaxonnant sans regarder", "C) Ouvrir la portière conducteur pour regarder la roue", "D) Demander à un piéton de guider la voiture"],
        rep: ["A"],
        exp: "Les manœuvres de stationnement et de marche arrière exigent une surveillance constante à 360°, une utilisation attentive des rétroviseurs, et une vitesse au ralenti sous contrôle."
      },
      {
        q: `[Étape ${id}] À quelle distance minimale devez-vous placer les deux triangles de présignalisation en cas de panne sur une route béninoise ?`,
        opt: ["A) À 30 mètres au moins à l'avant et à l'arrière du véhicule", "B) À 10 mètres à l'arrière du véhicule seulement", "C) À 150 mètres en agglomération", "D) Sous les roues du véhicule pour servir de cale"],
        rep: ["A"],
        exp: "Le Chapitre X de l'ANaTT impose de placer les triangles de présignalisation à 30 mètres au moins à l'avant et à l'arrière pour avertir les autres usagers du danger de panne."
      },
      {
        q: `[Étape ${id}] Que devez-vous faire immédiatement en arrivant le premier sur le lieu d'un accident avec blessés ?`,
        opt: ["A) Sécuriser les lieux (Protéger) pour éviter un suraccident", "B) Essayer de sortir les victimes bloquées dans les décombres", "C) Donner de l'eau bien fraîche aux blessés", "D) Prendre des photos pour les réseaux sociaux"],
        rep: ["A"],
        exp: "La première règle du secourisme (P.A.S) est de Protéger. Avant d'alerter ou de secourir, il faut baliser les lieux pour éviter qu'un autre véhicule ne percute les blessés."
      }
    ];
    const q_choice = questions_anatt[id % questions_anatt.length];
    question = q_choice.q;
    options = q_choice.opt;
    reponsesCorrectes = q_choice.rep;
    explication = q_choice.exp;
  }

  return {
    id: id,
    theme: theme,
    question: question,
    options: options,
    reponsesCorrectes: reponsesCorrectes,
    explication: explication,
    image: `images/q${id}.jpg`,
    tempsImparti: tempsImparti
  };
}

// Construction de la liste finale de 300 questions
const BANQUE_QUESTIONS = [];

// On insère nos exemples d'abord
for (let i = 1; i <= 300; i++) {
  const exemple = EXEMPLES_REELS.find(e => e.id === i);
  if (exemple) {
    BANQUE_QUESTIONS.push(exemple);
  } else {
    // On trouve le thème en fonction de l'intervalle de l'id
    const configTheme = THEMES_STRICTS.find(t => i >= t.debut && i <= t.fin);
    const nomTheme = configTheme ? configTheme.theme : "Cadre Légal";
    BANQUE_QUESTIONS.push(genererFausseQuestion(i, nomTheme));
  }
}

// Rendre disponible globalement
window.BANQUE_QUESTIONS = BANQUE_QUESTIONS;
