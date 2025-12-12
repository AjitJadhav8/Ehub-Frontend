import { AfterViewInit, Component, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.css'
})
export class DonutChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input() dimensionData: any = null;
  @Input() index: number = 0;
  
  private myChart: any = null;

  // Color palette
  private readonly colors = [
    '#5070dd', '#b6d634', '#ff994d', '#fb628b',
    '#0ca8df', '#ffd10a', '#785db0', '#3fbe95', '#ff6b6b'
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initChart();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dimensionData'] && this.myChart) {
      this.initChart();
    }
  }

  private initChart(): void {
    if (!this.chartContainer?.nativeElement || !this.dimensionData) return;

    if (this.myChart) {
      this.myChart.dispose();
    }

    this.myChart = echarts.init(this.chartContainer.nativeElement);
    const container = this.chartContainer.nativeElement;
    container.style.padding = '0';
    container.style.margin = '0';
    container.style.height = '100%';
    container.style.width = '100%';

    const color = this.colors[this.index % this.colors.length];
    const data = this.dimensionData.value || 0;

    const option = {
      backgroundColor: 'transparent',
      tooltip: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['50%', '75%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: '{c}%',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#371A2D',
            fontFamily: 'Poppins'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#371A2D'
            }
          },
          labelLine: { show: false },
          data: [
            { value: data, name: 'Score', itemStyle: { color: color } },
            { value: 100 - data, name: 'Remaining', itemStyle: { color: '#FFE1F7' } }
          ]
        }
      ]
    };

    this.myChart.setOption(option);
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