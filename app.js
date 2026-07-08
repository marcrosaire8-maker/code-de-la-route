/**
 * Logique du Jeu de Code de la Route Béninois (ANaTT)
 * Moteur de jeu autonome 100% Client-side en JavaScript Vanille
 */

const TOTAL_STEPS = (window.BANQUE_QUESTIONS && window.BANQUE_QUESTIONS.length) || 300;

function construireSecteurs(total) {
  const base = [
    { id: 1, nom: "Cadre Légal", description: "Permis B, pièces, infractions & sanctions" },
    { id: 2, nom: "Marquage au Sol", description: "Lignes, zébras, flèches de sélection" },
    { id: 3, nom: "Signalisation", description: "Panneaux, balises, feux et agents" },
    { id: 4, nom: "Priorités", description: "Priorités de passage, stop, ronds-points" },
    { id: 5, nom: "Mécanique", description: "Voyants, 4 temps moteur, fluides, pannes" },
    { id: 6, nom: "Circuit ANaTT", description: "Manœuvres d'examen, secourisme, P.A.S" }
  ];

  const block = Math.floor(total / base.length);
  const remainder = total % base.length;
  let start = 1;

  return base.map((secteur, index) => {
    const size = block + (index < remainder ? 1 : 0);
    const end = start + size - 1;
    const built = { ...secteur, debut: start, fin: end };
    start = end + 1;
    return built;
  });
}

// Configuration des Secteurs Académiques de l'ANaTT
const SECTEURS = construireSecteurs(TOTAL_STEPS);

// État global de l'application
let gameState = {
  unlockedStep: 1,        // Étape maximale débloquée globalement (1 à TOTAL_STEPS)
  activeStepId: null,      // Étape en cours de jeu
  activeSectorIndex: 0,    // Secteur actuellement affiché sur la Map
  lives: 5,               // 5 barres de carburant / vies
  selectedOption: null,    // Option sélectionnée (A, B, C ou D)
  timeLeft: 30,           // Chrono de 30 secondes par défaut
  timerInterval: null,     // Pointeur de l'intervalle du chrono
  completedSteps: [],     // Liste des IDs d'étapes validées
  
  // Statistiques de la série de 20 questions en cours
  seriesCorrect: 0,
  seriesTotal: 0,
  seriesQuestionsPlayed: [], // Historique des étapes jouées dans cette série
  seriesFirstAttemptResults: {} // Pour calculer la note finale sur 20 sans triche
};

const ttsState = {
  supported: typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
  voices: []
  ,
  userActivated: false
};

function setTtsStatus(message) {
  const el = document.getElementById("tts-status");
  if (el) el.textContent = message;
}

// ==========================================
// INITIALISATION DE L'APPLICATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  chargerProgression();
  initialiserSyntheseVocale();
  genererOngletsSecteurs();
  initialiserSectionPanneaux();
  initEvenements();
  afficherMapSecteur(gameState.activeSectorIndex);
  mettreAJourTableauDeBord();
  mettreAJourControlesLecture();
  
  // Initialisation des icônes Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Charger la progression depuis le localStorage
function chargerProgression() {
  const sauvegarde = localStorage.getItem("code_benin_sauvegarde");
  if (sauvegarde) {
    try {
      const data = JSON.parse(sauvegarde);
      gameState.unlockedStep = Math.max(1, Math.min(data.unlockedStep || 1, TOTAL_STEPS));
      gameState.completedSteps = (data.completedSteps || []).filter(id => id >= 1 && id <= TOTAL_STEPS);
      
      // Trouver automatiquement l'onglet actif en fonction de l'étape débloquée
      const activeSector = SECTEURS.find(s => gameState.unlockedStep >= s.debut && gameState.unlockedStep <= s.fin);
      if (activeSector) {
        gameState.activeSectorIndex = SECTEURS.indexOf(activeSector);
      }
    } catch (e) {
      console.error("Erreur de lecture de la sauvegarde", e);
    }
  }
}

// Sauvegarder la progression dans le localStorage
function sauvegarderProgression() {
  const data = {
    unlockedStep: gameState.unlockedStep,
    completedSteps: gameState.completedSteps
  };
  localStorage.setItem("code_benin_sauvegarde", JSON.stringify(data));
}

// Réinitialiser complètement le jeu
function reinitialiserJeu() {
  localStorage.removeItem("code_benin_sauvegarde");
  gameState.unlockedStep = 1;
  gameState.completedSteps = [];
  gameState.activeSectorIndex = 0;
  gameState.lives = 5;
  gameState.seriesCorrect = 0;
  gameState.seriesTotal = 0;
  gameState.seriesQuestionsPlayed = [];
  gameState.seriesFirstAttemptResults = {};
  
  sauvegarderProgression();
  afficherMapSecteur(0);
  mettreAJourTableauDeBord();
  fermerTousModals();
}

