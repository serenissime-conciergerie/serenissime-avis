# serenissime-avis — Contexte projet

> Ce fichier doit être lu en début de toute session (Chat ou Code) sur ce projet.
> **Règle** : à la fin de chaque session, mettre à jour ce fichier avec ce qui a changé (nouvelles fonctionnalités, bugs corrigés, décisions prises, points en suspens). Ne jamais laisser ce fichier devenir obsolète.

**Repo** : `serenissime-conciergerie/serenissime-avis`, branche `main`
**Stack** : vraisemblablement Cloudflare Workers (même schéma que les autres logiciels Sérénissime) — *à confirmer/compléter lors d'une prochaine session (base de données, stockage, structure du code)*
**Contact** : Jean-Jacques Boulanger (JJ), directeur Sérénissime Conciergerie (locations courte durée, Finistère Nord / Côtes d'Armor Ouest)

## Objet du logiciel

Récupère automatiquement les avis laissés par les vacanciers sur **Hostify** (PMS de gestion des réservations), les affiche, et calcule la moyenne des notes par hébergement.

## Fonctionnement

- **Synchronisation avec Hostify** : automatique, en arrière-plan (pas d'action manuelle requise — à la différence de `serenissime-planning` où la synchronisation Hostify est manuelle).
- **Affichage des avis** par hébergement.
- **Calcul de la moyenne des notes** par hébergement.
- **Usage en lecture seule** : le logiciel est un outil de consultation uniquement — pas de réponse aux avis, pas de filtrage avancé, pas d'alertes automatiques à ce jour.

## À faire (prochaine session)

- Compléter ce fichier avec les détails techniques (stack précise, fréquence exacte de la synchronisation automatique, structure du code) lors d'une prochaine session de travail sur ce dépôt.
- Clarifier si des évolutions sont envisagées (ex. alertes sur notes basses, réponse aux avis, filtres) — non demandées à ce jour mais à vérifier si le besoin évolue.
- Documenter ici toute évolution ou correctif dès qu'une session de développement a lieu.

## Historique des sessions

- *(Aucune session de développement documentée à ce jour — ce fichier a été créé à partir d'une description fonctionnelle de l'application par JJ, le 27 août 2026, sans accès direct au code.)*
