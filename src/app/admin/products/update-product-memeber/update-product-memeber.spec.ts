import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductMemeber } from './update-product-memeber';

describe('UpdateProductMemeber', () => {
  let component: UpdateProductMemeber;
  let fixture: ComponentFixture<UpdateProductMemeber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProductMemeber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductMemeber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