// ==========================================
// REPRÉSENTATION DU CODE DE LA ROUTE EN SVG
// ==========================================
function genererSVGDefinition(id, theme, questionText) {
  // Palette de couleurs premium
  const c = {
    asphalt: "#1e293b",
    grass: "#0b1329",
    stripe: "#ffffff",
    carBlue: "#00e5ff",
    carOrange: "#facc15",
    signRed: "#ef4444",
    signBlue: "#2563eb",
    yellowGlow: "#ffd600",
    white: "#ffffff",
    dark: "#070b13",
    zebra: "#ffffff"
  };

  // Base commune
  let svg = `<svg viewBox="0 0 320 220" class="svg-road-scene" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="320" height="220" fill="${c.grass}" />`;

  // Dessins thématiques hautement optimisés
  if (theme === "Cadre Légal") {
    // Dessiner une carte d'identité ou un permis de conduire officiel ANaTT Bénin
    svg += `
      <!-- Fond du Permis -->
      <rect x="30" y="30" width="260" height="160" rx="12" fill="${c.asphalt}" stroke="${c.carBlue}" stroke-width="2" />
      <rect x="40" y="40" width="240" height="30" rx="6" fill="${c.dark}" />
      <text x="50" y="60" fill="${c.yellowGlow}" font-family="monospace" font-size="11" font-weight="bold">RÉPUBLIQUE DU BÉNIN - ANaTT</text>
      
      <!-- Photo de profil fictive -->
      <rect x="50" y="85" width="60" height="75" rx="6" fill="${c.dark}" stroke="${c.stripe}" stroke-width="1" />
      <circle cx="80" cy="115" r="15" fill="${c.textSecondary || '#555'}" />
      <path d="M60 155 Q80 135 100 155 Z" fill="${c.textSecondary || '#555'}" />
      
      <!-- Textes du Permis B -->
      <text x="125" y="100" fill="${c.white}" font-family="sans-serif" font-size="10" font-weight="bold">PERMIS DE CONDUIRE</text>
      <text x="125" y="115" fill="${c.carBlue}" font-family="monospace" font-size="9">CATÉGORIE : B</text>
      <text x="125" y="130" fill="${c.white}" font-family="sans-serif" font-size="8">PTAC Max : 3.5 Tonnes</text>
      <text x="125" y="142" fill="${c.white}" font-family="sans-serif" font-size="8">Places : 9 (Conducteur inclus)</text>
      <text x="125" y="154" fill="${c.yellowGlow}" font-family="sans-serif" font-size="8">Âge minimum : 18 ans</text>
    `;
  } 
  else if (theme === "Marquage au sol") {
    // Dessiner une route asphalte avec marquage selon la question
    let isLineContinue = questionText.toLowerCase().includes("continue");
    let isZebra = questionText.toLowerCase().includes("zébra") || questionText.toLowerCase().includes("zebra");
    let isYellow = questionText.toLowerCase().includes("jaune");
    
    // Dessiner la route
    svg += `
      <rect x="80" y="0" width="160" height="220" fill="#111827" />
      <line x1="80" y1="0" x2="80" y2="220" stroke="${c.white}" stroke-width="3" />
      <line x1="240" y1="0" x2="240" y2="220" stroke="${c.white}" stroke-width="3" stroke-dasharray="${isYellow ? 'none' : 'none'}" />
    `;

    if (isYellow) {
      // Ligne jaune sur le trottoir / bord de route
      svg += `
        <line x1="235" y1="0" x2="235" y2="220" stroke="${c.carOrange}" stroke-width="6" stroke-dasharray="${questionText.toLowerCase().includes("discontinue") ? '10,10' : 'none'}" />
        <text x="250" y="110" fill="${c.carOrange}" font-family="sans-serif" font-size="10" font-weight="bold" transform="rotate(90 250 110)">TROTTOIR</text>
      `;
    }

    if (isZebra) {
      // Zone de zébras
      svg += `
        <path d="M 100 40 L 220 180" stroke="${c.white}" stroke-width="12" stroke-dasharray="10,15" />
        <path d="M 120 20 L 220 140" stroke="${c.white}" stroke-width="12" stroke-dasharray="10,15" />
        <text x="150" y="200" fill="${c.white}" font-family="sans-serif" font-size="8" text-anchor="middle">ZÉBRAS : INTERDIT DE CIRCULER</text>
      `;
    } else if (!isYellow) {
      // Ligne médiane
      if (isLineContinue) {
        svg += `<line x1="160" y1="0" x2="160" y2="220" stroke="${c.white}" stroke-width="4" />`;
      } else {
        svg += `<line x1="160" y1="0" x2="160" y2="220" stroke="${c.white}" stroke-width="4" stroke-dasharray="15,15" />`;
      }
    }

    // Dessiner une petite voiture bleue
    svg += `
      <g transform="translate(110, 120)">
        <rect x="0" y="0" width="24" height="40" rx="4" fill="${c.carBlue}" />
        <rect x="3" y="8" width="18" height="10" rx="2" fill="${c.dark}" />
        <rect x="4" y="24" width="16" height="8" rx="1" fill="${c.dark}" />
        <circle cx="4" cy="5" r="2" fill="${c.white}" />
        <circle cx="20" cy="5" r="2" fill="${c.white}" />
      </g>
    `;
  }
  else if (theme === "Signalisation") {
    // Dessiner un panneau de signalisation
    let isDanger = questionText.toLowerCase().includes("danger") || questionText.toLowerCase().includes("triangulaire") || questionText.toLowerCase().includes("balise");
    let isObligation = questionText.toLowerCase().includes("obligation") || questionText.toLowerCase().includes("obligatoire");
    
    if (isDanger) {
      // Panneau triangulaire à bord rouge
      svg += `
        <!-- Support du panneau -->
        <rect x="157" y="100" width="6" height="100" fill="#666" />
        
        <!-- Triangle Danger -->
        <polygon points="160,30 110,110 210,110" fill="${c.white}" stroke="${c.signRed}" stroke-width="8" stroke-linejoin="round" />
        
        <!-- Symbole intérieur (Point d'exclamation) -->
        <rect x="157" y="60" width="6" height="25" rx="3" fill="${c.dark}" />
        <circle cx="160" cy="95" r="4.5" fill="${c.dark}" />
        
        <!-- Texte de position -->
        <rect x="10" y="170" width="140" height="40" rx="6" fill="${c.dark}" stroke="${c.carBlue}" />
        <text x="80" y="185" fill="${c.white}" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="bold">AGGLOMÉRATION : 50m</text>
        <text x="80" y="200" fill="${c.yellowGlow}" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="bold">CAMPAGNE : 150m</text>
      `;
    } else if (isObligation) {
      // Panneau circulaire bleu
      svg += `
        <rect x="157" y="100" width="6" height="100" fill="#666" />
        <circle cx="160" cy="80" r="45" fill="${c.signBlue}" stroke="${c.white}" stroke-width="4" />
        <!-- Flèche obligation vers la droite -->
        <path d="M 130 80 L 180 80 M 165 65 L 180 80 L 165 95" stroke="${c.white}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      `;
    } else {
      // Panneau interdiction circulaire blanc bordé de rouge
      svg += `
        <rect x="157" y="100" width="6" height="100" fill="#666" />
        <circle cx="160" cy="80" r="45" fill="${c.white}" stroke="${c.signRed}" stroke-width="8" />
        <!-- Texte de limitation fictive 50 -->
        <text x="160" y="92" fill="${c.dark}" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">50</text>
      `;
    }
  }
  else if (theme === "Priorités") {
    // Dessiner une intersection routière
    svg += `
      <!-- L'intersection -->
      <rect x="110" y="0" width="100" height="220" fill="${c.asphalt}" />
      <rect x="0" y="60" width="320" height="100" fill="${c.asphalt}" />
      
      <!-- Marquage au sol de l'intersection -->
      <line x1="160" y1="0" x2="160" y2="50" stroke="${c.white}" stroke-width="2" stroke-dasharray="8,8" />
      <line x1="160" y1="170" x2="160" y2="220" stroke="${c.white}" stroke-width="2" stroke-dasharray="8,8" />
      <line x1="0" y1="110" x2="100" y2="110" stroke="${c.white}" stroke-width="2" stroke-dasharray="8,8" />
      <line x1="220" y1="110" x2="320" y2="110" stroke="${c.white}" stroke-width="2" stroke-dasharray="8,8" />
      
      <!-- Voiture A (Bleue, venant du bas) -->
      <g transform="translate(170, 170)">
        <rect x="0" y="0" width="20" height="32" rx="3" fill="${c.carBlue}" />
        <text x="10" y="20" fill="white" font-size="10" font-weight="bold" text-anchor="middle">A</text>
      </g>
      
      <!-- Voiture B (Jaune, venant de droite) -->
      <g transform="translate(240, 75)">
        <rect x="0" y="0" width="32" height="20" rx="3" fill="${c.carOrange}" />
        <text x="16" y="14" fill="black" font-size="10" font-weight="bold" text-anchor="middle">B</text>
      </g>
      
      <!-- Flèches directionnelles prioritaires -->
      <path d="M 180 160 L 180 120 L 140 120" stroke="${c.yellowGlow}" stroke-width="3" stroke-dasharray="5,2" fill="none" marker-end="url(#arrow)" />
      <path d="M 235 85 L 180 85" stroke="${c.carOrange}" stroke-width="2" stroke-dasharray="5,2" fill="none" />
      
      <!-- Panneau de priorité ou texte -->
      <rect x="5" y="10" width="100" height="40" rx="4" fill="${c.dark}" stroke="${c.yellowGlow}" />
      <text x="55" y="25" fill="${c.yellowGlow}" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="bold">PRIORITÉ À DROITE</text>
      <text x="55" y="38" fill="${c.white}" font-family="sans-serif" font-size="7" text-anchor="middle">Qui passe en premier ?</text>
    `;
  }
  else if (theme === "Mécanique") {
    // Dessiner un tableau de bord ou un voyant d'alerte mécanique
    let isOil = questionText.toLowerCase().includes("huile");
    let isBattery = questionText.toLowerCase().includes("batterie") || questionText.toLowerCase().includes("alternateur");
    
    svg += `
      <!-- Cadre du cadran -->
      <circle cx="160" cy="110" r="90" fill="${c.dark}" stroke="${c.asphalt}" stroke-width="6" />
      <circle cx="160" cy="110" r="80" fill="#030712" />
    `;

    if (isOil) {
      // Voyant Burette d'huile rouge
      svg += `
        <path d="M 120 120 Q 140 100 170 110 L 200 100 Q 205 110 200 115 L 185 115 Q 165 135 120 120 Z" fill="${c.signRed}" />
        <path d="M 195 95 L 195 105" stroke="${c.signRed}" stroke-width="3" />
        <circle cx="118" cy="120" r="2" fill="${c.signRed}" />
        <text x="160" y="150" fill="${c.signRed}" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">PRESSION D'HUILE</text>
        <text x="160" y="165" fill="${c.white}" font-family="sans-serif" font-size="8" text-anchor="middle">Arrêt Immédiat !</text>
      `;
    } else if (isBattery) {
      // Voyant Batterie rouge/orange
      svg += `
        <rect x="120" y="90" width="80" height="50" rx="4" fill="none" stroke="${c.signRed}" stroke-width="4" />
        <!-- Bornes + et - -->
        <rect x="135" y="82" width="10" height="8" fill="${c.signRed}" />
        <rect x="175" y="82" width="10" height="8" fill="${c.signRed}" />
        <!-- Signes -->
        <text x="140" y="115" fill="${c.signRed}" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">-</text>
        <text x="180" y="115" fill="${c.signRed}" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">+</text>
        <text x="160" y="170" fill="${c.signRed}" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">CHARGE BATTERIE</text>
      `;
    } else {
      // Compte-tours
      svg += `
        <path d="M 100 160 A 70 70 0 1 1 220 160" fill="none" stroke="${c.asphalt}" stroke-width="8" stroke-linecap="round" />
        <path d="M 100 160 A 70 70 0 1 1 180 70" fill="none" stroke="${c.carBlue}" stroke-width="8" stroke-linecap="round" />
        <!-- Aiguille -->
        <line x1="160" y1="110" x2="185" y2="65" stroke="${c.signRed}" stroke-width="3" stroke-linecap="round" />
        <circle cx="160" cy="110" r="8" fill="${c.stripe}" />
        <text x="160" y="140" fill="${c.white}" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">3000 RPM</text>
      `;
    }
  } else {
    // Circuit ANaTT / Manœuvres
    svg += `
      <!-- Circuit de piquets (Slalom / Créneau) -->
      <rect x="50" y="20" width="220" height="180" rx="10" fill="none" stroke="${c.asphalt}" stroke-width="8" />
      
      <!-- Piquets d'examen (jalonnement) -->
      <circle cx="90" cy="60" r="5" fill="${c.carOrange}" />
      <circle cx="90" cy="110" r="5" fill="${c.carOrange}" />
      <circle cx="90" cy="160" r="5" fill="${c.carOrange}" />
      
      <circle cx="230" cy="60" r="5" fill="${c.carOrange}" />
      <circle cx="230" cy="110" r="5" fill="${c.carOrange}" />
      <circle cx="230" cy="160" r="5" fill="${c.carOrange}" />
      
      <!-- Voiture effectuant la manœuvre -->
      <g transform="translate(140, 130)">
        <rect x="0" y="0" width="20" height="35" rx="3" fill="${c.carBlue}" />
        <rect x="2" y="8" width="16" height="8" fill="${c.dark}" />
        <!-- Clignotant arrière gauche orange -->
        <circle cx="2" cy="33" r="1.5" fill="${c.carOrange}" />
      </g>
      
      <!-- Flèche sinueuse de Slalom -->
      <path d="M 150 190 Q 110 160 150 130 Q 190 100 150 70 Q 110 40 150 25" stroke="${c.yellowGlow}" stroke-width="2" stroke-dasharray="5,3" fill="none" />
      <text x="160" y="212" fill="${c.white}" font-family="sans-serif" font-size="8" text-anchor="middle">CIRCUIT OFFICIEL ANaTT : SLALOM</text>
    `;
  }

  // Définitions partagées
  svg += `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="${c.yellowGlow}" />
      </marker>
    </defs>
  `;

  svg += `</svg>`;
  return svg;
}

