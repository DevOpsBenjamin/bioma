# ADR 0006: Thème Végétal Exclusif, Accessibilité Daltonienne et Moteurs Haptique & Audio

- **Statut** : Accepté
- **Date** : 2026-08-26
- **Auteurs** : DevOpsBenjamin & Antigravity
- **Ticket Lié** : [#7 Thèmes visuels, personnalisation des skins et feedback sensoriel (Audio / Haptique)](https://github.com/DevOpsBenjamin/bioma/issues/7)

## Contexte

Définir l'identité visuelle de **Bioma** pour la V1, l'accessibilité visuelle des 12 biomes colorés, et les retours sensoriels (vibrations haptiques mobile et synthèse sonore Web Audio discrète).

## Décisions

1. **Thème Unique V1 : L'Arbre Ancestral 🌲 & ses Racines 🌱** :
   - Préservation stricte de la cohérence et de l'identité végétale originelle de *Bioma*.
   - Aucun autre skin cosmétique en V1.

2. **Palette de 12 Biomes & Motifs d'Accessibilité Daltonienne** :
   - Nuances végétales contrastées sur fond sombre reposant (`#091310`).
   - Superposition de **motifs géométriques fins et discrets** (points, hachures, vagues, chevrons) permettant d'identifier immédiatement les frontières de biomes même en cas de daltonisme.

3. **Moteur Haptique Mobile Prioritaire** :
   - Déclenchement de pulsations tactiles via `navigator.vibrate` sur le double-tap d'ancrage, le déploiement des racines et l'écran de victoire.
   - Option d'activation/désactivation dans les réglages.

4. **Synthèse Sonore Web Audio Légère** :
   - Synthèse en temps réel (zéro fichier audio externe lourd) : micro-tic sur brouillon, son d'ancrage végétal et bruissement à l'enracinement, son d'échec feutré.
   - Bouton de coupure rapide (Mute) dans l'en-tête.

## Conséquences

- Univers artistique pur, immersif et immédiatement reconnaissable.
- Accessibilité exemplaire pour tous les profils visuels.
- Retours physiques percutants sur smartphone.
