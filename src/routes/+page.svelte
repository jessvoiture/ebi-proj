<script>
	import Scatterplot from '../components/Scatterplot.svelte';
    export let data; 

    $: datapoints = data.points;
 
</script>

<Scatterplot {datapoints}/>


  