// ==========================================
// RENDER DE LA MAP (ROADMAP)
// ==========================================
function genererOngletsSecteurs() {
  const container = document.getElementById("sector-tabs");
  container.innerHTML = "";
  
  SECTEURS.forEach((secteur, index) => {
    const btn = document.createElement("button");
    btn.className = `sector-btn ${index === gameState.activeSectorIndex ? "active" : ""}`;
    btn.textContent = secteur.nom;
    btn.title = secteur.description;
    btn.onclick = () => {
      gameState.activeSectorIndex = index;
      mettreAJourOngletsActifs();
      afficherMapSecteur(index);
    };
    container.appendChild(btn);
  });
}

function mettreAJourOngletsActifs() {
  const boutons = document.querySelectorAll(".sector-btn");
  boutons.forEach((btn, index) => {
    if (index === gameState.activeSectorIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function afficherMapSecteur(sectorIndex) {
  const trackContainer = document.getElementById("road-track");
  
  // Supprimer les anciens nœuds de la map
  const anciensNoeuds = trackContainer.querySelectorAll(".map-node, .road-checkpoint-banner");
  anciensNoeuds.forEach(el => el.remove());
  
  const secteur = SECTEURS[sectorIndex];
  
  // Ajuster la hauteur de la piste d'asphalte par rapport au nombre d'étapes
  const totalEtapesSecteur = (secteur.fin - secteur.debut) + 1;
  const hauteurEtape = 90; // Pixels entre deux étapes
  const hauteurPiste = (totalEtapesSecteur * hauteurEtape) + 150;
  trackContainer.style.minHeight = `${hauteurPiste}px`;
  
  // Limiter le rendu DOM pour garder une interface fluide même avec 12 000 questions.
  const MAX_NOEUDS_RENDUS = 220;
  const demiFenetre = Math.floor(MAX_NOEUDS_RENDUS / 2);
  const focusStep = Math.min(Math.max(gameState.unlockedStep, secteur.debut), secteur.fin);
  const renderStart = Math.max(secteur.debut, focusStep - demiFenetre);
  const renderEnd = Math.min(secteur.fin, focusStep + demiFenetre);
  
  // Générer les étapes de ce secteur
  for (let stepId = renderStart; stepId <= renderEnd; stepId++) {
    const node = document.createElement("div");
    node.className = "map-node";
    node.setAttribute("data-step", stepId);
    const topPosition = 80 + ((stepId - secteur.debut) * hauteurEtape);
    node.style.top = `${topPosition}px`;
    
    // Évaluation de l'état du niveau
    if (gameState.completedSteps.includes(stepId)) {
      node.classList.add("completed");
    } else if (stepId === gameState.unlockedStep) {
      node.classList.add("active-node");
    } else if (stepId > gameState.unlockedStep) {
      node.classList.add("locked");
    }
    
    // Événement clic sur le niveau
    node.onclick = () => {
      if (stepId <= gameState.unlockedStep) {
        lancerQuizNiveau(stepId);
      }
    };
    
    trackContainer.appendChild(node);
    
    // Placer un drapeau d'examen ou un péage intermédiaire tous les 20 niveaux
    if (stepId % 20 === 0) {
      const banner = document.createElement("div");
      banner.className = "road-checkpoint-banner";
      banner.style.top = `${topPosition + 45}px`;
      banner.innerHTML = `<h4>🚧 POSTE DE CONTRÔLE ${stepId / 20}</h4>`;
      trackContainer.appendChild(banner);
    }
    
  }
  
  // Mettre à jour l'odomètre en bas
  document.getElementById("stat-current-sector").textContent = secteur.nom;
  
  // Centrer automatiquement le scroll sur le niveau actif du secteur en cours
  setTimeout(() => {
    const noeudActif = trackContainer.querySelector(".active-node");
    if (noeudActif) {
      noeudActif.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 150);
}

// ==========================================
// GESTION DU MODE DE QUIZ (SALLE DE QUIZ)
// ==========================================
function lancerQuizNiveau(stepId) {
  gameState.activeStepId = stepId;
  gameState.selectedOption = null;
  gameState.timeLeft = 30;
  
  // Déterminer la série de 20 questions active (1-20, 21-40, etc.)
  const debutSerie = Math.floor((stepId - 1) / 20) * 20 + 1;
  const finSerie = debutSerie + 19;
  
  // Si le joueur débute une nouvelle série de 20 ou recommence, on initialise ses stats
  if (!gameState.seriesQuestionsPlayed.includes(stepId)) {
    // Si on a changé de bloc de 20, on réinitialise les vies et le compteur de série
    const activeSeriesBoundary = `S_${debutSerie}_${finSerie}`;
    if (gameState.lastSeriesBoundary !== activeSeriesBoundary) {
      gameState.lives = 5;
      gameState.seriesCorrect = 0;
      gameState.seriesTotal = 0;
      gameState.seriesQuestionsPlayed = [];
      gameState.seriesFirstAttemptResults = {};
      gameState.lastSeriesBoundary = activeSeriesBoundary;
    }
  }

  // Changer d'écran
  afficherEcran("screen-quiz");
  
  // Charger la question
  const questionObj = window.BANQUE_QUESTIONS.find(q => q.id === stepId);
  if (!questionObj) {
    console.error("Question introuvable pour l'étape : " + stepId);
    quitterQuiz();
    return;
  }
  
  // Remplir les données de l'interface
  document.getElementById("quiz-step-indicator").textContent = `Étape ${stepId} sur ${TOTAL_STEPS}`;
  document.getElementById("question-theme").textContent = questionObj.theme;
  document.getElementById("question-text").textContent = questionObj.question;
  
  // Toujours afficher un visuel pour chaque consigne:
  // 1) image locale si elle existe
  // 2) sinon illustration SVG générée automatiquement (fallback garanti)
  afficherIllustrationConsigne(questionObj);
  
  // Remplir les options de réponse
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";
  
  const lettres = ["A", "B", "C", "D"];
  questionObj.options.forEach((opt, idx) => {
    const card = document.createElement("div");
    card.className = "option-card";
    card.onclick = () => selectionnerOption(lettres[idx], card);
    
    const letterBox = document.createElement("div");
    letterBox.className = "option-letter";
    letterBox.textContent = lettres[idx];
    
    const optText = document.createElement("span");
    // Extraire le texte de l'option (retirer "A) " pour un affichage plus propre si nécessaire, mais le garder est bien aussi)
    optText.textContent = opt;
    
    card.appendChild(letterBox);
    card.appendChild(optText);
    optionsContainer.appendChild(card);
  });
  
  // Reset bouton Valider
  const btnValider = document.getElementById("btn-validate");
  btnValider.disabled = true;
  btnValider.innerHTML = `Valider <i data-lucide="check-circle-2"></i>`;
  if (window.lucide) window.lucide.createIcons();
  
  // Lancer le chronomètre
  demarrerChrono();
  lireQuestionSiActive(questionObj);
  mettreAJourTableauDeBord();
}

function initialiserSyntheseVocale() {
  if (!ttsState.supported) return;

  const chargerVoix = () => {
    ttsState.voices = window.speechSynthesis.getVoices();
  };

  chargerVoix();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = chargerVoix;
  }

  // Certains navigateurs mobiles exigent une interaction explicite
  // avant d'autoriser la synthèse vocale.
  const activerTTS = () => {
    if (ttsState.userActivated) return;
    ttsState.userActivated = true;
    try {
      const unlock = new SpeechSynthesisUtterance(" ");
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("Activation TTS différée", e);
    }
  };

  document.addEventListener("click", activerTTS, { once: true, capture: true });
  document.addEventListener("touchstart", activerTTS, { once: true, capture: true });
  document.addEventListener("keydown", activerTTS, { once: true, capture: true });
  setTtsStatus("Touchez l'écran puis appuyez sur Relire.");
}

function stopLectureVocale() {
  if (!ttsState.supported) return;
  window.speechSynthesis.cancel();
  setTtsStatus("Lecture arrêtée.");
}

function getVoixFrancaise() {
  if (!ttsState.voices.length) return null;
  const frVoices = ttsState.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("fr"));
  if (!frVoices.length) return ttsState.voices[0];

  // Préférence voix masculine si disponible sur l'appareil/navigateur.
  const maleHints = ["male", "man", "homme", "masculin", "thomas", "paul", "daniel", "georges", "nicolas", "yann"];
  const maleFrench = frVoices.find(v => {
    const name = (v.name || "").toLowerCase();
    return maleHints.some(h => name.includes(h));
  });

  return maleFrench || frVoices[0];
}

function construireTexteLecture(questionObj) {
  const optionsSansPrefixe = (questionObj.options || []).map((opt, idx) => {
    const propre = opt.replace(/^[A-D]\)\s*/i, "");
    const lettre = ["A", "B", "C", "D"][idx] || `${idx + 1}`;
    return `Option ${lettre}. ${propre}.`;
  });

  return `Question ${questionObj.id}. ${questionObj.question}. ${optionsSansPrefixe.join(" ")}`;
}

function lireQuestion(questionObj, force = false) {
  if (!ttsState.supported) return;
  if (!questionObj) return;
  if (!ttsState.userActivated && !force) return;

  stopLectureVocale();
  // Texte borné pour éviter certains blocages moteurs TTS sur mobiles.
  const texte = construireTexteLecture(questionObj).slice(0, 500);
  const utterance = new SpeechSynthesisUtterance(texte);
  utterance.lang = "fr-FR";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = getVoixFrancaise();
  if (voice) utterance.voice = voice;

  utterance.onstart = () => setTtsStatus("Lecture en cours...");
  utterance.onend = () => setTtsStatus("Lecture terminée.");
  utterance.onerror = (event) => {
    setTtsStatus(`Erreur lecture: ${event.error || "inconnue"}.`);
  };

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    // Différé court: plus fiable sur plusieurs navigateurs mobiles.
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 60);
  } catch (e) {
    setTtsStatus("Lecture non autorisée par le navigateur.");
    console.warn("Lecture vocale indisponible", e);
  }
}

function lireQuestionSiActive(questionObj) {
  if (!questionObj) return;
  lireQuestion(questionObj);
}

function lireMessageErreurVocal(raison = null) {
  if (!ttsState.supported || !ttsState.userActivated) return;

  const messages = [
    "Réponse incorrecte. Ce n'est pas grave, on continue.",
    "Incorrect. Relis la règle puis réessaie.",
    "Mauvaise réponse. Garde ton calme et poursuis l'entraînement.",
    "Erreur détectée. Continue, tu vas progresser."
  ];

  const prefix = raison ? `${raison}. ` : "";
  const message = `${prefix}${pick(Date.now(), messages)}`;

  stopLectureVocale();
  const utterance = new SpeechSynthesisUtterance(message.slice(0, 280));
  utterance.lang = "fr-FR";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = getVoixFrancaise();
  if (voice) utterance.voice = voice;

  utterance.onstart = () => setTtsStatus("Message vocal d'erreur...");
  utterance.onend = () => setTtsStatus("Message vocal terminé.");
  utterance.onerror = (event) => {
    setTtsStatus(`Erreur lecture: ${event.error || "inconnue"}.`);
  };

  try {
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 60);
  } catch (e) {
    console.warn("Lecture vocale d'erreur indisponible", e);
  }
}

