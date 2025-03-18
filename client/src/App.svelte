<script>
  import { Router, Route } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import DiagramDetail from './routes/DiagramDetail.svelte';
  import OperationDetail from './routes/OperationDetail.svelte';
  
  export let url = '';
</script>

<Router {url}>
  <div class="app-container">
    <header>
      <h1>One-Line Diagram Validator</h1>
      <nav>
        <a href="/">Home</a>
      </nav>
    </header>
    
    <main>
      <Route path="/" component={Home} />
      <Route path="/diagrams/:id" component={DiagramDetail} />
      <Route path="/operations/:id" component={OperationDetail} />
    </main>
    
    <footer>
      <p>One-Line Diagram Validator &copy; 2025</p>
    </footer>
  </div>
</Router>
