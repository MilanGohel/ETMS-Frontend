import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMembersDialogComponent } from './find-members-dialog.component';

describe('FindMembersDialogComponent', () => {
  let component: FindMembersDialogComponent;
  let fixture: ComponentFixture<FindMembersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindMembersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindMembersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
