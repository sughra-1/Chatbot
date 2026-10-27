import { ToolMessage } from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';
import { assistantPrompt } from './prompts.ai.js';
import { tools } from './tools.ai.js';

const llmWithTools = llm.bindTools(tools);
const MAX_STEPS = 5;

export const invokeAssistant = async (question, history) => {
    const messages = await assistantPrompt.formatMessages({ question, history });

    for (let step = 0; step < MAX_STEPS; step++) {
        const response = await llmWithTools.invoke(messages);

        if (!response.tool_calls?.length) {
            return response.content;
        }

        messages.push(response);

        for (const toolCall of response.tool_calls) {
            const selectedTool = tools.find((t) => t.name === toolCall.name);
            const result = selectedTool
                ? await selectedTool.invoke(toolCall.args)
                : `Unknown tool: ${toolCall.name}`;

            messages.push(new ToolMessage({
                content: String(result),
                tool_call_id: toolCall.id
            }));
        }
    }

    return 'I could not complete your request. Please try again.';
};
