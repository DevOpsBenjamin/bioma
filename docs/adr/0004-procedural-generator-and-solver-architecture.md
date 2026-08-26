# ADR 0004: Moteur du Solveur, Générateur Procédural et Métrique de Difficulté

- **Statut** : Accepté
- **Date** : 2026-08-26
- **Auteurs** : DevOpsBenjamin & Antigravity
- **Ticket Lié** : [#5 Algorithme de génération procédurale et solveur à solution unique](https://github.com/DevOpsBenjamin/bioma/issues/5)

## Contexte

Pour garantir le mode Hardcore (zéro devinette), chaque niveau doit posséder strictement **une unique solution** prouvée par déduction logique. De plus, la taille de la grille (de 6x6 à 12x12) ne reflète pas à elle seule la difficulté cognitive d'un puzzle.

## Décisions

1. **Livraison par Catalogue Pré-généré & Compact** :
   - Les 500+ niveaux de la progression sont pré-générés et certifiés hors-ligne via un script Node/TypeScript (`pnpm generate:levels`).
   - Les niveaux sont compressés dans un fichier JSON léger embarqué dans l'application, offrant un temps de chargement immédiat (0 ms) et une empreinte mémoire/batterie minimale sur mobile.

2. **Pipeline de Génération (Arbres d'abord $\to$ Biomes 4-connexes)** :
   - Placement de $N$ arbres valides sous contrainte de non-adjacence (Moore 8-voisins).
   - Expansion cellulaire concurrente des $N$ biomes orthogonaux d'un seul tenant (taille $\ge 2$ cases par biome).
   - Validation par le solveur pour certifier l'unicité de la solution.

3. **Moteur du Solveur de Contraintes (CSP Engine)** :
   - Propagation de contraintes : élimination des zones saturées, détection des cases forcées (singletons) et des exclusions induites (lignes/colonnes bloquées par un biome).
   - Backtracking avec arrêt précoce dès que le nombre de solutions trouvées atteint 2.

4. **Décorrélation Taille / Difficulté & Notation par Déduction** :
   - Chaque niveau se voit attribuer une note de difficulté basée sur la profondeur des déductions requises :
     - 🟢 **Doux / Relax (Facile)** : Résoluble par déductions directes de base.
     - 🟡 **Équilibré (Moyen)** : Nécessite des exclusions croisées biomes / lignes.
     - 🔴 **Profond / Hardcore (Difficile)** : Nécessite des bifurcations logiques et projections anticipées.
   - Les niveaux sont organisés en vagues alternant les tailles de grille (6x6 à 12x12) au sein de catégories d'intensité choisies par le joueur.

## Conséquences

- 100% des niveaux ont une solution unique irréfutable.
- Possibilité d'étendre le catalogue à 1000+ niveaux facilement.
- Expérience de jeu rythmée et adaptée à l'énergie/humeur du joueur.
