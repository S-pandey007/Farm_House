// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = {
//      resolver: {
//     sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'],
//     assetExts: ['glb', 'gltf', 'png', 'jpg'],
//   },
// };

// module.exports = config;

// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Extend assetExts if needed (only if you really use .glb, .gltf)
// config.resolver.assetExts.push("glb", "gltf");

// config.resolver.sourceExts.push("cjs", "mjs");


[("js", "jsx", "json", "ts", "tsx", "cjs", "mjs")].forEach((ext) => {
  if (config.resolver.sourceExts.indexOf(ext) === -1) {
    config.resolver.sourceExts.push(ext);
  }
});

["glb", "gltf", "png", "jpg"].forEach((ext) => {
  if (config.resolver.assetExts.indexOf(ext) === -1) {
    config.resolver.assetExts.push(ext);
  }
});

module.exports = config;
