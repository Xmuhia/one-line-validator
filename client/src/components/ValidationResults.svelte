<script>
    import { validateOperation } from '../services/api';
    
    export let operation;
    export let diagramId;
    
    let validationLevel = 'basic';
    let validating = false;
    let error = null;
    
    $: isValid = operation?.validationResults?.isValid || false;
    $: issues = operation?.validationResults?.issues || [];
    
    async function runValidation() {
      if (!operation || !operation._id) {
        error = 'No operation selected';
        return;
      }
      
      error = null;
      validating = true;
      
      try {
        const result = await validateOperation(operation._id, validationLevel);
        operation.validationResults = result.validationResults;
      } catch (err) {
        error = err.message || 'Error validating operation sequence';
      } finally {
        validating = false;
      }
    }
    
    function getSeverityClass(severity) {
      switch (severity) {
        case 'error': return 'severity-error';
        case 'warning': return 'severity-warning';
        case 'info': return 'severity-info';
        default: return '';
      }
    }
  </script>
  
  <div class="validation-results">
    <h2>Validation Results</h2>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <div class="form-group">
      <label for="validationLevel">Validation Level</label>
      <select id="validationLevel" bind:value={validationLevel}>
        <option value="basic">Level 1: Basic</option>
        <option value="logical">Level 2: Logical</option>
        <option value="advanced">Level 3: Advanced</option>
      </select>
    </div>
    
    <button 
      on:click={runValidation} 
      disabled={validating || !operation || !operation._id}
      class="validate-btn"
    >
      {#if validating}
        Validating...
      {:else}
        Run Validation
      {/if}
    </button>
    
    {#if operation && operation.validationResults}
      <div class="results-container">
        <div class="validation-status">
          <div class="status-indicator {isValid ? 'valid' : 'invalid'}">
            {isValid ? 'Valid' : 'Invalid'} 
            Operation Sequence
          </div>
        </div>
        
        {#if issues.length > 0}
          <h3>Issues Found:</h3>
          <ul class="issues-list">
            {#each issues as issue}
              <li class={getSeverityClass(issue.severity)}>
                <span class="step-number">Step {issue.stepIndex + 1}:</span>
                <span class="issue-message">{issue.message}</span>
                {#if issue.suggestion}
                  <div class="suggestion">
                    Suggestion: {issue.suggestion}
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        {:else if !isValid}
          <p>No specific issues were identified, but the operation sequence is invalid.</p>
        {:else}
          <p>No issues found. The operation sequence is valid.</p>
        {/if}
      </div>
    {/if}
  </div>
  
  <style>
    .validation-results {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    
    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .validate-btn {
      background: #0066cc;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }
    
    .validate-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .results-container {
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    
    .validation-status {
      text-align: center;
      margin-bottom: 1rem;
    }
    
    .status-indicator {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
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
    
    .issues-list {
      list-style-type: none;
      padding: 0;
    }
    
    .issues-list li {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
    }
    
    .severity-error {
      background: #f2dede;
      border-left: 4px solid #a94442;
    }
    
    .severity-warning {
      background: #fcf8e3;
      border-left: 4px solid #8a6d3b;
    }
    
    .severity-info {
      background: #d9edf7;
      border-left: 4px solid #31708f;
    }
    
    .step-number {
      font-weight: bold;
      margin-right: 0.5rem;
    }
    
    .suggestion {
      margin-top: 0.5rem;
      font-style: italic;
      color: #666;
    }
    
    .error-message {
      background: #ffeeee;
      color: #cc0000;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  </style>