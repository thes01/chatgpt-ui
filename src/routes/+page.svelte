<script lang="ts">
    import "../app.css";

    import type { ChatMessage } from "chatgpt";
    import SvelteMarkdown from "svelte-markdown";

    interface ChatHistoryItem {
        user: 'user' | 'bot',
        message: string,
        messageId?: string
    }

    let history: ChatHistoryItem[] = [
    ];
    let prompt = "";
    let error = false;
    let last_bot_id: string | undefined;

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

        await queryChatgpt(_prompt, last_bot_id, (message) => {
            if (history[history.length - 1].messageId === message.id) {
                history[history.length - 1].message = message.text;
            } else {
                history = [...history, {
                    user: 'bot',
                    message: message.text,
                    messageId: message.id
                }]
                last_bot_id = message.id;
            }
        });
    }

    async function retryLast() {
        // const last = history[history.length - 1];
        // const response = await queryChatgpt(last.message, last.messageId);
        // if (response !== undefined) {
        //     history = [...history, {
        //         user: 'bot',
        //         message: response.text,
        //         messageId: response.id
        //     }]
        // }
    }

    async function queryChatgpt(prompt: string, last_id?: string, on_update?: (resp: ChatMessage) => void) {
        let url = '/api/chatgpt?query=' + prompt;
        if (last_id) {
            url += '&last-id=' + last_id;
        }
        const ac = new AbortController();
        const signal = ac.signal;

        const response = await fetch(url, { signal });
        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

        while (true && reader !== undefined) {
            const { value, done } = await reader.read();
            try {
                const resp = JSON.parse(value ?? '') as ChatMessage;
                if (on_update) {
                    on_update(resp);
                }
            } catch {
            }
            if (done) break;
        }
        
        // if (resp.ok) {
        //     return await resp.json() as ChatMessage;
        // } else {
        //     error = true;
        //     console.log("error:", { resp });
        // }
    }
</script>

{#if error}
    <p>There was an error</p>
    <button on:click={retryLast}>Retry</button>
{/if}

<h1 class="text-xl mb-3">Konverzace s chatbotem</h1>
{#each history as item}
    <div class="flex prose prose-p:text-left -my-5">
        <div class="w-20 shrink-0">
            {#if item.user === 'user'}
                <p>Uživatel</p>
            {:else}
                <p>Chatbot</p>
            {/if}
        </div>
        <div>
            <SvelteMarkdown source={item.message}></SvelteMarkdown>
        </div>
    </div>
{/each}

<p class="mt-10">Váš dotaz: </p>

<div class="flex">
    <span 
        class="input border-black border-2 w-full mr-2" 
        role="textbox" 
        contenteditable bind:innerHTML={prompt}>
            
    </span>
    <!-- <textarea bind:value={prompt} class="border-black border-2 w-full mr-2"></textarea> -->
    <button on:click={submitPrompt} class="p-4 bg-gray-200">OK</button>
</div>

