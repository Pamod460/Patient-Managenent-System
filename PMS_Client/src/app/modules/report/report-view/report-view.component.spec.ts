import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewComponent } from './report-view.component';

describe('ReportViewComponent', () => {
  let component: ReportViewComponent;
  let fixture: ComponentFixture<ReportViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewComponent]
    });
    fixture = TestBed.createComponent(ReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
