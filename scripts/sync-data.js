const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
const DIST_CONFIG_DIR = path.join(ROOT_DIR, 'dist', 'config');
const UI_DATA_DIR = path.join(ROOT_DIR, 'ui', 'data');
const EMBEDDED_DATA_FILE = path.join(ROOT_DIR, 'ui', 'js', 'embedded-data.js');

console.log('====================================================');
console.log('🔄 Sincronizando e Validando Dados JSON do Aetherius');
console.log('====================================================');

// 1. Carrega e valida arquivos de configuração
const jsonFiles = [
  'classes-config.json',
  'perks-descriptions.json',
  'spells-descriptions.json',
  'perk-mappings.json'
];

const loadedData = {};

for (const fileName of jsonFiles) {
  const filePath = path.join(CONFIG_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo ausente em config/: ${fileName}`);
    process.exit(1);
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    loadedData[fileName] = JSON.parse(content);
    console.log(`✓ ${fileName}: JSON válido (${Object.keys(loadedData[fileName]).length} registros)`);
  } catch (err) {
    console.error(`❌ Erro ao analisar JSON de ${fileName}:`, err.message);
    process.exit(1);
  }
}

const classes = loadedData['classes-config.json'];
const perks = loadedData['perks-descriptions.json'];
const spells = loadedData['spells-descriptions.json'];
const mappings = loadedData['perk-mappings.json'];

// 2. Validação de Integridade Relacional (Links entre JSONs)
let missingPerks = [];
let missingMappings = [];
let missingSpells = [];

for (const [classId, classDef] of Object.entries(classes)) {
  if (classDef.stages) {
    for (const stage of classDef.stages) {
      if (stage.perks) {
        for (const perk of stage.perks) {
          if (!perks[perk]) {
            missingPerks.push({ classId, perk });
          }
          if (!mappings[perk]) {
            missingMappings.push({ classId, perk });
          }
        }
      }
    }
  }

  if (classDef.authorizedSpells) {
    for (const [tier, spellList] of Object.entries(classDef.authorizedSpells)) {
      for (const spell of spellList) {
        if (!spells[spell] && !spells[spell.toLowerCase()]) {
          missingSpells.push({ classId, spell, tier });
        }
      }
    }
  }
}

if (missingPerks.length > 0) {
  console.warn(`⚠️ Aviso: ${missingPerks.length} perks sem descrição em perks-descriptions.json:`, missingPerks);
} else {
  console.log('✓ 100% das perks de classes possuem descrição em perks-descriptions.json.');
}

if (missingMappings.length > 0) {
  console.warn(`⚠️ Aviso: ${missingMappings.length} perks sem mapeamento em perk-mappings.json:`, missingMappings);
} else {
  console.log('✓ 100% das perks de classes possuem mapeamento de FormID em perk-mappings.json.');
}

if (missingSpells.length > 0) {
  console.warn(`⚠️ Aviso: ${missingSpells.length} feitiços sem descrição em spells-descriptions.json:`, missingSpells);
} else {
  console.log('✓ 100% dos feitiços autorizados possuem descrição em spells-descriptions.json.');
}

// 3. Garante diretórios de destino
[DIST_CONFIG_DIR, UI_DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 4. Copia arquivos JSON para dist/config e ui/data
for (const fileName of jsonFiles) {
  const src = path.join(CONFIG_DIR, fileName);
  fs.copyFileSync(src, path.join(DIST_CONFIG_DIR, fileName));
  fs.copyFileSync(src, path.join(UI_DATA_DIR, fileName));
}
console.log('✓ Arquivos JSON sincronizados com dist/config/ e ui/data/.');

// 5. Gera ui/js/embedded-data.js para suporte instantâneo CEF/Offline
const embeddedContent = `// Gerado automaticamente por scripts/sync-data.js
// Fornece dados embutidos para compatibilidade total com CEF (file://) e navegadores sem servidor HTTP.
window.AETHERIUS_CLASSES = ${JSON.stringify(classes)};
window.AETHERIUS_PERKS = ${JSON.stringify(perks)};
window.AETHERIUS_SPELLS = ${JSON.stringify(spells)};
`;

fs.writeFileSync(EMBEDDED_DATA_FILE, embeddedContent, 'utf-8');
console.log(`✓ ui/js/embedded-data.js atualizado (${(fs.statSync(EMBEDDED_DATA_FILE).size / 1024).toFixed(1)} KB).`);
console.log('====================================================');
console.log('✨ Sincronização concluída com sucesso!');
console.log('====================================================');
