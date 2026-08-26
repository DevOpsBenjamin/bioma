# Bioma — Domain Context & Ubiquitous Language

> Ce document sert de source de vérité unique pour la terminologie, les invariants métier et les règles de conception de **Bioma**.

---

## 1. 🌿 Langage Ubiquitaire (Glossaire)

| Terme | Définition & Rôle |
| :--- | :--- |
| **Grille ($N \times N$)** | Matrice carrée de dimensions $N \times N$ ($N$ variant de 6 à 12 dans le catalogue standard). |
| **Cellule (Cell)** | Case élémentaire aux coordonnées $(r, c)$ avec $0 \le r, c < N$. |
| **Biome (Région / Zone)** | Sous-ensemble connexe orthogonal (4-connexité stricte) de cellules partageant une identité visuelle/couleur. Une grille $N \times N$ contient exactement **$N$ biomes disjoints** (taille minimum : 2 cases par biome). |
| **Arbre (Tree / Sujet)** | Élément principal de l'identité végétale de Bioma. Planté délibérément via **Double-Tap** (mobile) ou Clic Droit (desktop). Une fois validé avec succès, l'arbre devient immuable et verrouillé. |
| **Brouillon / Marqueur Souple (Soft Mark)** | Croix/marqueur translucide posé par le joueur (tap simple ou drag-to-mark) pour marquer ses déductions. Modifiable et effaçable à tout moment. |
| **Racine / Marqueur Dur (Hard Root)** | Marqueur végétal verrouillé et non-supprimable, déployé automatiquement par un Arbre planté pour interdire les cases de son entourage selon les options de confort actives. |
| **Motifs d'Accessibilité (Colorblind Textures)** | Textures et motifs géométriques subtils (points, hachures, vagues, quadrillage) superposés aux 12 couleurs de biomes pour garantir la distinction des zones sans dépendre de la perception des couleurs. |
| **Moteur Haptique Mobile** | Déclenchement de pulsations tactiles précises via `navigator.vibrate` (double-tap d'ancrage, déploiement des racines, victoire), débrayable dans les réglages. |
| **Moteur Web Audio Discret** | Synthèse audio en temps réel sans fichier externe : micro-tic sur brouillon, son d'ancrage et bruissement végétal sur déploiement des racines, son d'échec feutré. |
| **Options d'Auto-Enracinement** | Réglages utilisateur modulaires contrôlant le déploiement automatique des Racines à la pose d'un arbre : (1) Ligne & Colonne [Actif par défaut], (2) 8-voisins de Moore [Actif par défaut], (3) Biome entier [Inactif par défaut]. |
| **Campagne des Biomes (V1 Focus)** | Mode de jeu principal de la V1 constitué d'un parcours de 500+ niveaux non-linéaires alternant les tailles de grille (6x6 à 12x12) sous 3 filtres d'intensité (Doux / Équilibré / Profond). |
| **Étoile Parfaite (One-Shot Star ⭐)** | Récompense d'excellence unique accordée si et seulement si le niveau est résolu **du premier coup sans aucun échec**. En cas d'erreur/reset, l'étoile de ce niveau est **définitivement perdue**. |
| **Rang d'Harmonie** | Titre honorifique final attribué au joueur à l'issue des 500+ niveaux, calculé d'après le nombre total d'Étoiles Parfaites One-Shot cumulées. |
| **Moteur de Persistance IndexedDB** | Couche de stockage local asynchrone robuste (V1 offline) gérant l'état des niveaux, étoiles et réglages, avec outil d'Export / Import JSON et architecture prête pour synchronisation cloud future. |
| **Pause Mindful / Anti-Hyperfocus** | Message d'encouragement et d'invitation à la pause déclenché tous les 10 niveaux consécutifs. |
| **Solveur de Contraintes (CSP Engine)** | Algorithme de propagation de contraintes et backtracking à arrêt précoce à $S=2$ certifiant l'unicité stricte de la solution. |
| **Catalogue Pré-Généré** | Fichier JSON compact embarqué dans l'application contenant les 500+ grilles certifiées pour un chargement instantané à 0 ms. |
| **Mode Hardcore Absolu (One-Strike)** | Règle d'évaluation stricte : la validation d'un arbre sur une case ne faisant pas partie de la **solution unique** déclenche immédiatement l'**Échec du Niveau**. |
| **Transformation Anti-Mémorisation** | Mécanisme appliqué lors du rejeu d'un niveau échoué (rotation aléatoire 90°/180°/270°, symétrie miroir, permutation des couleurs de biomes) pour neutraliser la mémorisation spatiale brute et forcer la déduction logique. |

---

## 2. 📐 Invariants & Règles Fondamentales

Pour qu'une grille de taille $N \times N$ soit résolue :

1. **Unicité par Ligne** : Chaque ligne $r \in [0, N-1]$ doit contenir exactement **1 Arbre**.
2. **Unicité par Colonne** : Chaque colonne $c \in [0, N-1]$ doit contenir exactement **1 Arbre**.
3. **Unicité par Biome** : Chaque biome $b \in [0, N-1]$ doit contenir exactement **1 Arbre**.
4. **Non-Adjacence (Règle des 8-voisins)** : Deux arbres ne peuvent **jamais** se trouver dans deux cases adjacentes (ni orthogonalement, ni diagonalement).
5. **Connexité Orthogonale Stricte des Biomes** : Deux cases d'un même biome ne sont connectées que si elles partagent une arête commune (les connexions en diagonale ne sont pas admises).
6. **Solution Unique** : Tout puzzle proposé au joueur doit impérativement avoir une solution mathématique unique et vérifiée par le solveur.

---

## 3. 🎮 États d'une Cellule & Contrôles

- `EMPTY` : Case neutre, inexplorée.
- `SOFT_MARK` : Brouillon libre posé par le joueur (tap simple ou drag).
- `TREE` : Arbre validé et verrouillé.
- `HARD_ROOT` : Racine immuable déployée par un arbre (non-effaçable).

### Interactions
- **Double-Tap (300ms) / Clic Droit** : Planter un Arbre (`TREE`). Évalue immédiatement la solution (Hardcore : échec si non valide, ancrage permanent si valide).
- **Tap Simple & Drag-to-mark** : Poser / Effacer des brouillons (`SOFT_MARK`). Glisser depuis une case vide remplit de brouillons ; glisser depuis un brouillon les efface.
- **Bouton Gomme 🧹** : Nettoie instantanément tous les brouillons (`SOFT_MARK`) sans toucher aux arbres ni aux racines.
- **Grille Statique Épurée** : Pas de surbrillance distrayante des lignes/colonnes au toucher.
