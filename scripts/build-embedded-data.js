const fs = require('fs');
const path = require('path');

const classes = require('../config/classes-config.json');
const perks = require('../config/perks-descriptions.json');
const spells = require('../config/spells-descriptions.json');

const content = `// Dados embutidos para compatibilidade total com CEF e navegadores
window.AETHERIUS_CLASSES = ${JSON.stringify(classes)};
window.AETHERIUS_PERKS = ${JSON.stringify(perks)};
window.AETHERIUS_SPELLS = ${JSON.stringify(spells)};
`;

const outputPath = path.resolve(__dirname, '../ui/js/embedded-data.js');
fs.writeFileSync(outputPath, content, 'utf-8');
console.log('ui/js/embedded-data.js atualizado com sucesso! (Classes, Perks e Spells inclusos)');
