<script>
  import Node from '../../components/Node.svelte';
  import { page } from '$app/stores';
  let name = "SVJ"
  let nodeId = null;

  $: nodeId = $page.url.pathname.replace('/', ''); // Extract the node ID from the URL
</script>
  <!-- Header -->
  <header>
    <h1> <a href="/">{name}</a></h1>
</header>

<div class="container">
  <!-- Navigation -->
  <!-- <nav>
      <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#contact">Contact</a></li>
      </ul>
  </nav> -->

  <!-- Main Content -->
  <main>
    <Node {nodeId} />
  </main>
  <!-- Footer -->
  <footer>
    <p> &copy; {new Date().getFullYear()} {name}</p>
  </footer>
</div>