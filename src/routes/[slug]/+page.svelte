<script>
	import {count, extent} from "d3-array";
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

    let flattened_res = flatten(res).map((d)=> {
        return {...d, 
            is_selected:"active"}})

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
        .range(['#d5e5ed', 'lightgrey', '#fabed4', '#dcbeff', '#469990', '#e41a1c', '#911eb4', '#4363d8', '#a65628'])

    let legTitles = col.domain()

    let xAxis;
	let yAxis;
    let yAxis_A;
    let yAxis_No;

    let selected_dp = undefined;

    let mouse_x, mouse_y;                           
    const setMousePosition = function(event) {       
        mouse_x = event.clientX;
        mouse_y = event.clientY;
    } 

    function handleMouseover(lt) {
        let element = document.querySelectorAll(`circle:not(.${CSS.escape(lt)})`)
        element.classList.add("inactive");
    }

    function handleMouseout () {
        let element = document.querySelectorAll(`inactive`)
        element.classList.remove("inactive");
    }

    let isActive = true;

    let AWidth = 400;
    let AHeight = 300;
    let AInnerheight = AHeight / 2 - margin.top

    let artefact = flattened_res.filter(function (el) {
        return el.type == "Artefact"
    });

    let artefact_counts = artefact.reduce((p, c) => {
        var name = c.pos;
        if (!p.hasOwnProperty(name)) {
            p[name] = 0;
        }
        p[name]++;
        return p;
    }, {});

    let not_artefact = flattened_res.filter(function (el) {
        return el.type != "Artefact"
    });

    let not_artefact_counts = not_artefact.reduce((p, c) => {
        let name = c.pos;
        if (!p.hasOwnProperty(name)) {
            p[name] = 0;
        }
        p[name]++;
        return p;
    }, {});

    var countsExtended_A = Object.keys(artefact_counts).map(k => {
    return {name: k, count: artefact_counts[k]}; });

    var countsExtended_No = Object.keys(not_artefact_counts).map(k => {
    return {name: k, count: not_artefact_counts[k]}; });

    let yextentA = extent(countsExtended_A);
    let yscaleA = scaleLinear().domain(yextentA).range(AInnerheight)

    let yextentNo = extent(countsExtended_No);
    let yscaleNo = scaleLinear().domain(yextentNo).range(AInnerheight)

    $: {
		d3.select(yAxis)
            .call(d3.axisLeft(yScale));
		
		d3.select(xAxis)
            .call(d3.axisTop(xScale))
            .selectAll('.tick > text');

        d3.select(yAxis_A)
            .call(d3.axisLeft(yscaleA));

        d3.select(yAxis_No)
            .call(d3.axisLeft(yscaleNo));
	}

    function handleMouseOver(event, item){
        console.log(item)

        flattened_res.map((d)=> {
          if (d.type==item) {
            d.is_selected = "active"
            console.log(d.type, item)
            
        } else {
            d.is_selected = "inactive"
 
        }})}
    
    function handleMouseOut() {
        flattened_res.map((d)=> {
            return {...d, is_selected:"active"}})
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
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <div>
                    <span class="leg-item {lt}"
                          class:class-on-hover={isActive} on:mouseover={(e) => handleMouseOver(e, lt)} 
                                                           on:mouseout={() => handleMouseOut()}
                          style="background-color:{col(lt)};"    
                    >
                        {lt} 
                    </span>
                </div><br/>
            {/each}
        </div>

    </div>

    <br/>
    <br/>

    <svg height={AHeight}, width={AWidth}>
        <g class="x-axis" transform="translate({margin.left}, {AHeight / 2})"
		 bind:this={xAxis} />

        <g class="y-axis" transform="translate({margin.left - 20}, {margin.top})"
            bind:this={yAxis_A} />

        <g class="y-axis" transform="translate({margin.left - 20}, {margin.top})"
            bind:this={yAxis_No} />

        <g class="rects" width={innerWidth} height={AInnerheight} 
            transform='translate({margin.left}, {margin.top+8})'>
            {#each countsExtended_A as count, i}
                <line x1={i} y1=0 
                      x2={i} y2={yAxis_No(count)} 
                      stroke = "black"/>
            {/each}
        </g>
    </svg> 
</div>

<div class="x-axis-sticky" transform="translate({margin.left}, {margin.top / 2})"
    bind:this={xAxis}/>

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
                    fill = {point.is_selected == "active" ? col(point.type) : "lightgrey"}
                
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
        width: 33%;
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
        margin-bottom: 5px;
    }

    .x-axis-sticky {
        position: sticky;
        width: 1000;
        height: 3500;
        float: right;
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
        opacity: 100%;
        stroke: black;
    }

    .inactive {
        fill: lightgray;
    }

    .span {
        margin-bottom: 20;
    }

</style>
