import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../components/donut-chart/donut-chart.component';
import { ScatterChartComponent } from '../components/scatter-chart/scatter-chart.component';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-survey-dashboard',
  standalone: true,
  imports: [CommonModule, BarChartComponent, DonutChartComponent, ScatterChartComponent, NavbarComponent],
  templateUrl: './survey-dashboard.component.html',
  styleUrl: './survey-dashboard.component.css'
})
export class SurveyDashboardComponent implements AfterViewInit {
  
  // Bar chart data
  barChartData = [
    { name: 'Accountability', value: 80 },
    { name: 'Autonomy', value: 63.75 },
    { name: 'Collaboration', value: 71.88 },
    { name: 'Courage', value: 71.88 },
    { name: 'Inclusion', value: 41.88 },
    { name: 'Mastery', value: 53.75 },
    { name: 'Purpose', value: 63.13 },
    { name: 'Relatedness', value: 63.75 },
    { name: 'Vulnerability', value: 69.38 }
  ];

  // Survey data
  surveys = [
    { name: 'Q4 2024 Team Survey', responses: 72, status: 'active', date: '2 days ago' },
    { name: 'Q3 2024 Team Survey', responses: 68, status: 'inactive', date: 'Sep 2024' },
    { name: 'Q2 2024 Team Survey', responses: 65, status: 'inactive', date: 'Jun 2024' },
    { name: 'Q1 2024 Team Survey', responses: 63, status: 'inactive', date: 'Mar 2024' },
    { name: 'Q4 2023 Team Survey', responses: 60, status: 'inactive', date: 'Dec 2023' },
    { name: 'Q3 2023 Team Survey', responses: 58, status: 'inactive', date: 'Sep 2023' }
  ];

  ngAfterViewInit(): void {
    // Any initialization logic
  }

  onPointClick(data: any): void {
    Swal.fire({
      title: data.label,
      html: `
        <div class="text-left" style="font-family: 'Poppins', sans-serif;">
          <div class="mb-2"><strong style="color: #371A2D;">Motivational Driver:</strong> <span style="color: #432338;">${data.x.toFixed(1)}</span></div>
          <div class="mb-2"><strong style="color: #371A2D;">Psychological Safety:</strong> <span style="color: #432338;">${data.y.toFixed(1)}</span></div>
          <div class="mb-2"><strong style="color: #371A2D;">Quadrant:</strong> <span style="color: #432338;">${data.quadrant}</span></div>
          <div class="mt-3 p-3 rounded-lg bg-[#FFE1F7]/30 text-sm" style="color: #432338;">
            <strong style="color: #371A2D;">Recommendation:</strong><br>
            ${this.getRecommendation(data.quadrant)}
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#F77FBE',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl',
        title: 'poppins-bold',
        htmlContainer: 'poppins-regular'
      }
    });
  }

  private getRecommendation(quadrant: string): string {
    switch(quadrant) {
      case 'Optimal':
        return 'Continue current practices and mentor others. Focus on maintaining high performance levels.';
      case 'High Drive':
        return 'Focus on improving psychological safety through better support systems and team building activities.';
      case 'Safe':
        return 'Boost motivation through engagement and recognition programs. Set clear performance goals.';
      case 'At Risk':
        return 'Requires immediate attention and support from leadership. Schedule one-on-one coaching sessions.';
      default:
        return 'Review performance metrics regularly and provide constructive feedback.';
    }
  }

  // Method to handle survey selection
  selectSurvey(survey: any): void {
    console.log('Selected survey:', survey);
    // Implement survey switching logic here
  }
}