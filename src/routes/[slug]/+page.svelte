<script>
	import {extent} from "d3-array";
	import {scaleLinear, scaleOrdinal, scaleBand} from "d3-scale";
    import * as d3 from 'd3';

    import Scatter2 from "../../components/Scatter2.svelte";
    
    export let data

    // restructuring!
    let p = data.points;
    let res = p.residues;
    let pos = res.map(d => d.pos)

    // extract position and mod
    const flatten = array =>
        array.reduce((results, item) => 
            [...results, 
             ...item.modifications.map(modifications => 
                ({ pos: item.pos, 
                   residue: item.residue,
                   modifications: modifications.mod,
                   type: modifications.type,
                   prob: modifications.prob }))], 
            []
        );

    let flattened_res = flatten(res)

    // unique list of mods
    let unique_mods = [...new Set(flattened_res.map(item => item.modifications))]; 
    let unique_types = [...new Set(flattened_res.map(item => item.type))]; 

    // dimensions
    let width = 1000;
    let height = 3500;

    const margin = {top: 50, left: 150, right: 30, bottom:30};

    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;

    // scales
    let xExtent = extent(pos);
    let xScale = scaleLinear()
        .domain(xExtent)
        .range([0,innerWidth])

    let yScale = scaleBand()
		.domain(unique_mods)
		.range([0, innerHeight]);

    let col = scaleOrdinal()
        .domain(unique_types)
        .range(['#000000', '#000075', '#4363d8', '#469990', '#dcbeff', '#800000', '#911eb4', '#fabed4', '#42d4f4'])

    let legTitles = col.domain()

    let xAxis;
	let yAxis;
	
	$: {
		d3.select(yAxis)
            .call(d3.axisLeft(yScale));
		
		d3.select(xAxis)
            .call(d3.axisTop(xScale))
            .selectAll('.tick > text');
	}

    let selected_dp = undefined;

    let mouse_x, mouse_y;                           
    const setMousePosition = function(event) {       
        mouse_x = event.clientX;
        mouse_y = event.clientY;
    } 

    function test() {
        console.log('hello')
    }

</script>

<div class="metadata">
    <div class="item"><span>Name:</span> {p.name}</div>
    <div class="item"><span>Symbol:</span> {p.symbol}</div>
    <div class="item"><span>Function:</span> {p.function}</div>
    <br/>
    <div class="leg">

        <div class=leg-title>
            {#each legTitles as lt}
                <div class="leg-wrapper"
                    >
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <span   class="leg-item"
                            style="background-color:{col(lt)};"
                            on:mouseover={test()}
                            >

                            {lt} 
                    </span>
                </div>
            {/each}
        </div>

    </div>

    <!-- <Scatter2 data={data}/> -->
</div>

<svg {width} {height}>

    <g class="x-axis" transform="translate({margin.left}, {margin.top / 2})"
		 bind:this={xAxis} />

    <g class="y-axis" transform="translate({margin.left - 20}, {margin.top})"
        bind:this={yAxis} />

 	<g class="dots" width={innerWidth} height={innerHeight} 
                    transform='translate({margin.left}, {margin.top+8})'>
		{#each flattened_res as point}
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			<circle class = "{point.modifications}"
                    class:selected="{selected_dp && point.modifications == selected_dp.modifications &&
                                      selected_dp && point.pos == selected_dp.pos  }"
                    cx={xScale(point.pos)} 
                    cy={yScale(point.modifications)} 
                    fill = {col(point.type)}
                    r='7'
                    on:mouseover={function(event) {selected_dp = point; setMousePosition(event)}} 
                    on:mouseout={function() {selected_dp = undefined}} 
            />
		{/each}
	</g>
</svg>

{#if selected_dp != undefined}            
    <div id="tooltip" style="left: {mouse_x + 10}px; top: {mouse_y - 10}px">
        <svg class="tooltip" width=20 height=20>
            <g transform="translate(10,10)">
                point={selected_dp}
            </g>
        </svg>Modification: {selected_dp.modifications}<br/>
              Position: {selected_dp.pos}<br/>
              Type: {selected_dp.type}<br/>
              Residue: {selected_dp.residue}<br/>
              Prob: {selected_dp.prob}
    </div>
{/if}

<style>
    .metadata{
        width: 25%;
        font-family: sans-serif;
        font-size: 14pt;
        margin-left: 40px;
        margin-top: 40px;
        float: left;
        position: fixed;
    }

    .item {
        margin-bottom: 10px;
    }

    span {
        font-weight: bold;
    }

    circle{
        opacity: 50%;
    }

    svg {
        float: right;
        margin-right: 5%;
    }

    .leg-item {
        color: white;
        border-radius: 8px;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
        padding: 0 5px 0 5px;
    }

    .leg-wrapper {
        margin-bottom: 5px;
    }

    .x-axis{
        position: sticky;
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

    circle.selected {
        fill-opacity: 1;
        stroke: black;
    }

    .inactive {
        fill: lightgray;
    }


</style>
