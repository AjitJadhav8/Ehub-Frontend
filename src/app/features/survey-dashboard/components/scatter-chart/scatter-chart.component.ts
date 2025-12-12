import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';

@Component({
  selector: 'app-scatter-chart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './scatter-chart.component.html',
  styleUrl: './scatter-chart.component.css'
})
export class ScatterChartComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Output() pointClick = new EventEmitter<any>();

  private myChart: any = null;

  // Your actual data
  private readonly data = [
    { label: 'Person 1', x: 25, y: 29.375 },
    { label: 'Person 2', x: 36, y: 40 },
    { label: 'Person 3', x: 29.5, y: 27.5 },
    { label: 'Person 4', x: 26.5, y: 36.875 },
    { label: 'Person 5', x: 26, y: 31.875 },
    { label: 'Person 6', x: 27.5, y: 29.375 },
    { label: 'Person 7', x: 27.5, y: 22.5 },
    { label: 'Person 8', x: 24.5, y: 31.25 },
    { label: 'Person 9', x: 23.5, y: 30.625 },
    { label: 'Person 10', x: 25, y: 22.5 },
    { label: 'Person 11', x: 39, y: 33.75 },
    { label: 'Person 12', x: 30, y: 38.75 },
    { label: 'Person 13', x: 40.5, y: 31.875 },
    { label: 'Person 14', x: 30, y: 30 },
    { label: 'Person 15', x: 29.5, y: 26.875 },
    { label: 'Person 16', x: 33, y: 20.625 },
    { label: 'Person 17', x: 18.5, y: 40.625 },
    { label: 'Person 18', x: 27, y: 30.625 },
    { label: 'Person 19', x: 30.5, y: 28.125 },
    { label: 'Person 20', x: 28.5, y: 42.5 },
    { label: 'Person 21', x: 67, y: 80.625 },
    { label: 'Person 22', x: 75.5, y: 61.25 },
    { label: 'Person 23', x: 72.5, y: 51.875 },
    { label: 'Person 24', x: 68.5, y: 67.5 },
    { label: 'Person 25', x: 73.5, y: 78.125 },
    { label: 'Person 26', x: 77, y: 83.125 },
    { label: 'Person 27', x: 70.5, y: 68.125 },
    { label: 'Person 28', x: 75, y: 63.125 },
    { label: 'Person 29', x: 71.5, y: 65.625 },
    { label: 'Person 30', x: 79.5, y: 76.25 },
    { label: 'Person 31', x: 70.5, y: 68.125 },
    { label: 'Person 32', x: 70, y: 75.625 },
    { label: 'Person 33', x: 78.5, y: 80 },
    { label: 'Person 34', x: 62.5, y: 59.375 },
    { label: 'Person 35', x: 64, y: 63.75 },
    { label: 'Person 36', x: 78.5, y: 69.375 },
    { label: 'Person 37', x: 76.5, y: 75.625 },
    { label: 'Person 38', x: 70, y: 69.375 },
    { label: 'Person 39', x: 78, y: 80 },
    { label: 'Person 40', x: 72, y: 71.25 },
    { label: 'Person 41', x: 42.5, y: 50 },
    { label: 'Person 42', x: 54.5, y: 50 },
    { label: 'Person 43', x: 35, y: 36.875 },
    { label: 'Person 44', x: 47, y: 40.625 },
    { label: 'Person 45', x: 45.5, y: 48.125 },
    { label: 'Person 46', x: 42.5, y: 57.5 },
    { label: 'Person 47', x: 50, y: 50 },
    { label: 'Person 48', x: 53, y: 51.875 },
    { label: 'Person 49', x: 36.5, y: 48.125 },
    { label: 'Person 50', x: 51.5, y: 40.625 },
    { label: 'Person 51', x: 47, y: 53.75 },
    { label: 'Person 52', x: 62, y: 57.5 },
    { label: 'Person 53', x: 50, y: 46.25 },
    { label: 'Person 54', x: 50, y: 51.875 },
    { label: 'Person 55', x: 53, y: 53.75 },
    { label: 'Person 56', x: 53, y: 40.625 },
    { label: 'Person 57', x: 50, y: 42.5 },
    { label: 'Person 58', x: 48.5, y: 46.25 },
    { label: 'Person 59', x: 42.5, y: 48.125 },
    { label: 'Person 60', x: 44, y: 59.375 },
    { label: 'Person 61', x: 48.5, y: 48.125 },
    { label: 'Person 62', x: 41, y: 50 },
    { label: 'Person 63', x: 50, y: 50 },
    { label: 'Person 64', x: 47, y: 48.125 },
    { label: 'Person 65', x: 51.5, y: 50 },
    { label: 'Person 66', x: 45.5, y: 51.875 },
    { label: 'Person 67', x: 47, y: 42.5 },
    { label: 'Person 68', x: 50, y: 68.75 },
    { label: 'Person 69', x: 53, y: 48.125 },
    { label: 'Person 70', x: 39.5, y: 51.875 },
    { label: 'Person 71', x: 62, y: 40.625 },
    { label: 'Person 72', x: 36.5, y: 46.25 }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initChart();
    }, 0);
  }

  private getQuadrantColor(x: number, y: number): string {
    if (x >= 50 && y >= 50) {
      return '#81C784'; // Green - Optimal
    } else if (x >= 50 && y < 50) {
      return '#64B5F6'; // Blue - High Drive
    } else if (x < 50 && y >= 50) {
      return '#E57373'; // Red - Safe
    } else {
      return '#F77FBE'; // Pink - At Risk
    }
  }

  private getQuadrantName(x: number, y: number): string {
    if (x >= 50 && y >= 50) return 'Optimal';
    else if (x >= 50 && y < 50) return 'High Drive';
    else if (x < 50 && y >= 50) return 'Safe';
    else return 'At Risk';
  }

