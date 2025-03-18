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
<style>
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #ccc;
    }
    
    main {
      flex-grow: 1;
      padding: 2rem 0;
    }
    
    footer {
      border-top: 1px solid #ccc;
      padding: 1rem 0;
      text-align: center;
    }
    
    nav a {
      margin-left: 1rem;
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }
    
    nav a:hover {
      color: #0066cc;
    }
  </style>
