const config = {
	kit: {
	  // Disable SvelteKit's built-in routing as we're using svelte-routing
	  router: false,
	  // Disable SvelteKit's built-in hydration as we're using our own
	  hydrate: false
	}
  };
  
  export default config;