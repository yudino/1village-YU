import { isFirstStepValid } from '../enigmeChecks';

describe('Test enigmeCheck', () => {
  test('isFirstStepValid success', () => {
    const enigmeData = {
      theme: 0,
      indiceContentIndex: 1,
      timer: 0,
    };
    expect(isFirstStepValid(enigmeData)).toBe(true);
  });
});
