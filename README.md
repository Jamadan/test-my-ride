# mock-my-ride

Creates an object copy wiith all functions returns as a jest.mock that returns the origina, implementation
Also creates a function to mock the return value of an imported function

# Installation

`npm install mock-my-ride`

# Usage example

```javascript
import { mockFile, mockFunction } from 'mock-my-ride';

import * as funcsToMock from './sub-func';
mockFile(funcsToMock);

// Functions under test
import { isString } from './index';

describe('isString', () => {
  it('return true when isStringSub is true', () => {
    mockFunction(funcsToMock.isStringSub, true);

    expect(isString()).toEqual(true);
  });
});

```
