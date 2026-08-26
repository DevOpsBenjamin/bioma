# Domain Documentation

## Layout

**Layout: single-context**

Ce repository utilise un contexte de domaine unique au niveau racine :

- `CONTEXT.md` à la racine du repo — Glossaire du langage ubiquitaire (Ubiquitous Language)
- `docs/adr/` — Architecture Decision Records (ADRs)

## Règles d'utilisation

- Lire `CONTEXT.md` avant de concevoir ou d'implémenter toute logique de domaine ou d'algorithme.
- Utiliser rigoureusement les termes définis dans `CONTEXT.md` (Biomes, Cellules, Grille $N \times N$, Voisinage de Moore, Marqueurs, Solveur de contraintes, etc.).
- Proposer des ajouts à `CONTEXT.md` dès que de nouveaux concepts ou règles émergent.
- **Branch & PR Workflow** : Tout ajout/modification de `CONTEXT.md` ou d'un ADR dans `docs/adr/` doit être réalisé sur la branche dédiée du ticket, soumis via Pull Request et mergé sur `main` (`gh pr merge --squash --delete-branch`) avant la clôture du ticket.
