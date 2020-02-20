import prettierBabylon from 'prettier/parser-babylon';
export default {
  prettier: {
    parser: 'babel',
    plugins: [prettierBabylon],
    semi: true,
    singleQuote: true
  },
  wrapperList: ['injectIntl', 'createSelector']
};
