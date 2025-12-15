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

  // Export options with default selections
  exportOptions = {
    scatter: true,
    bar: true,
    donuts1: true,
    donuts2: true
  };

  constructor(private http: HttpClient) {}

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

  // Send charts to backend
  sendToBackend(): void {
    Swal.fire({
      title: 'Send Charts to Backend',
      html: `
        <div class="text-left" style="color: #432338;">
          <p class="mb-4 text-sm">Select charts to send to backend:</p>
          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-scatter-checkbox" ${this.exportOptions.scatter ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Scatter Chart (Team Performance Matrix)</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-bar-checkbox" ${this.exportOptions.bar ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Bar Chart (Dimension Scores)</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-donuts1-checkbox" ${this.exportOptions.donuts1 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Donut Charts 1-5</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="send-donuts2-checkbox" ${this.exportOptions.donuts2 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Donut Charts 6-9</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Generate & Send',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#F77FBE',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl',
        htmlContainer: 'text-left'
      },
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
        <div class="mb-4">
          <div class="w-12 h-12 border-4 border-[#FFE1F7] border-t-[#F77FBE] rounded-full animate-spin mx-auto"></div>
        </div>
        <p class="text-sm" style="color: #432338;">Converting charts to Base64...</p>
      </div>
    `,
    allowOutsideClick: false,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-xl'
    }
  });

  const base64Data: { [key: string]: string } = {};
  const dateStr = new Date().toISOString().slice(0,10);

  try {
    // Generate Base64 for each selected chart
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
          element = document.querySelector('.grid-cols-5')?.parentElement;
          break;
        case 'donuts2':
          element = document.querySelector('.grid-cols-4')?.parentElement;
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

    // Close loading dialog
    Swal.close();

    // Display FULL Base64 data in console for testing
    console.log('=== FULL BASE64 DATA FOR TESTING ===');
    console.log('Date:', dateStr);
    console.log('Total charts converted:', selectedCharts.length);
    
    selectedCharts.forEach(chart => {
      const base64 = base64Data[chart];
      console.log(`\n--- ${chart.toUpperCase()} CHART FULL BASE64 ---`);
      console.log(base64); // Full Base64 string
      console.log(`Base64 length: ${base64.length} characters`);
    });

    // Create a test object to send to backend
    const payload = {
      timestamp: new Date().toISOString(),
      customerName: 'Customer Name',
      survey: 'Q4 2024 Team Survey',
      charts: base64Data
    };

    // Show success message with Base64 preview
    Swal.fire({
      title: 'Base64 Generated Successfully!',
      html: `
        <div class="text-left" style="color: #432338;">
          <p class="mb-3 text-sm">Base64 data has been generated for ${selectedCharts.length} chart(s).</p>
          <div class="mb-4">
            <p class="text-xs font-semibold mb-1">FULL Base64 data logged to browser console.</p>
            <p class="text-xs text-gray-500">(Press F12 and go to Console tab to see full Base64)</p>
          </div>
          <div class="space-y-2">
            ${selectedCharts.map(chart => `
              <div class="p-2 bg-[#FFE1F7]/30 rounded">
                <div class="text-xs font-semibold" style="color: #371A2D;">${this.getChartDisplayName(chart)}</div>
                <div class="text-xs mt-1 truncate">${base64Data[chart]?.substring(0, 60)}...</div>
                <div class="text-xs text-gray-500 mt-1">Length: ${base64Data[chart]?.length} chars</div>
              </div>
            `).join('')}
          </div>
          <div class="mt-4 pt-4 border-t border-[#FFE1F7]">
            <button id="copy-test-btn" class="text-xs px-3 py-1.5 rounded border border-[#F77FBE] text-[#F77FBE] hover:bg-[#FFE1F7] transition-colors">
              Copy Full Base64
            </button>
            <button id="send-backend-btn" class="text-xs px-3 py-1.5 rounded bg-[#F77FBE] text-white hover:opacity-90 transition-colors ml-2">
              Send to Backend
            </button>
          </div>
        </div>
      `,
      confirmButtonText: 'Close',
      cancelButtonText: '',
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonColor: '#F77FBE',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl',
        htmlContainer: 'text-left'
      },
      didOpen: () => {
        // Copy FULL Base64 button
        document.getElementById('copy-test-btn')?.addEventListener('click', () => {
          const firstChart = selectedCharts[0];
          const fullBase64 = base64Data[firstChart] || '';
          navigator.clipboard.writeText(fullBase64)
            .then(() => {
              Swal.fire({
                title: 'Copied!',
                text: `Full Base64 for ${this.getChartDisplayName(firstChart)} copied to clipboard.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            })
            .catch(err => {
              console.error('Failed to copy:', err);
              Swal.fire({
                title: 'Error',
                text: 'Failed to copy Base64 to clipboard.',
                icon: 'error',
                timer: 2000
              });
            });
        });

        // Send to backend button
        document.getElementById('send-backend-btn')?.addEventListener('click', () => {
          this.sendToBackendAPI(payload);
        });
      }
    });

  } catch (error) {
    console.error('Error generating Base64:', error);
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
    switch(chart) {
      case 'scatter': return 'Scatter Chart';
      case 'bar': return 'Bar Chart';
      case 'donuts1': return 'Donut Charts 1-5';
      case 'donuts2': return 'Donut Charts 6-9';
      default: return chart;
    }
  }

private sendToBackendAPI(payload: any): void {
  // Replace with your actual backend API endpoint
  const backendUrl = 'https://your-backend-api.com/api/charts/upload';
  
  Swal.fire({
    title: 'Sending to Backend...',
    html: `
      <div class="text-center">
        <div class="mb-4">
          <div class="w-12 h-12 border-4 border-[#FFE1F7] border-t-[#F77FBE] rounded-full animate-spin mx-auto"></div>
        </div>
        <p class="text-sm" style="color: #432338;">Uploading chart data to backend...</p>
      </div>
    `,
    allowOutsideClick: false,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-xl'
    }
  });

  // For testing - log FULL Base64 to console
  setTimeout(() => {
    Swal.close();
    
    console.log('=== FULL BACKEND PAYLOAD BASE64 DATA ===');
    console.log('Timestamp:', payload.timestamp);
    console.log('Customer:', payload.customerName);
    console.log('Survey:', payload.survey);
    console.log('Number of charts:', Object.keys(payload.charts).length);
    
    // Log FULL Base64 for each chart
    Object.keys(payload.charts).forEach(chart => {
      console.log(`\n--- FULL ${chart.toUpperCase()} Base64 ---`);
      console.log(payload.charts[chart]); // FULL Base64
      console.log(`Length: ${payload.charts[chart].length} characters`);
    });
    
    // Also log the complete payload
    console.log('\n=== COMPLETE PAYLOAD STRUCTURE ===');
    console.log(JSON.stringify({
      timestamp: payload.timestamp,
      customerName: payload.customerName,
      survey: payload.survey,
      chartsCount: Object.keys(payload.charts).length
    }, null, 2));
    
    Swal.fire({
      title: 'Full Base64 Logged to Console!',
      html: `
        <div class="text-left" style="color: #432338;">
          <p class="mb-3 text-sm">Full Base64 data for all selected charts has been logged to console.</p>
          <div class="p-3 bg-[#FFE1F7]/30 rounded text-xs">
            <div><strong>Timestamp:</strong> ${payload.timestamp}</div>
            <div><strong>Customer:</strong> ${payload.customerName}</div>
            <div><strong>Survey:</strong> ${payload.survey}</div>
            <div><strong>Charts:</strong> ${Object.keys(payload.charts).join(', ')}</div>
            <div><strong>Total Base64 size:</strong> ${JSON.stringify(payload.charts).length} characters</div>
          </div>
          <div class="mt-3 text-xs space-y-1">
            <p><strong>To test Base64:</strong></p>
            <ol class="list-decimal pl-4">
              <li>Open browser console (F12)</li>
              <li>Find the FULL Base64 string</li>
              <li>Copy the entire string</li>
              <li>Go to https://codebeautify.org/base64-to-image-converter</li>
              <li>Paste and convert to verify image</li>
            </ol>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#F77FBE',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }, 2000);
}

  // Export all charts as separate images with checkboxes
  exportAllCharts(): void {
    const selectedCharts = Object.keys(this.exportOptions).filter(key => this.exportOptions[key as keyof typeof this.exportOptions]);
    
    if (selectedCharts.length === 0) {
      Swal.fire({
        title: 'No Charts Selected',
        text: 'Please select at least one chart to export.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F77FBE',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-xl'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Export Charts',
      html: `
        <div class="text-left" style="color: #432338;">
          <p class="mb-4 text-sm">Select charts to export:</p>
          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="scatter-checkbox" ${this.exportOptions.scatter ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Scatter Chart (Team Performance Matrix)</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="bar-checkbox" ${this.exportOptions.bar ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Bar Chart (Dimension Scores)</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="donuts1-checkbox" ${this.exportOptions.donuts1 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Donut Charts 1-5</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="donuts2-checkbox" ${this.exportOptions.donuts2 ? 'checked' : ''} 
                class="rounded border-[#F77FBE] text-[#F77FBE] focus:ring-[#F77FBE]">
              <span class="text-sm">Donut Charts 6-9</span>
            </label>
          </div>
          <div class="mt-6 pt-4 border-t border-[#FFE1F7]">
            <button id="select-all-btn" class="text-xs px-3 py-1.5 rounded border border-[#F77FBE] text-[#F77FBE] hover:bg-[#FFE1F7] transition-colors">
              Select All
            </button>
            <button id="deselect-all-btn" class="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors ml-2">
              Deselect All
            </button>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Export Selected',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#F77FBE',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl',
        htmlContainer: 'text-left'
      },
      didOpen: () => {
        // Select All button
        document.getElementById('select-all-btn')?.addEventListener('click', () => {
          ['scatter-checkbox', 'bar-checkbox', 'donuts1-checkbox', 'donuts2-checkbox'].forEach(id => {
            const checkbox = document.getElementById(id) as HTMLInputElement;
            if (checkbox) checkbox.checked = true;
          });
        });

        // Deselect All button
        document.getElementById('deselect-all-btn')?.addEventListener('click', () => {
          ['scatter-checkbox', 'bar-checkbox', 'donuts1-checkbox', 'donuts2-checkbox'].forEach(id => {
            const checkbox = document.getElementById(id) as HTMLInputElement;
            if (checkbox) checkbox.checked = false;
          });
        });
      },
      preConfirm: () => {
        // Get checkbox values
        this.exportOptions.scatter = (document.getElementById('scatter-checkbox') as HTMLInputElement)?.checked || false;
        this.exportOptions.bar = (document.getElementById('bar-checkbox') as HTMLInputElement)?.checked || false;
        this.exportOptions.donuts1 = (document.getElementById('donuts1-checkbox') as HTMLInputElement)?.checked || false;
        this.exportOptions.donuts2 = (document.getElementById('donuts2-checkbox') as HTMLInputElement)?.checked || false;

        const selectedCharts = Object.keys(this.exportOptions).filter(key => this.exportOptions[key as keyof typeof this.exportOptions]);
        
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
      'scatter': 'Scatter Chart',
      'bar': 'Bar Chart',
      'donuts1': 'Donut Group 1',
      'donuts2': 'Donut Group 2'
    };

    const totalToExport = selectedCharts.length;
    let exportedCount = 0;

    Swal.fire({
      title: 'Exporting...',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="w-12 h-12 border-4 border-[#FFE1F7] border-t-[#F77FBE] rounded-full animate-spin mx-auto"></div>
          </div>
          <p class="text-sm mb-2" style="color: #432338;">Exporting ${totalToExport} of ${totalToExport} charts...</p>
          <div class="mt-4 space-y-1 text-xs" style="color: #432338;">
            ${selectedCharts.map((chart, index) => `
              <div>${index + 1}. ${chartNames[chart]} <span class="float-right" id="export-status-${chart}">⏳</span></div>
            `).join('')}
          </div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl'
      }
    });

    // Export selected charts in sequence
    selectedCharts.forEach((chart, index) => {
      setTimeout(() => {
        switch(chart) {
          case 'scatter':
            this.exportScatterChart().then(() => {
              exportedCount++;
              if (exportedCount === totalToExport) {
                setTimeout(() => {
                  Swal.close();
                  this.showExportSuccess(selectedCharts);
                }, 500);
              }
            });
            break;
          case 'bar':
            this.exportBarChart().then(() => {
              exportedCount++;
              if (exportedCount === totalToExport) {
                setTimeout(() => {
                  Swal.close();
                  this.showExportSuccess(selectedCharts);
                }, 500);
              }
            });
            break;
          case 'donuts1':
            this.exportDonutGroup1().then(() => {
              exportedCount++;
              if (exportedCount === totalToExport) {
                setTimeout(() => {
                  Swal.close();
                  this.showExportSuccess(selectedCharts);
                }, 500);
              }
            });
            break;
          case 'donuts2':
            this.exportDonutGroup2().then(() => {
              exportedCount++;
              if (exportedCount === totalToExport) {
                setTimeout(() => {
                  Swal.close();
                  this.showExportSuccess(selectedCharts);
                }, 500);
              }
            });
            break;
        }
      }, index * 1000); // 1 second delay between each export
    });
  }

  private updateExportStatus(chart: string, status: string): void {
    const element = document.getElementById(`export-status-${chart}`);
    if (element) {
      element.textContent = status;
    }
  }

  private exportScatterChart(): Promise<void> {
    this.updateExportStatus('scatter', '📤');
    return new Promise((resolve) => {
      const scatterElement = document.querySelector('app-scatter-chart');
      if (scatterElement) {
        const parentContainer = scatterElement.closest('.bg-white.rounded-2xl');
        
        html2canvas(parentContainer as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        }).then(canvas => {
          this.downloadImage(canvas, 'scatter-chart');
          this.updateExportStatus('scatter', '✅');
          resolve();
        }).catch(error => {
          console.error('Scatter chart export error:', error);
          this.updateExportStatus('scatter', '❌');
          resolve();
        });
      } else {
        this.updateExportStatus('scatter', '❌');
        resolve();
      }
    });
  }

  private exportBarChart(): Promise<void> {
    this.updateExportStatus('bar', '📤');
    return new Promise((resolve) => {
      const barElement = document.querySelector('app-bar-chart');
      if (barElement) {
        const parentContainer = barElement.closest('.bg-white.rounded-2xl');
        
        html2canvas(parentContainer as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        }).then(canvas => {
          this.downloadImage(canvas, 'bar-chart');
          this.updateExportStatus('bar', '✅');
          resolve();
        }).catch(error => {
          console.error('Bar chart export error:', error);
          this.updateExportStatus('bar', '❌');
          resolve();
        });
      } else {
        this.updateExportStatus('bar', '❌');
        resolve();
      }
    });
  }

  private exportDonutGroup1(): Promise<void> {
    this.updateExportStatus('donuts1', '📤');
    return new Promise((resolve) => {
      const donutContainer = document.querySelector('.grid-cols-5')?.parentElement;
      if (donutContainer) {
        html2canvas(donutContainer as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        }).then(canvas => {
          this.downloadImage(canvas, 'donut-charts-1-5');
          this.updateExportStatus('donuts1', '✅');
          resolve();
        }).catch(error => {
          console.error('Donut group 1 export error:', error);
          this.updateExportStatus('donuts1', '❌');
          resolve();
        });
      } else {
        this.updateExportStatus('donuts1', '❌');
        resolve();
      }
    });
  }

  private exportDonutGroup2(): Promise<void> {
    this.updateExportStatus('donuts2', '📤');
    return new Promise((resolve) => {
      const donutContainer = document.querySelector('.grid-cols-4')?.parentElement;
      if (donutContainer) {
        html2canvas(donutContainer as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        }).then(canvas => {
          this.downloadImage(canvas, 'donut-charts-6-9');
          this.updateExportStatus('donuts2', '✅');
          resolve();
        }).catch(error => {
          console.error('Donut group 2 export error:', error);
          this.updateExportStatus('donuts2', '❌');
          resolve();
        });
      } else {
        this.updateExportStatus('donuts2', '❌');
        resolve();
      }
    });
  }

  private downloadImage(canvas: HTMLCanvasElement, filename: string): void {
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${filename}-${new Date().toISOString().slice(0,10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private showExportSuccess(selectedCharts: string[]): void {
    const chartNames: { [key: string]: string } = {
      'scatter': 'scatter-chart',
      'bar': 'bar-chart',
      'donuts1': 'donut-charts-1-5',
      'donuts2': 'donut-charts-6-9'
    };

    const dateStr = new Date().toISOString().slice(0,10);
    
    Swal.fire({
      title: 'Export Complete!',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="text-sm mb-2" style="color: #432338;">${selectedCharts.length} image file(s) have been downloaded:</p>
          <div class="text-xs space-y-1 p-3 rounded-lg bg-[#FFE1F7]/30 max-h-40 overflow-y-auto" style="color: #432338;">
            ${selectedCharts.map((chart, index) => `
              <div>${index + 1}. ${chartNames[chart]}-${dateStr}.png</div>
            `).join('')}
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#F77FBE',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }
}