//   private initChart(): void {
//     if (!this.chartContainer?.nativeElement) return;

//     if (this.myChart) {
//       this.myChart.dispose();
//     }

//     this.myChart = echarts.init(this.chartContainer.nativeElement);

//     // Get container dimensions for square chart
//     const container = this.chartContainer.nativeElement;
//     const size = Math.min(container.clientWidth, container.clientHeight);
    
//     // Prepare data points
//     const dataPoints = this.data.map(item => ({
//       name: item.label,
//       value: [item.x, item.y],
//       itemStyle: {
//         color: this.getQuadrantColor(item.x, item.y)
//       }
//     }));

//     const option = {
//       backgroundColor: 'transparent',

//       graphic: [
//   // Comfort Zone (Top-Left)
//   {
//     type: 'text',
//     left: '22%',   // inside grid, left quadrant center
//     top: '20%',
//     style: {
//       text: 'Comfort Zone',
//       fontSize: 14,
//       fontWeight: 'bold',
//       fill: '#432338'
//     }
//   },

//   // Learning Zone (Top-Right)
//   {
//     type: 'text',
//     left: '65%',   // inside grid, right quadrant center
//     top: '20%',
//     style: {
//       text: 'Learning Zone',
//       fontSize: 14,
//       fontWeight: 'bold',
//       fill: '#432338'
//     }
//   },

//   // Apathy Zone (Bottom-Left)
//   {
//     type: 'text',
//     left: '22%',
//     top: '65%',
//     style: {
//       text: 'Apathy Zone',
//       fontSize: 14,
//       fontWeight: 'bold',
//       fill: '#432338'
//     }
//   },

//   // Anxiety Zone (Bottom-Right)
//   {
//     type: 'text',
//     left: '65%',
//     top: '65%',
//     style: {
//       text: 'Anxiety Zone',
//       fontSize: 14,
//       fontWeight: 'bold',
//       fill: '#432338'
//     }
//   }
// ],


//       grid: {
//         left: '10%',
//         right: '5%',
//         bottom: '15%',
//         top: '10%',
//         containLabel: true
//       },
//       tooltip: {
//         trigger: 'item',
//         formatter: (params: any) => {
//           const data = params.data;
//           const x = data.value[0];
//           const y = data.value[1];
//           const quadrant = this.getQuadrantName(x, y);
          