function getQuestionActive() {
  return window.BANQUE_QUESTIONS.find(q => q.id === gameState.activeStepId);
}

function mettreAJourControlesLecture() {
  const replayBtn = document.getElementById("btn-tts-replay");
  const toolsWrapper = document.getElementById("audio-tools");

  if (!replayBtn || !toolsWrapper) return;

  if (!ttsState.supported) {
    toolsWrapper.style.display = "none";
    replayBtn.disabled = true;
    setTtsStatus("Ce navigateur ne supporte pas la synthèse vocale.");
    return;
  }

  toolsWrapper.style.display = "flex";
  replayBtn.disabled = false;
  if (!ttsState.userActivated) {
    setTtsStatus("Touchez l'écran puis appuyez sur Relire.");
  }
}

function afficherEcran(screenId) {
  ["screen-map", "screen-panneaux", "screen-quiz"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === screenId) el.classList.add("active");
    else el.classList.remove("active");
  });
}

function initialiserSectionPanneaux() {
  const startBtn = document.getElementById("btn-panneaux-start");
  const nextBtn = document.getElementById("btn-panneaux-next");
  if (!startBtn || !nextBtn) return;

  startBtn.onclick = () => demarrerQuizPanneaux();
  nextBtn.onclick = () => questionSuivantePanneaux();
  resetQuizPanneauxVue();
}

