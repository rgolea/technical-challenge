import { mongooseQueryBuilder } from './mongoose-query-builder';

describe('mongooseQueryBuilder', () => {
  it('should work', () => {
    expect(mongooseQueryBuilder()).toEqual('mongoose-query-builder');
  });
});
