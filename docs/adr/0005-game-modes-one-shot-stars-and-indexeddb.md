# ADR 0005: Modes de Jeu V1, Système d'Étoile One-Shot et Persistance IndexedDB

- **Statut** : Accepté
- **Date** : 2026-08-26
- **Auteurs** : DevOpsBenjamin & Antigravity
- **Ticket Lié** : [#6 Modes de jeu, progression et persistance (Campagne, Daily, Zen)](https://github.com/DevOpsBenjamin/bioma/issues/6)

## Contexte

Définir le périmètre fonctionnel des modes de jeu pour la V1, le système de gratification/scoring adapté au mode Hardcore sans pression de chronomètre, et l'infrastructure de persistance locale pérenne sur mobile PWA.

## Décisions

1. **Périmètre V1 : 100% Focalisé sur la Campagne (500+ Niveaux)** :
   - La V1 concentre tous les efforts sur **La Campagne des Biomes**, articulée en vagues non-linéaires de tailles (6x6 à 12x12) et filtrable par intensité logique (Doux / Équilibré / Profond).
   - Les modes *Daily* et *Zen Infini* sont relégués aux évolutions V2.

2. **Système de Notation par Étoile One-Shot ⭐** :
   - Aucun chronomètre imposé : la réflexion se fait à son propre rythme.
   - **L'Étoile One-Shot ⭐** n'est décernée que si le niveau est complété **au tout premier essai sans aucun échec ni reset**.
   - En cas d'échec sur un niveau, **l'étoile de ce niveau est définitivement perdue**. Le joueur peut continuer sa campagne pour valider le niveau, mais sans l'étoile.
   - Le total des étoiles collectées sur les 500+ niveaux détermine le **Rang d'Harmonie final** du joueur.

3. **Moteur de Stockage Local IndexedDB & Export/Import** :
   - Utilisation d'**IndexedDB** pour la persistance locale (robustesse et pérennité sur navigateurs mobiles PWA).
   - Module d'**Export / Import JSON** permettant de sauvegarder, restaurer ou transférer sa progression d'un appareil à l'autre en 1 clic.
   - Architecture découplée et prête pour un futur backend cloud (ex: Supabase).

4. **Pause Mindful / Anti-Hyperfocus** :
   - Rappel bienveillant d'invitation à la pause déclenché tous les 10 niveaux consécutifs complétés dans une même session.

## Conséquences

- Clarté maximale du produit V1 sans dispersion.
- Tension et concentration maximales : chaque niveau compte pour le score d'excellence global.
- Sauvegarde sécurisée et immunisée contre les suppressions intempestives de `localStorage`.
