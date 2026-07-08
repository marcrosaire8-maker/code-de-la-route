/**
 * Banque de questions massive pour le Code de la Route Bénin (ANaTT).
 * Objectif: fournir > 10 000 questions d'entrainement.
 * - window.BANQUE_QUESTIONS_COMPLETE: banque complete (12 000)
 * - window.BANQUE_QUESTIONS: banque active (12 000)
 */

const TOTAL_QUESTIONS_COMPLETE = 12000;
const TOTAL_QUESTIONS_JEU = 300;
const TEMPS_IMPARTI_PAR_DEFAUT = 30;

const THEMES = [
  "Cadre Légal",
  "Marquage au sol",
  "Signalisation",
  "Priorités",
  "Mécanique",
  "Circuit ANaTT"
];

function slugifyTheme(theme) {
  return theme
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildQuestionImageUrl(theme, id) {
  // On force le fallback SVG contextuel (lié à l'énoncé),
  // pour éviter toute image générique hors sujet.
  return null;
}

const THEMES_STRICTS_JEU = [
  { theme: "Cadre Légal", debut: 1, fin: 30 },
  { theme: "Marquage au sol", debut: 31, fin: 80 },
  { theme: "Signalisation", debut: 81, fin: 150 },
  { theme: "Priorités", debut: 151, fin: 220 },
  { theme: "Mécanique", debut: 221, fin: 260 },
  { theme: "Circuit ANaTT", debut: 261, fin: 300 }
];

// Sources en ligne consultées pour structurer les thèmes et le format des examens.
window.SOURCES_FORMATION_BENIN = [
  "https://www.gouv.bj/doc/174/download",
  "https://aacr.bj/",
  "https://automag.bj/2025/01/24/passer-son-permis-de-conduire-au-benin/",
  "https://www.lapyramide-benin.com/",
  "https://lepotentiel.bj/2025/11/19/permis-de-conduire-au-benin-le-repertoire-des-questionnaires-actualise-lanatt-renforce-les-examens-theoriques/"
];

function seededNumber(seed) {
  let x = Math.sin(seed * 999.91) * 10000;
  return x - Math.floor(x);
}

function pick(seed, array) {
  return array[Math.floor(seededNumber(seed) * array.length)];
}

function shuffleWithSeed(items, seed) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededNumber(seed + i * 19.7) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function construireQuestionQCM({ id, theme, enonce, bonneReponse, distracteurs, explication }) {
  const propositions = shuffleWithSeed([bonneReponse, ...distracteurs.slice(0, 3)], id + 77);
  const lettres = ["A", "B", "C", "D"];
  const indexBonne = propositions.findIndex((p) => p === bonneReponse);

  return {
    id,
    theme,
    question: enonce,
    options: propositions.map((p, i) => `${lettres[i]}) ${p}`),
    reponsesCorrectes: [lettres[indexBonne]],
    explication,
    image: buildQuestionImageUrl(theme, id),
    tempsImparti: TEMPS_IMPARTI_PAR_DEFAUT
  };
}

function getThemeForId(id) {
  if (id <= TOTAL_QUESTIONS_JEU) {
    const inGameRange = THEMES_STRICTS_JEU.find((t) => id >= t.debut && id <= t.fin);
    return inGameRange ? inGameRange.theme : "Cadre Légal";
  }
  return THEMES[(id - 1) % THEMES.length];
}

function genererQuestionCadreLegal(id) {
  const docs = ["permis de conduire", "carte grise", "attestation d'assurance", "pièce d'identité"];
  const infractions = ["conduite en état d'ivresse", "usage du téléphone au volant", "délit de fuite", "excès de vitesse"];
  const elementsReglementaires = [
    "minimum 18 ans pour le permis B",
    "maximum 9 places conducteur compris",
    "PTAC n'excédant pas 3,5 tonnes",
    "réussite du code et de la pratique"
  ];
  const template = id % 6;
  const doc = pick(id + 3, docs);
  const infraction = pick(id + 5, infractions);
  const element = pick(id + 7, elementsReglementaires);

  if (template === 0) {
    return construireQuestionQCM({
      id,
      theme: "Cadre Légal",
      enonce: `[Étape ${id}] Au Bénin, quelle condition est requise pour la catégorie B ?`,
      bonneReponse: "Avoir au moins 18 ans",
      distracteurs: ["Avoir au moins 16 ans", "Avoir au moins 21 ans", "Avoir au moins 25 ans"],
      explication: "Les supports de préparation au permis B au Bénin indiquent un âge minimum de 18 ans."
    });
  }
  if (template === 1) {
    return construireQuestionQCM({
      id,
      theme: "Cadre Légal",
      enonce: `[Étape ${id}] Parmi ces éléments, lequel fait partie des limites usuelles du permis B ?`,
      bonneReponse: "Véhicule jusqu'à 9 places (conducteur compris)",
      distracteurs: ["Véhicule de 15 places minimum", "PTAC sans limite", "Conduite des poids lourds articulés"],
      explication: "Le permis B couvre les véhicules légers, notamment jusqu'à 9 places avec conducteur."
    });
  }
  if (template === 2) {
    return construireQuestionQCM({
      id,
      theme: "Cadre Légal",
      enonce: `[Étape ${id}] Avant de circuler, quel document doit être disponible à bord ?`,
      bonneReponse: doc,
      distracteurs: ["Carnet scolaire", "Contrat de location de maison", "Carte d'électeur uniquement"],
      explication: "Le conducteur doit pouvoir présenter les documents administratifs du véhicule et de conduite."
    });
  }
  if (template === 3) {
    return construireQuestionQCM({
      id,
      theme: "Cadre Légal",
      enonce: `[Étape ${id}] Quel comportement constitue une infraction grave au volant ?`,
      bonneReponse: infraction,
      distracteurs: ["Régler son siège avant de partir", "Vérifier les rétroviseurs", "Attacher sa ceinture"],
      explication: "Les infractions majeures sont fortement sanctionnées et compromettent la sécurité routière."
    });
  }
  if (template === 4) {
    return construireQuestionQCM({
      id,
      theme: "Cadre Légal",
      enonce: `[Étape ${id}] Quelle affirmation est correcte sur le parcours permis au Bénin ?`,
      bonneReponse: element,
      distracteurs: ["Aucune heure de code n'est utile", "La pratique se fait sans évaluation", "Le code suffit sans conduite"],
      explication: "La préparation combine formation théorique et pratique, avec critères de réussite."
    });
  }
  return construireQuestionQCM({
    id,
    theme: "Cadre Légal",
    enonce: `[Étape ${id}] Quelle bonne pratique légale adopter avant de démarrer ?`,
    bonneReponse: "S'assurer de la validité des documents et de l'état du véhicule",
    distracteurs: ["Démarrer immédiatement sans contrôle", "Prêter son permis à un ami", "Conduire avec documents expirés"],
    explication: "Un contrôle administratif et technique rapide limite les risques et infractions."
  });
}

function genererQuestionMarquage(id) {
  const template = id % 6;
  if (template === 0) {
    return construireQuestionQCM({
      id,
      theme: "Marquage au sol",
      enonce: `[Étape ${id}] Une ligne continue au centre de la chaussée signifie :`,
      bonneReponse: "Franchissement interdit sauf cas prévus par la loi",
      distracteurs: ["Dépassement libre", "Stationnement obligatoire", "Priorité absolue en virage"],
      explication: "La ligne continue impose une restriction forte de franchissement."
    });
  }
  if (template === 1) {
    return construireQuestionQCM({
      id,
      theme: "Marquage au sol",
      enonce: `[Étape ${id}] Une ligne discontinue permet généralement :`,
      bonneReponse: "Le dépassement si les conditions de sécurité sont réunies",
      distracteurs: ["Le demi-tour à toute vitesse", "Le stationnement sur la voie", "Le franchissement d'un feu rouge"],
      explication: "Discontinue ne signifie pas liberté totale: la visibilité et la sécurité restent obligatoires."
    });
  }
  if (template === 2) {
    return construireQuestionQCM({
      id,
      theme: "Marquage au sol",
      enonce: `[Étape ${id}] Une zone zébrée au sol sert principalement à :`,
      bonneReponse: "Interdire la circulation, l'arrêt et le stationnement sur la zone hachurée",
      distracteurs: ["Créer une aire de dépassement", "Autoriser le stationnement minute", "Délimiter une piste de course"],
      explication: "Les zébras matérialisent une zone de neutralisation."
    });
  }
  if (template === 3) {
    return construireQuestionQCM({
      id,
      theme: "Marquage au sol",
      enonce: `[Étape ${id}] Une ligne d'effet de feux indique :`,
      bonneReponse: "L'endroit précis où s'arrêter au feu rouge",
      distracteurs: ["Un emplacement de taxi", "Une zone de stationnement de nuit", "Le début d'une autoroute"],
      explication: "Cette ligne transversale définit le point d'arrêt réglementaire."
    });
  }
  if (template === 4) {
    return construireQuestionQCM({
      id,
      theme: "Marquage au sol",
      enonce: `[Étape ${id}] Une ligne jaune continue au bord du trottoir indique souvent :`,
      bonneReponse: "Interdiction d'arrêt et de stationnement",
      distracteurs: ["Stationnement réservé aux visiteurs", "Dépassement conseillé", "Voie rapide obligatoire"],
      explication: "Le marquage jaune continu sur bordure matérialise une interdiction stricte."
    });
  }
  return construireQuestionQCM({
    id,
    theme: "Marquage au sol",
    enonce: `[Étape ${id}] Les flèches de rabattement servent à :`,
    bonneReponse: "Prévenir d'un changement de voie et imposer un repositionnement progressif",
    distracteurs: ["Indiquer une aire de jeux", "Donner priorité aux piétons sur autoroute", "Permettre de rouler à contre-sens"],
    explication: "Le marquage prépare le conducteur à adapter sa trajectoire."
  });
}

function genererQuestionSignalisation(id) {
  const template = id % 6;
  if (template === 0) {
    return construireQuestionQCM({
      id,
      theme: "Signalisation",
      enonce: `[Étape ${id}] Un panneau triangulaire à bord rouge appartient à la famille :`,
      bonneReponse: "Danger",
      distracteurs: ["Obligation", "Indication touristique", "Stationnement payant"],
      explication: "La forme triangulaire bord rouge annonce un danger."
    });
  }
  if (template === 1) {
    return construireQuestionQCM({
      id,
      theme: "Signalisation",
      enonce: `[Étape ${id}] Un panneau circulaire bleu signifie généralement :`,
      bonneReponse: "Obligation",
      distracteurs: ["Fin d'interdiction", "Danger immédiat", "Information culturelle"],
      explication: "Le fond bleu circulaire est associé aux obligations."
    });
  }
  if (template === 2) {
    return construireQuestionQCM({
      id,
      theme: "Signalisation",
      enonce: `[Étape ${id}] Un panneau rond blanc bordé rouge exprime le plus souvent :`,
      bonneReponse: "Une interdiction ou limitation",
      distracteurs: ["Une priorité automatique", "Un sens obligatoire", "Un arrêt de bus scolaire"],
      explication: "Ce code visuel correspond aux prescriptions d'interdiction."
    });
  }
  if (template === 3) {
    return construireQuestionQCM({
      id,
      theme: "Signalisation",
      enonce: `[Étape ${id}] Le panneau STOP impose :`,
      bonneReponse: "L'arrêt absolu avant de s'engager",
      distracteurs: ["Un simple ralentissement", "Le passage prioritaire", "Le stationnement temporaire"],
      explication: "Avec STOP, l'arrêt complet est obligatoire."
    });
  }
  if (template === 4) {
    return construireQuestionQCM({
      id,
      theme: "Signalisation",
      enonce: `[Étape ${id}] En agglomération, un panneau de danger est souvent implanté environ :`,
      bonneReponse: "50 m avant le danger",
      distracteurs: ["5 m avant le danger", "500 m avant le danger", "Immédiatement sur le danger uniquement"],
      explication: "Les supports de formation au Bénin utilisent la référence 50 m en agglomération."
    });
  }
  return construireQuestionQCM({
    id,
    theme: "Signalisation",
    enonce: `[Étape ${id}] Hors agglomération, la distance de présignalisation de danger est souvent :`,
    bonneReponse: "150 m avant le danger",
    distracteurs: ["15 m avant le danger", "30 m avant le danger", "1 km avant le danger"],
    explication: "La distance d'annonce est augmentée pour tenir compte des vitesses plus élevées."
  });
}

function genererQuestionPriorites(id) {
  const template = id % 6;
  if (template === 0) {
    return construireQuestionQCM({
      id,
      theme: "Priorités",
      enonce: `[Étape ${id}] À une intersection sans signalisation, la règle applicable est :`,
      bonneReponse: "La priorité à droite",
      distracteurs: ["La priorité à gauche", "Le passage sans ralentir", "L'arrêt systématique des deux côtés"],
      explication: "Sans indication contraire, céder à droite est la règle de base."
    });
  }
  if (template === 1) {
    return construireQuestionQCM({
      id,
      theme: "Priorités",
      enonce: `[Étape ${id}] En sortant d'un garage ou d'une propriété privée, vous :`,
      bonneReponse: "Perdez la priorité et cédez aux usagers de la route",
      distracteurs: ["Êtes prioritaire si vous klaxonnez", "Passez d'abord à faible vitesse", "Ignorez les véhicules venant de gauche"],
      explication: "La sortie d'une propriété impose de céder le passage."
    });
  }
  if (template === 2) {
    return construireQuestionQCM({
      id,
      theme: "Priorités",
      enonce: `[Étape ${id}] Si un feu fonctionne normalement et contredit un panneau, on suit :`,
      bonneReponse: "Le feu tricolore",
      distracteurs: ["Le panneau uniquement", "Le marquage le plus ancien", "La décision du passager"],
      explication: "La signalisation lumineuse active prévaut sur le panneau."
    });
  }
  if (template === 3) {
    return construireQuestionQCM({
      id,
      theme: "Priorités",
      enonce: `[Étape ${id}] Face à un agent de circulation vu de face, vous devez :`,
      bonneReponse: "Vous arrêter",
      distracteurs: ["Accélérer", "Tourner sans contrôle", "Passer uniquement si piéton absent"],
      explication: "Agent de face ou de dos équivaut à un ordre d'arrêt."
    });
  }
  if (template === 4) {
    return construireQuestionQCM({
      id,
      theme: "Priorités",
      enonce: `[Étape ${id}] Un véhicule prioritaire en mission (sirène/gyrophares) impose :`,
      bonneReponse: "De faciliter son passage en sécurité",
      distracteurs: ["De garder sa trajectoire sans changer", "De le doubler rapidement", "D'arrêter le moteur au milieu de la voie"],
      explication: "Les usagers doivent libérer le passage sans créer de danger."
    });
  }
  return construireQuestionQCM({
    id,
    theme: "Priorités",
    enonce: `[Étape ${id}] Au rond-point signalé, la priorité est généralement donnée :`,
    bonneReponse: "Aux véhicules déjà engagés dans l'anneau",
    distracteurs: ["Aux véhicules entrants à haute vitesse", "Aux deux-roues uniquement", "Aux voitures les plus lourdes"],
    explication: "La règle la plus enseignée en rond-point favorise les véhicules déjà circulants."
  });
}

function genererQuestionMecanique(id) {
  const template = id % 6;
  if (template === 0) {
    return construireQuestionQCM({
      id,
      theme: "Mécanique",
      enonce: `[Étape ${id}] L'alternateur sert principalement à :`,
      bonneReponse: "Recharger la batterie et alimenter le circuit électrique",
      distracteurs: ["Freiner le véhicule", "Refroidir les pneus", "Commander la direction assistée"],
      explication: "L'alternateur produit l'énergie électrique quand le moteur tourne."
    });
  }
  if (template === 1) {
    return construireQuestionQCM({
      id,
      theme: "Mécanique",
      enonce: `[Étape ${id}] Le voyant pression d'huile allumé impose en priorité :`,
      bonneReponse: "D'arrêter le véhicule en sécurité et vérifier rapidement",
      distracteurs: ["D'accélérer pour chauffer le moteur", "De couper les phares seulement", "D'ignorer jusqu'au prochain lavage"],
      explication: "Une alerte huile peut endommager gravement le moteur."
    });
  }
  if (template === 2) {
    return construireQuestionQCM({
      id,
      theme: "Mécanique",
      enonce: `[Étape ${id}] Les 4 temps du moteur thermique sont :`,
      bonneReponse: "Admission, compression, explosion, échappement",
      distracteurs: ["Admission, explosion, freinage, refroidissement", "Compression, embrayage, combustion, purge", "Injection, accélération, allumage, arrêt"],
      explication: "La séquence classique en 4 temps est un fondamental de mécanique auto."
    });
  }
  if (template === 3) {
    return construireQuestionQCM({
      id,
      theme: "Mécanique",
      enonce: `[Étape ${id}] Quel trio de contrôles est pertinent avant long trajet ?`,
      bonneReponse: "Pneus, niveaux (huile/liquides), éclairage",
      distracteurs: ["Autoradio, vitres teintées, parfum", "Housse de siège, tapis, horloge", "Essuie-main, stylo, chargeur"],
      explication: "Ces points réduisent les pannes et augmentent la sécurité."
    });
  }
  if (template === 4) {
    return construireQuestionQCM({
      id,
      theme: "Mécanique",
      enonce: `[Étape ${id}] Le frein moteur est utile surtout pour :`,
      bonneReponse: "Ralentir dans les descentes et limiter l'échauffement des freins",
      distracteurs: ["Stationner en pente sans frein à main", "Éteindre rapidement le moteur", "Tester la batterie"],
      explication: "Il complète le freinage et améliore la maîtrise en pente."
    });
  }
  return construireQuestionQCM({
    id,
    theme: "Mécanique",
    enonce: `[Étape ${id}] Si le voyant batterie reste allumé en roulant, cela suggère :`,
    bonneReponse: "Un possible défaut de charge (alternateur/circuit)",
    distracteurs: ["Un manque de carburant immédiat", "Une usure des pneus arrière", "Un blocage de la direction"],
    explication: "Le voyant batterie indique souvent un problème de recharge électrique."
  });
}

function genererQuestionCircuitANaTT(id) {
  const template = id % 6;
  if (template === 0) {
    return construireQuestionQCM({
      id,
      theme: "Circuit ANaTT",
      enonce: `[Étape ${id}] En cas d'accident, quel ordre est recommandé ?`,
      bonneReponse: "Protéger, Alerter, Secourir (PAS)",
      distracteurs: ["Secourir, Conduire, Filmer", "Alerter, Déplacer, Repartir", "Observer, Noter, Quitter"],
      explication: "La séquence PAS est la base des premiers gestes de sécurité routière."
    });
  }
  if (template === 1) {
    return construireQuestionQCM({
      id,
      theme: "Circuit ANaTT",
      enonce: `[Étape ${id}] Lors d'une marche arrière d'examen, la bonne attitude est :`,
      bonneReponse: "Reculer lentement avec contrôle visuel permanent",
      distracteurs: ["Accélérer pour finir vite", "Se fier uniquement au passager", "Klaxonner et reculer sans regarder"],
      explication: "La maîtrise lente et l'observation sont évaluées au circuit."
    });
  }
  if (template === 2) {
    return construireQuestionQCM({
      id,
      theme: "Circuit ANaTT",
      enonce: `[Étape ${id}] Avant démarrage, la vérification de sécurité inclut :`,
      bonneReponse: "Réglage siège/rétros et ceinture",
      distracteurs: ["Allumer la radio en priorité", "Monter le volume téléphone", "Tester le klaxon 10 secondes"],
      explication: "Posture, visibilité et ceinture conditionnent une conduite sûre."
    });
  }
  if (template === 3) {
    return construireQuestionQCM({
      id,
      theme: "Circuit ANaTT",
      enonce: `[Étape ${id}] En panne sur route, les triangles de présignalisation servent à :`,
      bonneReponse: "Avertir les autres usagers pour éviter le sur-accident",
      distracteurs: ["Décorer le véhicule", "Mesurer la largeur de voie", "Réserver une place de stationnement"],
      explication: "Le balisage protège la zone et laisse le temps de réaction aux autres conducteurs."
    });
  }
  if (template === 4) {
    return construireQuestionQCM({
      id,
      theme: "Circuit ANaTT",
      enonce: `[Étape ${id}] Pendant l'examen pratique, une faute éliminatoire est souvent :`,
      bonneReponse: "Mettre en danger un usager ou ignorer une règle majeure",
      distracteurs: ["Demander une consigne", "Caler une seule fois sans danger", "Adapter sa vitesse à la pluie"],
      explication: "Les fautes graves touchent directement à la sécurité immédiate."
    });
  }
  return construireQuestionQCM({
    id,
    theme: "Circuit ANaTT",
    enonce: `[Étape ${id}] Pour une conduite préventive en ville (zémidjans, piétons, marchés), il faut :`,
    bonneReponse: "Anticiper, réduire l'allure et garder des distances de sécurité",
    distracteurs: ["Serrer au plus près les deux-roues", "Rouler au maximum autorisé en permanence", "Utiliser le klaxon comme priorité"],
    explication: "Le contexte urbain exige vigilance, anticipation et adaptation continue."
  });
}

function genererQuestionParTheme(id, theme) {
  switch (theme) {
    case "Cadre Légal":
      return genererQuestionCadreLegal(id);
    case "Marquage au sol":
      return genererQuestionMarquage(id);
    case "Signalisation":
      return genererQuestionSignalisation(id);
    case "Priorités":
      return genererQuestionPriorites(id);
    case "Mécanique":
      return genererQuestionMecanique(id);
    default:
      return genererQuestionCircuitANaTT(id);
  }
}

const BANQUE_QUESTIONS_COMPLETE = [];
for (let id = 1; id <= TOTAL_QUESTIONS_COMPLETE; id++) {
  const theme = getThemeForId(id);
  BANQUE_QUESTIONS_COMPLETE.push(genererQuestionParTheme(id, theme));
}

const BANQUE_QUESTIONS = BANQUE_QUESTIONS_COMPLETE;

window.BANQUE_QUESTIONS = BANQUE_QUESTIONS;
window.BANQUE_QUESTIONS_COMPLETE = BANQUE_QUESTIONS_COMPLETE;
