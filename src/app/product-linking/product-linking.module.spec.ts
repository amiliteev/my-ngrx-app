import { ProductLinkingModule } from './product-linking.module';

describe('ProductLinkingModule', () => {
  let productLinkingModule: ProductLinkingModule;

  beforeEach(() => {
    productLinkingModule = new ProductLinkingModule();
  });

  it('should create an instance', () => {
    expect(productLinkingModule).toBeTruthy();
  });
});
