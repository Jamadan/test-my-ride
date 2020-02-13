import createTestFile from './index';

describe('analyse', () => {
  it('return analysis', async () => {
    const analysis = await createTestFile('test/index.js');

    expect(analysis).toEqual(undefined);
  });
});
