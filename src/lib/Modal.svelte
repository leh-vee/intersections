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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background-color: rgba(255, 255, 255, 0);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  #close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
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
    text-align: center;
    margin: 10px;
    padding: 0;
    font-family: "Bitcount Prop Single", system-ui;
    color: gold;
    font-weight: 300;
    font-size: 13dvw;
  }
</style>