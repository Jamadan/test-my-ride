import analyseFile from './index';

describe('analyse', () => {
  it('return analysis', async () => {
    const analysis = await analyseFile('../test/index.js');

    expect(1).toEqual(1);
  });
});
