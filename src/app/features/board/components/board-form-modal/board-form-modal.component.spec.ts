import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardFormModalComponent } from './board-form-modal.component';

describe('BoardFormModalComponent', () => {
  let component: BoardFormModalComponent;
  let fixture: ComponentFixture<BoardFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
