import * as React from 'react';
import * as d3 from 'd3';

const data: StockData[] = [{
    "date": "2020-09-29T20:37:40Z",
    "value": 115.54
  }, {
    "date": "2020-09-29T10:39:35Z",
    "value": 52.88
  }, {
    "date": "2020-09-29T07:35:47Z",
    "value": 65.73
  }, {
    "date": "2020-09-29T19:33:37Z",
    "value": 58.14
  }, {
    "date": "2020-09-29T17:37:55Z",
    "value": 137.16
  }, {
    "date": "2020-09-29T13:40:34Z",
    "value": 148.58
  }, {
    "date": "2020-09-29T09:49:08Z",
    "value": 103.74
  }, {
    "date": "2020-09-29T21:23:16Z",
    "value": 107.11
  }, {
    "date": "2020-09-29T13:35:17Z",
    "value": 127.85
  }, {
    "date": "2020-09-29T09:44:55Z",
    "value": 75.89
  }, {
    "date": "2020-09-29T18:21:08Z",
    "value": 97.98
  }, {
    "date": "2020-09-29T19:38:32Z",
    "value": 147.02
  }, {
    "date": "2020-09-29T14:33:29Z",
    "value": 32.02
  }, {
    "date": "2020-09-29T03:05:20Z",
    "value": 44.05
  }, {
    "date": "2020-09-29T21:49:46Z",
    "value": 29.78
  }, {
    "date": "2020-09-29T06:35:32Z",
    "value": 44.55
  }, {
    "date": "2020-09-29T13:58:46Z",
    "value": 42.08
  }, {
    "date": "2020-09-29T23:30:43Z",
    "value": 138.04
  }, {
    "date": "2020-09-29T13:02:46Z",
    "value": 68.23
  }, {
    "date": "2020-09-29T19:17:15Z",
    "value": 29.48
  }, {
    "date": "2020-09-29T00:24:23Z",
    "value": 118.23
  }, {
    "date": "2020-09-29T21:21:31Z",
    "value": 86.43
  }, {
    "date": "2020-09-29T13:48:21Z",
    "value": 73.2
  }, {
    "date": "2020-09-29T23:22:40Z",
    "value": 135.42
  }, {
    "date": "2020-09-29T01:21:15Z",
    "value": 39.66
  }, {
    "date": "2020-09-29T17:51:42Z",
    "value": 64.55
  }, {
    "date": "2020-09-29T16:08:31Z",
    "value": 91.87
  }, {
    "date": "2020-09-29T10:11:13Z",
    "value": 61.94
  }, {
    "date": "2020-09-29T03:26:12Z",
    "value": 47.06
  }, {
    "date": "2020-09-29T08:36:32Z",
    "value": 32.09
  }, {
    "date": "2020-09-29T17:44:54Z",
    "value": 120.02
  }, {
    "date": "2020-09-29T16:53:46Z",
    "value": 98.4
  }, {
    "date": "2020-09-29T16:04:30Z",
    "value": 114.29
  }, {
    "date": "2020-09-29T09:57:11Z",
    "value": 98.27
  }, {
    "date": "2020-09-29T04:23:36Z",
    "value": 84.59
  }, {
    "date": "2020-09-29T19:08:49Z",
    "value": 92.52
  }, {
    "date": "2020-09-29T13:30:31Z",
    "value": 128.26
  }, {
    "date": "2020-09-29T13:43:10Z",
    "value": 121.15
  }, {
    "date": "2020-09-29T03:00:47Z",
    "value": 79.7
  }, {
    "date": "2020-09-29T20:01:57Z",
    "value": 66.73
  }, {
    "date": "2020-09-29T20:53:02Z",
    "value": 138.88
  }, {
    "date": "2020-09-29T08:30:37Z",
    "value": 143.23
  }, {
    "date": "2020-09-29T17:06:06Z",
    "value": 96.93
  }, {
    "date": "2020-09-29T04:04:51Z",
    "value": 53.96
  }, {
    "date": "2020-09-29T15:20:45Z",
    "value": 87.97
  }, {
    "date": "2020-09-29T13:53:13Z",
    "value": 114.57
  }, {
    "date": "2020-09-29T21:42:29Z",
    "value": 108.01
  }, {
    "date": "2020-09-29T15:40:51Z",
    "value": 65.35
  }, {
    "date": "2020-09-29T18:03:05Z",
    "value": 121.93
  }, {
    "date": "2020-09-29T14:29:23Z",
    "value": 127.77
  }, {
    "date": "2020-09-29T01:40:31Z",
    "value": 37.25
  }, {
    "date": "2020-09-29T03:32:29Z",
    "value": 134.72
  }, {
    "date": "2020-09-29T16:40:52Z",
    "value": 55.51
  }, {
    "date": "2020-09-29T15:08:04Z",
    "value": 60.09
  }, {
    "date": "2020-09-29T20:48:24Z",
    "value": 114.72
  }, {
    "date": "2020-09-29T14:23:43Z",
    "value": 125.77
  }, {
    "date": "2020-09-29T14:04:21Z",
    "value": 110.59
  }, {
    "date": "2020-09-29T18:14:31Z",
    "value": 95.8
  }, {
    "date": "2020-09-29T11:03:26Z",
    "value": 58.84
  }, {
    "date": "2020-09-29T21:15:02Z",
    "value": 88.58
  }, {
    "date": "2020-09-29T08:01:09Z",
    "value": 52.49
  }, {
    "date": "2020-09-29T20:26:16Z",
    "value": 119.77
  }, {
    "date": "2020-09-29T03:08:49Z",
    "value": 42.99
  }, {
    "date": "2020-09-29T23:10:38Z",
    "value": 97.3
  }, {
    "date": "2020-09-29T03:53:41Z",
    "value": 146.15
  }, {
    "date": "2020-09-29T11:38:33Z",
    "value": 83.38
  }, {
    "date": "2020-09-29T05:00:15Z",
    "value": 136.35
  }, {
    "date": "2020-09-29T17:09:28Z",
    "value": 55.03
  }, {
    "date": "2020-09-29T07:03:19Z",
    "value": 91.7
  }, {
    "date": "2020-09-29T04:53:29Z",
    "value": 109.34
  }, {
    "date": "2020-09-29T00:21:11Z",
    "value": 92.77
  }, {
    "date": "2020-09-29T16:47:42Z",
    "value": 149.33
  }, {
    "date": "2020-09-29T18:55:39Z",
    "value": 28.38
  }, {
    "date": "2020-09-29T03:24:05Z",
    "value": 57.76
  }, {
    "date": "2020-09-29T02:12:48Z",
    "value": 59.14
  }, {
    "date": "2020-09-29T16:55:36Z",
    "value": 115.84
  }, {
    "date": "2020-09-29T02:24:03Z",
    "value": 114.25
  }, {
    "date": "2020-09-29T12:18:43Z",
    "value": 38.99
  }, {
    "date": "2020-09-29T09:10:11Z",
    "value": 71.13
  }, {
    "date": "2020-09-29T21:21:18Z",
    "value": 77.48
  }, {
    "date": "2020-09-29T09:13:02Z",
    "value": 113.23
  }, {
    "date": "2020-09-29T19:12:44Z",
    "value": 67.38
  }, {
    "date": "2020-09-29T17:23:21Z",
    "value": 53.33
  }, {
    "date": "2020-09-29T20:17:13Z",
    "value": 121.45
  }, {
    "date": "2020-09-29T20:14:27Z",
    "value": 59.56
  }, {
    "date": "2020-09-29T21:48:57Z",
    "value": 54.42
  }, {
    "date": "2020-09-29T16:42:36Z",
    "value": 133.4
  }, {
    "date": "2020-09-29T20:32:40Z",
    "value": 64.11
  }, {
    "date": "2020-09-29T02:46:21Z",
    "value": 68.49
  }, {
    "date": "2020-09-29T11:46:30Z",
    "value": 25.97
  }, {
    "date": "2020-09-29T14:11:03Z",
    "value": 94.75
  }, {
    "date": "2020-09-29T11:08:48Z",
    "value": 70.88
  }, {
    "date": "2020-09-29T07:52:03Z",
    "value": 63.92
  }, {
    "date": "2020-09-29T10:20:14Z",
    "value": 128.64
  }, {
    "date": "2020-09-29T10:29:55Z",
    "value": 29.79
  }, {
    "date": "2020-09-29T23:52:11Z",
    "value": 120.36
  }, {
    "date": "2020-09-29T21:49:44Z",
    "value": 136.3
  }, {
    "date": "2020-09-29T13:02:55Z",
    "value": 132.12
  }, {
    "date": "2020-09-29T17:39:43Z",
    "value": 129.68
  }, {
    "date": "2020-09-29T15:52:17Z",
    "value": 98.77
}].map(val => {
    return (
        {
            date: new Date(val['date']),
            value: val['value']
        }
    )
}).sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
});

