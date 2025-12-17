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
    const displayData = [...chartData];

    const option = {
      backgroundColor: 'transparent',
      grid: { left: '10%', right: '5%', bottom: '5%', top: '5%', containLabel: false },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const d = params[0];
          return `<div style="font-weight:bold;color:#371A2D;">${d.name}</div>
                  <div style="color:#432338;">Score: <b>${d.value}</b></div>`;
        },
        backgroundColor: 'rgba(255,255,255,0.95)',
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
        axisLabel: {
          color: '#432338',
          fontSize: 10,
          formatter: '{value}',   // ❌ removed %
          fontFamily: 'Poppins'
        },
        axisLine: { lineStyle: { color: '#F77FBE', width: 1.5 } },
        splitLine: { show: true, lineStyle: { color: '#FFE1F7', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: displayData.map(i => i.name),
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
          formatter: '{c}',   // ❌ removed %
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
    if (value >= 80) return '#22c55e'; // green
    if (value >= 60) return '#facc15'; // yellow
    return '#ef4444';                  // red
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

