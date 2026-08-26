# Issue tracker & Pull Requests: GitHub

Issues, spécifications, roadmap et Pull Requests pour ce projet vivent sur GitHub. Utiliser la CLI `gh` pour toutes les opérations.

## Conventions

- **Créer une branche par ticket** : `git checkout -b <type>/issue-<n>-<slug>` (ex: `docs/issue-2-context-domain`, `feat/issue-3-solver-engine`).
- **Créer une issue** : `gh issue create --title "..." --body "..."`.
- **Consulter une issue** : `gh issue view <number> --comments`, avec filtrage `jq` et labels.
- **Lister les issues** : `gh issue list --state open --json number,title,body,labels,comments`
- **Commenter une issue** : `gh issue comment <number> --body "..."`
- **Gérer les labels** : `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Créer une Pull Request** : `gh pr create --title "..." --body "Closes #<number>\n\n<summary>"`
- **Merger une PR** : `gh pr merge --squash --delete-branch` (flags requis en non-interactif) puis synchroniser avec `git checkout main && git pull origin main`.

## Pull requests comme surface unique de livraison

Toute livraison de code, de documentation, d'assets ou de décision ADR passe impérativement par une Pull Request créée via `gh pr create` et fusionnée via `gh pr merge --squash --delete-branch`.

## Opérations du Wayfinder (`/wayfinder`)

Utilisé pour cartographier le projet, dissiper le brouillard d'inconnues et orchestrer les tickets. La **map** est une issue centrale labellisée `wayfinder:map` avec des sous-tickets (issues enfants).

- **Map Issue** : Une issue unique labellisée `wayfinder:map`, contenant les sections *Notes*, *Decisions-so-far*, *Fog of War* (points à éclaircir) et *Frontier*. Création : `gh issue create --label "wayfinder:map" --title "Map: ..." --body "..."`.
- **Tickets enfants** : Issues individuelles référencées dans la map. Labels : `wayfinder:<type>` (`research`, `prototype`, `grilling`, `task`).
- **Blocages & Dépendances** : Utiliser les dépendances d'issues GitHub natives (`gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`).
- **Frontier Query** : Lister les tickets ouverts sans bloqueurs actifs non résolus.
- **Prise en charge (Claim)** : `gh issue edit <n> --add-assignee @me`, suivi immédiatement de la création de la branche `git checkout -b <type>/issue-<n>-<slug>`.
- **Résolution d'un ticket** :
  1. **Développement, tests et commits sur la branche**.
  2. **Vérification locale** : `pnpm typecheck && pnpm test && pnpm build`.
  3. **Push de la branche** : `git push -u origin <branch>`.
  4. **Ouverture de la PR** : `gh pr create --title "<type>: resolve issue #<n> - <title>" --body "Closes #<n>\n\n## Résolution\n\n<résumé>"`.
  5. **Squash & Merge** : `gh pr merge --squash --delete-branch`.
  6. **Retour sur `main`** : `git checkout main && git pull origin main`.
  7. **Commentaire de résolution** : `gh issue comment <n> --body "<détail de la résolution>"`.
  8. **Clôture** de l'issue si non automatique : `gh issue close <n>`.
  9. **Mise à jour de la carte** : Mettre à jour `Decisions-so-far` et cocher la case du ticket dans la map issue.
  10. **Propreté** : Vérifier que `git status` est propre sur `main`.
