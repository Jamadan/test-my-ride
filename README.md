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
- handle require/resquire.default/require.names/import * as
- handle root config file for local installs
- updated function wrapper list
- output using result func for creste selector
