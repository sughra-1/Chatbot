// qwen3 can write its reasoning before the answer, either inside
// <think>...</think> or (thinking models) as plain text ending with </think>.
// Keep only the part after the reasoning, so the user sees the final answer.
export const cleanAnswer = (text = '') => {
    let answer = String(text);

    // Everything before the last </think> is reasoning
    if (answer.includes('</think>')) {
        answer = answer.slice(answer.lastIndexOf('</think>') + '</think>'.length);
    }

    // A <think> block that was never closed
    answer = answer.replace(/<think>[\s\S]*/g, '');

    return answer.trim();
};
