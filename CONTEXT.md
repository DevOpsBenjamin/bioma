# Bioma — Domain Context & Ubiquitous Language

> Ce document sert de source de vérité unique pour la terminologie, les invariants métier et les règles de conception de **Bioma**.

---

## 1. 🌿 Langage Ubiquitaire (Glossaire)

| Terme | Définition & Rôle |
| :--- | :--- |
| **Grille ($N \times N$)** | Matrice carrée de dimensions $N \times N$ ($N$ variant typiquement de 4 à 12). |
| **Cellule (Cell)** | Case élémentaire aux coordonnées $(r, c)$ avec $0 \le r, c < N$. |
| **Biome (Région / Zone)** | Sous-ensemble connexe de cellules partageant une même identité visuelle/couleur. Une grille de taille $N \times N$ contient exactement **$N$ biomes disjoints**. |
| **Arbre (Tree / Sujet)** | Élément principal à placer dans la grille (plante, fleur, félin, couronne selon le skin actif). |
| **Pousse / Marqueur (Dot / Mark)** | Indicateur placé par le joueur signifiant *"Aucun arbre ne peut être planté sur cette case"*. |
| **Voisinage de Moore (8-voisins)** | Les 8 cases adjacentes orthogonales (haut, bas, gauche, droite) et diagonales entourant une cellule. |
| **Conflit (Conflict / Violation)** | État d'erreur où deux arbres violent au moins un des 4 invariants fondamentaux. |
| **Générateur Procédural** | Algorithme qui construit une grille, partitionne les biomes et garantit l'existence d'une solution unique. |
| **Solveur de Contraintes** | Algorithme (backtracking + propagation de contraintes) capable de déterminer si une grille admet 0, 1 ou plusieurs solutions. |
| **Skin (Habillage)** | Thème graphique interchangeant les icônes et la palette (ex: Arbres 🌲, Sakuras 🌸, Chats 🐱, Étoiles ⭐, Couronnes 👑, Gemmes 💎). |

---

## 2. 📐 Invariants & Règles Fondamentales

Pour qu'une grille de taille $N \times N$ soit résolue :

1. **Unicité par Ligne** : Chaque ligne $r \in [0, N-1]$ doit contenir exactement **1 Arbre**.
2. **Unicité par Colonne** : Chaque colonne $c \in [0, N-1]$ doit contenir exactement **1 Arbre**.
3. **Unicité par Biome** : Chaque biome $b \in [0, N-1]$ doit contenir exactement **1 Arbre**.
4. **Non-Adjacence (Règle des 8-voisins)** : Deux arbres ne peuvent **jamais** se trouver dans deux cases adjacentes (ni orthogonalement, ni diagonalement).
5. **Solution Unique** : Tout puzzle proposé au joueur doit impérativement avoir une solution unique et prouvée sans ambiguïté.

---

## 3. 🎮 États d'une Cellule

Chaque case de la grille peut se trouver dans l'un des trois états suivants :
- `EMPTY` : Case neutre, non explorée.
- `MARK` : Case marquée par le joueur (symbole discret / caillou / graine) pour éliminer cette possibilité.
- `TREE` : Case où un arbre est planté.

---

## 4. 🧭 Architecture Technique

- **Moteur Logique Isolé** (`src/core/`) : Indépendant de l'UI (modèle de données immuable, solveur, générateur, vérificateur d'invariants, historique Undo/Redo).
- **Gestionnaire d'État** (`src/stores/`) : Store Pinia gérant la session de jeu, le chronomètre, les réglages et la persistance locale (`localStorage`).
- **Composants d'Interface** (`src/components/`) : Grille réactive Vue 3, palette de biomes, contrôles tactiles (drag-to-mark, single tap cycle).
- **Moteur Sonore Web Audio** (`src/audio/`) : Synthèse sonore en temps réel ultra-légère (pentatonique zen, retour haptique/acoustique sur chaque action).
