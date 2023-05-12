<script>
    import { LayerCake, ScaledSvg, Html, takeEvery } from 'layercake';
    import { extent, bin } from 'd3-array';
    import { scaleBand } from 'd3-scale';
    import { format } from 'd3-format';

    import Column from '../components/Column.svelte'
    import AxisX from '../components/AxisX.html.svelte';
    import AxisY from '../components/AxisY.html.svelte';

    import calcThresholds from '../modules/calcThresholds.js';

    export let data;

    // let p = data.points;
    // let res = p.residues;
    // let pos = res.map(d => d.pos)

    const f = format('.2f');

    let binCount = 40;

    const xKey = ['x0', 'x1'];
    const yKey = 'length';

    const domain = extent(data);

    $: steps = calcThresholds(domain, binCount);
    $: hist = bin()
        .domain(domain)
        .thresholds(steps);

    $: slimSteps = takeEvery(steps, 7);
</script>

<style>
/*
  The wrapper div needs to have an explicit width and height in CSS.
  It can also be a flexbox child or CSS grid element.
  The point being it needs dimensions since the <LayerCake> element will
  expand to fill it.
*/
    .chart-container {
        width: 500px;
        height: 200px;
    }
</style>

<div class="input-container">
    <div class="chart-container">
        <LayerCake
            ssr={true}
            percentRange={true}
            x={xKey}
            y={yKey}
            xDomain={steps}
            xScale={scaleBand().paddingInner([0])}
            yDomain={[0, null]}
            data={hist(data)}
        >
            <Html>
                <AxisX
                    gridlines={false}
                    baseline={true}
                    ticks={slimSteps}
                    formatTick={d => +f(d)}
                />
                <AxisY
                    gridlines={false}
                    ticks={3}
                />
            </Html>

                <ScaledSvg>
                    <Column
                        fill={'#fff'}
                        stroke={'#000'}
                        strokeWidth={1}
                    />
                </ScaledSvg>

        </LayerCake>
    </div>
</div>