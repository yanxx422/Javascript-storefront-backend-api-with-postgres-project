import { UserStore } from '../models/users';

const store = new UserStore();

import { UserOne } from './mocked_data';
describe('User Models', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });
  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add an user', async () => {
    const result = await store.create(UserOne);
    expect(result).toEqual(
      jasmine.objectContaining({
        firstname: UserOne.firstName,
        lastname: UserOne.lastName
      })
    );
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toContain(
      jasmine.objectContaining({
        firstname: UserOne.firstName,
        lastname: UserOne.lastName
      })
    );
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(UserOne.id);
    expect(result).toEqual(
      jasmine.objectContaining({
        firstname: UserOne.firstName,
        lastname: UserOne.lastName
      })
    );
  });
  it('Delete method should return', async () => {
    const result = await store.delete(UserOne.id);
    expect(result).toEqual(
      jasmine.objectContaining({
        id: parseInt(UserOne.id)
      })
    );
  });
});
