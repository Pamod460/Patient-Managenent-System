import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCustomViewComponent } from './report-custom-view.component';

describe('ReportCustomViewComponent', () => {
  let component: ReportCustomViewComponent;
  let fixture: ComponentFixture<ReportCustomViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportCustomViewComponent]
    });
    fixture = TestBed.createComponent(ReportCustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
