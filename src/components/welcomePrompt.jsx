export function WelcomePrompt({ metas, onPromptClick }) {
    const measure = metas.find((meta) => meta.semanticType === "quantitative");
    const dimension =
        metas.find((meta) => meta.semanticType === "temporal") ||
        metas.find((meta) => meta.semanticType === "nominal");
    const firstField = metas.length > 0 ? metas[0].fid : "data";

    const prompts = [
        `Show the distribution of ${measure ? measure.fid : firstField}.`,
        `How does ${measure?.fid} differ across ${dimension?.fid}?`,
        `Recommend a random chart from this dataset for me.`,
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingY: '32px' }}>
            {prompts.map((prompt, pIndex) => (
                <div
                    key={pIndex}
                    onClick={() => onPromptClick?.(prompt)}
                    style={{
                        background: '#111',
                        border: '0.5px solid #222',
                        borderRadius: pIndex === 0 ? '0 8px 8px 0' : '8px',
                        borderLeft: pIndex === 0 ? '2px solid #c0392b' : 'none',
                        color: '#666',
                        padding: '16px',
                        fontSize: '12px',
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        lineHeight: '1.5'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#444';
                        e.currentTarget.style.color = '#aaa';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#222';
                        e.currentTarget.style.color = '#666';
                    }}
                >
                    <p style={{ margin: 0 }}>{prompt}</p>
                </div>
            ))}
        </div>
    );
}
