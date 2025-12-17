import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../components/donut-chart/donut-chart.component';
import { ScatterChartComponent } from '../components/scatter-chart/scatter-chart.component';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


interface DescriptionData {
  scatter: string;
  bar: string;
  donuts: string[];
}

interface Survey {
  name: string;
  responses: number;
  status: string;
  date: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface ExportOptions {
  scatter: boolean;
  bar: boolean;
  donuts1: boolean;
  donuts2: boolean;
}

interface EditingState {
  scatter: boolean;
  bar: boolean;
  donuts1: boolean;
  donuts2: boolean;
}


@Component({
  selector: 'app-survey-dashboard',
  standalone: true,
  imports: [CommonModule, BarChartComponent, DonutChartComponent, ScatterChartComponent, NavbarComponent, FormsModule],
  templateUrl: './survey-dashboard.component.html',
  styleUrl: './survey-dashboard.component.css'
})
export class SurveyDashboardComponent implements AfterViewInit {
  // Add this property to track individual donut editing
editingDonutIndex: number | null = null;

// Check if a specific donut is being edited
isEditingDonut(index: number): boolean {
  return this.editingDonutIndex === index;
}

// Start editing individual donut
startIndividualDonutEdit(index: number): void {
  this.editingDonutIndex = index;
  // Store the current description in temp variable
  this.tempDonutDescriptions[index] = this.descriptions.donuts[index];
}

// Save individual donut description
saveIndividualDonutDescription(index: number): void {
  this.descriptions.donuts[index] = this.tempDonutDescriptions[index];
  this.editingDonutIndex = null;
  this.showSuccessToast(`${this.barChartData[index].name} description has been updated.`);
}

// Cancel individual donut edit
cancelIndividualDonutEdit(index: number): void {
  this.editingDonutIndex = null;
  // Optionally reset the temp description
  this.tempDonutDescriptions[index] = this.descriptions.donuts[index];
  this.showInfoToast('Edit cancelled.');
}

// Reset individual donut description to AI content
resetIndividualDonutDescription(index: number): void {
  this.tempDonutDescriptions[index] = this.originalDonutDescriptions[index];
  const dimensionName = this.barChartData[index].name;
  this.showInfoToast(`${dimensionName} description has been reset to AI content.`);
}

// Also update the existing resetSingleDonutDescription to use the new method
resetSingleDonutDescription(index: number): void {
  this.resetIndividualDonutDescription(index);
}
  // selectedSurvey: Survey | null = null;
selectSurvey(survey: Survey): void {
  this.selectedSurvey = survey;
  this.showInfoToast(`Loading ${survey.name}...`);
  
  // If survey is inactive (in progress), show appropriate message
  if (survey.status === 'inactive') {
    console.log(`Survey "${survey.name}" is in progress - showing analysis status`);
  }
}
  barChartData: ChartData[] = [
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
getStartDate(): string {
  if (this.selectedSurvey?.name === 'Q4 2024 Team Survey') return 'Oct 1, 2024';
  if (this.selectedSurvey?.name === 'Q3 2024 Team Survey') return 'Jul 1, 2024';
  if (this.selectedSurvey?.name === 'Q2 2024 Team Survey') return 'Apr 1, 2024';
  if (this.selectedSurvey?.name === 'Q1 2024 Team Survey') return 'Jan 1, 2024';
  if (this.selectedSurvey?.name === 'Q4 2023 Team Survey') return 'Oct 1, 2023';
  if (this.selectedSurvey?.name === 'Q3 2023 Team Survey') return 'Jul 1, 2023';
  return 'Oct 1, 2024'; // Default
}

getEndDate(): string {
  if (this.selectedSurvey?.name === 'Q4 2024 Team Survey') return 'Dec 31, 2024';
  if (this.selectedSurvey?.name === 'Q3 2024 Team Survey') return 'Sep 30, 2024';
  if (this.selectedSurvey?.name === 'Q2 2024 Team Survey') return 'Jun 30, 2024';
  if (this.selectedSurvey?.name === 'Q1 2024 Team Survey') return 'Mar 31, 2024';
  if (this.selectedSurvey?.name === 'Q4 2023 Team Survey') return 'Dec 31, 2023';
  if (this.selectedSurvey?.name === 'Q3 2023 Team Survey') return 'Sep 30, 2023';
  return 'Dec 31, 2024'; // Default
}
getResponseCount(): number {
  return this.selectedSurvey?.responses || 72;
}

getProgressPercentage(): number {
  return this.selectedSurvey?.responses || 72;
}

getStatusLabel(): string {
  if (this.selectedSurvey?.status === 'active') return 'Completed';
  if (this.selectedSurvey?.status === 'inactive') return 'In Progress';
  return 'Completed'; // Default
}

getExpectedCompletionDate(): string {
  if (this.selectedSurvey?.name === 'Q3 2024 Team Survey') return 'Oct 15, 2024';
  if (this.selectedSurvey?.name === 'Q2 2024 Team Survey') return 'Jul 15, 2024';
  if (this.selectedSurvey?.name === 'Q1 2024 Team Survey') return 'Apr 15, 2024';
  if (this.selectedSurvey?.name === 'Q4 2023 Team Survey') return 'Jan 15, 2024';
  if (this.selectedSurvey?.name === 'Q3 2023 Team Survey') return 'Oct 15, 2023';
  return 'Oct 15, 2024'; // Default
}
surveys: Survey[] = [
  { name: 'Q4 2024 Team Survey', responses: 72, status: 'active', date: '2 days ago' },
  { name: 'Q3 2024 Team Survey', responses: 68, status: 'inactive', date: 'Sep 2024' },
  { name: 'Q2 2024 Team Survey', responses: 65, status: 'inactive', date: 'Jun 2024' },
  { name: 'Q1 2024 Team Survey', responses: 63, status: 'inactive', date: 'Mar 2024' },
  { name: 'Q4 2023 Team Survey', responses: 60, status: 'inactive', date: 'Dec 2023' },
  { name: 'Q3 2023 Team Survey', responses: 58, status: 'inactive', date: 'Sep 2023' }
];
  selectedSurvey: Survey | null = this.surveys[0];


  descriptions: DescriptionData = {
    scatter: `The team exhibits a relatively balanced distribution across zones, with notable concentrations in the Apathy Zone (41.7%) and the Learning Zone (40.3%). The mean scores for motivational drivers (49.42) and psychological safety (50.05) are close to the midline, suggesting a team that is not strongly skewed toward either high or low performance environments.

However, the high proportion of individuals in the Apathy Zone indicates a significant subset of the team may be disengaged or lacking the necessary psychological safety to feel motivated. Conversely, the strong presence in the Learning Zone signals that nearly half the team is thriving in an optimal environment for growth and performance.

**Key Insights:**
- 40.3% of team members are in the optimal Learning Zone
- 41.7% require immediate attention in the Apathy Zone
- Psychological safety (50.05) slightly exceeds motivational drivers (49.42)
- Opportunity exists to shift members from Apathy to Learning zones`,

    bar: `The dimension scores reveal varied performance across engagement factors. Accountability leads at 80%, indicating strong ownership and follow-through, while Inclusion lags at 41.88%, highlighting an area requiring immediate attention.

**Top Performers (70%+):**
- Accountability (80%): Excellent ownership culture
- Collaboration (71.88%): Effective teamwork and communication
- Courage (71.88%): Healthy risk-taking and speaking up

**Areas for Improvement:**
- Inclusion (41.88%): Significant improvement needed in belonging
- Mastery (53.75%): Requires more skill development opportunities
- Autonomy (63.75%): Could benefit from increased decision-making authority

The distribution suggests strengths in execution (Accountability, Collaboration) but challenges in belonging (Inclusion) and growth (Mastery).`,

    donuts: [
      'High accountability score (80%) indicates strong ownership culture with clear responsibilities and follow-through mechanisms in place. Teams demonstrate reliable delivery and personal responsibility for outcomes.',
      'Moderate autonomy (63.75%) suggests team members have reasonable independence but could benefit from more decision-making authority. Consider delegating more ownership of processes and outcomes.',
      'Strong collaboration (71.88%) reflects effective teamwork, communication, and cross-functional coordination within the organization. Continue fostering cooperative problem-solving environments.',
      'Healthy courage score (71.88%) shows willingness to take risks, speak up, and challenge the status quo when needed. Maintain environments where constructive dissent is valued.',
      'Low inclusion (41.88%) is a concern - indicates potential issues with diversity, belonging, or equitable participation across the team. Implement inclusion initiatives and ensure all voices are heard.',
      'Mastery score (53.75%) suggests moderate skill development - opportunities exist for enhanced training and growth pathways. Consider implementing mentorship programs and skill-building workshops.',
      'Purpose at 63.13% indicates decent alignment with organizational mission but room for stronger connection to meaningful work. Clarify how individual roles contribute to larger objectives.',
      'Relatedness (63.75%) shows satisfactory interpersonal connections but potential for deeper team bonding and relationship building. Foster opportunities for team building and social connection.',
      'Vulnerability (69.38%) reflects reasonably safe environment for openness, though psychological safety could be further strengthened. Encourage sharing of failures and learning opportunities.'
    ]
  };

  isEditing: EditingState = {
    scatter: false,
    bar: false,
    donuts1: false,
    donuts2: false
  };

  isEditingDonuts: boolean[] = [false, false];
  tempDonutDescriptions: string[] = [...this.descriptions.donuts];
  originalDonutDescriptions: string[] = [...this.descriptions.donuts];

  exportOptions: ExportOptions = {
    scatter: true,
    bar: true,
    donuts1: true,
    donuts2: true
  };

  originalDescriptions: DescriptionData = { ...this.descriptions };

  constructor(private http: HttpClient) {
    // Initialize selectedSurvey after surveys is defined
    if (this.surveys.length > 0) {
      this.selectedSurvey = this.surveys[0];
    }
  }
  ngAfterViewInit(): void {}
completeSurvey(): void {}
  getDonutDescription(index: number): string {
    return this.descriptions.donuts[index] || '';
  }

  getScoreLabel(score: number): string {
    if (score >= 70) return 'Strong';
    if (score >= 50) return 'Moderate';
    return 'Needs Improvement';
  }

  toggleEdit(chartType: keyof EditingState): void {
    this.isEditing[chartType] = !this.isEditing[chartType];
  }

 saveDescription(chartType: keyof EditingState): void {
  this.isEditing[chartType] = false;
  this.showSuccessToast('Description has been updated successfully.');
}

cancelEdit(chartType: keyof EditingState): void {
  this.isEditing[chartType] = false;
  if (chartType === 'scatter') {
    this.descriptions.scatter = this.originalDescriptions.scatter;
  } else if (chartType === 'bar') {
    this.descriptions.bar = this.originalDescriptions.bar;
  }
  this.showInfoToast('Edit cancelled. Changes discarded.');
}


 resetDescription(chartType: keyof EditingState): void {
  if (chartType === 'scatter') {
    this.descriptions.scatter = this.originalDescriptions.scatter;
  } else if (chartType === 'bar') {
    this.descriptions.bar = this.originalDescriptions.bar;
  }
  this.isEditing[chartType] = false;
  this.showInfoToast('Description has been reset to AI-generated analysis.');
}
toggleDonutEdit(groupIndex: number): void {
  this.isEditingDonuts[groupIndex] = !this.isEditingDonuts[groupIndex];
  if (this.isEditingDonuts[groupIndex]) {
    this.tempDonutDescriptions = [...this.descriptions.donuts];
  }
}
saveAllDonutDescriptions(groupIndex: number): void {
  this.descriptions.donuts = [...this.tempDonutDescriptions];
  this.isEditingDonuts[groupIndex] = false;
  this.showSuccessToast(`All ${groupIndex === 0 ? 'Core Engagement' : 'Growth & Trust'} descriptions have been updated.`);
}
 cancelDonutEdit(groupIndex: number): void {
  this.tempDonutDescriptions = [...this.originalDonutDescriptions];
  this.isEditingDonuts[groupIndex] = false;
  this.showInfoToast('All changes have been discarded.');
}


//   resetSingleDonutDescription(index: number): void {
//   this.tempDonutDescriptions[index] = this.originalDonutDescriptions[index];
//   const dimensionName = this.barChartData[index].name;
//   this.showInfoToast(`${dimensionName} description has been reset to AI content.`);
// }
private showSuccessToast(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    iconColor: '#10b981',
    customClass: {
      container: 'swal-toast-container',
      popup: 'toast-popup'
    }
  });
}

private showInfoToast(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    iconColor: '#F77FBE',
    customClass: {
      container: 'swal-toast-container',
      popup: 'toast-popup'
    }
  });
}