const panneauQuizState = {
  pool: [],
  currentIndex: 0,
  score: 0,
  currentQuestion: null,
  locked: false,
  started: false
};

function melangerListe(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function construirePoolQuizPanneaux() {
  const panneaux = Array.isArray(window.CATALOGUE_PANNEAUX) ? window.CATALOGUE_PANNEAUX : [];
  const melanges = melangerListe(panneaux);
  const limite = Math.min(30, melanges.length);
  return melanges.slice(0, limite).map((panneau, index) => construireQuestionPanneau(index + 1, panneau, panneaux));
}

function construireQuestionPanneau(index, panneau, tousLesPanneaux) {
  const autres = melangerListe(tousLesPanneaux.filter((p) => p.id !== panneau.id));
  const distracteurs = autres.slice(0, 3).map((p) => p.nom);
  const propositions = melangerListe([panneau.nom, ...distracteurs]).slice(0, 4);
  const lettres = ["A", "B", "C", "D"];
  const correcteIndex = propositions.findIndex((p) => p === panneau.nom);

  return {
    id: `PANNEAU-${index}`,
    panneauId: panneau.id,
    theme: "Signalisation",
    question: `Que signifie ce panneau (${panneau.id}) ?`,
    options: propositions.map((p, i) => `${lettres[i]}) ${p}`),
    reponsesCorrectes: [lettres[correcteIndex]],
    explication: panneau.description,
    image: typeof window.getPanneauImage === "function" ? window.getPanneauImage(panneau.id) : null
  };
}

function majEnteteQuizPanneaux() {
  const counter = document.getElementById("panneaux-quiz-counter");
  const score = document.getElementById("panneaux-quiz-score");
  if (!counter || !score) return;

  const total = panneauQuizState.pool.length;
  const index = Math.min(panneauQuizState.currentIndex + 1, total);
  counter.textContent = `Question ${index} / ${total}`;
  score.textContent = `Score : ${panneauQuizState.score}`;
}

function resetQuizPanneauxVue() {
  panneauQuizState.pool = [];
  panneauQuizState.currentIndex = 0;
  panneauQuizState.score = 0;
  panneauQuizState.currentQuestion = null;
  panneauQuizState.locked = false;
  panneauQuizState.started = false;

  const img = document.getElementById("panneaux-quiz-image");
  const visualSide = document.getElementById("panneaux-quiz-visual-side");
  const question = document.getElementById("panneaux-quiz-question");
  const options = document.getElementById("panneaux-quiz-options");
  const feedback = document.getElementById("panneaux-quiz-feedback");
  const startBtn = document.getElementById("btn-panneaux-start");
  const nextBtn = document.getElementById("btn-panneaux-next");

  if (img) {
    img.removeAttribute("src");
    img.style.display = "none";
  }
  if (visualSide) visualSide.classList.add("is-hidden");
  if (question) question.textContent = "Appuie sur « Démarrer » pour lancer le quiz panneaux.";
  if (options) options.innerHTML = "";
  if (feedback) feedback.textContent = "";
  if (startBtn) {
    startBtn.style.display = "inline-flex";
    startBtn.textContent = "Démarrer";
  }
  if (nextBtn) nextBtn.style.display = "none";

  majEnteteQuizPanneaux();
}

function demarrerQuizPanneaux() {
  panneauQuizState.pool = construirePoolQuizPanneaux();
  panneauQuizState.currentIndex = 0;
  panneauQuizState.score = 0;
  panneauQuizState.locked = false;
  panneauQuizState.started = true;

  const startBtn = document.getElementById("btn-panneaux-start");
  const nextBtn = document.getElementById("btn-panneaux-next");
  const visualSide = document.getElementById("panneaux-quiz-visual-side");
  if (startBtn) startBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
  if (visualSide) visualSide.classList.remove("is-hidden");

  if (!panneauQuizState.pool.length) {
    const question = document.getElementById("panneaux-quiz-question");
    if (question) question.textContent = "Aucune question panneau disponible.";
    return;
  }

  afficherQuestionPanneauxCourante();
}

function afficherQuestionPanneauxCourante() {
  const q = panneauQuizState.pool[panneauQuizState.currentIndex];
  if (!q) {
    afficherResultatFinalQuizPanneaux();
    return;
  }

  panneauQuizState.currentQuestion = q;
  panneauQuizState.locked = false;

  const img = document.getElementById("panneaux-quiz-image");
  const question = document.getElementById("panneaux-quiz-question");
  const options = document.getElementById("panneaux-quiz-options");
  const feedback = document.getElementById("panneaux-quiz-feedback");
  const nextBtn = document.getElementById("btn-panneaux-next");

  if (img) {
    const src = (typeof window.resoudreImagePanneauQuestion === "function")
      ? window.resoudreImagePanneauQuestion(q)
      : q.image;
    const fallback = (typeof window.getPanneauFallbackImage === "function" && q.panneauId)
      ? window.getPanneauFallbackImage(q.panneauId)
      : null;
    img.onload = () => {
      img.style.display = "block";
    };
    img.onerror = () => {
      if (fallback && img.src !== fallback) {
        img.src = fallback;
      }
    };
    img.style.display = "none";
    img.src = src || fallback || "";
  }
  if (question) question.textContent = q.question;
  if (feedback) feedback.textContent = "";
  if (nextBtn) nextBtn.style.display = "none";

  const lettres = ["A", "B", "C", "D"];
  if (options) {
    options.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card";
      const optionText = opt.replace(/^[A-D]\)\s*/i, "");
      card.innerHTML = `<div class="option-letter">${lettres[idx]}</div><span>${optionText}</span>`;
      card.onclick = () => validerReponseQuizPanneaux(lettres[idx], card);
      options.appendChild(card);
    });
  }

  majEnteteQuizPanneaux();
  lireQuestion(q, true);
}

