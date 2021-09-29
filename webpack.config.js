const path = require('path')

module.exports = {
    entry: {
        background_scripts: './background_scripts/background.js',
        content: './background_scripts/content.js',
    },
    output: {
        path: path.resolve(__dirname, 'addon'),
        filename: '[name]/index.js',
    },
}
 