private showErrorToast(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: '#ffffff',
    iconColor: '#ef4444',
    customClass: {
      container: 'swal-toast-container',
      popup: 'toast-popup'
    }
  });
}

private showLoadingToast(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    title: message,
    showConfirmButton: false,
    allowOutsideClick: false,
    timer: undefined,
    didOpen: () => {
      Swal.showLoading();
    },
    background: '#ffffff',
    customClass: {
      container: 'swal-toast-container',
      popup: 'toast-popup'
    }
  });
}
  onPointClick(data: any): void {
    Swal.fire({
      title: data.label,
      html: `
        <div class="text-left space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 rounded-lg bg-[#FFE1F7]/30">
              <div class="text-xs font-semibold" style="color: #371A2D;">Motivational Driver</div>
              <div class="text-lg font-bold mt-1" style="color: #F77FBE;">${data.x.toFixed(1)}</div>
            </div>
            <div class="p-3 rounded-lg bg-[#FFE1F7]/30">
              <div class="text-xs font-semibold" style="color: #371A2D;">Psychological Safety</div>
              <div class="text-lg font-bold mt-1" style="color: #F77FBE;">${data.y.toFixed(1)}</div>
            </div>
          </div>
          <div class="p-3 rounded-lg border border-[#F77FBE]">
            <div class="text-xs font-semibold mb-1" style="color: #371A2D;">Quadrant: <span style="color: #432338;">${data.quadrant}</span></div>
            <div class="text-xs mt-2" style="color: #432338;">
              <strong>Recommendation:</strong><br>
              ${this.getRecommendation(data.quadrant)}
            </div>
          </div>
        </div>
      `,
      width: 500,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#F77FBE'
    });
  }

  private getRecommendation(quadrant: string): string {
    const recommendations: { [key: string]: string } = {
      'Optimal': 'Continue current practices and mentor others. Focus on maintaining high performance levels and sharing best practices across teams.',
      'High Drive': 'Focus on improving psychological safety through better support systems, regular check-ins, and team building activities.',
      'Safe': 'Boost motivation through engagement programs, recognition systems, and clear performance goals aligned with personal growth.',
      'At Risk': 'Requires immediate attention and support from leadership. Schedule one-on-one coaching sessions and create safety nets.'
    };
    return recommendations[quadrant] || 'Review performance metrics regularly and provide constructive feedback.';
  }

  // selectSurvey(survey: Survey): void {
  //   Swal.fire({
  //     title: 'Survey Selected',
  //     html: `<div class="text-center py-4"><div class="text-lg font-semibold" style="color: #371A2D;">${survey.name}</div><div class="text-sm mt-2" style="color: #432338;">Loading survey data...</div></div>`,
  //     icon: 'info',
  //     timer: 1500,
  //     showConfirmButton: false
  //   });
  // }

  sendToBackend(): void {
    Swal.fire({
      title: 'Send Charts to Backend',
      html: `
        <div class="text-left space-y-4">
          <p class="text-sm" style="color: #432338;">Select charts to send:</p>
          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-scatter-checkbox" ${this.exportOptions.scatter ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Team Performance Matrix</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-bar-checkbox" ${this.exportOptions.bar ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Dimension Scores</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-donuts1-checkbox" ${this.exportOptions.donuts1 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Core Engagement Drivers</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-donuts2-checkbox" ${this.exportOptions.donuts2 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Growth & Trust Indicators</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Generate & Send',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#F77FBE',
      preConfirm: () => {
        const scatter = (document.getElementById('send-scatter-checkbox') as HTMLInputElement)?.checked || false;
        const bar = (document.getElementById('send-bar-checkbox') as HTMLInputElement)?.checked || false;
        const donuts1 = (document.getElementById('send-donuts1-checkbox') as HTMLInputElement)?.checked || false;
        const donuts2 = (document.getElementById('send-donuts2-checkbox') as HTMLInputElement)?.checked || false;

        const selectedCharts: string[] = [];
        if (scatter) selectedCharts.push('scatter');
        if (bar) selectedCharts.push('bar');
        if (donuts1) selectedCharts.push('donuts1');
        if (donuts2) selectedCharts.push('donuts2');
        
        if (selectedCharts.length === 0) {
          Swal.showValidationMessage('Please select at least one chart to send.');
          return false;
        }
        
        return selectedCharts;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.generateAndSendBase64(result.value as string[]);
      }
    });
  }

  private async generateAndSendBase64(selectedCharts: string[]): Promise<void> {
    Swal.fire({
      title: 'Generating Base64...',
      html: `
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-[#FFE1F7] border-t-[#F77FBE] rounded-full animate-spin mx-auto"></div>
          <p class="text-sm mt-4" style="color: #432338;">Converting charts to Base64...</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false
    });

    const base64Data: { [key: string]: string } = {};

    try {
      for (const chart of selectedCharts) {
        let element = null;
        
        switch(chart) {
          case 'scatter':
            element = document.querySelector('app-scatter-chart')?.closest('.bg-white.rounded-2xl');
            break;
          case 'bar':
            element = document.querySelector('app-bar-chart')?.closest('.bg-white.rounded-2xl');
            break;
          case 'donuts1':
            element = document.querySelectorAll('.bg-white.rounded-2xl')[2];
            break;
          case 'donuts2':
            element = document.querySelectorAll('.bg-white.rounded-2xl')[3];
            break;
        }

        if (element) {
          const canvas = await html2canvas(element as HTMLElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
          });
          base64Data[chart] = canvas.toDataURL('image/png');
        }
      }

      Swal.close();
      console.log('Base64 data generated:', Object.keys(base64Data));

      const payload = {
        timestamp: new Date().toISOString(),
        customerName: 'Customer Name',
        survey: 'Q4 2024 Team Survey',
        charts: base64Data
      };

      Swal.fire({
        title: 'Base64 Generated!',
        html: `
          <div class="text-left space-y-4">
            <p class="text-sm" style="color: #432338;">Successfully generated Base64 for ${selectedCharts.length} chart(s).</p>
            <div class="space-y-2">
              ${selectedCharts.map(chart => `
                <div class="p-3 rounded-lg bg-[#FFFAFD] border border-[#F77FBE]/30">
                  <div class="text-xs font-semibold" style="color: #371A2D;">${this.getChartDisplayName(chart)}</div>
                  <div class="text-xs mt-1 text-gray-500">${base64Data[chart]?.length.toLocaleString()} chars</div>
                </div>
              `).join('')}
            </div>
          </div>
        `,
        confirmButtonText: 'Close',
        confirmButtonColor: '#F77FBE'
      });

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to generate Base64 data.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F77FBE'
      });
    }
  }

  private getChartDisplayName(chart: string): string {
    const names: { [key: string]: string } = {
      'scatter': 'Team Performance Matrix',
      'bar': 'Dimension Scores',
      'donuts1': 'Core Engagement Drivers',
      'donuts2': 'Growth & Trust Indicators'
    };
    return names[chart] || chart;
  }

  exportAllCharts(): void {
    const selectedCharts = Object.keys(this.exportOptions).filter(key => this.exportOptions[key as keyof ExportOptions]) as string[];
    
    if (selectedCharts.length === 0) {
      Swal.fire({
        title: 'No Charts Selected',
        text: 'Please select at least one chart to export.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F77FBE'
      });
      return;
    }

    Swal.fire({
      title: 'Export Charts as PNG',
      html: `
        <div class="text-left space-y-4">
          <p class="text-sm" style="color: #432338;">Select charts to export:</p>
          <div class="space-y-2">
            <label class="flex items-center space-x-3">
              <input type="checkbox" id="scatter-checkbox" ${this.exportOptions.scatter ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Team Performance Matrix</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" id="bar-checkbox" ${this.exportOptions.bar ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Dimension Scores</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" id="donuts1-checkbox" ${this.exportOptions.donuts1 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Core Engagement Drivers</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="checkbox" id="donuts2-checkbox" ${this.exportOptions.donuts2 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE]">
              <span class="text-sm">Growth & Trust Indicators</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Export Selected',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#F77FBE',
      preConfirm: () => {
        this.exportOptions.scatter = (document.getElementById('scatter-checkbox') as HTMLInputElement)?.checked || false;
        this.exportOptions.bar = (document.getElementById('bar-checkbox') as HTMLInputElement)?.checked || false;
        this.exportOptions.donuts1 = (document.getElementById('donuts1-checkbox') as HTMLInputElement)?.checked || false;
        this.exportOptions.donuts2 = (document.getElementById('donuts2-checkbox') as HTMLInputElement)?.checked || false;

        const selectedCharts = Object.keys(this.exportOptions).filter(key => this.exportOptions[key as keyof ExportOptions]) as string[];
        
        if (selectedCharts.length === 0) {
          Swal.showValidationMessage('Please select at least one chart to export.');
          return false;
        }
        
        return selectedCharts;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.startExportProcess(result.value as string[]);
      }
    });
  }

  private startExportProcess(selectedCharts: string[]): void {
    const chartNames: { [key: string]: string } = {
      'scatter': 'team-performance-matrix',
      'bar': 'dimension-scores',
      'donuts1': 'core-engagement-drivers',
      'donuts2': 'growth-trust-indicators'
    };

    const total = selectedCharts.length;
    let completed = 0;

    Swal.fire({
      title: `Exporting ${total} Chart${total > 1 ? 's' : ''}`,
      html: `
        <div class="space-y-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div id="export-progress" class="bg-[#F77FBE] h-2 rounded-full" style="width: 0%"></div>
          </div>
          <div class="space-y-2 text-sm" style="color: #432338;">
            ${selectedCharts.map(chart => `
              <div class="flex justify-between items-center">
                <span>${this.getChartDisplayName(chart)}</span>
                <span id="status-${chart}" class="text-xs">⏳ Waiting</span>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false
    });

    selectedCharts.forEach((chart, index) => {
      setTimeout(async () => {
        try {
          await this.exportChart(chart, chartNames[chart]);
          completed++;
          const statusElement = document.getElementById(`status-${chart}`);
          if (statusElement) statusElement.textContent = '✅ Exported';
          const progressElement = document.getElementById('export-progress');
          if (progressElement) progressElement.style.width = `${(completed / total) * 100}%`;
          
          if (completed === total) {
            setTimeout(() => {
              Swal.close();
              this.showExportSuccess(selectedCharts);
            }, 500);
          }
        } catch (error) {
          console.error(`Export failed for ${chart}:`, error);
          const statusElement = document.getElementById(`status-${chart}`);
          if (statusElement) statusElement.textContent = '❌ Failed';
          completed++;
        }
      }, index * 800);
    });
  }

  private exportChart(chart: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let element = null;
      
      switch(chart) {
        case 'scatter':
          element = document.querySelector('app-scatter-chart')?.closest('.bg-white.rounded-2xl');
          break;
        case 'bar':
          element = document.querySelector('app-bar-chart')?.closest('.bg-white.rounded-2xl');
          break;
        case 'donuts1':
          element = document.querySelectorAll('.bg-white.rounded-2xl')[2];
          break;
        case 'donuts2':
          element = document.querySelectorAll('.bg-white.rounded-2xl')[3];
          break;
      }

      if (!element) {
        reject(new Error('Element not found'));
        return;
      }

      html2canvas(element as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      }).then(canvas => {
        this.downloadImage(canvas, filename);
        resolve();
      }).catch(reject);
    });
  }

  private downloadImage(canvas: HTMLCanvasElement, filename: string): void {
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
    link.download = `survey-dashboard-${filename}-${date}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private showExportSuccess(selectedCharts: string[]): void {
    const dateStr = new Date().toISOString().slice(0,10);
    
    Swal.fire({
      title: 'Export Complete!',
      html: `
        <div class="text-center space-y-4">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold" style="color: #371A2D;">${selectedCharts.length} File${selectedCharts.length > 1 ? 's' : ''} Downloaded</h3>
          </div>
          <div class="text-left space-y-2">
            ${selectedCharts.map((chart, i) => `
              <div class="flex items-center space-x-3 p-2">
                <div class="h-8 w-8 rounded-full bg-[#FFE1F7] flex items-center justify-center">
                  <span class="text-xs font-bold" style="color: #F77FBE;">${i + 1}</span>
                </div>
                <div class="text-sm" style="color: #432338;">
                  ${this.getChartDisplayName(chart)}-${dateStr}.png
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#F77FBE'
    });
  }
}