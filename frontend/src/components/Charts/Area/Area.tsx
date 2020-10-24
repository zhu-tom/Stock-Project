import * as React from 'react';
import Chart from 'chart.js';
import { StockDataType } from '../../../types/StockTypes';
import moment from 'moment';

Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
   draw: function(ease: any) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
        const activePoint = this.chart.tooltip._active[0];
        const ctx = this.chart.ctx;
        const x = activePoint.tooltipPosition().x;
        const topY = this.chart.legend.bottom;
        const bottomY = this.chart.chartArea.bottom;

         // draw line
         ctx.save();
         ctx.beginPath();
         ctx.moveTo(x, topY);
         ctx.lineTo(x, bottomY);
         ctx.lineWidth = 2;
         ctx.strokeStyle = '#07C';
         ctx.stroke();
         ctx.restore();
      }
   }
});

const xAxisConfigs: {day: any, week: any, month: any, year: any} = {
  day: {
    type: 'time',
    time: {
        unit: 'hour',
        displayFormats: {
            hour: 'hA'
        },
        
    },
    distribution: 'linear',
    ticks: {
        source: 'auto',
        min: moment().subtract(1, "day").valueOf(),
    },
  },
  week: {
    type: 'time',
    time: {
        unit: 'day',
        displayFormats: {
            day: 'MM/DD'
        },
        
    },
    distribution: 'linear',
    ticks: {
        source: 'auto',
        min: moment().subtract(5, "days").valueOf(),
    },
  },
  month: {
    type: 'time',
    time: {
        unit: 'week',
        displayFormats: {
            week: 'MM/DD'
        },
        
    },
    distribution: 'linear',
    ticks: {
        source: 'auto',
        min: moment().subtract(1, "month").valueOf(),
    },
  },
  year: {
    type: 'time',
    time: {
        unit: 'month',
        displayFormats: {
            month: "MMM 'YY"
        },
        
    },
    distribution: 'linear',
    ticks: {
        source: 'auto',
        min: moment().subtract(1, "year").valueOf(),
    },
  }
}

type AreaChartProps = {
  label?: string, 
  data?: StockDataType[]
  range: "day" | "week" | "month" | "year"
}

class AreaChart extends React.Component<AreaChartProps, {}> {
    chartRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    myChart?: Chart;

    componentDidMount() {
      this.updateChart();
    }

    componentDidUpdate() {
      this.updateChart();
    }

    updateChart() {
      const data = this.props.data?.map(val => ({
          y: val.value || val.price,
          x: new Date(val.date! || val.datetime!),
      })).sort((a, b) => a.x.getTime() - b.x.getTime());
      
      const ctx = this.chartRef.current?.getContext("2d");

      const gradient = ctx?.createLinearGradient(0, 0, 0, 450);
      gradient?.addColorStop(0, "rgb(0, 39, 102, 1)");
      gradient?.addColorStop(1, "rgb(230, 247, 255, 0)");

      this.myChart = new Chart(ctx!, {
          type: "LineWithLine",
          options: {
              scales: {
                  xAxes: [
                      xAxisConfigs[this.props.range]
                  ]
              },
              tooltips: {
                  mode: 'index',
                  intersect: false,
              },
              elements: {
                  point: {
                      radius: 0
                  }
              }
          },
          data: {
              datasets: [
                  {
                      fill: 'start',
                      label: this.props.label || "Your Portfolio",
                      data: data,
                      backgroundColor: gradient,
                      
                  },
              ]
          },
      });
    }

    render() {
        return <canvas ref={this.chartRef}></canvas>
    }
}

export default AreaChart;