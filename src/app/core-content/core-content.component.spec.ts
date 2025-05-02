import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreContentComponent } from './core-content.component';

describe('CoreContentComponent', () => {
  let component: CoreContentComponent;
  let fixture: ComponentFixture<CoreContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
