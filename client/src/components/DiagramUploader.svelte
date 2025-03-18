<script>
    import { createEventDispatcher } from 'svelte';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { uploadDiagram } from '../services/api';
    
    const dispatch = createEventDispatcher();
    
    let files = [];
    let uploading = false;
    let error = null;
    let diagramName = '';
    let Dropzone;
    let dropzoneLoaded = false;
    
    onMount(async () => {
      if (browser) {
        // Import Dropzone only on client-side
        const module = await import('svelte-file-dropzone');
        Dropzone = module.Dropzone;
        dropzoneLoaded = true;
      }
    });
    
    function handleFilesSelect(e) {
      const { acceptedFiles } = e.detail;
      files = acceptedFiles;
      
      // Extract file name for diagram name suggestion
      if (files.length > 0) {
        diagramName = files[0].name.split('.')[0];
      }
    }
    
    async function handleUpload() {
      if (files.length === 0) {
        error = 'Please select a file first';
        return;
      }
      
      if (!diagramName) {
        error = 'Please enter a name for the diagram';
        return;
      }
      
      error = null;
      uploading = true;
      
      try {
        const formData = new FormData();
        formData.append('diagram', files[0]);
        formData.append('name', diagramName);
        
        const response = await uploadDiagram(formData);
        
        // Reset form
        files = [];
        diagramName = '';
        
        // Notify parent component
        dispatch('diagramUploaded', response.diagram);
      } catch (err) {
        error = err.message || 'Error uploading diagram';
      } finally {
        uploading = false;
      }
    }
  </script>
  
  <div class="diagram-uploader">
    <h2>Upload One-Line Diagram</h2>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <div class="form-group">
      <label for="diagramName">Diagram Name</label>
      <input 
        type="text" 
        id="diagramName" 
        bind:value={diagramName} 
        placeholder="Enter a name for this diagram"
      />
    </div>
    
    <div class="form-group">
      {#if browser && dropzoneLoaded && Dropzone}
        <svelte:component this={Dropzone} on:drop={handleFilesSelect} accept=".png,.jpg,.jpeg,.pdf">
          <div class="dropzone-content">
            <p>Drag & drop your one-line diagram here</p>
            <p class="small">Supported formats: PNG, JPG, PDF</p>
          </div>
        </svelte:component>
      {:else}
        <div class="dropzone-content">
          <p>Loading file upload component...</p>
          <p class="small">Supported formats: PNG, JPG, PDF</p>
        </div>
      {/if}
    </div>
    
    {#if files.length > 0}
      <div class="selected-file">
        <p>Selected file: {files[0].name} ({Math.round(files[0].size / 1024)} KB)</p>
      </div>
    {/if}
    
    <button 
      on:click={handleUpload} 
      disabled={uploading || files.length === 0 || !diagramName}
      class="upload-btn"
    >
      {#if uploading}
        Uploading...
      {:else}
        Upload Diagram
      {/if}
    </button>
  </div>
  
  <style>
    .diagram-uploader {
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