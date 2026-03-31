export function matchQuote(str, left, right) {
    let stack = 0;
    let start = -1;
    let end = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === left) {
            if (stack === 0) start = i;
            stack++;
        }
        if (str[i] === right) {
            stack--;
            if (stack === 0) {
                end = i;
                break;
            }
        }
    }
    if (start !== -1 && end !== -1) {
        return str.substring(start, end + 1);
    }
    return null;
}

export function getValidVegaSpec(content) {
    const raw = matchQuote(content, "{", "}");
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }
    return null;
}

export function extractTextAndSpec(content) {
    let spec = null;
    let text = content;

    // Fast-path: response is pure JSON
    const trimmed = content?.trim?.() ?? "";
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
            spec = JSON.parse(trimmed);
            text = "";
            return { text, spec };
        } catch {
            // fall through
        }
    }

    // First, try to extract JSON from Markdown code blocks (```json...```)
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    let jsonMatch = codeBlockRegex.exec(content);

    if (jsonMatch) {
        try {
            const jsonStr = jsonMatch[1].trim();
            spec = JSON.parse(jsonStr);
            // Remove the entire code block from text
            text = content.replace(codeBlockRegex, "").trim();
            // Clean up any trailing/leading punctuation and newlines
            text = text.replace(/^[\s,.;:!?]+|[\s,.;:!?]+$/g, "").trim();
        } catch (e) {
            // If parsing fails, try the old method
            const raw = matchQuote(content, "{", "}");
            if (raw) {
                try {
                    spec = JSON.parse(raw);
                    text = content.replace(raw, "").trim();
                    text = text.replace(/^[\s,.;:!?]+|[\s,.;:!?]+$/g, "").trim();
                } catch (e2) {
                    spec = null;
                    text = content;
                }
            }
        }
    } else {
        // Fallback: look for JSON without code blocks
        const raw = matchQuote(content, "{", "}");
        if (raw) {
            try {
                spec = JSON.parse(raw);
                text = content.replace(raw, "").trim();
                text = text.replace(/^[\s,.;:!?]+|[\s,.;:!?]+$/g, "").trim();
            } catch (e) {
                spec = null;
                text = content;
            }
        }
    }

    return { text, spec };
}
