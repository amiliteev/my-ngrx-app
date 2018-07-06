import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLinkingContainer } from './product-linking.container';

describe('ProductLinking.ContainerComponent', () => {
  let component: ProductLinkingContainer;
  let fixture: ComponentFixture<ProductLinkingContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLinkingContainer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLinkingContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
