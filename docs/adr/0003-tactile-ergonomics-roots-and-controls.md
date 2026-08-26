# ADR 0003: Ergonomie Tactile, Gestuelle d'Ancrage et Système de Racines

- **Statut** : Accepté
- **Date** : 2026-08-26
- **Auteurs** : DevOpsBenjamin & Antigravity
- **Ticket Lié** : [#4 Ergonomie tactile, contrôles mobile-first et interactions de grille](https://github.com/DevOpsBenjamin/bioma/issues/4)

## Contexte

Puisque le mode Hardcore sanctionne tout arbre mal placé par un échec immédiat, l'ergonomie mobile doit éliminer tout risque de miss-click accidentel, tout en offrant une fluidité maximale pour le traçage et l'élimination des cases déduites.

## Décisions

1. **Gestuelle Délibérée d'Ancrage (Double-Tap)** :
   - Le placement d'un Arbre se fait exclusivement par **Double-Tap (fenêtre de 300ms)** sur mobile ou Clic Droit sur PC.
   - Cette action délibérée justifie le mode One-Strike : l'arbre posé est immédiatement vérifié contre la solution unique. S'il est valide, il est ancré et verrouillé définitivement.

2. **Système de Racines Végétales (Hard Roots)** :
   - À l'ancrage d'un arbre, celui-ci déploie automatiquement des **Racines végétales** non-supprimables qui verrouillent les cases interdites.
   - 3 réglages modulaires indépendants :
     1. `autoRootsRowCol` : Remplissage de la ligne et de la colonne de l'arbre (**Actif par défaut**).
     2. `autoRootsNeighbors` : Remplissage des 8 cases adjacentes de Moore (**Actif par défaut**).
     3. `autoRootsBiome` : Remplissage du biome entier de l'arbre (**Inactif par défaut**, activable en option).

3. **Brouillons & Drag-to-Mark Intelligent** :
   - Le Tap Simple et le Drag permettent de poser et d'effacer les brouillons souples (`SOFT_MARK`).
   - Les arbres et racines sont protégés et immunisés au passage du doigt.
   - Un bouton discret Gomme 🧹 permet de vider tous les brouillons d'un coup.
   - Aucun survol/highlight agressif de ligne/colonne au doigt pour préserver la quiétude et la clarté visuelle.

## Conséquences

- Zéro fausse manipulation accidentelle.
- Rythme de jeu accéléré et très satisfaisant grâce à l'enracinement automatique.
- Interface minimaliste sans boutons superflus.