function lireCorrectionPanneauxVocal(message) {
  if (!ttsState.supported || !ttsState.userActivated) return;
  stopLectureVocale();
  const utterance = new SpeechSynthesisUtterance(String(message).slice(0, 320));
  utterance.lang = "fr-FR";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;
  const voice = getVoixFrancaise();
  if (voice) utterance.voice = voice;
  try {
    setTimeout(() => window.speechSynthesis.speak(utterance), 60);
  } catch (e) {
    console.warn("Lecture correction panneaux indisponible", e);
  }
}

function validerReponseQuizPanneaux(lettreChoisie, bouton) {
  if (panneauQuizState.locked || !panneauQuizState.currentQuestion) return;
  panneauQuizState.locked = true;

  const q = panneauQuizState.currentQuestion;
  const correcte = q.reponsesCorrectes[0];
  const feedback = document.getElementById("panneaux-quiz-feedback");
  const cards = document.querySelectorAll("#panneaux-quiz-options .option-card");
  const lettres = ["A", "B", "C", "D"];

  cards.forEach((card, idx) => {
    if (lettres[idx] === correcte) card.classList.add("correct");
    if (card === bouton && lettreChoisie !== correcte) card.classList.add("incorrect");
    card.disabled = true;
  });

  const bonneOptionIndex = lettres.indexOf(correcte);
  const bonneOptionTexte = (q.options[bonneOptionIndex] || "").replace(/^[A-D]\)\s*/i, "");

  if (lettreChoisie === correcte) {
    panneauQuizState.score += 1;
    if (feedback) feedback.textContent = "Bonne réponse !";
  } else if (feedback) {
    feedback.textContent = `Incorrect. Bonne réponse : ${correcte} — ${bonneOptionTexte}`;
    lireCorrectionPanneauxVocal(`Incorrect. La bonne réponse est ${correcte}. ${bonneOptionTexte}.`);
  }

  majEnteteQuizPanneaux();

  // Avancer automatiquement après une courte pause (comme un vrai quiz)
  setTimeout(() => {
    questionSuivantePanneaux();
  }, 1100);
}

function questionSuivantePanneaux() {
  if (!panneauQuizState.pool.length) return;
  panneauQuizState.currentIndex += 1;
  if (panneauQuizState.currentIndex >= panneauQuizState.pool.length) {
    afficherResultatFinalQuizPanneaux();
    return;
  }
  afficherQuestionPanneauxCourante();
}

function afficherResultatFinalQuizPanneaux() {
  const question = document.getElementById("panneaux-quiz-question");
  const options = document.getElementById("panneaux-quiz-options");
  const feedback = document.getElementById("panneaux-quiz-feedback");
  const nextBtn = document.getElementById("btn-panneaux-next");
  const startBtn = document.getElementById("btn-panneaux-start");
  const total = panneauQuizState.pool.length;
  const noteSur20 = total > 0 ? Math.round((panneauQuizState.score / total) * 20) : 0;

  if (question) question.textContent = "Quiz terminé !";
  if (options) options.innerHTML = "";
  if (feedback) feedback.textContent = `Score final : ${panneauQuizState.score} / ${total} — Note : ${noteSur20}/20`;
  if (nextBtn) nextBtn.style.display = "none";
  if (startBtn) {
    startBtn.style.display = "inline-flex";
    startBtn.textContent = "Recommencer";
  }
  majEnteteQuizPanneaux();
}

function ouvrirSectionPanneaux() {
  stopLectureVocale();
  afficherEcran("screen-panneaux");
  resetQuizPanneauxVue();
  if (window.lucide) window.lucide.createIcons();
}

function quitterSectionPanneaux() {
  stopLectureVocale();
  afficherEcran("screen-map");
  afficherMapSecteur(gameState.activeSectorIndex);
}

function afficherIllustrationConsigne(questionObj) {
  const imageEl = document.getElementById("quiz-img");
  const vectorContainer = document.getElementById("quiz-vector-fallback");

  const svgFallback = () => {
    imageEl.style.display = "none";
    imageEl.removeAttribute("src");
    vectorContainer.style.display = "flex";
    vectorContainer.innerHTML = genererSVGDefinition(
      questionObj.id,
      questionObj.theme,
      questionObj.question
    );
  };

  svgFallback();

  const imageUrl = typeof window.resoudreImagePanneauQuestion === "function"
    ? window.resoudreImagePanneauQuestion(questionObj)
    : questionObj.image;

  if (!imageUrl) return;

  imageEl.onload = () => {
    vectorContainer.style.display = "none";
    imageEl.style.display = "block";
    imageEl.alt = questionObj.panneauId
      ? `Panneau ${questionObj.panneauId}`
      : "Panneau de signalisation";
  };
  imageEl.onerror = () => {
    svgFallback();
  };

  imageEl.src = "";
  imageEl.src = imageUrl;
}

function selectionnerOption(lettre, elementOption) {
  // Désélectionner les anciennes
  const cards = document.querySelectorAll(".option-card");
  cards.forEach(c => c.classList.remove("selected"));
  
  // Sélectionner la nouvelle
  elementOption.classList.add("selected");
  gameState.selectedOption = lettre;
  
  // Activer le bouton de validation
  document.getElementById("btn-validate").disabled = false;
}

// ==========================================
// MOTEUR DU CHRONOMÈTRE
// ==========================================
function demarrerChrono() {
  clearInterval(gameState.timerInterval);
  gameState.timeLeft = 30;
  mettreAJourChronoVisuel();
  
  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--;
    mettreAJourChronoVisuel();
    
    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.timerInterval);
      gererPanneDeTemps();
    }
  }, 1000);
}

