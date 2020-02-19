import createTestFile from './index';

describe('analyse', () => {
  it('return analysis', async () => {
    const analysis = await createTestFile(
      'test/index.js',
      undefined,
      undefined,
      true
    );

    expect(analysis).toEqual(undefined);
  });
});
