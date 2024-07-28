import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDetailsViewComponent } from './record-details-view.component';

describe('RecordDetailsViewComponent', () => {
  let component: RecordDetailsViewComponent;
  let fixture: ComponentFixture<RecordDetailsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordDetailsViewComponent]
    });
    fixture = TestBed.createComponent(RecordDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
