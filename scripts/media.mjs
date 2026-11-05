// Trie les visuels Instagram (assets/raw/) dans assets/<catégorie>/ avec des noms lisibles,
// puis les prépare pour le web dans public/media/<catégorie>/ (next/image sert ensuite AVIF/WebP à la bonne taille).
//   npm run media
//
// Nom = <style>-<n>.jpg ; le style sert à la fois de texte alternatif (locales/*.json → alt) et de filtre de galerie.
// Écartées volontairement : 05, 30, 59, 60, 61, 68, 74 (couvertures de reels en 720 px), 08, 09, 11, 14, 18, 20, 22, 29, 32, 37,
// 39, 40, 41, 42, 45, 51, 52, 54, 55, 56, 58, 66, 67, 70, 73, 78, 83, 84 (doublons de style ou coiffure peu visible),
// 10 (silhouette en pied, coiffure trop petite), 82 (avant/après sans coiffure), 94 (marié, pas de coiffure),
// 23 et 26 (portraits qui semblent être Oshrat elle-même : gardés en réserve pour « À propos », à confirmer).
// Aucune légende Instagram n'est reprise : ni prénom, ni compte de mariée ou de maquilleuse.
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = readdirSync(path.join(ROOT, "assets/raw"));
const raw = (n) => {
  const f = RAW.find((x) => x.startsWith(`oshrat-aharon_${n}`));
  if (!f) throw new Error(`introuvable : ${n}`);
  return `raw/${f}`;
};

// [n° Instagram, catégorie, style]
const PICKS = [
  ["03", "hero", "ondulations"],
  ["34", "hero", "chignon-dos"],
  ["80", "hero", "chignon-bijou"],

  ["01", "mariees", "ondulations"],
  ["02", "mariees", "ondulations"],
  ["04", "mariees", "ondulations"],
  ["19", "mariees", "ondulations"],
  ["27", "mariees", "ondulations"],
  ["36", "mariees", "ondulations"],
  ["47", "mariees", "ondulations"],
  ["48", "mariees", "ondulations"],
  ["53", "mariees", "ondulations"],
  ["65", "mariees", "ondulations"],
  ["86", "mariees", "ondulations"],
  ["06", "mariees", "chignon-flou"],
  ["07", "mariees", "chignon-flou"],
  ["12", "mariees", "chignon-flou"],
  ["46", "mariees", "chignon-flou"],
  ["57", "mariees", "chignon-flou"],
  ["44", "mariees", "chignon-bas"],
  ["62", "mariees", "chignon-bas"],
  ["63", "mariees", "chignon-bas"],
  ["69", "mariees", "chignon-bas"],
  ["76", "mariees", "chignon-bas"],
  ["43", "mariees", "chignon-haut"],
  ["31", "mariees", "chignon-haut"],
  ["21", "mariees", "semi-attache"],
  ["24", "mariees", "semi-attache"],
  ["25", "mariees", "semi-attache"],
  ["49", "mariees", "semi-attache"],
  ["17", "mariees", "semi-attache"],
  ["71", "mariees", "queue-de-cheval"],
  ["87", "mariees", "queue-de-cheval"],

  ["35", "details", "chignon-dos"],
  ["50", "details", "chignon-dos"],
  ["79", "details", "chignon-bijou"],
  ["64", "details", "couronne"],
  ["92", "details", "couronne"],
  ["93", "details", "couronne"],
  ["90", "details", "fleurs"],

  ["13", "soiree", "soiree-attache"],
  ["16", "soiree", "soiree-ondulations"],
  ["28", "soiree", "soiree-ondulations"],
  ["38", "soiree", "soiree-ondulations"],
  ["85", "soiree", "soiree-ondulations"],
  ["88", "soiree", "soiree-ondulations"],
  ["91", "soiree", "soiree-ondulations"],
  ["89", "soiree", "tresse"],
  ["81", "soiree", "queue-de-cheval"],

  ["77", "masterclass", "masterclass-gestes"],
  ["75", "masterclass", "lisse"],
  ["72", "masterclass", "masterclass-coulisses"],

  ["logo", "apropos", "oshrat"],
];

const sizes = {};
const count = {};
for (const [n, cat, style] of PICKS) {
  const k = `${cat}/${style}`;
  count[k] = (count[k] ?? 0) + 1;
  const name = `${style}-${String(count[k]).padStart(2, "0")}`;
  const file = path.join(ROOT, "assets", raw(n));
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  await copyFile(file, path.join(ROOT, "assets", cat, `${name}.jpg`));
  const max = cat === "hero" ? 2000 : 1600;
  const info = await sharp(file)
    .rotate()
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
  sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
}

// Image de partage (Open Graph) 1200 × 630 : la mariée aux ondulations, cadrée sur le visage et les cheveux
await sharp(path.join(ROOT, "assets", raw("03")))
  .resize(1200, 630, { fit: "cover", position: "top" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`${PICKS.length} images prêtes`);
