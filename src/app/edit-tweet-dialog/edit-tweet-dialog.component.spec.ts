import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTweetDialogComponent } from './edit-tweet-dialog.component';

describe('EditTweetDialogComponent', () => {
  let component: EditTweetDialogComponent;
  let fixture: ComponentFixture<EditTweetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTweetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTweetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
