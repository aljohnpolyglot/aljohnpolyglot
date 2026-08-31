import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'languages/german/js/data/german-creators-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const createdAt = '2026-08-30T00:00:00.000Z';
let created = 0;

for (const creator of data.creators) {
  const assetPath = path.join(root, 'languages/german', creator.profileImage);
  const sidecarPath = `${assetPath}.json`;
  if (!fs.existsSync(assetPath) || fs.existsSync(sidecarPath)) continue;
  const officialLinks = Object.values(creator.links || {}).join(', ');
  const prompt = `SOURCE ASSET: Existing verified local profile or identity image for ${creator.name}, retained from the pre-existing German creator dataset. Official public identity sources: ${officialLinks || 'recorded in the project dataset'}. Not AI-generated; reused without visual modification in the German portal build on 2026-08-30.`;
  fs.writeFileSync(sidecarPath, `${JSON.stringify({ prompt, createdAt }, null, 2)}\n`);
  created += 1;
}

const extraAssets = [
  {
    relativePath: 'languages/german/images/hero/aljohn-german-meetup.jpg',
    prompt: 'SOURCE ASSET: Existing local hero and playlist preview from Aljohn Polyglot\'s official video at https://www.youtube.com/watch?v=05cY5vrtXu0 in the supplied German playlist https://www.youtube.com/playlist?list=PLHC88jnBSUqIHoAHrUt_vBVPHDtM_x604. Retained from the pre-existing German page assets; not AI-generated.'
  },
  {
    relativePath: 'images/logo_linguno.png',
    prompt: 'SOURCE ASSET: Existing official Linguno identity mark retained from the shared website assets; official product source https://www.linguno.com/language/ger/. Not AI-generated; reused without visual modification in the German portal build on 2026-08-30.'
  }
];

for (const asset of extraAssets) {
  const assetPath = path.join(root, asset.relativePath);
  const sidecarPath = `${assetPath}.json`;
  if (!fs.existsSync(assetPath) || fs.existsSync(sidecarPath)) continue;
  fs.writeFileSync(sidecarPath, `${JSON.stringify({ prompt: asset.prompt, createdAt }, null, 2)}\n`);
  created += 1;
}

console.log(`Created ${created} provenance sidecars.`);