//           return `
//             <div style="font-weight: bold;">${data.name}</div>
//             <div>Motivational Driver: <b>${x.toFixed(1)}</b></div>
//             <div>Psychological Safety: <b>${y.toFixed(1)}</b></div>
//             <div>Quadrant: <b>${quadrant}</b></div>
//           `;
//         },
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         borderColor: '#F77FBE',
//         borderWidth: 1,
//         textStyle: {
//           color: '#432338'
//         },
//         extraCssText: 'border-radius: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);'
//       },
//       xAxis: {
//         name: 'Motivational Driver',
//         nameLocation: 'middle',
//         nameGap: 25,
//         nameTextStyle: {
//           fontSize: 12,
//           color: '#432338',
//           fontWeight: 'bold'
//         },
//         type: 'value',
//         min: 0,
//         max: 100,
//         interval: 10,
//         axisLine: {
//           lineStyle: {
//             color: '#F77FBE',
//             width: 1.5
//           }
//         },
//         axisLabel: {
//           color: '#432338',
//           fontSize: 10,
//           formatter: '{value}'
//         },
//         axisTick: {
//           show: true,
//           interval: 10,
//           length: 4
//         },
//         splitLine: {
//           show: true,
//           lineStyle: {
//             color: '#FFE1F7',
//             type: 'dashed',
//             width: 0.5
//           }
//         }
//       },
//       yAxis: {
//         name: 'Psychological Safety',
//         nameLocation: 'middle',
//         nameGap: 30,
//         nameTextStyle: {
//           fontSize: 12,
//           color: '#432338',
//           fontWeight: 'bold'
//         },
//         type: 'value',
//         min: 0,
//         max: 100,
//         interval: 10,
//         axisLine: {
//           lineStyle: {
//             color: '#F77FBE',
//             width: 1.5
//           }
//         },
//         axisLabel: {
//           color: '#432338',
//           fontSize: 10,
//           formatter: '{value}'
//         },
//         axisTick: {
//           show: true,
//           interval: 10,
//           length: 4
//         },
//         splitLine: {
//           show: true,
//           lineStyle: {
//             color: '#FFE1F7',
//             type: 'dashed',
//             width: 0.5
//           }
//         }
//       },
//       series: [
//   {
//     type: 'scatter',
//     data: dataPoints,
//     symbolSize: 8,

//     // ✅ Correct axis-based center lines
//   markLine: {
//   silent: true,
//   symbol: 'none',

//   label: {
//     show: false   // ✅ This hides the 50 - 50 text
//   },

//   lineStyle: {
//     color: '#432338',
//     type: 'dashed',
//     width: 1
//   },

//   data: [
//     { xAxis: 50 }, // Vertical center line
//     { yAxis: 50 }  // Horizontal center line
//   ]
// },


//     emphasis: {
//       scale: true,
//       scaleSize: 12,
//       itemStyle: {
//         shadowBlur: 8,
//         shadowColor: 'rgba(0, 0, 0, 0.2)'
//       }
//     }
//   }
// ]

//     };

//     this.myChart.setOption(option);

//     // Handle click events
//     this.myChart.on('click', (params: any) => {
//       if (params.componentType === 'series' && params.seriesType === 'scatter') {
//         const data = params.data;
//         const pointData = {
//           label: data.name,
//           x: data.value[0],
//           y: data.value[1],
//           quadrant: this.getQuadrantName(data.value[0], data.value[1])
//         };
//         this.pointClick.emit(pointData);
//       }
//     });

