import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterScatterChartComponent } from './cluster-scatter-chart.component';

describe('ClusterScatterChartComponent', () => {
  let component: ClusterScatterChartComponent;
  let fixture: ComponentFixture<ClusterScatterChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterScatterChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClusterScatterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
