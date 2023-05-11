<script>
    import Scatterplot from '../../components/Scatterplot.svelte';
    export let data = {}
    console.log(data)
</script>

<p>{data.points.name, data.points.species}</p>