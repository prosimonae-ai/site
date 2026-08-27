/* ══════════════════════════════════════════════
   REELS — gallery grid  |  reels.js
   → Remplis REELS avec tes vrais assets
══════════════════════════════════════════════ */

/* vimeoId = ID Vimeo       | vimeoH = hash si privée
   poster  = miniature       | client = nom du client
   desc    = courte description                         */

/* ─── Vimeo thumbnail cache ─── */
const thumbCache = new Map();

async function getVimeoThumb(vimeoId, vimeoH) {
  const key = vimeoId + (vimeoH || '');
  if (thumbCache.has(key)) return thumbCache.get(key);
  const vimeoUrl = vimeoH
    ? `https://vimeo.com/${vimeoId}/${vimeoH}`
    : `https://vimeo.com/${vimeoId}`;
  const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}&width=1280`);
  if (!res.ok) throw new Error('oEmbed failed');
  const data = await res.json();
  const url = data.thumbnail_url || '';
  thumbCache.set(key, url);
  return url;
}
const REELS = [
  { label: 'Top App Spiderman',     year: 2026, color: '#0d0a1a', poster: '', vimeoId: '1221825120', vimeoH: '',            client: 'Kylianlebris',    volume: 1,   desc: "5 applications au cœur de l'univers Spider-Man — des expériences immersives, des easter eggs cachés et des interfaces qui font basculer dans la toile.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/spiderman/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/spiderman/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/spiderman/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/spiderman/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/spiderman/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/spiderman/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/spiderman/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/spiderman/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/spiderman/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/spiderman/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/spiderman/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/spiderman/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/spiderman/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/spiderman/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/spiderman/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/spiderman/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/spiderman/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/spiderman/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/spiderman/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/spiderman/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/spiderman/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/spiderman/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/spiderman/frame_023.jpg' }
    ] },
  { label: 'Sélection de Chaises',   year: 2026, color: '#0a0d0f', poster: '', vimeoId: '1221849753', vimeoH: '', client: 'Vinceeh', volume: 0.6,   desc: "Une sélection de chaises choisies par Vinceeh — des pièces qui sortent de l'ordinaire, mises en valeur par une animation dynamique qui transforme un sujet du quotidien en vrai moment de style.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-chaises/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-chaises/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-chaises/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-chaises/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-chaises/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-chaises/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-chaises/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-chaises/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-chaises/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-chaises/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-chaises/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-chaises/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-chaises/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-chaises/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-chaises/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-chaises/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-chaises/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-chaises/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-chaises/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-chaises/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-chaises/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-chaises/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-chaises/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/vinceeh-chaises/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/vinceeh-chaises/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/vinceeh-chaises/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/vinceeh-chaises/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/vinceeh-chaises/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/vinceeh-chaises/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/vinceeh-chaises/frame_030.jpg' },
      { time: 90, url: 'assets/keyframes/vinceeh-chaises/frame_031.jpg' },
      { time: 93, url: 'assets/keyframes/vinceeh-chaises/frame_032.jpg' }
    ] },
  { label: 'Yakisugi',               year: 2026, color: '#0d0b08', poster: '', vimeoId: '1221851512', vimeoH: '', client: 'Vinceeh', volume: 0.6,   desc: "Le Yakisugi — une technique japonaise ancestrale qui consiste à brûler le bois pour le rendre plus résistant et lui donner un caractère unique. Mis en images pour Vinceeh avec une direction rythmée, entre matière brute et esthétique épurée.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-yakisugi/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-yakisugi/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-yakisugi/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-yakisugi/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-yakisugi/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-yakisugi/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-yakisugi/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-yakisugi/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-yakisugi/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-yakisugi/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-yakisugi/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-yakisugi/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-yakisugi/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-yakisugi/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-yakisugi/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-yakisugi/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-yakisugi/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-yakisugi/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-yakisugi/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-yakisugi/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-yakisugi/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-yakisugi/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-yakisugi/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/vinceeh-yakisugi/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/vinceeh-yakisugi/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/vinceeh-yakisugi/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/vinceeh-yakisugi/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/vinceeh-yakisugi/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/vinceeh-yakisugi/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/vinceeh-yakisugi/frame_030.jpg' },
      { time: 90, url: 'assets/keyframes/vinceeh-yakisugi/frame_031.jpg' },
      { time: 93, url: 'assets/keyframes/vinceeh-yakisugi/frame_032.jpg' },
      { time: 96, url: 'assets/keyframes/vinceeh-yakisugi/frame_033.jpg' }
    ] },
  { label: 'Erreurs déco',           year: 2026, color: '#0f0c0a', poster: '', vimeoId: '1221861234', vimeoH: '', client: 'Vinceeh', volume: 0.6, desc: "Les erreurs à éviter quand on fait sa déco — conseils concrets et directs mis en scène avec une réalisation dynamique pour rendre le sujet accessible et accrocheur.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_030.jpg' },
      { time: 90, url: 'assets/keyframes/vinceeh-deco-erreurs/frame_031.jpg' }
    ] },
  { label: 'Couleurs du Métro',      year: 2026, color: '#08080f', poster: '', vimeoId: '1221861237', vimeoH: '', client: 'Vinceeh', volume: 0.6, desc: "L'histoire cachée derrière les couleurs des lignes du métro parisien — un sujet du quotidien raconté avec rythme et motion design pour révéler ce qu'on ne voit plus.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-metro/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-metro/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-metro/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-metro/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-metro/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-metro/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-metro/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-metro/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-metro/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-metro/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-metro/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-metro/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-metro/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-metro/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-metro/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-metro/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-metro/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-metro/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-metro/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-metro/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-metro/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-metro/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-metro/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/vinceeh-metro/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/vinceeh-metro/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/vinceeh-metro/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/vinceeh-metro/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/vinceeh-metro/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/vinceeh-metro/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/vinceeh-metro/frame_030.jpg' },
      { time: 90, url: 'assets/keyframes/vinceeh-metro/frame_031.jpg' },
      { time: 93, url: 'assets/keyframes/vinceeh-metro/frame_032.jpg' },
      { time: 96, url: 'assets/keyframes/vinceeh-metro/frame_033.jpg' },
      { time: 99, url: 'assets/keyframes/vinceeh-metro/frame_034.jpg' },
      { time: 102, url: 'assets/keyframes/vinceeh-metro/frame_035.jpg' },
      { time: 105, url: 'assets/keyframes/vinceeh-metro/frame_036.jpg' },
      { time: 108, url: 'assets/keyframes/vinceeh-metro/frame_037.jpg' }
    ] },
  { label: 'Sièges rouges au cinéma', year: 2026, color: '#120608', poster: '', vimeoId: '1221861235', vimeoH: '', client: 'Vinceeh', volume: 0.6, desc: "Pourquoi les fauteuils de cinéma sont-ils toujours rouges ? Une question du quotidien qui cache une réponse fascinante — racontée avec rythme et une direction visuelle soignée.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_030.jpg' },
      { time: 90, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_031.jpg' },
      { time: 93, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_032.jpg' },
      { time: 96, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_033.jpg' },
      { time: 99, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_034.jpg' },
      { time: 102, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_035.jpg' },
      { time: 105, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_036.jpg' },
      { time: 108, url: 'assets/keyframes/vinceeh-cinema-rouge/frame_037.jpg' }
    ] },
  { label: 'Rolex — Ça vaut quoi ?', year: 2026, color: '#0f0d0a', poster: '', vimeoId: '1221870770', vimeoH: '', client: 'Lucallaccio', volume: 1, desc: "Ça vaut quoi une Rolex ? Une plongée dans l'univers de la montre de luxe, entre histoire, prestige et valeur réelle — mis en images pour Lucallaccio avec une réalisation soignée et rythmée.",
    keyframes: [
      { time:   0, url: 'assets/keyframes/rolex-lucallaccio/frame_001.jpg' },
      { time:   3, url: 'assets/keyframes/rolex-lucallaccio/frame_002.jpg' },
      { time:   6, url: 'assets/keyframes/rolex-lucallaccio/frame_003.jpg' },
      { time:   9, url: 'assets/keyframes/rolex-lucallaccio/frame_004.jpg' },
      { time:  12, url: 'assets/keyframes/rolex-lucallaccio/frame_005.jpg' },
      { time:  15, url: 'assets/keyframes/rolex-lucallaccio/frame_006.jpg' },
      { time:  18, url: 'assets/keyframes/rolex-lucallaccio/frame_007.jpg' },
      { time:  21, url: 'assets/keyframes/rolex-lucallaccio/frame_008.jpg' },
      { time:  24, url: 'assets/keyframes/rolex-lucallaccio/frame_009.jpg' },
      { time:  27, url: 'assets/keyframes/rolex-lucallaccio/frame_010.jpg' },
      { time:  30, url: 'assets/keyframes/rolex-lucallaccio/frame_011.jpg' },
      { time:  33, url: 'assets/keyframes/rolex-lucallaccio/frame_012.jpg' },
      { time:  36, url: 'assets/keyframes/rolex-lucallaccio/frame_013.jpg' },
      { time:  39, url: 'assets/keyframes/rolex-lucallaccio/frame_014.jpg' },
      { time:  42, url: 'assets/keyframes/rolex-lucallaccio/frame_015.jpg' },
      { time:  45, url: 'assets/keyframes/rolex-lucallaccio/frame_016.jpg' },
      { time:  48, url: 'assets/keyframes/rolex-lucallaccio/frame_017.jpg' },
      { time:  51, url: 'assets/keyframes/rolex-lucallaccio/frame_018.jpg' },
      { time:  54, url: 'assets/keyframes/rolex-lucallaccio/frame_019.jpg' },
      { time:  57, url: 'assets/keyframes/rolex-lucallaccio/frame_020.jpg' },
      { time:  60, url: 'assets/keyframes/rolex-lucallaccio/frame_021.jpg' },
      { time:  63, url: 'assets/keyframes/rolex-lucallaccio/frame_022.jpg' },
      { time:  66, url: 'assets/keyframes/rolex-lucallaccio/frame_023.jpg' },
      { time:  69, url: 'assets/keyframes/rolex-lucallaccio/frame_024.jpg' },
      { time:  72, url: 'assets/keyframes/rolex-lucallaccio/frame_025.jpg' },
      { time:  75, url: 'assets/keyframes/rolex-lucallaccio/frame_026.jpg' },
      { time:  78, url: 'assets/keyframes/rolex-lucallaccio/frame_027.jpg' },
      { time:  81, url: 'assets/keyframes/rolex-lucallaccio/frame_028.jpg' },
      { time:  84, url: 'assets/keyframes/rolex-lucallaccio/frame_029.jpg' },
      { time:  87, url: 'assets/keyframes/rolex-lucallaccio/frame_030.jpg' },
      { time:  90, url: 'assets/keyframes/rolex-lucallaccio/frame_031.jpg' },
      { time:  93, url: 'assets/keyframes/rolex-lucallaccio/frame_032.jpg' },
      { time:  96, url: 'assets/keyframes/rolex-lucallaccio/frame_033.jpg' },
      { time:  99, url: 'assets/keyframes/rolex-lucallaccio/frame_034.jpg' },
      { time: 102, url: 'assets/keyframes/rolex-lucallaccio/frame_035.jpg' },
      { time: 105, url: 'assets/keyframes/rolex-lucallaccio/frame_036.jpg' },
      { time: 108, url: 'assets/keyframes/rolex-lucallaccio/frame_037.jpg' },
      { time: 111, url: 'assets/keyframes/rolex-lucallaccio/frame_038.jpg' },
      { time: 114, url: 'assets/keyframes/rolex-lucallaccio/frame_039.jpg' },
      { time: 117, url: 'assets/keyframes/rolex-lucallaccio/frame_040.jpg' },
      { time: 120, url: 'assets/keyframes/rolex-lucallaccio/frame_041.jpg' },
      { time: 123, url: 'assets/keyframes/rolex-lucallaccio/frame_042.jpg' },
      { time: 126, url: 'assets/keyframes/rolex-lucallaccio/frame_043.jpg' }
    ] },
  { label: 'Setup TCL — Kylianlebris', year: 2026, color: '#080c12', poster: 'https://i.vimeocdn.com/video/2194687912-1b987f3d39a2c12dda0f972d5dcb7dea60e652d1fd82c5a99cfcaf91f69a3015-d_1280?region=us', vimeoId: '1221871316', vimeoH: '', client: 'Kylianlebris', brandLogo: 'LOGO/TCL.png', volume: 1, desc: "Kylianlebris ne supportait plus son ancien setup — on a pris ça comme un défi. Une transformation complète autour d'une TCL, filmée et montée pour montrer chaque détail du résultat final.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/kylian-tcl/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/kylian-tcl/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/kylian-tcl/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/kylian-tcl/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/kylian-tcl/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/kylian-tcl/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/kylian-tcl/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/kylian-tcl/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/kylian-tcl/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/kylian-tcl/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/kylian-tcl/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/kylian-tcl/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/kylian-tcl/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/kylian-tcl/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/kylian-tcl/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/kylian-tcl/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/kylian-tcl/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/kylian-tcl/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/kylian-tcl/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/kylian-tcl/frame_020.jpg' }
    ] },
  { label: 'DJI Mic Mini 2S',        year: 2026, color: '#080a0f', poster: 'https://i.vimeocdn.com/video/2194687478-4bec04acb72321dd7dea8e71541017aee60dd34ccc2cbf29ce9ddc73833886e2-d_1280?region=us', vimeoId: '1221872650', vimeoH: '', client: 'Kylianlebris', brandLogo: 'LOGO/DJI.jpg', volume: 1, desc: "Les 5 détails qui font la différence sur le DJI Mic Mini 2S — un test produit réalisé pour Kylianlebris en collaboration avec DJI France, entre qualité audio et praticité terrain.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/kylian-dji/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/kylian-dji/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/kylian-dji/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/kylian-dji/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/kylian-dji/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/kylian-dji/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/kylian-dji/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/kylian-dji/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/kylian-dji/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/kylian-dji/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/kylian-dji/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/kylian-dji/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/kylian-dji/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/kylian-dji/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/kylian-dji/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/kylian-dji/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/kylian-dji/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/kylian-dji/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/kylian-dji/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/kylian-dji/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/kylian-dji/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/kylian-dji/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/kylian-dji/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/kylian-dji/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/kylian-dji/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/kylian-dji/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/kylian-dji/frame_027.jpg' }
    ] },
  { label: 'Bottega Veneta',         year: 2026, color: '#120e09', poster: '', vimeoId: '1221896811', vimeoH: '', client: 'May Bartelot', volume: 1, desc: "Investir ou pas dans un sac Bottega Veneta ? Qualité, modèles à choisir, valeur sur le marché secondaire — un guide complet mis en images pour May Bartelot.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/bottega-may/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/bottega-may/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/bottega-may/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/bottega-may/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/bottega-may/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/bottega-may/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/bottega-may/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/bottega-may/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/bottega-may/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/bottega-may/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/bottega-may/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/bottega-may/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/bottega-may/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/bottega-may/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/bottega-may/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/bottega-may/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/bottega-may/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/bottega-may/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/bottega-may/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/bottega-may/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/bottega-may/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/bottega-may/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/bottega-may/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/bottega-may/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/bottega-may/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/bottega-may/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/bottega-may/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/bottega-may/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/bottega-may/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/bottega-may/frame_030.jpg' },
      { time: 90, url: 'assets/keyframes/bottega-may/frame_031.jpg' },
      { time: 93, url: 'assets/keyframes/bottega-may/frame_032.jpg' }
    ] },

  { label: 'Finder Apple',            year: 2026, color: '#0a0d0f', poster: 'https://i.vimeocdn.com/video/2194723099-9238ecce4409afe278561673f1c49bcf9855feade1047a6cd75c99de2eedd0b6-d_1280?region=us', vimeoId: '1221897580', vimeoH: '', client: 'Vinceeh', volume: 0.6, desc: "L'énigme derrière l'icône du Finder d'Apple — origines, anecdotes et symbolisme décortiqués par Vinceeh.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-finder/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-finder/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-finder/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-finder/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-finder/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-finder/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-finder/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-finder/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-finder/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-finder/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-finder/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-finder/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-finder/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-finder/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-finder/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-finder/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-finder/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-finder/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-finder/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-finder/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-finder/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-finder/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-finder/frame_023.jpg' }
    ] },

  { label: 'Friend — IA',             year: 2026, color: '#080a10', poster: '', vimeoId: '1221897579', vimeoH: '', client: 'Vinceeh', volume: 0.6, desc: "Et si ton meilleur ami était une IA ? Vinceeh explore Friend, le pendant IA d'un compagnon de poche.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-friend/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-friend/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-friend/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-friend/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-friend/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-friend/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-friend/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-friend/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-friend/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-friend/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-friend/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-friend/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-friend/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-friend/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-friend/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-friend/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-friend/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-friend/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-friend/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-friend/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-friend/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-friend/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-friend/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/vinceeh-friend/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/vinceeh-friend/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/vinceeh-friend/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/vinceeh-friend/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/vinceeh-friend/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/vinceeh-friend/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/vinceeh-friend/frame_030.jpg' },
      { time: 90, url: 'assets/keyframes/vinceeh-friend/frame_031.jpg' },
      { time: 93, url: 'assets/keyframes/vinceeh-friend/frame_032.jpg' },
      { time: 96, url: 'assets/keyframes/vinceeh-friend/frame_033.jpg' }
    ] },

  { label: 'Déco — Trade Republic',   year: 2026, color: '#090c0f', poster: '', vimeoId: '1221898501', vimeoH: '', client: 'Vinceeh', brandLogo: 'LOGO/TR.png', volume: 0.6, desc: "3 conseils pour économiser sur la déco de son intérieur — collaboration commerciale Trade Republic par Vinceeh.",
    keyframes: [
      { time:  0, url: 'assets/keyframes/vinceeh-deco-tips/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/vinceeh-deco-tips/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/vinceeh-deco-tips/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/vinceeh-deco-tips/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/vinceeh-deco-tips/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/vinceeh-deco-tips/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/vinceeh-deco-tips/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/vinceeh-deco-tips/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/vinceeh-deco-tips/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/vinceeh-deco-tips/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/vinceeh-deco-tips/frame_011.jpg' },
      { time: 33, url: 'assets/keyframes/vinceeh-deco-tips/frame_012.jpg' },
      { time: 36, url: 'assets/keyframes/vinceeh-deco-tips/frame_013.jpg' },
      { time: 39, url: 'assets/keyframes/vinceeh-deco-tips/frame_014.jpg' },
      { time: 42, url: 'assets/keyframes/vinceeh-deco-tips/frame_015.jpg' },
      { time: 45, url: 'assets/keyframes/vinceeh-deco-tips/frame_016.jpg' },
      { time: 48, url: 'assets/keyframes/vinceeh-deco-tips/frame_017.jpg' },
      { time: 51, url: 'assets/keyframes/vinceeh-deco-tips/frame_018.jpg' },
      { time: 54, url: 'assets/keyframes/vinceeh-deco-tips/frame_019.jpg' },
      { time: 57, url: 'assets/keyframes/vinceeh-deco-tips/frame_020.jpg' },
      { time: 60, url: 'assets/keyframes/vinceeh-deco-tips/frame_021.jpg' },
      { time: 63, url: 'assets/keyframes/vinceeh-deco-tips/frame_022.jpg' },
      { time: 66, url: 'assets/keyframes/vinceeh-deco-tips/frame_023.jpg' },
      { time: 69, url: 'assets/keyframes/vinceeh-deco-tips/frame_024.jpg' },
      { time: 72, url: 'assets/keyframes/vinceeh-deco-tips/frame_025.jpg' },
      { time: 75, url: 'assets/keyframes/vinceeh-deco-tips/frame_026.jpg' },
      { time: 78, url: 'assets/keyframes/vinceeh-deco-tips/frame_027.jpg' },
      { time: 81, url: 'assets/keyframes/vinceeh-deco-tips/frame_028.jpg' },
      { time: 84, url: 'assets/keyframes/vinceeh-deco-tips/frame_029.jpg' },
      { time: 87, url: 'assets/keyframes/vinceeh-deco-tips/frame_030.jpg' }
    ] },
];

/* ─── LOGOS CLIENTS ──────────────────────── */
const CLIENT_LOGOS = {
  'Vinceeh':      'LOGO/vinceeh.jpg',
  'Kylianlebris': 'LOGO/kylian.jpg',
  'May Bartelot': 'LOGO/May.jpg',
  'Lucallaccio':  'LOGO/Lucas.jpg',
};

/* ─── DONNÉES YOUTUBE ────────────────────── */
const YOUTUBE = [
];

/* ─── DONNÉES ANIMATION / DA ─────────────── */
const ANIMATION = [
  { label: 'Yoshien — Matcha', year: 2025, color: '#0a1208', poster: '', vimeoId: '1221865522', vimeoH: '', client: 'Yoshien', volume: 1, ratio: '4/5', desc: "Stop motion réalisé pour Yoshien, marque de matcha fictive — une mise en scène produit soignée, entre texture, mouvement image par image et esthétique épurée.", spanRow: '1',
    keyframes: [
      { time:  0, url: 'assets/keyframes/yoshien-matcha/frame_001.jpg' },
      { time:  3, url: 'assets/keyframes/yoshien-matcha/frame_002.jpg' },
      { time:  6, url: 'assets/keyframes/yoshien-matcha/frame_003.jpg' },
      { time:  9, url: 'assets/keyframes/yoshien-matcha/frame_004.jpg' },
      { time: 12, url: 'assets/keyframes/yoshien-matcha/frame_005.jpg' },
      { time: 15, url: 'assets/keyframes/yoshien-matcha/frame_006.jpg' },
      { time: 18, url: 'assets/keyframes/yoshien-matcha/frame_007.jpg' },
      { time: 21, url: 'assets/keyframes/yoshien-matcha/frame_008.jpg' },
      { time: 24, url: 'assets/keyframes/yoshien-matcha/frame_009.jpg' },
      { time: 27, url: 'assets/keyframes/yoshien-matcha/frame_010.jpg' },
      { time: 30, url: 'assets/keyframes/yoshien-matcha/frame_011.jpg' }
    ] },
  { label: '?????',               year: 2025, color: '#100a18', poster: '', vimeoId: '', vimeoH: '', client: '',       desc: '', spanRow: '2' },
  { label: '?????',               year: 2025, color: '#0a0e18', poster: '', vimeoId: '', vimeoH: '', client: '',       desc: '', spanRow: '1' },
  { label: '?????',               year: 2024, color: '#130d0f', poster: '', vimeoId: '', vimeoH: '', client: '',       desc: '', spanRow: '1' },
  { label: '?????',               year: 2025, color: '#1a0a10', poster: '', vimeoId: '', vimeoH: '', client: '',       desc: '', spanRow: '1' },
  { label: '?????',               year: 2024, color: '#13100a', poster: '', vimeoId: '', vimeoH: '', client: '',       desc: '', spanRow: '2' },
  { label: '?????',               year: 2025, color: '#0d0d1a', poster: '', vimeoId: '', vimeoH: '', client: '',       desc: '', spanRow: '1' },
  { label: '?????',               year: 2025, color: '#0a100a', poster: '', vimeoId: '', vimeoH: '', client: '',       desc: '', spanRow: '1' },
];

const PER_PAGE = 8;
let shown = 0;

const grid      = document.getElementById('rl-grid');
const moreWrap  = document.getElementById('rl-more-wrap');
const moreBtn   = document.getElementById('rl-more');
const moreCount = document.getElementById('rl-more-count');
const countEl   = document.getElementById('rl-count');

/* ─── AUDIO ──────────────────────────────── */
let _ac = null;
const _bufs = {};

function getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  return _ac;
}

async function loadSound(name, path) {
  try {
    const ac = getAC();
    _bufs[name] = await ac.decodeAudioData(await (await fetch(path)).arrayBuffer());
  } catch(e) {}
}

function playSound(name) {
  if (!_bufs[name]) return;
  try {
    const ac = getAC();
    if (ac.state === 'suspended') ac.resume();
    const g = ac.createGain(); g.gain.value = 0.1;
    const s = ac.createBufferSource(); s.buffer = _bufs[name];
    s.connect(g); g.connect(ac.destination); s.start(0);
  } catch(e) {}
}

loadSound('toc', 'sound/toc.wav');
document.addEventListener('pointerdown', () => getAC().resume(), { once: true });

/* ─── THEATER PLAYER ─────────────────────── */
const theaterBackdrop  = document.getElementById('theater-backdrop');
const rlPlayer         = document.getElementById('rl-player');
const rlVideoBox       = rlPlayer.querySelector('.reel-video-box');
const rlVimeo          = document.getElementById('rl-vimeo');
const rlHit            = document.getElementById('rl-hit');
const rlInfoNum        = document.getElementById('rl-info-num');
const rlInfoYear       = document.getElementById('rl-info-year');
const rlInfoTitle      = document.getElementById('rl-info-title');
const rlInfoClient     = document.getElementById('rl-info-client');
const rlInfoDesc       = document.getElementById('rl-info-desc');
const rlPlayBtn        = document.getElementById('rl-play-btn');
const rlMuteBtn        = document.getElementById('rl-mute-btn');
const rlCloseBtn       = document.getElementById('rl-close-btn');
const rlCornerBtns     = rlMuteBtn.closest('.reel-corner-btns');
const rlCornerOrigParent = rlCornerBtns.parentElement;
const rlPlayed         = document.getElementById('rl-played');
const rlDot            = document.getElementById('rl-dot');
const rlNextReel        = document.getElementById('rl-next-reel');
const rlNextReelTitle   = document.getElementById('rl-next-reel-title');
const rlNextReelFill    = document.getElementById('rl-next-reel-fill');
const rlScrollHint      = document.getElementById('rl-scroll-hint-desktop');

let currentDataset = REELS;
let currentIndex   = 0;
let descWords      = [];
const rlHoverFill     = document.getElementById('rl-hover-fill');
const rlProgressFill  = document.getElementById('rl-progress-fill');
const rlTime          = document.getElementById('rl-time');
const rlBar           = document.getElementById('rl-bar');
const rlStrip         = document.getElementById('rl-strip');
const rlStripTip      = document.getElementById('rl-strip-tip');
const rlTipImg        = document.getElementById('rl-tip-img');
const rlTipTime       = document.getElementById('rl-tip-time');
const rlStripPoster   = document.getElementById('rl-strip-poster');
const rlMobIndicator  = document.getElementById('rl-mob-indicator');

let vPlayer        = null;
let vPlayerLoadedId = null; // ID de la vidéo actuellement dans l'iframe
let isMuted        = false;
let targetVolume   = 1;    // volume cible du reel courant (0-1)
let duration       = 0;
let storyboard     = [];

function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function resetProgress() {
  rlPlayed.style.width       = '0%';
  rlDot.style.left           = '0%';
  rlProgressFill.style.width = '0%';
  rlTime.textContent         = '0:00';
  duration = 0;
}

/* Même logique que script.js — opacity/transform, jamais display */
function setIcon(hide, show) {
  hide.style.opacity   = '0';
  hide.style.transform = 'scale(0.7)';
  show.style.opacity   = '1';
  show.style.transform = 'scale(1)';
}

const riUnmuted = rlMuteBtn.querySelector('.ri-unmuted');
const riMuted   = rlMuteBtn.querySelector('.ri-muted');
const riPlay    = rlPlayBtn.querySelector('.ri-play');
const riPause   = rlPlayBtn.querySelector('.ri-pause');

setIcon(riMuted, riUnmuted);
setIcon(riPause, riPlay);

function setMute(muted) {
  isMuted = muted;
  if (vPlayer) {
    vPlayer.setMuted(muted);
    if (!muted) vPlayer.setVolume(targetVolume);
  }
  rlMuteBtn.classList.toggle('muted', muted);
  setIcon(muted ? riUnmuted : riMuted, muted ? riMuted : riUnmuted);
}

function setPlayState(playing) {
  setIcon(playing ? riPlay : riPause, playing ? riPause : riPlay);
  updateTheaterCursor(playing);
  rlPlayer.classList.toggle('paused', !playing);
}

let mobFlashTimer = null;
function showMobIndicator(playing) {
  if (!rlMobIndicator) return;
  rlMobIndicator.classList.remove('playing', 'paused');
  clearTimeout(mobFlashTimer);
  if (playing) {
    /* Tap pour reprendre → flash icône pause puis disparaît */
    rlMobIndicator.classList.add('playing', 'visible');
    mobFlashTimer = setTimeout(() => rlMobIndicator.classList.remove('visible'), 520);
  } else {
    /* En pause → icône play reste visible */
    rlMobIndicator.classList.add('paused', 'visible');
  }
}
function hideMobIndicator() {
  clearTimeout(mobFlashTimer);
  if (rlMobIndicator) rlMobIndicator.classList.remove('visible', 'playing', 'paused');
}

function fillInfo(reel, index) {
  rlInfoNum.textContent    = String(index + 1).padStart(2, '0');
  rlInfoYear.textContent   = reel.year;
  rlInfoTitle.textContent  = reel.label;
  rlInfoClient.textContent = reel.client || '';
  rlInfoClient.style.display = reel.client ? '' : 'none';

  /* Découpage desc en mots revelables */
  rlInfoDesc.innerHTML = '';
  descWords = [];
  if (reel.desc) {
    reel.desc.split(' ').filter(w => w).forEach((word, i) => {
      if (i > 0) rlInfoDesc.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.className = 'ct-word';
      span.textContent = word;
      if (isTouch) span.classList.add('lit');
      rlInfoDesc.appendChild(span);
      descWords.push(span);
    });
    rlInfoDesc.style.display = '';
  } else {
    rlInfoDesc.style.display = 'none';
  }

  /* Reset indicateur next reel */
  rlNextReel.classList.remove('visible');
  rlNextReelFill.style.width = '0%';
}

/* ─── FILMSTRIP ──────────────────────────── */
function clearFilmstrip() {
  if (!rlBar) return;
  rlBar.querySelectorAll('.strip-frame').forEach(el => el.remove());
}

function buildFilmstrip(frames, dur) {
  clearFilmstrip();
  if (!frames.length || !dur || !rlBar) return;
  const n = frames.length;
  frames.forEach((frame, i) => {
    const img = document.createElement('img');
    img.className  = 'strip-frame';
    img.loading    = 'lazy';
    /* Distribution égale : chaque frame occupe 1/n de la largeur */
    img.style.left  = (i / n * 100) + '%';
    img.style.width = (1 / n * 100) + '%';
    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    img.src = frame.url;
    rlBar.appendChild(img);
  });
}

function openPlayer(reel, index, srcArr) {
  if (!reel.vimeoId) return;
  currentDataset = srcArr || REELS;
  currentIndex   = index >= 0 ? index : 0;
  scrollAccum    = 0;

  targetVolume = reel.volume ?? 1;

  /* Adapte l'aspect-ratio de la video-box au format de la vidéo */
  if (rlVideoBox) rlVideoBox.style.aspectRatio = reel.ratio || '9 / 16';

  resetProgress();
  fillInfo(reel, index);

  /* Reset filmstrip */
  storyboard = [];
  clearFilmstrip();
  if (rlStripPoster) rlStripPoster.style.backgroundImage = '';
  if (rlTipImg) rlTipImg.removeAttribute('src');

  if (vPlayer && vPlayerLoadedId === reel.vimeoId) {
    /* Vidéo déjà dans l'iframe (pré-chargée) — juste play + unmute */
    vPlayer.setCurrentTime(0).catch(() => {});
    vPlayer.setVolume(targetVolume);
    vPlayer.setMuted(false).catch(() => {});
    vPlayer.play().catch(() => {});
    vPlayerLoadedId = reel.vimeoId;
  } else if (vPlayer) {
    /* Iframe existante mais vidéo différente — loadVideo() */
    const loadOpts = { id: reel.vimeoId, autoplay: true };
    if (reel.vimeoH) loadOpts.h = reel.vimeoH;
    vPlayer.loadVideo(loadOpts).then(() => {
      vPlayerLoadedId = reel.vimeoId;
      vPlayer.setVolume(targetVolume);
      vPlayer.setMuted(false).catch(() => {});
      vPlayer.play().catch(() => {});
      vPlayer.getMuted().then(muted => {
        vPlayer.getVolume().then(vol => {
          const actuallyMuted = muted || vol === 0;
          isMuted = actuallyMuted;
          rlMuteBtn.classList.toggle('muted', isMuted);
          setIcon(isMuted ? riUnmuted : riMuted, isMuted ? riMuted : riUnmuted);
        });
      });
    });
  } else {
    /* Pas encore d'iframe — crée l'instance */
    const opts = {
      id:       reel.vimeoId,
      autoplay: true,
      controls: false,
      title:    false,
      byline:   false,
      portrait: false,
      dnt:      true,
    };
    if (reel.vimeoH) opts.h = reel.vimeoH;
    vPlayer = new Vimeo.Player(rlVimeo, opts);
    vPlayerLoadedId = reel.vimeoId;

    vPlayer.on('play',  () => { setPlayState(true); });
    vPlayer.on('pause', () => { setPlayState(false); if (isTouch) showMobIndicator(false); });
    vPlayer.on('ended', () => {
      setPlayState(false);
      if (isTouch) hideMobIndicator();
      /* Revient à t=0 immédiatement pour bloquer l'écran de fin Vimeo */
      vPlayer.setCurrentTime(0).catch(() => {});
    });
    vPlayer.on('timeupdate', ({ seconds, duration: dur }) => {
      if (!dur) return;
      duration = dur;
      const pct = seconds / dur * 100;
      rlPlayed.style.width       = pct + '%';
      rlDot.style.left           = pct + '%';
      rlProgressFill.style.width = pct + '%';
      rlTime.textContent         = fmtTime(seconds);
    });
    /* Sync UI sur l'état réel du volume — le navigateur peut forcer le muet au démarrage */
    vPlayer.on('volumechange', ({ muted, volume }) => {
      const actuallyMuted = muted || volume === 0;
      if (actuallyMuted !== isMuted) {
        isMuted = actuallyMuted;
        rlMuteBtn.classList.toggle('muted', isMuted);
        setIcon(isMuted ? riUnmuted : riMuted, isMuted ? riMuted : riUnmuted);
      }
    });
  }

  const afterReady = async () => {
    vPlayer.setVolume(targetVolume);
    vPlayer.setMuted(false).catch(() => {});
    /* Synchro UI sur l'état réel après autoplay (navigateur peut forcer le muet) */
    try {
      const [muted, vol] = await Promise.all([vPlayer.getMuted(), vPlayer.getVolume()]);
      const actuallyMuted = muted || vol === 0;
      isMuted = actuallyMuted;
      rlMuteBtn.classList.toggle('muted', isMuted);
      setIcon(isMuted ? riUnmuted : riMuted, isMuted ? riMuted : riUnmuted);
    } catch (_) {}
    try {
      /* Récupère durée + thumbnail en parallèle */
      const [dur, thumbUrl] = await Promise.all([
        vPlayer.getDuration(),
        getVimeoThumb(reel.vimeoId, reel.vimeoH).catch(() => '')
      ]);

      if (thumbUrl && rlStripPoster) {
        rlStripPoster.style.backgroundImage = `url("${thumbUrl}")`;
      }

      /* Tente le storyboard Vimeo (Pro+) */
      /* Priorité aux keyframes maison (couvrent toute la durée) ;
         storyboard Vimeo en fallback uniquement si pas de keyframes */
      if (reel.keyframes && reel.keyframes.length > 0 && dur) {
        storyboard = reel.keyframes.map((kf, i, arr) => ({
          startTime: kf.time,
          endTime:   arr[i + 1] ? arr[i + 1].time : dur,
          url:       kf.url
        }));
        buildFilmstrip(storyboard, dur);
      } else {
        let frames = [];
        try { frames = await vPlayer.getThumbnails(); } catch (_) {}
        if (frames && frames.length > 0) {
          storyboard = frames;
          buildFilmstrip(frames, dur);
        }
      }
    } catch (_) {}
  };

  vPlayer.ready().then(afterReady);

  rlPlayer.classList.add('theater');
  theaterBackdrop.classList.add('active');
  document.body.classList.add('theater-open');
  setPlayState(true);
  setMute(false);
  playSound('toc');

  /* Hint scroll desktop — réapparaît à chaque ouverture */
  if (rlScrollHint && !isTouch) {
    rlScrollHint.classList.remove('hidden');
  }

  /* Mobile : téléporte les corner-btns dans <body> pour échapper au transform du player */
  if (isTouch) {
    document.body.appendChild(rlCornerBtns);
    rlCornerBtns.classList.add('floating');
  }
}


function closePlayer() {
  hideMobIndicator();

  rlPlayer.classList.remove('theater');
  theaterBackdrop.classList.remove('active');
  document.body.classList.remove('theater-open');
  theaterCursor.classList.remove('visible');
  theaterCursor.style.opacity = '0';
  setTimeout(() => { theaterCursor.style.cssText = ''; }, 250);
  if (vPlayer) { vPlayer.destroy(); vPlayer = null; }
  setIcon(riPause, riPlay);
  /* reset scroll state */
  scrollAccum = 0;
  descWords.forEach(w => w.classList.remove('lit'));
  rlNextReel.classList.remove('visible');
  rlNextReelFill.style.width = '0%';
  rlPlayer.style.transform = '';
  if (drainScrollRaf) { cancelAnimationFrame(drainScrollRaf); drainScrollRaf = null; }

  /* Mobile : remet les corner-btns à leur place d'origine */
  if (isTouch && rlCornerBtns.parentElement === document.body) {
    rlCornerBtns.classList.remove('floating');
    rlCornerOrigParent.appendChild(rlCornerBtns);
  }
}

/* Curseur PLAY/PAUSE sur le player theater */
const theaterCursor  = document.getElementById('rl-theater-cursor');
const theaterVcText  = theaterCursor.querySelector('.vc-text');
let tcX = 0, tcY = 0, tcTX = 0, tcTY = 0;

(function tcLoop() {
  tcX += (tcTX - tcX) * 0.14;
  tcY += (tcTY - tcY) * 0.14;
  theaterCursor.style.transform = `translate(${tcX}px,${tcY}px) rotate(-10deg)`;
  requestAnimationFrame(tcLoop);
})();

const isTouch = ('ontouchstart' in window) || window.matchMedia('(hover: none)').matches;

/* Sur desktop uniquement, ajoute "Accueil" dans le #nav */
if (!isTouch) {
  const navLinks = document.querySelector('#nav .nav-links');
  if (navLinks) {
    const accueil = document.createElement('a');
    accueil.href = '#rl-hero';
    accueil.className = 'nav-link';
    accueil.textContent = 'Accueil';
    navLinks.insertBefore(accueil, navLinks.firstChild);
  }
}
if (!isTouch) {
  rlHit.addEventListener('mouseenter', e => {
    tcTX = e.clientX + 18; tcTY = e.clientY - 16;
    tcX = tcTX; tcY = tcTY;
    theaterVcText.textContent = 'Play';
    theaterCursor.classList.remove('cursor-close');
    theaterCursor.classList.add('visible');
  });
  rlHit.addEventListener('mouseleave', () => theaterCursor.classList.remove('visible'));
  rlHit.addEventListener('mousemove',  e => { tcTX = e.clientX + 18; tcTY = e.clientY - 16; });
}


function updateTheaterCursor(playing) {
  if (theaterCursor.style.background === 'transparent') return;
  theaterVcText.classList.add('vc-out');
  theaterVcText.addEventListener('animationend', () => {
    theaterVcText.classList.remove('vc-out');
    if (theaterCursor.style.background === 'transparent') return;
    theaterVcText.textContent = playing ? 'Pause' : 'Play';
    theaterVcText.classList.add('vc-in');
    theaterVcText.addEventListener('animationend', () => theaterVcText.classList.remove('vc-in'), { once: true });
  }, { once: true });
}

/* Clic sur la vidéo → pause/lecture */
rlHit.addEventListener('click', () => {
  if (!vPlayer) return;
  vPlayer.getPaused().then(p => p ? vPlayer.play() : vPlayer.pause());
});

/* Tap mobile → barre de contrôle */
rlHit.addEventListener('touchend', e => {
  if (!vPlayer) return;
  e.preventDefault();
  vPlayer.getPaused().then(paused => {
    if (paused) { vPlayer.play(); showMobIndicator(true); }
    else        { vPlayer.pause(); showMobIndicator(false); }
  });
}, { passive: false });

rlPlayBtn.addEventListener('click', () => {
  if (!vPlayer) return;
  vPlayer.getPaused().then(p => p ? vPlayer.play() : vPlayer.pause());
});

rlMuteBtn.addEventListener('click', () => setMute(!isMuted));
rlCloseBtn.addEventListener('click', closePlayer);
theaterBackdrop.addEventListener('click', closePlayer);


if (!isTouch) {
  theaterBackdrop.addEventListener('mouseenter', e => {
    tcTX = e.clientX + 18; tcTY = e.clientY - 16;
    tcX = tcTX; tcY = tcTY;
    theaterVcText.classList.remove('vc-out', 'vc-in');
    theaterVcText.textContent = '×';
    theaterCursor.style.background = 'transparent';
    theaterCursor.style.fontSize = '72px';
    theaterCursor.style.padding = '0';
    theaterCursor.style.color = 'var(--pink)';
    theaterCursor.classList.add('visible');
  });
  theaterBackdrop.addEventListener('mouseleave', () => {
    theaterCursor.classList.remove('visible');
    if (theaterBackdrop.classList.contains('active')) {
      theaterCursor.style.cssText = '';
    }
  });
  theaterBackdrop.addEventListener('mousemove', e => { tcTX = e.clientX + 18; tcTY = e.clientY - 16; });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePlayer(); });

document.getElementById('rl-info-cta').addEventListener('click', e => {
  e.preventDefault();
  closePlayer();
  setTimeout(() => {
    document.getElementById('rl-contact').scrollIntoView({ behavior: 'smooth' });
  }, 300);
});

let rlDragging = false;
let rlRaf      = null;

function rlPct(e) {
  const r = rlBar.getBoundingClientRect();
  return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
}
function rlApply(pct) {
  rlPlayed.style.width       = (pct * 100) + '%';
  rlDot.style.left           = (pct * 100) + '%';
  rlProgressFill.style.width = (pct * 100) + '%';
  cancelAnimationFrame(rlRaf);
  rlRaf = requestAnimationFrame(() => {
    if (vPlayer && duration) vPlayer.setCurrentTime(pct * duration);
  });
}

rlStrip.addEventListener('pointerdown', e => {
  e.preventDefault();
  rlStrip.setPointerCapture(e.pointerId);
  rlDragging = true;
  rlApply(rlPct(e));
});
rlStrip.addEventListener('pointermove', e => {
  const pct = rlPct(e);
  if (rlDragging) {
    rlApply(pct);
  } else if (!isTouch) {
    rlHoverFill.style.width = (pct * 100) + '%';
  }
  if (!isTouch) updateScrubPreview(e, pct);
});
rlStrip.addEventListener('pointerup', e => {
  if (!rlDragging) return;
  rlDragging = false;
  rlHoverFill.style.width = '0%';
  rlApply(rlPct(e));
});
rlStrip.addEventListener('pointerleave', () => {
  if (!rlDragging) rlHoverFill.style.width = '0%';
});

function updateScrubPreview(e, pct) {
  const hoverTime = pct * duration;
  rlTipTime.textContent = fmtTime(hoverTime);

  /* Position horizontale clamped pour que le tooltip reste dans le strip */
  const stripRect = rlStrip.getBoundingClientRect();
  const tipW      = rlStripTip.offsetWidth || 90;
  const rawLeft   = e.clientX - stripRect.left;
  const clamped   = Math.max(tipW / 2, Math.min(stripRect.width - tipW / 2, rawLeft));
  rlStripTip.style.left = clamped + 'px';

  /* Image : storyboard si dispo, sinon poster général */
  if (storyboard.length) {
    let frame = storyboard[0];
    for (const f of storyboard) {
      if (f.startTime <= hoverTime) frame = f;
    }
    if (frame && frame.url && rlTipImg.src !== frame.url) rlTipImg.src = frame.url;
  } else {
    const bg     = rlStripPoster.style.backgroundImage;
    const match  = bg.match(/url\(["']?(.+?)["']?\)/);
    const poster = match ? match[1] : '';
    if (poster && rlTipImg.src !== poster) rlTipImg.src = poster;
  }
}

/* ─── BUILD CARD ─────────────────────────── */
function buildCard(reel, srcArr) {
  const card = document.createElement('div');
  card.className = 'rl-card';
  card._reel = reel;

  const bg = document.createElement('div');
  bg.className = 'rl-card-bg';
  bg.style.background = reel.color;
  card.appendChild(bg);

  const img = document.createElement('img');
  img.className = 'rl-card-thumb';
  img.alt = reel.label;
  img.loading = 'lazy';
  img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  card.appendChild(img);

  function setThumb(url) {
    if (!url) return;
    img.src = url;
  }

  if (reel.poster) {
    setThumb(reel.poster);
  } else if (reel.vimeoId) {
    getVimeoThumb(reel.vimeoId, reel.vimeoH)
      .then(setThumb)
      .catch(() => {});
  }

  if (reel.video) {
    const vid = document.createElement('video');
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.preload = 'none';
    vid.dataset.src = reel.video;
    card.appendChild(vid);

    card.addEventListener('mouseenter', () => {
      if (!vid.src) vid.src = vid.dataset.src;
      vid.play().catch(() => {});
      playSound('toc');
    });
    card.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
    });
  }

  if (!reel.vimeoId) {
    const badge = document.createElement('div');
    badge.className = 'rl-card-wip';
    badge.textContent = 'Projet en cours';
    card.appendChild(badge);
  }

  const logoSrc = CLIENT_LOGOS[reel.client];
  if (logoSrc || reel.brandLogo) {
    const stack = document.createElement('div');
    stack.className = 'rl-card-logo-stack';
    if (logoSrc) {
      const logo = document.createElement('img');
      logo.className = 'rl-card-client-logo';
      logo.src = logoSrc;
      logo.alt = reel.client;
      logo.loading = 'lazy';
      stack.appendChild(logo);
    }
    if (reel.brandLogo) {
      const brand = document.createElement('img');
      brand.className = 'rl-card-brand-logo';
      brand.src = reel.brandLogo;
      brand.alt = '';
      brand.loading = 'lazy';
      stack.appendChild(brand);
    }
    card.appendChild(stack);
  }

  const info = document.createElement('div');
  info.className = 'rl-card-info';
  info.innerHTML = `
    <span class="rl-card-label">${reel.label}</span>
    <span class="rl-card-year">${reel.year}</span>
  `;
  card.appendChild(info);

  const arr = srcArr || REELS;
  card.addEventListener('click', () => openPlayer(reel, arr.indexOf(reel), arr));

  return card;
}

/* ─── REVEAL ─────────────────────────────── */
function revealCards(cards) {
  const obs = new IntersectionObserver(entries => {
    /* Filtrer celles qui entrent en vue */
    const visible = entries.filter(e => e.isIntersecting).map(e => e.target);
    if (!visible.length) return;

    /* Trier par position X (gauche → droite = colonne 0 → N) */
    visible.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);

    visible.forEach((el, i) => {
      el.style.transitionDelay = (i * 55) + 'ms';
      el.classList.add('in');
      el.addEventListener('transitionend', () => {
        el.style.transitionDelay = '';
        el.style.willChange = 'auto';
      }, { once: true });
      obs.unobserve(el);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  cards.forEach(c => obs.observe(c));
}

/* ─── SMOOTH SCROLL TO FIRST NEW CARD ────── */
function scrollToFirstNew(firstNewCard) {
  if (!firstNewCard) return;
  const cardTop = firstNewCard.getBoundingClientRect().top + window.scrollY;
  const target  = cardTop - window.innerHeight * 0.68;
  window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
}

/* ─── RENDER BATCH ───────────────────────── */
function renderBatch() {
  const batch = REELS.slice(shown, shown + PER_PAGE);
  const newCards = batch.map(r => buildCard(r, REELS));
  newCards.forEach(c => grid.appendChild(c));

  /* délai court pour que le DOM soit peint avant le reveal */
  requestAnimationFrame(() => requestAnimationFrame(() => revealCards(newCards)));

  shown += batch.length;

  const remaining = REELS.length - shown;
  moreBtn.style.display = remaining > 0 ? '' : 'none';

  if (countEl) countEl.textContent = `${REELS.length} reels`;
}

moreBtn.addEventListener('click', () => {
  playSound('toc');
  const beforeCount = grid.children.length;
  renderBatch();
  document.getElementById('rl-discover-link').classList.add('visible');
  requestAnimationFrame(() => {
    scrollToFirstNew(grid.children[beforeCount]);
  });
});

/* ─── CATÉGORIES ─────────────────────────── */
const catBtns    = document.querySelectorAll('.rl-cat');
const panes      = document.querySelectorAll('.rl-grid-pane');
const rlContent  = document.getElementById('rl-content');
const rlCatNav   = document.getElementById('rl-cat-nav');
const catIndicator = document.getElementById('rl-cat-indicator');

function moveIndicator(btn) {
  catIndicator.style.left  = btn.offsetLeft + 'px';
  catIndicator.style.width = btn.offsetWidth + 'px';
}

let isFirstCategory = true;

function setCategory(cat) {
  catBtns.forEach(b => b.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));
  const activeBtn = document.querySelector(`.rl-cat[data-cat="${cat}"]`);
  activeBtn.classList.add('active');
  const pane = document.getElementById('pane-' + cat);
  pane.classList.add('active');
  rlContent.dataset.cat = cat;
  rlCatNav.dataset.cat  = cat;
  moveIndicator(activeBtn);

  if (!isFirstCategory) {
    requestAnimationFrame(() => {
      const cards = Array.from(pane.querySelectorAll('.rl-card.in'));
      cards.forEach((card, i) => {
        card.style.animation = 'none';
        card.offsetHeight; /* force reflow */
        card.style.animation = `cardReveal 680ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms both`;
        card.addEventListener('animationend', () => {
          card.style.animation = '';
        }, { once: true });
      });
    });
  }
}

/* État initial sans animation */
catIndicator.style.transition = 'none';
setCategory('reels');
isFirstCategory = false;
requestAnimationFrame(() => {
  catIndicator.style.transition = '';
});

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setCategory(btn.dataset.cat);
    playSound('toc');
  });
});

/* ─── GRILLE YOUTUBE ─────────────────────── */
(function () {
  const gridYt    = document.getElementById('rl-grid-yt');
  const moreWrapYt= document.getElementById('rl-more-wrap-yt');
  const moreBtnYt = document.getElementById('rl-more-yt');
  const moreCountYt = document.getElementById('rl-more-count-yt');
  let shownYt = 0;
  const PER = 4;

  function renderYt() {
    const batch = YOUTUBE.slice(shownYt, shownYt + PER);
    const cards = batch.map(r => buildCard(r, YOUTUBE));
    cards.forEach(c => gridYt.appendChild(c));
    requestAnimationFrame(() => requestAnimationFrame(() => revealCards(cards)));
    shownYt += batch.length;
    const rem = YOUTUBE.length - shownYt;
    moreBtnYt.style.display = rem > 0 ? '' : 'none';
  }

  moreBtnYt.addEventListener('click', () => { playSound('toc'); renderYt(); });
  renderYt();
})();

/* ─── GRILLE ANIMATION / DA ──────────────── */
(function () {
  const gridAnim    = document.getElementById('rl-grid-anim');
  const moreWrapAnim= document.getElementById('rl-more-wrap-anim');
  const moreBtnAnim = document.getElementById('rl-more-anim');
  const moreCountAnim = document.getElementById('rl-more-count-anim');
  let shownAnim = 0;
  const PER = 4;

  function renderAnim() {
    const batch = ANIMATION.slice(shownAnim, shownAnim + PER);
    const cards = batch.map(r => {
      const c = buildCard(r, ANIMATION);
      if (r.spanRow && r.spanRow !== '1') c.dataset.spanRow = r.spanRow;
      return c;
    });
    cards.forEach(c => gridAnim.appendChild(c));
    requestAnimationFrame(() => requestAnimationFrame(() => revealCards(cards)));
    shownAnim += batch.length;
    const rem = ANIMATION.length - shownAnim;
    moreBtnAnim.style.display = rem > 0 ? '' : 'none';
  }

  moreBtnAnim.addEventListener('click', () => { playSound('toc'); renderAnim(); });
  renderAnim();
})();


/* ─── NAV STICKY ─────────────────────────── */
(function () {
  const nav    = document.getElementById('rl-cat-nav');
  const OFFSET = 88; // hauteur du header

  // placeholder maintient la place quand la nav est fixed
  const placeholder = document.createElement('div');
  placeholder.id = 'rl-nav-placeholder';
  nav.parentNode.insertBefore(placeholder, nav.nextSibling);

  // position naturelle dans la page (calculée après chargement)
  let naturalTop = 0;
  function cacheNaturalTop() {
    // la nav n'est pas encore fixed : on peut lire directement
    if (!nav.classList.contains('nav-fixed')) {
      naturalTop = nav.getBoundingClientRect().top + window.scrollY;
    }
  }
  window.addEventListener('load', cacheNaturalTop);
  window.addEventListener('resize', () => {
    nav.classList.remove('nav-fixed');
    placeholder.style.display = 'none';
    cacheNaturalTop();
    /* recalcule la position de l'indicateur */
    const activeBtn = nav.querySelector('.rl-cat.active');
    if (activeBtn) requestAnimationFrame(() => moveIndicator(activeBtn));
  });
  cacheNaturalTop();

  const content = document.getElementById('rl-content');

  const FADE_ZONE = 180;

  function onScroll() {
    if (isTouch) return;
    const contentBottom = content.getBoundingClientRect().bottom;
    const shouldFix     = window.scrollY + OFFSET >= naturalTop;

    if (shouldFix && !nav.classList.contains('nav-fixed')) {
      placeholder.style.cssText = `display:block;height:${nav.offsetHeight}px;margin-bottom:48px`;
      nav.classList.add('nav-fixed');
    } else if (!shouldFix && nav.classList.contains('nav-fixed')) {
      nav.classList.remove('nav-fixed');
      placeholder.style.display = 'none';
      nav.style.opacity = '';
    }

    // fondu uniquement quand la nav est fixed
    if (nav.classList.contains('nav-fixed')) {
      const dist = contentBottom - OFFSET;
      nav.style.opacity = String(Math.max(0, Math.min(1, dist / FADE_ZONE)));
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── SCROLL BTN ─────────────────────────── */
document.getElementById('rl-scroll-btn').addEventListener('click', () => {
  document.getElementById('rl-content').scrollIntoView({ behavior: 'smooth' });
});

/* ─── BRAND DOTS — MAGNETIC ──────────────── */
(function () {
  const dots = [...document.querySelectorAll('.bd')];

  /* cache la position d'origine (sans transform) une fois au chargement */
  dots.forEach(d => { d.style.transform = 'none'; });
  const origins = dots.map(d => {
    const r = d.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  });
  const state = dots.map(() => ({ tx: 0, ty: 0 }));

  dots.forEach((dot, i) => {
    function scheduleBlink() {
      const delay = 8000 + Math.random() * 12000;
      setTimeout(() => {
        dot.style.opacity = '0';
        setTimeout(() => {
          dot.style.opacity = '1';
          scheduleBlink();
        }, 1000);
      }, delay);
    }
    setTimeout(scheduleBlink, i * 600 + Math.random() * 3000);
  });

  /* recalcule si resize */
  window.addEventListener('resize', () => {
    dots.forEach((d, i) => {
      d.style.transform = 'none';
      const r = d.getBoundingClientRect();
      origins[i] = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });
  });

  let mouseX = -9999, mouseY = -9999;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  const RADIUS = 130;
  const FORCE  = 7;

  (function raf() {
    dots.forEach((dot, i) => {
      const s = state[i];
      const { cx, cy } = origins[i];
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = 0, targetY = 0;
      if (dist < RADIUS && dist > 1) {
        /* force nulle au contact (dist≈0), pic à mi-chemin, nulle au bord */
        const t = dist / RADIUS;
        const strength = 4 * t * (1 - t) * FORCE;
        targetX = (dx / dist) * strength;
        targetY = (dy / dist) * strength;
      }

      s.tx += (targetX - s.tx) * 0.06;
      s.ty += (targetY - s.ty) * 0.06;
      dot.style.transform = `translate(${s.tx}px, ${s.ty}px)`;
    });
    requestAnimationFrame(raf);
  })();
})();

/* ─── INIT ───────────────────────────────── */
renderBatch();

/* ─── SHOWREEL PLAYER ────────────────────── */
(function initShowreel() {
  if (typeof Vimeo === 'undefined') { setTimeout(initShowreel, 80); return; }

  const iframe     = document.getElementById('rl2-iframe');
  const hit        = document.getElementById('rl2-hit');
  const muteCorner = document.getElementById('rl2-mute-btn');
  const mutePill   = document.getElementById('rl2-pill-mute-btn');
  const playBtn    = document.getElementById('rl2-play-btn');
  const fill       = document.getElementById('rl2-fill');
  const bar        = document.getElementById('rl2-bar');
  const hoverFill  = document.getElementById('rl2-hover-fill');
  const played     = document.getElementById('rl2-played');
  const dot        = document.getElementById('rl2-dot');
  const timeEl     = document.getElementById('rl2-time');
  const fullBtn    = document.getElementById('rl2-full-btn');
  const section    = document.getElementById('rl-showreel');

  const p = new Vimeo.Player(iframe);
  let dur = 0;
  let isPlaying = false;
  let isMuted   = false;

  function si(hide, show) {
    hide.style.opacity = '0'; hide.style.transform = 'scale(0.7)';
    show.style.opacity = '1'; show.style.transform = 'scale(1)';
  }

  const rPlay    = playBtn.querySelector('.ri-play');
  const rPause   = playBtn.querySelector('.ri-pause');
  const mCornerU = muteCorner.querySelector('.ri-unmuted');
  const mCornerM = muteCorner.querySelector('.ri-muted');
  const mPillU   = mutePill.querySelector('.ri-unmuted');
  const mPillM   = mutePill.querySelector('.ri-muted');

  /* État initial : son ON, boutons rose dès le départ */
  playBtn.classList.add('btn-active');
  [muteCorner, mutePill].forEach(b => b.classList.add('btn-active'));

  function fmt(s) {
    s = Math.max(0, Math.floor(s));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  /* Volume proportionnel à la visibilité dans le viewport */
  function updateScrollVolume() {
    if (isMuted) return;
    const rect  = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    const visH  = Math.min(rect.bottom, viewH) - Math.max(rect.top, 0);
    const ratio = Math.max(0, Math.min(1, visH / rect.height));
    p.setVolume(ratio);
  }

  window.addEventListener('scroll', updateScrollVolume, { passive: true });

  /* Curseur PLAY / PAUSE */
  const cursor  = document.getElementById('rl2-cursor');
  const vcText  = cursor.querySelector('.vc-text');
  let vcX = 0, vcY = 0, vcTX = 0, vcTY = 0;

  (function vcLoop() {
    vcX += (vcTX - vcX) * 0.14;
    vcY += (vcTY - vcY) * 0.14;
    cursor.style.transform = `translate(${vcX}px,${vcY}px) rotate(-10deg)`;
    requestAnimationFrame(vcLoop);
  })();

  hit.addEventListener('mouseenter', e => {
    vcTX = e.clientX + 18; vcTY = e.clientY - 16;
    vcX = vcTX; vcY = vcTY;
    cursor.classList.add('visible');
  });
  hit.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
  hit.addEventListener('mousemove',  e => { vcTX = e.clientX + 18; vcTY = e.clientY - 16; });

  function updateCursorLabel(playing) {
    vcText.classList.add('vc-out');
    vcText.addEventListener('animationend', () => {
      vcText.classList.remove('vc-out');
      vcText.textContent = playing ? 'Pause' : 'Play';
      vcText.classList.add('vc-in');
      vcText.addEventListener('animationend', () => vcText.classList.remove('vc-in'), { once: true });
    }, { once: true });
  }

  function setPlayState(playing) {
    isPlaying = playing;
    si(playing ? rPlay : rPause, playing ? rPause : rPlay);
    playBtn.classList.add('btn-active');
    updateCursorLabel(playing);
  }

  function setMuteState(muted) {
    isMuted = muted;
    if (muted) { p.setVolume(0); } else { updateScrollVolume(); }
    [muteCorner, mutePill].forEach(b => b.classList.toggle('btn-active', !muted));
    si(muted ? mCornerU : mCornerM, muted ? mCornerM : mCornerU);
    si(muted ? mPillU   : mPillM,   muted ? mPillM   : mPillU);
  }

  p.on('play',  () => setPlayState(true));
  p.on('pause', () => setPlayState(false));
  p.on('ended', () => { setPlayState(false); p.setCurrentTime(0); });
  p.on('timeupdate', ({ seconds, duration: d }) => {
    if (!d) return;
    dur = d;
    const pct = seconds / d * 100;
    played.style.width = pct + '%';
    dot.style.left     = pct + '%';
    fill.style.width   = pct + '%';
    timeEl.textContent = fmt(seconds);
  });

  /* Autoplay au scroll — fallback muet si bloqué par le navigateur */
  let hasStarted = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      p.play().catch(() => {
        isMuted = true;
        p.setVolume(0);
        si(mCornerU, mCornerM); si(mPillU, mPillM);
        muteCorner.classList.remove('btn-active');
        mutePill.classList.remove('btn-active');
      });
    } else if (hasStarted) {
      p.pause();
    }
  }, { threshold: 0.3 });

  p.on('play', () => { hasStarted = true; updateScrollVolume(); });
  obs.observe(section);

  /* Indicateur mobile showreel */
  const rl2MobInd = document.getElementById('rl2-mob-indicator');
  let rl2FlashTimer = null;
  function showRl2Indicator(playing) {
    if (!rl2MobInd) return;
    rl2MobInd.classList.remove('playing', 'paused');
    clearTimeout(rl2FlashTimer);
    if (playing) {
      rl2MobInd.classList.add('playing', 'visible');
      rl2FlashTimer = setTimeout(() => rl2MobInd.classList.remove('visible'), 520);
    } else {
      rl2MobInd.classList.add('paused', 'visible');
    }
  }

  /* Clic vidéo */
  hit.addEventListener('click', () => isPlaying ? p.pause() : p.play());
  playBtn.addEventListener('click', () => isPlaying ? p.pause() : p.play());

  /* Tap mobile showreel */
  hit.addEventListener('touchend', e => {
    e.preventDefault();
    if (isPlaying) { p.pause(); showRl2Indicator(false); }
    else           { p.play();  showRl2Indicator(true);  }
  }, { passive: false });

  p.on('pause', () => { if (isTouch) showRl2Indicator(false); });
  p.on('ended', () => { if (rl2MobInd) { rl2MobInd.classList.remove('visible','playing','paused'); } });
  [muteCorner, mutePill].forEach(b => b.addEventListener('click', () => setMuteState(!isMuted)));

  /* Plein écran — même système que l'accueil */
  const rl2Outer = document.getElementById('rl2-outer');
  const rl2Backdrop = document.getElementById('theater-backdrop');
  let rl2Placeholder = null;

  function toggleRl2Theater() {
    const on = !rl2Outer.classList.contains('theater');
    if (on) {
      const rect = rl2Outer.getBoundingClientRect();
      rl2Placeholder = document.createElement('div');
      rl2Placeholder.style.cssText = `width:${rect.width}px;height:${rect.height}px;flex-shrink:0;`;
      rl2Outer.parentNode.insertBefore(rl2Placeholder, rl2Outer);
      document.body.classList.add('theater-open');
    } else {
      if (rl2Placeholder) { rl2Placeholder.remove(); rl2Placeholder = null; }
      document.body.classList.remove('theater-open');
    }
    rl2Outer.classList.toggle('theater', on);
    rl2Backdrop.classList.toggle('active', on);
  }

  fullBtn.addEventListener('click', toggleRl2Theater);
  rl2Backdrop.addEventListener('click', () => {
    if (rl2Outer.classList.contains('theater')) toggleRl2Theater();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && rl2Outer.classList.contains('theater')) toggleRl2Theater();
  });

  /* Barre de progression avec drag */
  const strip   = document.getElementById('rl2-strip');
  let rl2Drag   = false;
  let rl2Raf    = null;

  function rl2Pct(e) {
    const r = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  }
  function rl2Apply(pct) {
    played.style.width = (pct * 100) + '%';
    dot.style.left     = (pct * 100) + '%';
    fill.style.width   = (pct * 100) + '%';
    cancelAnimationFrame(rl2Raf);
    rl2Raf = requestAnimationFrame(() => { if (dur) p.setCurrentTime(pct * dur); });
  }

  strip.addEventListener('pointerdown', e => {
    e.preventDefault();
    strip.setPointerCapture(e.pointerId);
    rl2Drag = true;
    rl2Apply(rl2Pct(e));
  });
  strip.addEventListener('pointermove', e => {
    const pct = rl2Pct(e);
    if (rl2Drag) {
      rl2Apply(pct);
    } else {
      hoverFill.style.width = (pct * 100) + '%';
    }
  });
  strip.addEventListener('pointerup', e => {
    if (!rl2Drag) return;
    rl2Drag = false;
    hoverFill.style.width = '0%';
    rl2Apply(rl2Pct(e));
  });
  strip.addEventListener('pointerleave', () => {
    if (!rl2Drag) hoverFill.style.width = '0%';
  });
})();


/* ─── SCROLL THEATER — reveal mots + reel suivant ── */
let scrollAccum    = 0;
let drainScrollRaf = null;
const NEXT_THRESHOLD = 900;

function applyScrollState() {
  if (!descWords.length) return;
  /* Cache le hint dès le premier scroll */
  if (rlScrollHint && scrollAccum > 0) rlScrollHint.classList.add('hidden');
  const wordStep    = 22;
  const wordTotal   = descWords.length * wordStep;
  const totalRange  = wordTotal + NEXT_THRESHOLD;
  const clamped     = Math.min(totalRange, Math.max(0, scrollAccum));

  /* révélation des mots */
  const litCount = Math.floor(Math.min(clamped, wordTotal) / wordStep);
  descWords.forEach((w, i) => w.classList.toggle('lit', i < litCount));

  /* indicateur next reel */
  const allLit = litCount >= descWords.length;
  const nextIdx = currentIndex + 1;
  const hasNext = nextIdx < currentDataset.length && currentDataset[nextIdx].vimeoId;

  if (allLit && hasNext) {
    rlNextReel.classList.add('visible');
    const nextPct = Math.min(1, (clamped - wordTotal) / NEXT_THRESHOLD);
    rlNextReelFill.style.width = (nextPct * 100) + '%';
    rlNextReelTitle.textContent = currentDataset[nextIdx].label;

    /* Déplacement du player pour indiquer le prochain reel (desktop uniquement) */
    const ease = nextPct * nextPct;
    if (window.innerWidth > 768) {
      rlPlayer.style.transform = `translate(calc(-50% - ${ease * 28}px), calc(-50% + ${ease * 8}px)) scale(${1 - ease * 0.04})`;
    }

    if (clamped >= totalRange) {
      rlPlayer.style.transform = '';
      openPlayer(currentDataset[nextIdx], nextIdx, currentDataset);
    }
  } else {
    rlNextReel.classList.remove('visible');
    rlNextReelFill.style.width = '0%';
    /* Retour position normale si on re-scroll vers le haut */
    rlPlayer.style.transform = '';
  }
}

function drainScroll() {
  scrollAccum = Math.max(0, scrollAccum - 20);
  applyScrollState();
  if (scrollAccum > 0) {
    drainScrollRaf = requestAnimationFrame(drainScroll);
  } else {
    drainScrollRaf = null;
  }
}

window.addEventListener('wheel', e => {
  if (window.innerWidth <= 768) return;
  if (!document.body.classList.contains('theater-open')) return;
  e.preventDefault();
  if (drainScrollRaf) { cancelAnimationFrame(drainScrollRaf); drainScrollRaf = null; }

  if (e.deltaY > 0) {
    scrollAccum = Math.min(descWords.length * 22 + NEXT_THRESHOLD, scrollAccum + e.deltaY * 0.85);
    applyScrollState();
  } else {
    scrollAccum = Math.max(0, scrollAccum + e.deltaY * 0.85);
    applyScrollState();
    if (scrollAccum < descWords.length * 22) {
      drainScrollRaf = requestAnimationFrame(drainScroll);
    }
  }
}, { passive: false });

/* ─── CONTACT EMAIL — proximité + magnétique ─ */
(function () {
  const email  = document.querySelector('#rl-contact .rl-contact-email');
  if (!email) return;
  const RADIUS = 180, FORCE = 10;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    const r  = email.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    email.classList.toggle('is-near', dist < RADIUS);

    if (dist < RADIUS && dist > 1) {
      const t = dist / RADIUS;
      const s = 4 * t * (1 - t) * FORCE;
      tx = (dx / dist) * s;
      ty = (dy / dist) * s;
    } else {
      tx = 0; ty = 0;
    }
  });

  let cx = 0, cy = 0;
  (function raf() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    email.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(raf);
  })();
})();

/* ─── SCROLL REVEAL (.sr) ────────────────── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('sr-visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.sr').forEach(el => obs.observe(el));
})();

/* ─── SCROLLSPY NAV ──────────────────────── */
(function () {
  const navLinks = document.querySelectorAll('#nav .nav-link[href^="#"], #bottom-nav .nav-link[href^="#"]');
  const SECTION_IDS = ['rl-hero', 'rl-content', 'rl-showreel', 'rl-contact'];
  const sectionEls  = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);

  let current = null;

  function setActive(id) {
    if (id === current) return;
    current = id;
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`#nav .nav-link[href="#${id}"], #bottom-nav .nav-link[href="#${id}"]`)
      .forEach(l => l.classList.add('active'));
  }

  function spy() {
    /* Si on est tout en bas → Contact */
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
    if (atBottom) { setActive('rl-contact'); return; }

    /* Sinon : section dont le top est la plus proche du tiers supérieur de l'écran */
    const trigger = window.scrollY + window.innerHeight * 0.4;
    let best = sectionEls[0];
    for (const el of sectionEls) {
      if (el.offsetTop <= trigger) best = el;
    }
    setActive(best.id);
  }

  window.addEventListener('scroll', spy, { passive: true });
  spy();
})();



