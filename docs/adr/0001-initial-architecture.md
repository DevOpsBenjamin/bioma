# ADR 0001: Choix de la Stack Technique et Architecture Initiale

- **Statut** : Accepté
- **Date** : 2026-08-26
- **Auteurs** : DevOpsBenjamin & Antigravity

## Contexte

Conception d'un jeu de puzzle logique de type Queens / Star Battle (nommé **Bioma**), sans publicité, mobile-first et jouable hors-ligne via PWA.

## Décision

1. **Framework Frontend & Réactivité** : **Vue 3** (Composition API `<script setup>`) avec **TypeScript** et **Vite**, couplé à **Pinia** pour l'état réactif granulaire et **Tailwind CSS v4** pour le design responsive et les transitions glassmorphism.
2. **Architecture Logicielle Découplée** : Séparation stricte entre le moteur de jeu/solveur (`src/core/`) et la couche de présentation Vue 3.
3. **CI / CD & Déploiement** : GitHub Actions pour les tests unitaires (`vitest`), le typecheck (`vue-tsc`) et le build Vite, avec déploiement sur **Cloudflare Pages** et **GitHub Pages**.
4. **Politique de Branche** : Branche `main` protégée, pull requests obligatoires, squash merge unique, blocking CI.

## Conséquences

- Performances optimales et légèreté (chargement instantané sur mobile).
- Qualité et robustesse garanties par la CI bloquante.
- Évolutivité pour de futurs modes de jeu (générateur procédural, daily puzzle, thèmes interchangeables).
