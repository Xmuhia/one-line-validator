<script>

    export let diagram;
    
    $: components = diagram?.components || [];
    $: connections = diagram?.connections || [];
    

    
    // Component rendering functions
    function renderBreaker(component) {
      const { x, y } = component.position;
      // Render a breaker as a rectangle with a small gap (if open)
      const isClosed = component.properties?.state === 'closed';
      
      if (isClosed) {
        return `<rect x="${x - 10}" y="${y - 5}" width="20" height="10" fill="#333" stroke="black" />`;
      } else {
        return `
          <rect x="${x - 10}" y="${y - 5}" width="8" height="10" fill="#333" stroke="black" />
          <rect x="${x + 2}" y="${y - 5}" width="8" height="10" fill="#333" stroke="black" />
        `;
      }
    }
    
    function renderBus(component) {
      const { x, y } = component.position;
      // Render a bus as a horizontal line
      return `
        <line x1="${x - 50}" y1="${y}" x2="${x + 50}" y2="${y}" stroke="#333" stroke-width="4" />
        <text x="${x}" y="${y - 10}" text-anchor="middle">${component.id}</text>
      `;
    }
    
    function renderTransformer(component) {
      const { x, y } = component.position;
      // Render a transformer as two circles
      return `
        <circle cx="${x - 8}" cy="${y}" r="8" fill="white" stroke="#333" />
        <circle cx="${x + 8}" cy="${y}" r="8" fill="white" stroke="#333" />
        <text x="${x}" y="${y - 15}" text-anchor="middle" font-size="10">${component.id}</text>
      `;
    }
    
    function renderComponent(component) {
      switch (component.type) {
        case 'breaker': return renderBreaker(component);
        case 'bus': return renderBus(component);
        case 'transformer': return renderTransformer(component);
        default: return '';
      }
    }
    
    function renderConnection(connection) {
      const fromComponent = components.find(c => c.id === connection.from);
      const toComponent = components.find(c => c.id === connection.to);
      
      if (!fromComponent || !toComponent) return '';
      
      const { x: x1, y: y1 } = fromComponent.position;
      const { x: x2, y: y2 } = toComponent.position;
      
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#666" />`;
    }
  </script>
  
  <div class="diagram-viewer">
    <h2>One-Line Diagram: {diagram?.name || 'Untitled'}</h2>
    
    {#if diagram}
      <div class="diagram-container">
        <svg width="800" height="600" viewBox="0 0 800 600">
          <!-- Render connections first (under components) -->
          {#each connections as connection}
            {@html renderConnection(connection)}
          {/each}
          
          <!-- Then render components -->
          {#each components as component}
            {@html renderComponent(component)}
          {/each}
        </svg>
      </div>
      
      <div class="component-list">
        <h3>Components:</h3>
        <ul>
          {#each components as component}
            <li>
              <strong>{component.id}</strong> ({component.type})
              {#if component.properties}
                <ul class="properties-list">
                  {#each Object.entries(component.properties) as [key, value]}
                    <li>{key}: {value}</li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>No diagram data available</p>
    {/if}
  </div>
  
  <style>
    .diagram-viewer {
      margin-bottom: 2rem;
    }
    
    .diagram-container {
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      margin-bottom: 1rem;
      overflow: auto;
    }
    
    .component-list {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
    }
    
    .component-list ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    .properties-list {
      padding-left: 1.5rem !important;
      font-size: 0.9rem;
      color: #666;
    }
  </style>