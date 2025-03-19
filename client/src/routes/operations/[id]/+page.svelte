<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import ValidationResults from '../../../components/ValidationResults.svelte';
    import { operationStore } from '../../../stores/operationStore';
    import { diagramStore } from '../../../stores/diagramStore';
  
    // Get id from SvelteKit's page store parameter
    $: id = $page.params.id;
  
    $: operation = $operationStore.currentOperation;
    $: loading = $operationStore.loading;
    $: error = $operationStore.error;
    $: steps = operation?.steps || [];
    $: diagramId = operation?.diagramId || null;
    $: diagram = $diagramStore.currentDiagram;
  
    onMount(async () => {
      console.log('OperationDetail Mounted with ID:', id); // Debugging line
  
      if (!id) {
        console.error("ID is undefined");
        return;
      }
  
      try {
        const loadedOperation = await operationStore.loadOperation(id);
        if (loadedOperation?.diagramId) {
          await diagramStore.loadDiagram(loadedOperation.diagramId);
        }
      } catch (err) {
        console.error('Error loading operation:', err);
      }
    });
  </script>  
  
  <div class="operation-detail">
    <div class="back-link">
      <a href="/">← Back to Home</a>
      {#if diagramId}
        <a href={`/diagrams/${diagramId}`}>← Back to Diagram</a>
      {/if}
    </div>
    
    {#if loading}
      <p>Loading operation sequence...</p>
    {:else if error}
      <div class="error-message">{error}</div>
    {:else if !operation}
      <p>Operation sequence not found</p>
    {:else}
      <div class="operation-header">
        <h1>{operation.name}</h1>
        <div class="diagram-reference">
          {#if diagram}
            <p>Based on diagram: <a href={`/diagrams/${diagramId}`}>{diagram.name}</a></p>
          {:else}
            <p>Loading diagram information...</p>
          {/if}
        </div>
      </div>
      
      <section class="validation-section">
        <ValidationResults {operation} diagramId={diagramId} />
      </section>
      
      <section class="steps-section">
        <h2>Operation Steps</h2>
        
        {#if steps.length === 0}
          <p>No steps found in this operation sequence.</p>
        {:else}
          <div class="steps-container">
            <table class="steps-table">
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Component</th>
                  <th>Action</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {#each steps as step, index}
                  <tr class={operation.validationResults?.issues?.some(issue => issue.stepIndex === index) ? 'problem-step' : ''}>
                    <td>{index + 1}</td>
                    <td>{step.componentId}</td>
                    <td>{step.action}</td>
                    <td>{step.properties?.notes || ''}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </section>
    {/if}
  </div>
  
  <style>
    .operation-detail {
      max-width: 100%;
    }
    
    .back-link {
      margin-bottom: 1rem;
      display: flex;
      gap: 1rem;
    }
    
    .back-link a {
      text-decoration: none;
      color: #0066cc;
      font-weight: bold;
    }
    
    .operation-header {
      margin-bottom: 2rem;
    }
    
    .diagram-reference {
      color: #666;
    }
    
    .diagram-reference a {
      color: #0066cc;
      text-decoration: none;
    }
    
    section {
      margin-top: 2rem;
    }
    
    .steps-container {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .steps-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .steps-table th, .steps-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .steps-table th {
      background: #f5f5f5;
      font-weight: bold;
    }
    
    .problem-step {
      background: #fff3f3;
    }
    
    .error-message {
      background: #ffeeee;
      color: #cc0000;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  </style>