type StockData = {
    date: Date,
    value: number,
}

class LineChart extends React.Component<{}, {}> {
    private chartRef: React.RefObject<SVGSVGElement> = React.createRef();
    private chartDim = {
        width: 600,
        height: 400,
        margin: 25,
    }

    componentDidMount() {
        const svg = d3.select(this.chartRef.current);

        const xScale = d3.scaleTime();
        const xExt = d3.extent(data, d => d.date);

        xScale.domain([xExt[0]!, xExt[1]!])
                .range([0, 600])
                .ticks(d3.timeMinute.filter(d => d.getMinutes() % 60 === 0));
        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr('transform', `translate(${this.chartDim.margin}, ${this.chartDim.height + this.chartDim.margin})`)
            .call(xAxis);
    
        const yScale = d3.scaleLinear();
        const yExt = d3.extent(data, d => d.value);
        yScale.domain([yExt[0]!, yExt[1]!])
                .range([400, 0])
                .nice();
        const yAxis = d3.axisLeft(yScale)
                        .tickSize(this.chartDim.width);
        svg.append("g")
            .attr('transform', `translate(${this.chartDim.margin + this.chartDim.width}, ${this.chartDim.margin})`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick:not(:first-of-type) line")
                .attr("stroke-opacity", 0.5)
                .attr("stroke-width", 0.7)
                .attr("stroke-dasharray", "2,2")
            );

        const line = d3.line<StockData>();
        line.x((d) => xScale(d.date)!).y((d) => yScale(d.value)!);             

        
        svg.append("path")
            .datum(data)
            .attr("transform", `translate(${this.chartDim.margin}, ${this.chartDim.margin})`)
            .attr("fill", "none")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke", "steelblue")
            .attr("d", line(data)!);
        
    }

    render() {
        return (
            <svg ref={this.chartRef} height={this.chartDim.height + 2 * this.chartDim.margin}>
            </svg>
        );
    }
}

export default LineChart;