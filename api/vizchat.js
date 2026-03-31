export default async function handler(req, res) {
    if (req.method && req.method.toUpperCase() !== "POST") {
        res.status(405).json({ success: false, message: "[livedataviz error] Method not allowed" });
        return;
    }

    const { messages = [], metas = [] } = req.body;

    if (messages.length === 0 || metas.length === 0) {
        res.status(400).json({
            success: false,
            message: "[livedataviz error] messages or metas is empty.",
        });
        return;
    }

    if (!process.env.OPENAI_API_KEY) {
        res.status(500).json({
            success: false,
            message: "[livedataviz error] Missing OPENAI_API_KEY. Set it in your .env (local) or Vercel env vars.",
        });
        return;
    }

    const systemMessage = {
        role: "system",
        content: `You are a great assistant at Vega-Lite visualization creation.

You must always respond with:
1) A brief natural-language summary (1-3 sentences) describing what the chart shows.
2) A valid Vega-Lite specification as JSON inside a Markdown \`\`\`json code block.

You should create the vega-lite specification based on the user's query.

Besides, here are some requirements:
1. Do not contain the key called 'data' in the vega-lite specification.
2. If the user asks many times, you should generate the specification based on the previous context.
3. You should consider aggregating the field if it is quantitative and the chart has a mark type of rect, bar, line, area or arc.
4. Do NOT include extra text after the JSON code block.
4. The available fields in the dataset and their types are:
${metas.map((field) => `${field.fid} (${field.semanticType})`).join(", ")}`,
    };

    const allMessages = [...messages];
    if (allMessages[allMessages.length - 1].role === "user") {
        allMessages[allMessages.length - 1] = {
            ...allMessages[allMessages.length - 1],
            content: `Translate text delimited by triple backticks into a vega-lite specification in JSON string.\n\`\`\`\n${allMessages[allMessages.length - 1].content}\n\`\`\``,
        };
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || "gpt-4o",
                messages: [systemMessage, ...allMessages],
                temperature: 0.05,
            }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const msg = data?.error?.message || `OpenAI API error (status ${response.status})`;
            res.status(response.status).json({
                success: false,
                message: `[livedataviz error] ${msg}`,
                error: data?.error ?? data ?? null,
            });
            return;
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `[livedataviz error] ${error.message}`,
        });
    }
}
