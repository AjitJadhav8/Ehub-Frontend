import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input() data: any[] = [];
  @Input() title: string = 'Psychological Safety Dimensions';
  
  private myChart: any = null;

  // Default data if none provided
  private readonly defaultData = [
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initChart();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.myChart) {
      this.initChart();
    }
  }

  // private initChart(): void {
  //   if (!this.chartContainer?.nativeElement) return;

  //   if (this.myChart) {
  //     this.myChart.dispose();
  //   }

  //   this.myChart = echarts.init(this.chartContainer.nativeElement);
    
  //   // Use provided data or default data
  //   const chartData = this.data.length > 0 ? this.data : this.defaultData;
    
  //   // Sort data by value (descending)
  //   const sortedData = [...chartData].sort((a, b) => b.value - a.value);

  //   const option = {
  //     backgroundColor: 'transparent',
  //     toolbox: {
  //       show: false
  //     },
  //     title: {
  //       text: this.title,
  //       left: 'center',
  //       textStyle: {
  //         color: '#371A2D',
  //         fontSize: 16,
  //         fontWeight: 'bold'
  //       }
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'shadow'
  //       },
  //       formatter: (params: any) => {
  //         const data = params[0];
  //         return `
  //           <div style="font-weight: bold;">${data.name}</div>
  //           <div>Score: <b>${data.value}%</b></div>
  //         `;
  //       },
  //       backgroundColor: 'rgba(255, 255, 255, 0.95)',
  //       borderColor: '#F77FBE',
  //       borderWidth: 1,
  //       textStyle: {
  //         color: '#432338'
  //       }
  //     },
  //     grid: {
  //       left: '15%',
  //       right: '5%',
  //       bottom: '10%',
  //       top: '20%',
  //       containLabel: false
  //     },
  //     xAxis: {
  //       type: 'value',
  //       min: 0,
  //       max: 100,
  //       interval: 10,
  //       axisLabel: {
  //         color: '#432338',
  //         fontSize: 10,
  //         formatter: '{value}%'
  //       },
  //       axisLine: {
  //         lineStyle: {
  //           color: '#F77FBE',
  //           width: 1.5
  //         }
  //       },
  //       splitLine: {
  //         show: true,
  //         lineStyle: {
  //           color: '#FFE1F7',
  //           type: 'dashed'
  //         }
  //       }
  //     },
  //     yAxis: {
  //       type: 'category',
  //       data: sortedData.map(item => item.name),
  //       axisLabel: {
  //         color: '#432338',
  //         fontSize: 11,
  //         width: 100,
  //         overflow: 'truncate'
  //       },
  //       axisLine: {
  //         lineStyle: {
  //           color: '#F77FBE',
  //           width: 1.5
  //         }
  //       },
  //       axisTick: {
  //         show: false
  //       }
  //     },
  //     series: [
  //       {
  //         name: 'Score',
  //         type: 'bar',
  //         data: sortedData.map(item => ({
  //           name: item.name,
  //           value: item.value,
  //           itemStyle: {
  //             color: this.getBarColor(item.value)
  //           }
  //         })),
  //         label: {
  //           show: true,
  //           position: 'right',
  //           formatter: '{c}%',
  //           color: '#432338',
  //           fontSize: 10
  //         },
  //         barWidth: '60%'
  //       }
  //     ]
  //   };

  //   this.myChart.setOption(option);

  //   // Handle resize
  //   window.addEventListener('resize', () => {
  //     this.resizeChart();
  //   });
  // }
private initChart(): void {
  if (!this.chartContainer?.nativeElement) return;

  if (this.myChart) {
    this.myChart.dispose();
  }

  this.myChart = echarts.init(this.chartContainer.nativeElement);
  const container = this.chartContainer.nativeElement;
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.height = '100%';
  container.style.width = '100%';
  
  const chartData = this.data.length > 0 ? this.data : this.defaultData;
  // Keep original sequence - do NOT sort
  const displayData = [...chartData];

  const option = {
    backgroundColor: 'transparent',
    grid: { left: '10%', right: '5%', bottom: '5%', top: '5%', containLabel: false },
    tooltip: {
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const data = params[0];
        return `<div style="font-weight: bold; color: #371A2D;">${data.name}</div>
                <div style="color: #432338;">Score: <b>${data.value}%</b></div>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#F77FBE', 
      borderWidth: 2,
      textStyle: { color: '#432338' },
      padding: [8, 12]
    },
    xAxis: {
      type: 'value', 
      min: 0, 
      max: 100, 
      interval: 10,
      axisLabel: { color: '#432338', fontSize: 10, formatter: '{value}%', fontFamily: 'Poppins' },
      axisLine: { lineStyle: { color: '#F77FBE', width: 1.5 } },
      splitLine: { show: true, lineStyle: { color: '#FFE1F7', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: displayData.map(item => item.name),
      axisLabel: { 
        color: '#432338', 
        fontSize: 11, 
        width: 100, 
        overflow: 'truncate',
        fontFamily: 'Poppins'
      },
      axisLine: { lineStyle: { color: '#F77FBE', width: 1.5 } },
      axisTick: { show: false }
    },
    series: [{
      name: 'Score', 
      type: 'bar',
      data: displayData.map(item => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: this.getBarColor(item.value) }
      })),
      label: { 
        show: true, 
        position: 'right', 
        formatter: '{c}%', 
        color: '#432338', 
        fontSize: 10,
        fontFamily: 'Poppins',
        fontWeight: 'bold'
      },
      barWidth: '40%',
      itemStyle: {
        borderRadius: [0, 8, 8, 0]
      }
    }]
  };

  this.myChart.setOption(option);
  window.addEventListener('resize', () => { this.resizeChart(); });
  setTimeout(() => { this.myChart.resize(); }, 0);
}
  private getBarColor(value: number): string {
    return '#F77FBE'; // Pink accent color for all bars
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