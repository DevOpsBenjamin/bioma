# Bioma — Domain Context & Ubiquitous Language

> Ce document sert de source de vérité unique pour la terminologie, les invariants métier et les règles de conception de **Bioma**.

---

## 1. 🌿 Langage Ubiquitaire (Glossaire)

| Terme | Définition & Rôle |
| :--- | :--- |
| **Grille ($N \times N$)** | Matrice carrée de dimensions $N \times N$ ($N$ variant de 6 à 12 dans le flux de jeu standard). |
| **Cellule (Cell)** | Case élémentaire aux coordonnées $(r, c)$ avec $0 \le r, c < N$. |
| **Biome (Région / Zone)** | Sous-ensemble connexe orthogonal (4-connexité stricte) de cellules partageant une identité visuelle/couleur. Une grille $N \times N$ contient exactement **$N$ biomes disjoints** (taille minimum : 2 cases par biome). |
| **Arbre (Tree / Sujet)** | Élément principal à placer dans la grille (plante, fleur, félin, couronne selon le skin actif). |
| **Pousse / Marqueur (Dot / Mark)** | Indicateur placé par le joueur signifiant *"Aucun arbre ne peut être planté sur cette case"*. Aide visuelle facultative. |
| **Voisinage de Moore (8-voisins)** | Les 8 cases adjacentes orthogonales (haut, bas, gauche, droite) et diagonales entourant une cellule. |
| **Mode Hardcore Absolu (One-Strike)** | Règle d'évaluation stricte : la validation d'un arbre sur une case ne faisant pas partie de la **solution unique** déclenche immédiatement l'**Échec du Niveau**. |
| **Transformation Anti-Mémorisation** | Mécanisme appliqué lors du rejeu d'un niveau échoué (rotation aléatoire 90°/180°/270°, symétrie miroir, permutation des couleurs de biomes) pour neutraliser la mémorisation spatiale brute et forcer la déduction logique. |
| **Rythme de Progression Non-Linéaire** | Alternance dynamique des tailles de grille (ex: vagues 6x6 $\to$ 9x9 $\to$ 12x12 $\to$ 7x7 $\to$ 10x10) sur 500+ niveaux pour éviter l'épuisement mental et la monotonie. |
| **Pause Mindful / Anti-Hyperfocus** | Message d'encouragement et d'invitation à la pause déclenché tous les 10 niveaux consécutifs. |
| **Générateur Procédural & Solveur** | Algorithmes vérifiant qu'un puzzle admet **strictement une unique solution** avant d'être proposé. |

---

## 2. 📐 Invariants & Règles Fondamentales

Pour qu'une grille de taille $N \times N$ soit résolue :

1. **Unicité par Ligne** : Chaque ligne $r \in [0, N-1]$ doit contenir exactement **1 Arbre**.
2. **Unicité par Colonne** : Chaque colonne $c \in [0, N-1]$ doit contenir exactement **1 Arbre**.
3. **Unicité par Biome** : Chaque biome $b \in [0, N-1]$ doit contenir exactement **1 Arbre**.
4. **Non-Adjacence (Règle des 8-voisins)** : Deux arbres ne peuvent **jamais** se trouver dans deux cases adjacentes (ni orthogonalement, ni diagonalement).
5. **Connexité Orthogonale Stricte des Biomes** : Deux cases d'un même biome ne sont connectées que si elles partagent une arête commune (les connexions en diagonale ne sont pas admises).
6. **Solution Unique** : Tout puzzle proposé au joueur doit impérativement avoir une solution mathématique unique et vérifiée.

---

## 3. 🎮 États d'une Cellule & Boucle de Jeu

- `EMPTY` : Case neutre, inexplorée.
- `MARK` : Case marquée par le joueur (croix / graine / galet) pour éliminer cette position (aide optionnelle).
- `TREE` : Case où un arbre est planté et validé.
  - Si la case fait partie de la **solution unique** $\to$ Arbre ancré avec succès.
  - Si la case ne fait pas partie de la solution $\to$ **Échec Immédiat du Niveau** (One-Strike).

---

## 4. 🔄 Boucle d'Échec et Anti-Mémorisation

Lorsqu'un niveau échoue :
1. L'état actuel de la grille est gelé avec un feedback visuel zen mais sans appel ("Échec de l'Harmonie").
2. Le joueur est redirigé vers l'accueil ou le menu des niveaux pour casser la rétention de mémoire à court terme.
3. À la relance du niveau, la matrice sous-jacente subit une transformation isométrique aléatoire (rotation $\in \{0^\circ, 90^\circ, 180^\circ, 270^\circ\}$, inversion axiale) et les couleurs des biomes sont permutées aléatoirement : la structure logique reste rigoureusement identique, mais le cerveau doit reconstruire le raisonnement logique sans pouvoir recopier visuellement son coup précédent.
