import { ProductStore } from '../models/products';

const store = new ProductStore();
import { ProductOne, UserOne } from './mocked_data';

describe('Product Models', () => {
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

  it('Create method should return a Product', async () => {
    const result = await store.create(ProductOne);
    expect(result).toEqual(
      jasmine.objectContaining({
        name: ProductOne.name,
        price: ProductOne.price.toString(),
        category: ProductOne.category
      })
    );
  });

  it('index method should return a list of Products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      jasmine.objectContaining({
        name: ProductOne.name
      })
    ]);
  });

  it('show method should return the correct product id', async () => {
    const result = await store.show(ProductOne.id.toString());
    expect(result).toEqual(
      jasmine.objectContaining({
        name: ProductOne.name
      })
    );
  });
  it('Delete method should return', async () => {
    const result = await store.delete(parseInt(ProductOne.id.toString()));
    expect(result).toEqual(
      jasmine.objectContaining({
        id: parseInt(UserOne.id)
      })
    );
  });
});
