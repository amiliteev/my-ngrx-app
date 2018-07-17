import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductLinkComponent } from './new-product-link.component';

describe('NewProductLinkComponent', () => {
  let component: NewProductLinkComponent;
  let fixture: ComponentFixture<NewProductLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
