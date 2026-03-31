export async function chatCompletion(messages, metas) {
    const url = `/api/vizchat`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, metas }),
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        // Check if response is ok
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error: ${res.status} ${res.statusText}. ${text}`);
        }

        // Check if response has content
        const contentLength = res.headers.get('content-length');
        if (contentLength === '0' || !res.headers.get('content-type')?.includes('application/json')) {
            throw new Error('API returned empty or non-JSON response. Make sure the backend API is running.');
        }

        const result = await res.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message ?? "Unknown error from API");
        }
    } catch (error) {
        if (error instanceof SyntaxError && error.message.includes('Unexpected end of JSON')) {
            throw new Error('API returned invalid JSON response. Check that your backend server is running on port 3000 or use "vercel dev" instead.');
        }
        if (error.name === 'AbortError') {
            throw new Error('API request timed out. The server took too long to respond. Check that your backend API is running.');
        }
        throw error;
    }
}
