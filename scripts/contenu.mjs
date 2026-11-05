// Génère CONTENU.md : tous les textes du site, dans toutes les langues, section par section, pour validation par la cliente.
//   node scripts/contenu.mjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LANGS = [
  ["he", "עברית"],
  ["fr", "Français"],
  ["en", "English"],
  ["es", "Español"],
];
const SECTIONS = {
  meta: "Référencement (titres Google et descriptions, par page)",
  nav: "Menu",
  infobar: "Bandeau d'infos pratiques",
  intro: "Ouverture",
  hero: "Hero",
  datebar: "Barre « Vérifier ma date » du hero",
  tiles: "Tuiles 001 · 002 · 003",
  manifesto: "Manifeste",
  services: "Prestations et prix (prix dans data/prestations.json)",
  about: "Portrait d'Oshrat (à compléter avec elle)",
  gallery: "Galerie « Nos mariées »",
  process: "Comment ça marche",
  masterclass: "Masterclass (programme à valider, chiffres dans data/masterclass.json)",
  tips: "Conseils pour le mariage (proposition à faire valider par Oshrat)",
  partners: "Maquilleuses partenaires (masqué tant que data/partenaires.json est vide)",
  zone: "Zone de déplacement",
  faq: "Questions fréquentes",
  words: "Les mots des mariées",
  booking: "Formulaire + message WhatsApp",
  whatsapp: "Bouton WhatsApp",
  footer: "Pied de page",
  pages: "Pages Coiffures de mariée, Coiffures de soirée, Masterclass, Mentions légales",
  alt: "Textes alternatifs des photos (accessibilité, Google Images)",
};

const dicts = Object.fromEntries(await Promise.all(LANGS.map(async ([l]) => [l, JSON.parse(await readFile(path.join(ROOT, "locales", `${l}.json`), "utf8"))])));

function flatten(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") out.push(...flatten(v, key));
    else out.push([key, String(v)]);
  }
  return out;
}
const get = (obj, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

let md = `# Oshrat Aharon – Bridal & Evening Hair : contenu du site

Tous les textes du site, dans les 4 langues, à relire et valider avec Oshrat.
Fichiers sources : \`locales/he.json\`, \`fr.json\`, \`en.json\`, \`es.json\` (ce fichier est généré par \`npm run contenu\`).
Données à remplir : \`data/prestations.json\` (prix « à partir de »), \`data/masterclass.json\` (format, durée, prix, dates),
\`data/dates.json\` (dates déjà prises), \`data/avis.json\` (vrais avis de mariées), \`data/partenaires.json\` (maquilleuses, avec accord),
\`data/site.json\` (ville de base).
La liste des informations à demander à Oshrat est dans **INFOS-A-DEMANDER.md**.

`;

for (const [sec, title] of Object.entries(SECTIONS)) {
  md += `\n## ${title}\n`;
  for (const [key] of flatten(dicts.he[sec], sec)) {
    md += `\n**\`${key}\`**\n\n`;
    for (const [l, name] of LANGS) md += `- ${name} : ${get(dicts[l], key) ?? "—"}\n`;
  }
}

await writeFile(path.join(ROOT, "CONTENU.md"), md);
console.log("CONTENU.md écrit");
