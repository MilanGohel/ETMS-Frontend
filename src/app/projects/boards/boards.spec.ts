import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Boards } from './boards';

describe('Boards', () => {
  let component: Boards;
  let fixture: ComponentFixture<Boards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Boards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
