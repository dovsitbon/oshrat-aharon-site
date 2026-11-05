# Infos à demander à Oshrat Aharon

Le site est en ligne avec ses vraies photos Instagram. Rien n'a été inventé : prix, avis, dates, ville et chiffres restent vides tant qu'elle ne les a pas donnés.
Chaque réponse se reporte dans un fichier précis, sans toucher au code.

| # | Question | Où la reporter |
|---|----------|----------------|
| 1 | **Ville de base et zone de déplacement** (villes, régions, distance max ?) | `data/site.json` → `city` ; texte `zone` dans `locales/*.json` |
| 2 | **Son histoire** : depuis quand elle coiffe, comment elle a commencé, sa formation, ce qu'elle aime dans son métier | `locales/*.json` → `about.text` (le texte actuel est une proposition à valider) |
| 3 | **Ses prix et formules** « à partir de » : mariée, essai, soirée, accompagnantes, henné / fiançailles | `data/prestations.json` → `price` (nombre en ₪, `null` = « sur demande ») |
| 4 | **L'essai** : le propose-t-elle ? Où, combien de temps avant, prix ? | `data/prestations.json` (ligne `trial`) ; FAQ |
| 5 | **Frais de déplacement et départ tôt le matin** : tarif, à partir de quelle heure | `data/prestations.json` → `extras` |
| 6 | **Acompte** : montant, comment le verser, conditions d'annulation | FAQ « Comment réserver la date ? » |
| 7 | **Masterclass** : format (privé / petit groupe), durée, programme réel, ce qui est inclus (modèle, kit, certificat ?), prix, places, prochaines dates | `data/masterclass.json` ; `locales/*.json` → `masterclass.program` / `included` |
| 8 | **Vrais avis de mariées** (story « כלות מפרגנות ») avec l'accord de chacune : prénom ou initiale | `data/avis.json` |
| 9 | **Maquilleuses partenaires** : lesquelles accepte-t-elle de citer (accord écrit de chacune) | `data/partenaires.json` (la section reste masquée tant que c'est vide) |
| 10 | **Conseils pour le mariage** : valider ou corriger les 6 conseils proposés (story « טיפים לחתונה ») | `locales/*.json` → `tips` |
| 11 | **Photos et vidéos en bonne qualité** (fichiers d'origine, pas Instagram), surtout des vues de dos et de trois quarts, et 1 ou 2 reels pour un hero vidéo muet | `assets/` puis `npm run media` |
| 12 | **Logo** si elle en a un (sinon le logo typographique « OSHRAT AHARON » + mèche et épingle à perle reste) | `components/Logo.tsx`, `app/icon.svg` |
| 13 | **Portrait** : confirmer que la photo de profil Instagram est bien elle (les visuels n°23 et 26 semblent aussi être elle) | `public/media/apropos/` |
| 14 | **Accord des mariées** dont les photos sont publiées (aucun prénom ni compte n'est affiché sur le site) | — |
| 15 | **Nom de domaine** souhaité (ex. oshrataharon.co.il) | Vercel |
| 16 | **Dates déjà prises** pour griser le calendrier du formulaire | `data/dates.json` → `taken` |

## Déjà en place

- WhatsApp 054-940-9503 (lien wa.me/972549409503) ; lien WhatsApp Business gardé dans `data/site.json` au cas où elle le préfère.
- Horaires de réponse dim.–jeu. 8 h 30 – 17 h, rappel « date + lieu » dans le bandeau, sous le bouton d'envoi et dans la FAQ.
- Instagram @oshrataharonhairstyle.
