# test-my-ride

Creates a test file next to the passed filename, mocks all imports and creates describe block per function with correct mocks inserted

# Installation

`npm install -g test-my-ride`

# Usage example

```javascript
test-my-ride src/path/to/file.js --function functionName --config path/to/config/file.json
```
Run this from terminal. Will create a `src/path/to/file.test-my-ride.js` file.

Currently used for boiler plate test file generation.

Config structure:

```javascript
{
  "prettier": {
    "semi": true,
    "singleQuote": true
  },
  "outputPostfix": ".test-jam"
}
```

The settings for prettier are overridable and docco is [here](https://prettier.io/docs/en/options.html)

`outputPostfix` overrides the default `.test-my-ride` postfix to the test file.

The following values are not overridable:
```javascript
  parser: 'babel',
  plugins: [prettierBabylon]
```


Stuff coming soon:
- handle root config file for local installs
- Support different templates for create statements which can be supplied (or accepted into the repo via PR)
- Handle combiners and stuff like `injectIntl` (ignore list maybe? would have to handle use of internal non exported functions. will come back to this)
