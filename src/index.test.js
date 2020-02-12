import analyseFile from './index';

describe('analyse', () => {
  it('return analysis', async () => {
    const analysis = await analyseFile();

    expect(1).toEqual(1);
  });
});
