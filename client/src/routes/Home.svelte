<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import DiagramUploader from '../components/DiagramUploader.svelte';
    import OperationUploader from '../components/OperationUploader.svelte';
    import { diagramStore } from '../stores/diagramStore';
    import { operationStore } from '../stores/operationStore';
    
    // Destructure the store values
    $: diagrams = $diagramStore.diagrams;
    $: diagramsLoading = $diagramStore.loading;
    $: diagramError = $diagramStore.error;
    
    $: operations = $operationStore.operations;
    $: operationsLoading = $operationStore.loading;
    $: operationError = $operationStore.error;
    
    // Selected diagram for operation uploads
    let selectedDiagramId = null;
    
    onMount(() => {
      // Load data on component mount
      diagramStore.loadDiagrams();
      operationStore.loadOperations();
    });
    
    function handleDiagramUploaded(event) {
      const diagram = event.detail;
      diagramStore.addDiagram(diagram);
      navigate(`/diagrams/${diagram._id}`);
    }
    
    function handleOperationUploaded(event) {
      const operation = event.detail;
      operationStore.addOperation(operation);
      navigate(`/operations/${operation._id}`);
    }
    
    function selectDiagramForOperation(diagramId) {
      selectedDiagramId = diagramId;
    }
    
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  </script>
  
  <div class="home-container">
    <div class="uploaders-container">
      <section class="uploader-section">
        <DiagramUploader on:diagramUploaded={handleDiagramUploaded} />
      </section>
      
      <section class="uploader-section">
        <OperationUploader 
          diagramId={selectedDiagramId} 
          on:operationUploaded={handleOperationUploaded} 
        />
        {#if !selectedDiagramId}
          <div class="info-message">Please select a diagram below to upload operations for.</div>
        {/if}
      </section>
    </div>
    
    <section class="existing-diagrams">
      <h2>Existing Diagrams</h2>
      
      {#if diagramsLoading}
        <p>Loading diagrams...</p>
      {:else if diagramError}
        <div class="error-message">{diagramError}</div>
      {:else if diagrams.length === 0}
        <p>No diagrams found. Upload a new diagram to get started.</p>
      {:else}
        <div class="diagrams-list">
          {#each diagrams as diagram}
            <div class="diagram-card {selectedDiagramId === diagram._id ? 'selected' : ''}">
              <h3>{diagram.name}</h3>
              <p class="date">Uploaded: {formatDate(diagram.uploadDate)}</p>
              <div class="button-group">
                <button 
                  class="view-btn"
                  on:click={() => navigate(`/diagrams/${diagram._id}`)}
                >
                  View Diagram
                </button>
                <button 
                  class="select-btn {selectedDiagramId === diagram._id ? 'selected' : ''}"
                  on:click={() => selectDiagramForOperation(diagram._id)}
                >
                  {selectedDiagramId === diagram._id ? 'Selected' : 'Select for Operation'}
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
    
    <section class="existing-operations">
      <h2>Recent Operations</h2>
      
      {#if operationsLoading}
        <p>Loading operations...</p>
      {:else if operationError}
        <div class="error-message">{operationError}</div>
      {:else if operations.length === 0}
        <p>No operations found. Create a new operation sequence after uploading a diagram.</p>
      {:else}
        <div class="operations-list">
          {#each operations as operation}
            <div class="operation-card">
              <h3>{operation.name}</h3>
              <p class="date">Created: {formatDate(operation.createdDate)}</p>
              <div class="status-badge {operation.validationResults?.isValid ? 'valid' : 'invalid'}">
                {operation.validationResults?.isValid ? 'Valid' : 'Invalid'}
              </div>
              <button 
                class="view-btn"
                on:click={() => navigate(`/operations/${operation._id}`)}
              >
                View Operation
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  </div>
  
  <style>
    .home-container {
      max-width: 100%;
    }
    
    .uploaders-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    @media (max-width: 768px) {
      .uploaders-container {
        grid-template-columns: 1fr;
      }
    }
    
    .uploader-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 1rem;
    }
    
    section {
      margin-bottom: 2rem;
    }
    
    .diagrams-list, .operations-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .diagram-card, .operation-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      position: relative;
    }
    
    .diagram-card.selected {
      border: 2px solid #0066cc;
      box-shadow: 0 3px 8px rgba(0, 102, 204, 0.2);
    }
    
    .date {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    .button-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .view-btn {
      background: #0066cc;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .select-btn {
      background: #666;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .select-btn.selected {
      background: #28a745;
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
    
    .info-message {
      background: #e7f3ff;
      color: #0066cc;
      padding: 0.75rem;
      border-radius: 4px;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
  </style>