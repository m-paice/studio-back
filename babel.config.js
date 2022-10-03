module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-flow',
  ],
  plugins: ['syntax-flow', '@babel/plugin-syntax-flow'],
  ignore: [],
};
