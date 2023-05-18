import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const D3TimeLine = ({ stages, newDates }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (newDates.length === stages.length) {
            drawChart();
        }
    }, [stages, newDates]);

    const drawChart = () => {
        if (!chartRef.current) return;

        const data = stages.map((stage, index) => ({
            name: stage.title,
            date: new Date(newDates[index]),
        }));

        const margin = { top: 40, right: 100, bottom: 40, left: 270 };
        const width = chartRef.current.parentElement.clientWidth - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        d3.select(chartRef.current).select('svg').remove();

        const svg = d3
            .select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleTime()
            .domain([
                d3.min(data, (d) => d.date),
                d3.max(data, (d) => d.date),
            ])
            .range([0, width]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, height])
            .padding(0.1);

        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg
            .append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).tickFormat(''))
            .selectAll('g.tick')
            .append('foreignObject') 
            .attr('width', 250)
            .attr('height', y.bandwidth())
            .attr('x', -260)
            .attr('y', -y.bandwidth() / 2)
            .append('xhtml:div') 
            .attr('style', 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; white-space: pre-wrap; width: 250px; text-align: end;')
            .text((d) => d);

        svg
            .selectAll('.point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('cx', (d) => x(d.date))
            .attr('cy', (d) => y(d.name) + y.bandwidth() / 2)
            .attr('r', 5)
            .attr('fill', '#69b3a2');
        svg
            .selectAll('.point-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'point-label')
            .attr('x', (d) => x(d.date) + 10) 
            .attr('y', (d) => y(d.name) + y.bandwidth() / 2 + 5) 
            .text((d) => d3.timeFormat("%Y-%m-%d")(d.date))
            .style('font-size', '12px')
            .style('fill', '#000');
    };

    return <div ref={chartRef}></div>
}

export default D3TimeLine