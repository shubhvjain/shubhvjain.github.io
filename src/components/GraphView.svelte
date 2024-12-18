<script>
    import { onMount } from 'svelte';


  let relations = null;

  const fetchRelations = async () => {
    const response = await fetch("/data/relations.json");
    if (!response.ok) throw new Error("Failed to fetch node relations");
    return response.json();
  };

  onMount(async () => {
    try {
      relations = await fetchRelations();
      console.log(relations);
    } catch (error) {
      console.error("Error loading relations:", error);
    }
  });
  //  let relations;

  import { Node, Svelvet, Minimap, Controls, ThemeToggle } from "svelvet";
</script>

<style>
   #graph {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
	}
</style>

<!-- 
<ul>
  {#each relations.edges as node}
    <li>
     {node.node1} - {node.node2} 
    </li>
  {/each}
</ul> -->
<div id="graph">
  <Svelvet id="my-canvas"  controls>
    <Node  label="Hello! I'm still working on my website!"/>
    <ThemeToggle main="dark" alt="light" slot="toggle" />
  </Svelvet>
</div>

