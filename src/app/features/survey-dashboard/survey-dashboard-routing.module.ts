import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Import standalone components
import { SurveyDashboardComponent } from './survey-dashboard/survey-dashboard.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { ScatterChartComponent } from './components/scatter-chart/scatter-chart.component';

const routes: Routes = [
  {
    path: '', 
    component: SurveyDashboardComponent
    // If you want child routes later, add children here
  }
];

@NgModule({
  declarations: [
    // No declarations needed since we're using standalone components
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    
    // Import standalone components
    SurveyDashboardComponent,
    BarChartComponent,
    DonutChartComponent,
    ScatterChartComponent
  ]
})
export class SurveyDashboardModule { }