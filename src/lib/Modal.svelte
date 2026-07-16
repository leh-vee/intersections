<script>
  import { isModalOpen } from '$lib/store.js';
</script>

<div id="modal">
  <button id="close-btn" onclick={() => $isModalOpen = false} 
    aria-label="Close modal">&times;</button>
  <h1>Intersections</h1>
</div>

<style>
  #modal {
    position: absolute;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    z-index: 3;
    color: var(--moon-glow-fill);
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 2px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    text-align: center;
    overflow-y: auto;
  }

  #close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    color: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  #close-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin-top: 0;
    font-weight: 500;
  }
</style>