function mettreAJourChronoVisuel() {
  const bar = document.getElementById("timer-liquid-bar");
  const text = document.getElementById("timer-text");
  
  const pourcentage = (gameState.timeLeft / 30) * 100;
  bar.style.width = `${pourcentage}%`;
  text.textContent = `${gameState.timeLeft}s`;
  
  // Alerte de temps faible (en rouge)
  if (gameState.timeLeft <= 8) {
    bar.style.background = "var(--red-danger)";
    text.style.color = "var(--red-danger)";
  } else {
    bar.style.background = "linear-gradient(90deg, var(--neon-blue), var(--yellow-sign))";
    text.style.color = "var(--text-primary)";
  }
}

function gererPanneDeTemps() {
  // La question est considérée comme fausse
  penaliserErreur("Temps écoulé ! Vous devez répondre plus rapidement sur la route.");
}

// ==========================================
// VÉRIFICATION DE LA RÉPONSE
// ==========================================
function validerReponseActive() {
  if (!gameState.selectedOption) return;
  clearInterval(gameState.timerInterval);
  stopLectureVocale();
  
  const questionObj = window.BANQUE_QUESTIONS.find(q => q.id === gameState.activeStepId);
  const reponseCorrecte = questionObj.reponsesCorrectes[0]; // Gère le choix simple d'abord
  
  const cards = document.querySelectorAll(".option-card");
  const lettres = ["A", "B", "C", "D"];
  
  // Enregistrer le premier essai pour le calcul de la note finale
  if (!(gameState.activeStepId in gameState.seriesFirstAttemptResults)) {
    gameState.seriesFirstAttemptResults[gameState.activeStepId] = (gameState.selectedOption === reponseCorrecte);
  }
  
  if (gameState.selectedOption === reponseCorrecte) {
    // Succès !
    cards.forEach((card, idx) => {
      if (lettres[idx] === reponseCorrecte) {
        card.classList.add("correct");
      }
    });
    
    // Enregistrer le succès dans les statistiques de série
    if (!gameState.seriesQuestionsPlayed.includes(gameState.activeStepId)) {
      gameState.seriesQuestionsPlayed.push(gameState.activeStepId);
      gameState.seriesTotal++;
      gameState.seriesCorrect++;
    }
    
    // Débloquer le niveau suivant
    if (!gameState.completedSteps.includes(gameState.activeStepId)) {
      gameState.completedSteps.push(gameState.activeStepId);
    }
    
    if (gameState.activeStepId === gameState.unlockedStep && gameState.unlockedStep < TOTAL_STEPS) {
      gameState.unlockedStep = gameState.activeStepId + 1;
    }
    
    sauvegarderProgression();
    
    // Afficher le pop-up de succès avec explications pédagogiques
    setTimeout(() => {
      afficherModalExplication(true, questionObj);
    }, 400);
    
  } else {
    // Erreur !
    cards.forEach((card, idx) => {
      if (lettres[idx] === gameState.selectedOption) {
        card.classList.add("incorrect");
      }
      if (lettres[idx] === reponseCorrecte) {
        card.classList.add("correct");
      }
    });
    
    // Secouer la carte visuelle pour l'effet d'accident
    document.getElementById("visual-card-container").classList.add("shake");
    setTimeout(() => {
      document.getElementById("visual-card-container").classList.remove("shake");
    }, 500);
    
    // Enregistrer l'infraction dans les statistiques de série
    if (!gameState.seriesQuestionsPlayed.includes(gameState.activeStepId)) {
      gameState.seriesQuestionsPlayed.push(gameState.activeStepId);
      gameState.seriesTotal++;
    }
    
    // Soustraire une vie
    gameState.lives--;
    mettreAJourTableauDeBord();
    lireMessageErreurVocal();
    
    // Vérifier si Game Over (Panne de moteur)
    setTimeout(() => {
      if (gameState.lives <= 0) {
        afficherModalGameOver();
      } else {
        afficherModalExplication(false, questionObj);
      }
    }, 600);
  }
}

// Pénalisation d'erreur suite à une panne de temps
function penaliserErreur(raisonExplication) {
  clearInterval(gameState.timerInterval);
  stopLectureVocale();
  
  const questionObj = window.BANQUE_QUESTIONS.find(q => q.id === gameState.activeStepId);
  const reponseCorrecte = questionObj.reponsesCorrectes[0];
  
  // Premier essai faux
  if (!(gameState.activeStepId in gameState.seriesFirstAttemptResults)) {
    gameState.seriesFirstAttemptResults[gameState.activeStepId] = false;
  }
  
  if (!gameState.seriesQuestionsPlayed.includes(gameState.activeStepId)) {
    gameState.seriesQuestionsPlayed.push(gameState.activeStepId);
    gameState.seriesTotal++;
  }
  
  gameState.lives--;
  mettreAJourTableauDeBord();
  lireMessageErreurVocal("Temps écoulé");
  
  setTimeout(() => {
    if (gameState.lives <= 0) {
      afficherModalGameOver();
    } else {
      // Afficher le modal d'infraction
      afficherModalExplication(false, questionObj, raisonExplication);
    }
  }, 500);
}

// ==========================================
// POPUPS ET MODALS (AFFICHAGE)
// ==========================================
function afficherModalExplication(isCorrect, questionObj, customExplicationText = null) {
  const modal = document.getElementById("modal-explanation");
  const card = document.getElementById("explanation-card");
  const icon = document.getElementById("explanation-icon");
  const title = document.getElementById("explanation-title");
  const correctBanner = document.getElementById("explanation-correct-banner");
  const desc = document.getElementById("explanation-desc");
  
  // Style dynamique vert ou rouge
  if (isCorrect) {
    card.className = "modal-card success";
    icon.setAttribute("data-lucide", "check-circle");
    title.textContent = "EXCELLENT CONDUITE !";
    title.style.color = "var(--green-success)";
    correctBanner.textContent = `Vous avez répondu juste : Option ${questionObj.reponsesCorrectes[0]}`;
    correctBanner.style.borderLeftColor = "var(--green-success)";
  } else {
    card.className = "modal-card infraction";
    icon.setAttribute("data-lucide", "shield-alert");
    title.textContent = "INFRACTION CONSTATÉE !";
    title.style.color = "var(--red-danger)";
    correctBanner.textContent = `La bonne réponse était : Option ${questionObj.reponsesCorrectes[0]}`;
    correctBanner.style.borderLeftColor = "var(--red-danger)";
  }
  
  // Explication pédagogique
  let explicationHtml = "";
  if (customExplicationText) {
    explicationHtml += `<strong>${customExplicationText}</strong><br><br>`;
  }
  explicationHtml += questionObj.explication;
  desc.innerHTML = explicationHtml;
  
  // Recréer les icônes lucide dans le modal
  if (window.lucide) window.lucide.createIcons();
  
  modal.classList.add("active");
  
  // Action de validation d'étape
  document.getElementById("btn-next-step").onclick = () => {
    fermerTousModals();
    progresserApresExplication();
  };
}

