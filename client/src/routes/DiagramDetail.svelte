<script>
    import { onMount } from 'svelte';
    import { Link } from 'svelte-routing';
    import DiagramViewer from '../components/DiagramViewer.svelte';
    import OperationSequenceInput from '../components/OperationSequenceInput.svelte';
    import { diagramStore } from '../stores/diagramStore';
    import { operationStore } from '../stores/operationStore';
    
    // Get the diagram ID from props
    export let id;
    
    // Destructure the store values
    $: diagram = $diagramStore.currentDiagram;
    $: loading = $diagramStore.loading;
    $: error = $diagramStore.error;
    
    $: operations = $operationStore.operations.filter(op => op.diagramId === id);
    
    onMount(async () => {
      // Load diagram on component mount
      try {
        await diagramStore.loadDiagram(id);
      } catch (err) {
        console.error('Error loading diagram:', err);
      }
      
      // Load operations
      await operationStore.loadOperations();
    });
    
    function handleOperationCreated(event) {
      const operation = event.detail;
      operationStore.addOperation(operation);
    }
    
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  </script>
  
  <div class="diagram-detail">
    <div class="back-link">
      <Link to="/">← Back to Home</Link>
    </div>
    
    {#if loading}
      <p>Loading diagram...</p>
    {:else if error}
      <div class="error-message">{error}</div>
    {:else if !diagram}
      <p>Diagram not found</p>
    {:else}
      <DiagramViewer {diagram} />
      
      <section class="operations-section">
        <h2>Create New Operation Sequence</h2>
        <OperationSequenceInput 
          diagramId={diagram._id} 
          on:operationCreated={handleOperationCreated}
        />
        
        <h2>Existing Operation Sequences</h2>
        {#if operations.length === 0}
          <p>No operations created for this diagram yet.</p>
        {:else}
          <div class="operations-list">
            {#each operations as operation}
              <div class="operation-card">
                <h3>{operation.name}</h3>
                <p class="date">Created: {formatDate(operation.createdDate)}</p>
                <div class="status-badge {operation.validationResults?.isValid ? 'valid' : 'invalid'}">
                  {operation.validationResults?.isValid ? 'Valid' : 'Invalid'}
                </div>
                <Link to={`/operations/${operation._id}`} class="view-link">
                  View Operation
                </Link>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {/if}
  </div>
  
  <style>
    .diagram-detail {
      max-width: 100%;
    }
    
    .back-link {
      margin-bottom: 1rem;
    }
    
    .back-link a {
      text-decoration: none;
      color: #0066cc;
      font-weight: bold;
    }
    
    section {
      margin-top: 2rem;
    }
    
    .operations-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .operation-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      position: relative;
    }
    
    .date {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    .view-link {
      display: inline-block;
      background: #0066cc;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
    }
    
    .status-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    
    .valid {
      background: #dff0d8;
      color: #3c763d;
    }
    
    .invalid {
      background: #f2dede;
      color: #a94442;
    }
    
    .error-message {
      background: #ffeeee;
      color: #cc0000;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  </style>