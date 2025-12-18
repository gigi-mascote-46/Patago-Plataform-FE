module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Remova os plugins do Flow!
    // plugins: [
    //   ['@babel/plugin-proposal-export-namespace-from'],
    //   ['@babel/plugin-syntax-flow', { enums: true }],
    //   ['@babel/plugin-transform-flow-strip-types']
    // ]
  };
};