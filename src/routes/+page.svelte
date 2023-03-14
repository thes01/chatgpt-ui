<script lang="ts">
    import "../app.css";

    let resp = "";
    let prompt = "";
</script>

<p>Prompt: </p>
<input type="text" bind:value={prompt} class="border-black border-2 w-full">

<!-- <button on:click={() => getResponse(prompt)}>Submit</button> -->

<h1>Response:</h1>
<p>{ resp }</p>