<script>
    import { createEventDispatcher } from 'svelte';
    import { Dropzone } from 'svelte-file-dropzone';
    import { createOperation } from '../services/api';
    
    export let diagramId;
    
    const dispatch = createEventDispatcher();
    
    let files = [];
    let uploading = false;
    let error = null;
    let operationName = '';
    
    function handleFilesSelect(e) {
      const { acceptedFiles } = e.detail;
      files = acceptedFiles;
      
      // Extract file name for operation name suggestion
      if (files.length > 0) {
        operationName = files[0].name.split('.')[0];
      }
    }
    
    async function handleUpload() {
      if (!diagramId) {
        error = 'No diagram selected';
        return;
      }
      
      if (files.length === 0) {
        error = 'Please select an Excel file';
        return;
      }
      
      if (!operationName) {
        error = 'Please enter a name for the operation sequence';
        return;
      }
      
      error = null;
      uploading = true;
      
      try {
        const formData = new FormData();
        formData.append('operationFile', files[0]);
        formData.append('name', operationName);
        formData.append('diagramId', diagramId);
        
        const response = await createOperation(formData);
        
        // Reset form
        files = [];
        operationName = '';
        
        // Notify parent component
        dispatch('operationCreated', response.operation);
      } catch (err) {
        error = err.message || 'Error uploading operation sequence';
      } finally {
        uploading = false;
      }
    }
  </script>
  
  <div class="operation-input">
    <h2>Upload Operation Sequence</h2>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <div class="form-group">
      <label for="operationName">Operation Name</label>
      <input 
        type="text" 
        id="operationName" 
        bind:value={operationName} 
        placeholder="Enter a name for this operation sequence"
      />
    </div>
    
    <div class="form-group">
      <Dropzone on:drop={handleFilesSelect} accept=".xlsx,.xls">
        <div class="dropzone-content">
          <p>Drag & drop your Excel file here</p>
          <p class="small">Supported formats: XLSX, XLS</p>
          <p class="small">
            Excel file should have columns for: componentId, action, notes
          </p>
        </div>
      </Dropzone>
    </div>
    
    {#if files.length > 0}
      <div class="selected-file">
        <p>Selected file: {files[0].name} ({Math.round(files[0].size / 1024)} KB)</p>
      </div>
    {/if}
    
    <button 
      on:click={handleUpload} 
      disabled={uploading || files.length === 0 || !operationName || !diagramId}
      class="upload-btn"
    >
      {#if uploading}
        Uploading...
      {:else}
        Upload Operation Sequence
      {/if}
    </button>
  </div>
  
  <style>
    .operation-input {
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
    
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .dropzone-content {
      padding: 2rem;
      border: 2px dashed #ccc;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
    
    .small {
      font-size: 0.8rem;
      color: #666;
    }
    
    .selected-file {
      margin-top: 1rem;
      font-style: italic;
    }
    
    .upload-btn {
      background: #0066cc;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 1rem;
    }
    
    .upload-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .error-message {
      background: #ffeeee;
      color: #cc0000;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  </style>