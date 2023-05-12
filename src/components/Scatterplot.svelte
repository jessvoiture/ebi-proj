<script>
	import {extent} from "d3-array";
	import {scaleLinear, scaleOrdinal} from "d3-scale";
    import { goto } from '$app/navigation';

    export let datapoints;
 
    let selected_dp = undefined;

    let mouse_x, mouse_y;                           
    const setMousePosition = function(event) {       
        mouse_x = event.clientX;
        mouse_y = event.clientY;
    } 

    const handleClick = function(point) {
        goto(`./${point}`)
    }

    let width = 1000;
    let height = 600;

    const margin = {top: 30, left: 30, right: 30, bottom:30};

    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;

    let xExtent = extent(datapoints, (d) =>  d.length);
    let yExtent = extent(datapoints, (d) =>  d.nr_modifications);

    let xMax = 1.1 * xExtent[1];
    let xMin = 0.9 * xExtent[0];
    let xDomain = [xMin, xMax];
    
    let yMax = 1.1 * yExtent[1];
    let yMin = 0.9 * yExtent[0];
    let yDomain = [yMin, yMax];

    let xScale = scaleLinear().domain(xDomain).range([0,innerWidth])
    let yScale = scaleLinear().domain(yDomain).range([innerHeight, 0])

    let colorScale = scaleOrdinal()
		.domain(["human", "mouse"])
		.range(['#075204','#bd95b7'])
		.unknown("#555");

    // make ticks
	let xTicks = xScale.ticks(5);
	let yTicks = yScale.ticks(5);
	let xTickFormat = xScale.tickFormat(5, ".0s");
	let yTickFormat = yScale.tickFormat(5, ".0s");

</script>

<svg {width} {height}>
    <g class="x-axis" transform='translate({margin.left},0)'>
		{#each xTicks as tick}
			<g class = "tick" transform='translate({xScale(tick)}, 0)'>
				<text y={height}>{xTickFormat(tick)}</text>
			</g>
		{/each}
        <line x1=0 y1={innerHeight + margin.top} 
              x2={innerWidth} y2={innerHeight + margin.top} />

	</g>

    <g class="y-axis" transform='translate(0, {margin.top})'>
		{#each yTicks as tick}
			<g class = "tick" transform='translate(0, {yScale(tick)})'>
				<text x={10}>{yTickFormat(tick)}</text>
                <!-- <line x1={margin.left} y1={yScale(tick)}
                      x2={margin.left + innerWidth} y2={yScale(tick)}
                      stroke = "black"/> -->
			</g>
		{/each}
        <line x1={margin.left} y1=0
              x2={margin.left} y2={innerHeight}
              stroke = 'black' />
	</g> 
	
 	<g class="dots" width={innerWidth} height={innerHeight} 
                    transform='translate({margin.left}, {margin.top})'>
		{#each datapoints as point}
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<circle cx={xScale(point.length)} 
                    cy={yScale(point.nr_modifications)} 
                    r='7'
                    fill = {colorScale(point.species)}
                    class:selected="{selected_dp && point.name == selected_dp.name}"
                    on:mouseover={function(event) {selected_dp = point; setMousePosition(event)}}  
                    on:mouseout={function() {selected_dp = undefined}}
                    on:click={handleClick(selected_dp.name)}/>
		{/each}
	</g>
</svg>

{#if selected_dp != undefined}            
    <div id="tooltip" style="left: {mouse_x + 10}px; top: {mouse_y - 10}px">
        <svg class="tooltip" width=20 height=20>
            <g transform="translate(10,10)">
                point={selected_dp}
            </g>
        </svg>Species: {selected_dp.species}<br/>Protein: {selected_dp.name}
    
    </div>
{/if}

<style>
    .y-axis, .x-axis {
        font-family: sans-serif;
        fill: gray;
    }

    circle.selected {
        fill-opacity: 1;
        stroke: black;
    }

    #tooltip {                                     
        position: fixed;
        background-color: white;
        padding: 3px;
        border: solid 1px;
        font-family: sans-serif;
    }

    svg.tooltip {                                
        margin: 0px;
        padding: 0px;
    }

    svg {
        display: block;
        margin: auto;
    }

    line {
        stroke: lightgray;
    }
</style>