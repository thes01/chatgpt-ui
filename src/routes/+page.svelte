<script lang="ts">
    import "../app.css";
    import type { ChatMessage } from "chatgpt";

    interface ChatHistoryItem {
        user: 'user' | 'bot',
        message: string,
        messageId?: string
    }

    let history: ChatHistoryItem[] = [];
    let prompt = "";
    let error = false;

    function onPromptKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            submitPrompt();
        }
    }

    async function submitPrompt() {
        const _prompt = prompt;
        history = [...history, {
            user: 'user',
            message: _prompt
        }];
        prompt = "";
        const response = await queryChatgpt(_prompt);
        if (response !== undefined) {
            history = [...history, {
                user: 'bot',
                message: response.text,
                messageId: response.id
            }]
        }
    }

    async function retryLast() {
        const last = history[history.length - 1];
        const response = await queryChatgpt(last.message, last.messageId);
        if (response !== undefined) {
            history = [...history, {
                user: 'bot',
                message: response.text,
                messageId: response.id
            }]
        }
    }

    async function queryChatgpt(prompt: string, last_id?: string) {
        let url = '/api/chatgpt?query=' + prompt;
        if (last_id) {
            url += '&last-id' + last_id;
        }
        const resp = await fetch(url);
        
        if (resp.ok) {
            return await resp.json() as ChatMessage;
        } else {
            error = true;
            console.log("error:", { resp });
        }
    }
</script>


<h1>Conversation:</h1>
{#each history as item}
    <p>{item.user}: {item.message}</p>
{/each}

{#if error}
    <p>There was an error</p>
    <button on:click={retryLast}>Retry</button>
{/if}

<p class="mt-10">Prompt: </p>
<input type="text" bind:value={prompt} on:keydown={onPromptKeyDown} class="border-black border-2 w-full">
<button on:click={submitPrompt}>Submit</button>
