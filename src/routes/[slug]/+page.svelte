<script>
	import {extent} from "d3-array";
	import {scaleLinear, scaleOrdinal, scaleBand} from "d3-scale";
    
    export let data = {}

    // restructuring!
    let p = data.points;
    let res = p.residues;
    let modifications = res.map(d => d.modifications)
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
    let width = 1200;
    let height = 3400;

    const margin = {top: 30, left: 30, right: 30, bottom:30};

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

    // make ticks
	let xTicks = xScale.ticks(5);
	let yTicks = yScale.ticks(unique_mods.length);
	let xTickFormat = xScale.tickFormat(5, ".0s");
	let yTickFormat = yScale.tickFormat(5, ".0s");

</script>

<div class="metadata">
    <div class="item"><span>Name:</span> {p.name}</div>
    <div class="item"><span>Symbol:</span> {p.symbol}</div>
    <div class="item"><span>Function:</span> {p.function}</div>

    <div class="leg">

        <div class=leg-title>
            {#each legTitles as lt}
                <span style="color: {lt}"> {lt} </span><br/>
            {/each}
        </div>

    </div>
</div>

<svg {width} {height}>

    <g class="y-axis" transform='translate(0, {margin.top})'>
		{#each yTicks as tick}
			<g class = "tick" transform='translate(0, {yScale(tick)})'>
				<text x={10}>{yTickFormat(tick)}</text>
			</g>
		{/each}
	</g> 

 	<g class="dots" width={innerWidth} height={innerHeight} 
                    transform='translate({margin.left}, {margin.top})'>
		{#each flattened_res as point}
			<circle class={point.modifications}
                    cx={xScale(point.pos)} 
                    cy={yScale(point.modifications)} 
                    fill = {col(point.type)}
                    r='7'/>
		{/each}
	</g>
</svg>




<style>
    .metadata{
        width: 20%;
        font-family: sans-serif;
        font-size: 14pt;
        margin-left: 40px;
        margin-top: 40px;
        float: left;
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
</style>
