# test-my-ride

Creates an test file next to the passed filename, automacks all imports and creates describe block per function with correct mocks inserted

# Installation

`npm install -g test-my-ride`

# Usage example

```javascript
test-my-ride src/path/to/file.js
```
Run this from terminal. Will create a `src/path/to/file.test-my-ride.js` file.

Currently used for boiler plate test file generation;

Stuff coming soon:
- Support test generation for individual function as param
- Support output postfix as param (e.g. `.test.js`)
- Support different templates for create statements which can be supplied (or accepted into the repo via PR)
- Handle combiners and stuff like `injectIntl` (ignore list maybe? would have to handle use of internal non exported functions. will come back to this)