//     // Handle resize
//     window.addEventListener('resize', () => {
//       this.resizeChart();
//     });
//   }
private initChart(): void {
  if (!this.chartContainer?.nativeElement) return;

  if (this.myChart) {
    this.myChart.dispose();
  }

  this.myChart = echarts.init(this.chartContainer.nativeElement);
  const container = this.chartContainer.nativeElement;
  container.style.padding = '0';
  container.style.margin = '0';

  const dataPoints = this.data.map(item => ({
    name: item.label,
    value: [item.x, item.y],
    itemStyle: {
      color: this.getQuadrantColor(item.x, item.y)
    }
  }));

  const option = {
    backgroundColor: 'transparent',
    graphic: [
      {
        type: 'text', left: '22%', top: '20%',
        style: { text: 'Comfort Zone', fontSize: 14, fontWeight: 'bold', fill: '#432338' }
      },
      {
        type: 'text', left: '65%', top: '20%',
        style: { text: 'Learning Zone', fontSize: 14, fontWeight: 'bold', fill: '#432338' }
      },
      {
        type: 'text', left: '22%', top: '65%',
        style: { text: 'Apathy Zone', fontSize: 14, fontWeight: 'bold', fill: '#432338' }
      },
      {
        type: 'text', left: '65%', top: '65%',
        style: { text: 'Anxiety Zone', fontSize: 14, fontWeight: 'bold', fill: '#432338' }
      }
    ],
    grid: { left: '5%', right: '5%', bottom: '5%', top: '5%', containLabel: false },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data;
        const x = data.value[0];
        const y = data.value[1];
        const quadrant = this.getQuadrantName(x, y);
        return `<div style="font-weight: bold; color: #371A2D;">${data.name}</div>
                <div style="color: #432338;">Motivational Driver: <b>${x.toFixed(1)}</b></div>
                <div style="color: #432338;">Psychological Safety: <b>${y.toFixed(1)}</b></div>
                <div style="color: #432338;">Quadrant: <b>${quadrant}</b></div>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#F77FBE', borderWidth: 2,
      textStyle: { color: '#432338' },
      padding: [8, 12],
      extraCssText: 'border-radius: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);'
    },
    xAxis: {
      name: 'Motivational Driver', nameLocation: 'middle', nameGap: 35,
      nameTextStyle: { fontSize: 12, color: '#371A2D', fontWeight: 'bold', fontFamily: 'Poppins' },
      type: 'value', min: 0, max: 100, interval: 10,
      axisLine: { lineStyle: { color: '#F77FBE', width: 2 } },
      axisLabel: { color: '#432338', fontSize: 11, formatter: '{value}', fontFamily: 'Poppins' },
      axisTick: { show: true, interval: 10, length: 5, lineStyle: { color: '#F77FBE' } },
      splitLine: { show: true, lineStyle: { color: '#FFE1F7', type: 'dashed', width: 1 } }
    },
    yAxis: {
      name: 'Psychological Safety', nameLocation: 'middle', nameGap: 45,
      nameTextStyle: { fontSize: 12, color: '#371A2D', fontWeight: 'bold', fontFamily: 'Poppins' },
      type: 'value', min: 0, max: 100, interval: 10,
      axisLine: { lineStyle: { color: '#F77FBE', width: 2 } },
      axisLabel: { color: '#432338', fontSize: 11, formatter: '{value}', fontFamily: 'Poppins' },
      axisTick: { show: true, interval: 10, length: 5, lineStyle: { color: '#F77FBE' } },
      splitLine: { show: true, lineStyle: { color: '#FFE1F7', type: 'dashed', width: 1 } }
    },
    series: [{
      type: 'scatter', data: dataPoints, symbolSize: 8,
      markLine: {
        silent: true, symbol: 'none',
        label: { show: false },
        lineStyle: { color: '#432338', type: 'dashed', width: 1 },
        data: [{ xAxis: 50 }, { yAxis: 50 }]
      },
      emphasis: {
        scale: true, scaleSize: 12,
        itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0, 0, 0, 0.2)' }
      }
    }]
  };

  this.myChart.setOption(option);

  this.myChart.on('click', (params: any) => {
    if (params.componentType === 'series' && params.seriesType === 'scatter') {
      const data = params.data;
      this.pointClick.emit({
        label: data.name,
        x: data.value[0],
        y: data.value[1],
        quadrant: this.getQuadrantName(data.value[0], data.value[1])
      });
    }
  });

  window.addEventListener('resize', () => { this.resizeChart(); });
  setTimeout(() => { this.myChart.resize(); }, 0);
}
  resizeChart(): void {
    if (this.myChart) {
      this.myChart.resize();
    }
  }

  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.dispose();
      window.removeEventListener('resize', () => {});
    }
  }
}