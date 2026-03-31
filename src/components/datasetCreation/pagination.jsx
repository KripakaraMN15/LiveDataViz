export default function Pagination({ from, to, total, onNext, onPrev }) {
    return (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '0.5px solid #333', background: '#111', padding: '12px 16px' }}>
            <div>
                <p style={{ fontSize: '13px', color: '#888', margin: 0, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                    Showing <span style={{ fontWeight: 600, color: '#e8e8e8' }}>{from}</span> to{" "}
                    <span style={{ fontWeight: 600, color: '#e8e8e8' }}>{to}</span> of{" "}
                    <span style={{ fontWeight: 600, color: '#e8e8e8' }}>{total}</span> results
                </p>
            </div>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', gap: '8px' }}>
                <button
                    onClick={onPrev}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '0.5px solid #333',
                        background: '#111',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontFamily: "'Space Mono', monospace",
                        color: '#666',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = '#555';
                        e.target.style.color = '#aaa';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = '#333';
                        e.target.style.color = '#666';
                    }}
                >
                    Prev
                </button>
                <button
                    onClick={onNext}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '0.5px solid #333',
                        background: '#111',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontFamily: "'Space Mono', monospace",
                        color: '#666',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = '#555';
                        e.target.style.color = '#aaa';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = '#333';
                        e.target.style.color = '#666';
                    }}
                >
                    Next
                </button>
            </div>
        </nav>
    );
}