function progresserApresExplication() {
  // Est-ce qu'on a atteint la fin du bloc de 20 questions de la série en cours ?
  // Une série se valide aux étapes multiples de 20 (20, 40, 60, etc.)
  const stepFini = gameState.activeStepId;
  const estMultipleDeVingt = (stepFini % 20 === 0);
  
  if (estMultipleDeVingt && gameState.completedSteps.includes(stepFini)) {
    // Afficher l'écran de note intermédiaire sur 20
    afficherModalNoteIntermediaire(stepFini);
  } else {
    // Si c'est la dernière étape et qu'il l'a réussie, victoire totale !
    if (stepFini === TOTAL_STEPS && gameState.completedSteps.includes(TOTAL_STEPS)) {
      afficherModalVictoireFinale();
    } else {
      quitterQuiz();
    }
  }
}

function afficherModalNoteIntermediaire(stepMilestone) {
  const modal = document.getElementById("modal-score");
  const scoreObtained = document.getElementById("score-obtained");
  const title = document.getElementById("score-eval-title");
  const message = document.getElementById("score-eval-message");
  const wrapper = document.getElementById("score-circle-wrapper");
  
  // Calculer la note réelle sur 20 dans ce bloc de 20 questions
  const debutBloc = stepMilestone - 19;
  const finBloc = stepMilestone;
  
  let reponsesCorrectesPremierEssai = 0;
  for (let id = debutBloc; id <= finBloc; id++) {
    if (gameState.seriesFirstAttemptResults[id] === true) {
      reponsesCorrectesPremierEssai++;
    }
  }
  
  scoreObtained.textContent = reponsesCorrectesPremierEssai;
  
  // Évaluation verbale
  if (reponsesCorrectesPremierEssai >= 18) {
    title.textContent = "CONDUITE EXCELLENTE !";
    message.textContent = `Note : ${reponsesCorrectesPremierEssai}/20. Vous êtes un véritable expert de la route béninoise. L'ANaTT vous félicite !`;
    wrapper.style.borderColor = "var(--green-success)";
    scoreObtained.style.color = "var(--green-success)";
  } else if (reponsesCorrectesPremierEssai >= 15) {
    title.textContent = "ADMIS AU CRITÉRE DE L'EXAMEN";
    message.textContent = `Note : ${reponsesCorrectesPremierEssai}/20. Très bonne maîtrise globale. Continuez ainsi pour garantir votre examen pratique !`;
    wrapper.style.borderColor = "var(--neon-blue)";
    scoreObtained.style.color = "var(--neon-blue)";
  } else {
    title.textContent = "ENTRAÎNEMENT INSUFFISANT";
    message.textContent = `Note : ${reponsesCorrectesPremierEssai}/20. C'est insuffisant pour obtenir le permis de conduire ANaTT (seuil d'admissibilité de 15/20). Entraînez-vous à nouveau sur ce secteur de route !`;
    wrapper.style.borderColor = "var(--red-danger)";
    scoreObtained.style.color = "var(--red-danger)";
  }
  
  modal.classList.add("active");
  
  document.getElementById("btn-resume-map").onclick = () => {
    // Passer au secteur suivant
    const activeSector = SECTEURS.find(s => gameState.unlockedStep >= s.debut && gameState.unlockedStep <= s.fin);
    if (activeSector) {
      gameState.activeSectorIndex = SECTEURS.indexOf(activeSector);
      genererOngletsSecteurs();
    }
    
    // Réinitialiser la série pour le prochain bloc
    gameState.seriesCorrect = 0;
    gameState.seriesTotal = 0;
    gameState.seriesQuestionsPlayed = [];
    gameState.seriesFirstAttemptResults = {};
    
    fermerTousModals();
    quitterQuiz();
  };
}

function afficherModalGameOver() {
  const modal = document.getElementById("modal-gameover");
  const percentText = document.getElementById("gameover-progress-percent");
  
  // Progression globale en pourcentage
  const percent = Math.round(((gameState.unlockedStep - 1) / TOTAL_STEPS) * 100);
  percentText.textContent = `${percent}%`;
  
  modal.classList.add("active");
  
  // Recommencer la série en cours
  document.getElementById("btn-restart-series").onclick = () => {
    fermerTousModals();
    
    // On réinitialise la vie et on relance la série actuelle de 20 questions
    gameState.lives = 5;
    
    const baseStep = Math.floor((gameState.activeStepId - 1) / 20) * 20 + 1;
    gameState.seriesQuestionsPlayed = [];
    gameState.seriesCorrect = 0;
    gameState.seriesTotal = 0;
    gameState.seriesFirstAttemptResults = {};
    
    lancerQuizNiveau(baseStep);
  };
}

function afficherModalVictoireFinale() {
  const modal = document.getElementById("modal-victory");
  modal.classList.add("active");
  
  document.getElementById("btn-restart-game").onclick = () => {
    reinitialiserJeu();
  };
}

function fermerTousModals() {
  const overlays = document.querySelectorAll(".modal-overlay");
  overlays.forEach(o => o.classList.remove("active"));
}

function quitterQuiz() {
  clearInterval(gameState.timerInterval);
  stopLectureVocale();
  afficherEcran("screen-map");
  
  // Recharger la carte
  afficherMapSecteur(gameState.activeSectorIndex);
  mettreAJourTableauDeBord();
}

// ==========================================
// MAJ DU TABLEAU DE BORD (HUD / HUD BAR)
// ==========================================
function mettreAJourTableauDeBord() {
  // Rendu des cœurs de vies (barres de carburant)
  const heartsContainer = document.getElementById("hud-lives");
  heartsContainer.innerHTML = "";
  
  for (let i = 1; i <= 5; i++) {
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", "droplet");
    
    if (i <= gameState.lives) {
      icon.className = "life-heart";
    } else {
      icon.className = "life-heart empty";
    }
    heartsContainer.appendChild(icon);
  }
  
  // Progression globale
  document.getElementById("global-score").textContent = `${gameState.completedSteps.length} / ${TOTAL_STEPS}`;
  
  // Stats Odomètre en bas de la carte
  document.getElementById("stat-completed-count").textContent = gameState.completedSteps.length;
  
  // Taux de réussite global
  let totalEssais = Object.keys(gameState.seriesFirstAttemptResults).length;
  let totalReussis = Object.values(gameState.seriesFirstAttemptResults).filter(v => v === true).length;
  let taux = totalEssais > 0 ? Math.round((totalReussis / totalEssais) * 100) : 100;
  document.getElementById("stat-success-rate").textContent = `${taux}%`;
  
  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// GESTION DES ACTIONS ET ÉVÉNEMENTS
// ==========================================
function initEvenements() {
  // Clic sur "Valider" de la question
  document.getElementById("btn-validate").onclick = () => {
    validerReponseActive();
  };
  
  // Clic sur "Quitter"
  document.getElementById("btn-quit-quiz").onclick = () => {
    quitterQuiz();
  };
  
  // Clic sur "Continuer la route"
  document.getElementById("btn-start-quick").onclick = () => {
    lancerQuizNiveau(gameState.unlockedStep);
  };

  document.getElementById("btn-open-panneaux").onclick = () => {
    ouvrirSectionPanneaux();
  };

  document.getElementById("btn-back-map-from-panneaux").onclick = () => {
    quitterSectionPanneaux();
  };

  document.getElementById("btn-tts-replay").onclick = () => {
    lireQuestion(getQuestionActive(), true);
  };
}