/* ─── BURGER MENU MOBILE ─── */
(function() {
  const btn  = document.getElementById('burger-btn');
  const menu = document.getElementById('burger-menu');
  if (!btn || !menu) return;

  function openMenu() {
    btn.classList.add('open');
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('.burger-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();

/* ─── PRÉ-CHARGEMENT VIMEO ─────────────────────────────────────
   Initialise l'iframe Vimeo en arrière-plan dès le chargement de la
   page avec le premier reel disponible (muet, sans autoplay).
   Quand l'utilisateur clique, l'iframe est déjà prête.
─────────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const firstReel = REELS.find(r => r.vimeoId);
  if (!firstReel || vPlayer) return;

  const opts = {
    id:       firstReel.vimeoId,
    autoplay: false,
    muted:    true,
    controls: false,
    title:    false,
    byline:   false,
    portrait: false,
    dnt:      true,
  };
  if (firstReel.vimeoH) opts.h = firstReel.vimeoH;

  vPlayer = new Vimeo.Player(rlVimeo, opts);
  vPlayerLoadedId = firstReel.vimeoId;

  vPlayer.on('play',  () => { setPlayState(true); });
  vPlayer.on('pause', () => { setPlayState(false); if (isTouch) showMobIndicator(false); });
  vPlayer.on('ended', () => {
    setPlayState(false);
    if (isTouch) hideMobIndicator();
    vPlayer.setCurrentTime(0).catch(() => {});
  });
  vPlayer.on('timeupdate', ({ seconds, duration: dur }) => {
    if (!dur) return;
    duration = dur;
    const pct = seconds / dur * 100;
    rlPlayed.style.width       = pct + '%';
    rlDot.style.left           = pct + '%';
    rlProgressFill.style.width = pct + '%';
    rlTime.textContent         = fmtTime(seconds);
  });
  vPlayer.on('volumechange', ({ muted, volume }) => {
    const actuallyMuted = muted || volume === 0;
    if (actuallyMuted !== isMuted) {
      isMuted = actuallyMuted;
      rlMuteBtn.classList.toggle('muted', isMuted);
      setIcon(isMuted ? riUnmuted : riMuted, isMuted ? riMuted : riUnmuted);
    }
  });
});
