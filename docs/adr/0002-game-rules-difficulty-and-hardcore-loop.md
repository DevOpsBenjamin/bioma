# ADR 0002: Règles Fondamentales, Difficulté Non-Linéaire et Boucle Hardcore

- **Statut** : Accepté
- **Date** : 2026-08-26
- **Auteurs** : DevOpsBenjamin & Antigravity
- **Ticket Lié** : [#3 Règles de jeu, contraintes exactes et échelles de difficulté](https://github.com/DevOpsBenjamin/bioma/issues/3)

## Contexte

Les jeux de casse-tête gratuits sur smartphone (ex: Meowdoku, Zoodoku) imposent souvent un système de 3 vies qui incite le joueur à deviner un coup sur deux au lieu d'employer la logique pure, tout en étant saturés de publicités. Nous concevons **Bioma** comme une expérience 100% logique, sans pub, exigeante et rythmée.

## Décisions

1. **Invariants Purs (1 Arbre par Zone)** :
   - 1 arbre par ligne, 1 par colonne, 1 par biome connexe orthogonal (4-connexité, minimum 2 cases).
   - Aucun contact entre deux arbres parmi les 8 voisins de Moore.

2. **Système Hardcore "Zero-Guessing"** :
   - Tout arbre validé qui n'appartient pas à la solution unique entraîne un **Échec Immédiat** du niveau.
   - Les marqueurs (croix/pousses) restent des outils de travail libres et non évalués.
   - La victoire est instantanée dès la pose des $N$ arbres valides.

3. **Boucle Anti-Mémorisation Visuelle** :
   - À l'échec, le joueur est renvoyé vers l'accueil/sélection des niveaux pour briser la mémoire spatiale à court terme.
   - Au rejeu du niveau, une transformation isométrique (rotation 90°/180°/270°, miroir) et une permutation des couleurs de biomes sont appliquées. Le graphe logique est conservé, mais le repère visuel est neutralisé.

4. **Progression Non-Linéaire sur 500+ Niveaux (6x6 à 12x12)** :
   - Alternance en vagues dynamiques des dimensions de grilles pour éviter la monotonie.
   - Message de pause bienveillant (*Anti-Hyperfocus / TDAH*) tous les 10 niveaux consécutifs.

## Conséquences

- Élimination totale de la stratégie de devinette : chaque coup doit être prouvé logiquement par le joueur.
- Rétention et satisfaction intellectuelle décuplées.
- Exigence forte sur le solveur et le générateur pour garantir 100% de puzzles à solution unique irréprochable.
