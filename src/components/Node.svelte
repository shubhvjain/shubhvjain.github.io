<script>
  import { onMount } from 'svelte';

  export let nodeId;
  let nodeData = null;
  let error = null;

  const fetchNode = async (nodeId) => {
    const response = await fetch(`/data/nodes/${nodeId}.json`);
    if (!response.ok) throw new Error(`Failed to fetch node: ${nodeId}`);
    return response.json();
  };

  onMount(async () => {
    try {
      nodeData = await fetchNode(nodeId);
    } catch (err) {
      error = err.message;
    }
  });
</script>

{#if error}
  <p>Error: {error}</p>
{:else if nodeData}  
    <!-- Blog Post -->
    <article>
      <h1>{nodeData.meta.title}</h1>
      <p>{nodeData.content}</p>
      <h2>My First Blog Post</h2>
      <p><strong>Date:</strong> December 18, 2024</p>
      <p>
          Welcome to my blog! This is my first post, and I’m so excited to start this journey with you. 
          Here, I’ll share my thoughts, experiences, and tips on topics I’m passionate about.
      </p>
      <p>
          In this post, I’d like to talk about why I decided to start blogging. For years, I’ve been 
          jotting down ideas and stories, but it’s only recently that I realized the joy of sharing 
          them with others. Writing has always been a way for me to express myself, and I hope my words 
          can inspire or resonate with you.
      </p>
      <p>Thank you for joining me. Stay tuned for more updates!</p>
  </article>


{:else}
  <p>Loading...</p>
{/if}
