/**
 * Catalogue des panneaux de signalisation routière (référentiel d'entraînement).
 * - Image distante si disponible
 * - Fallback SVG local garanti pour affichage fiable sur mobile
 */

function wikiSign(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

const CATALOGUE_PANNEAUX = [
  { id: "A1a", nom: "Danger", categorie: "danger", description: "Annonce un danger général.", image: wikiSign("France road sign A1a.svg"), motsCles: ["danger", "triangle"] },
  { id: "A1b", nom: "Virage dangereux", categorie: "danger", description: "Annonce un virage dangereux.", image: wikiSign("France road sign A1b.svg"), motsCles: ["virage", "danger"] },
  { id: "A3", nom: "Chaussée rétrécie", categorie: "danger", description: "Annonce un rétrécissement de la chaussée.", image: null, motsCles: ["chaussée", "rétrécie"] },
  { id: "A13a", nom: "Passage à niveau", categorie: "danger", description: "Annonce un passage à niveau avec barrières.", image: wikiSign("France road sign A13a.svg"), motsCles: ["train", "passage à niveau"] },
  { id: "A14", nom: "Carrefour", categorie: "danger", description: "Annonce une intersection.", image: null, motsCles: ["intersection", "carrefour"] },

  { id: "AB3a", nom: "Cédez le passage", categorie: "priorite", description: "Céder le passage avant de s'engager.", image: wikiSign("France road sign AB3a.svg"), motsCles: ["cédez", "priorité"] },
  { id: "AB4", nom: "STOP", categorie: "priorite", description: "Arrêt obligatoire.", image: wikiSign("France road sign AB4.svg"), motsCles: ["stop", "arrêt"] },
  { id: "AB5", nom: "Annonce de STOP", categorie: "priorite", description: "STOP annoncé à l'avance.", image: wikiSign("France road sign AB5.svg"), motsCles: ["annonce", "stop"] },
  { id: "AB6", nom: "Route prioritaire", categorie: "priorite", description: "Vous circulez sur une route prioritaire.", image: wikiSign("France road sign AB6.svg"), motsCles: ["prioritaire"] },
  { id: "AB7", nom: "Fin de route prioritaire", categorie: "priorite", description: "Fin de la priorité de la route suivie.", image: null, motsCles: ["fin", "prioritaire"] },

  { id: "B0", nom: "Sens interdit", categorie: "interdiction", description: "Accès interdit dans ce sens.", image: wikiSign("France road sign B0.svg"), motsCles: ["sens interdit"] },
  { id: "B1", nom: "Circulation interdite", categorie: "interdiction", description: "Accès interdit à tous véhicules.", image: null, motsCles: ["interdit"] },
  { id: "B3", nom: "Interdiction de dépasser", categorie: "interdiction", description: "Dépassement interdit.", image: null, motsCles: ["dépasser", "interdiction"] },
  { id: "B6d", nom: "Stationnement interdit", categorie: "interdiction", description: "Stationnement interdit.", image: null, motsCles: ["stationnement"] },
  { id: "B14_50", nom: "Limitation 50 km/h", categorie: "interdiction", description: "Vitesse max autorisée 50 km/h.", image: wikiSign("France road sign B14 (50).svg"), motsCles: ["50", "vitesse"] },
  { id: "B14_70", nom: "Limitation 70 km/h", categorie: "interdiction", description: "Vitesse max autorisée 70 km/h.", image: null, motsCles: ["70", "vitesse"] },
  { id: "B31", nom: "Fin d'interdiction", categorie: "interdiction", description: "Fin d'une interdiction signalée.", image: wikiSign("France road sign B31.svg"), motsCles: ["fin", "interdiction"] },

  { id: "B21a1", nom: "Tourner à droite", categorie: "obligation", description: "Direction obligatoire à droite.", image: wikiSign("France road sign B21a1.svg"), motsCles: ["droite", "obligation"] },
  { id: "B21a2", nom: "Tourner à gauche", categorie: "obligation", description: "Direction obligatoire à gauche.", image: null, motsCles: ["gauche", "obligation"] },
  { id: "B21b", nom: "Aller tout droit", categorie: "obligation", description: "Direction obligatoire tout droit.", image: null, motsCles: ["tout droit", "obligation"] },
  { id: "B6a1", nom: "Voie réservée bus", categorie: "obligation", description: "Voie obligatoire réservée aux bus.", image: wikiSign("France road sign B6a1.svg"), motsCles: ["bus", "voie réservée"] },

  { id: "C18", nom: "Stationnement", categorie: "indication", description: "Emplacement de stationnement.", image: wikiSign("France road sign C18.svg"), motsCles: ["parking", "stationnement"] },
  { id: "C20a", nom: "Passage piétons", categorie: "indication", description: "Annonce un passage piétons.", image: null, motsCles: ["piéton"] },
  { id: "C25", nom: "Hôpital", categorie: "indication", description: "Indication d'un établissement de soins.", image: null, motsCles: ["hôpital", "clinique"] },
  { id: "C27", nom: "Poste de secours", categorie: "indication", description: "Indique un poste de secours.", image: null, motsCles: ["secours"] }
];

function getPanneauById(id) {
  return CATALOGUE_PANNEAUX.find((p) => p.id === id) || null;
}

function svgFormeParCategorie(categorie) {
  if (categorie === "danger") {
    return '<polygon points="160,26 56,196 264,196" fill="#fff" stroke="#ef4444" stroke-width="16" />';
  }
  if (categorie === "priorite") {
    return '<polygon points="160,22 276,138 160,254 44,138" fill="#facc15" stroke="#fff" stroke-width="12" />';
  }
  if (categorie === "obligation") {
    return '<circle cx="160" cy="140" r="96" fill="#2563eb" stroke="#ffffff" stroke-width="12" />';
  }
  if (categorie === "interdiction") {
    return '<circle cx="160" cy="140" r="96" fill="#ffffff" stroke="#ef4444" stroke-width="16" />';
  }
  return '<rect x="64" y="44" width="192" height="192" rx="16" fill="#2563eb" stroke="#ffffff" stroke-width="12" />';
}

function buildPanneauFallbackSvg(panneau) {
  const forme = svgFormeParCategorie(panneau.categorie);
  const textColor = panneau.categorie === "interdiction" ? "#0f172a" : "#ffffff";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 280">
    <rect width="320" height="280" fill="#f8fafc" />
    <g>${forme}</g>
    <text x="160" y="146" text-anchor="middle" font-size="26" font-family="Arial, sans-serif" font-weight="700" fill="${textColor}">${panneau.id}</text>
    <rect x="20" y="236" width="280" height="32" rx="8" fill="#0f172a" />
    <text x="160" y="257" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#f8fafc">${panneau.nom}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getPanneauFallbackImage(id) {
  const panneau = getPanneauById(id);
  if (!panneau) return null;
  return buildPanneauFallbackSvg(panneau);
}

function getPanneauImage(id) {
  const panneau = getPanneauById(id);
  if (!panneau) return null;
  return panneau.image || buildPanneauFallbackSvg(panneau);
}

function trouverPanneauParTexte(texte, categorie = null) {
  const source = (texte || "").toLowerCase();
  const candidats = categorie
    ? CATALOGUE_PANNEAUX.filter((p) => p.categorie === categorie)
    : CATALOGUE_PANNEAUX;

  let meilleur = null;
  let meilleurScore = 0;

  candidats.forEach((panneau) => {
    let score = 0;
    panneau.motsCles.forEach((mot) => {
      if (source.includes(mot.toLowerCase())) score += 1;
    });
    if (score > meilleurScore) {
      meilleurScore = score;
      meilleur = panneau;
    }
  });

  return meilleurScore > 0 ? meilleur : null;
}

function resoudreImagePanneauQuestion(questionObj) {
  if (!questionObj) return null;
  if (questionObj.panneauId) return getPanneauImage(questionObj.panneauId);

  if (questionObj.theme === "Signalisation") {
    const panneau = trouverPanneauParTexte(`${questionObj.question} ${questionObj.explication || ""}`)
      || CATALOGUE_PANNEAUX.find(p => p.categorie === "danger");
    return panneau ? getPanneauImage(panneau.id) : null;
  }

  return questionObj.image || null;
}

window.CATALOGUE_PANNEAUX = CATALOGUE_PANNEAUX;
window.getPanneauById = getPanneauById;
window.getPanneauImage = getPanneauImage;
window.getPanneauFallbackImage = getPanneauFallbackImage;
window.trouverPanneauParTexte = trouverPanneauParTexte;
window.resoudreImagePanneauQuestion = resoudreImagePanneauQuestion;
