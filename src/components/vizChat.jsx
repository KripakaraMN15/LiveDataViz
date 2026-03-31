import { useEffect, useRef } from "react";
import ReactVega from "./react-vega";
import { HandThumbDownIcon, HandThumbUpIcon, TrashIcon } from "@heroicons/react/20/solid";
import DataTable from "./datasetCreation/dataTable";
const VizChat = ({ messages, dataset, onDelete, onUserFeedback }) => {
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div style={{ background: '#0a0a0a', border: '0.5px solid #1e1e1e', borderRadius: '4px', overflowY: 'auto', maxHeight: '80vh' }} ref={container}>
            {messages.map((message, index) => {
                if (message.role === "assistant") {
                    // Check if vegaSpec is already extracted (new format)
                    const spec = message.vegaSpec;
                    const text = message.content;

                    return (
                        <div style={{ padding: '24px', display: 'flex', borderBottom: index === messages.length - 1 ? 'none' : '0.5px solid #1e1e1e' }} key={index}>
                            <div style={{ flexShrink: 0 }}>
                                <div className="ai-avatar">
                                    <div className="ai-avatar-square" />
                                </div>
                            </div>
                            <div style={{ flex: 1, paddingLeft: '24px' }}>
                                {/* Display text response */}
                                {text && (
                                    <p style={{ color: '#e8e8e8', fontSize: '13px', fontFamily: "'Space Grotesk', system-ui, sans-serif", margin: '0 0 16px 0', lineHeight: '1.5' }}>
                                        {text}
                                    </p>
                                )}
                                {/* Display visualization if spec exists */}
                                {spec && (
                                    <div style={{ marginTop: '16px' }}>
                                        <ReactVega spec={spec} data={dataset.dataSource ?? []} />
                                    </div>
                                )}
                                {/* If neither text nor spec, show empty state */}
                                {!text && !spec && (
                                    <p style={{ color: '#666', fontSize: '13px', fontFamily: "'Space Grotesk', system-ui, sans-serif", margin: 0, fontStyle: 'italic' }}>
                                        No response
                                    </p>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingLeft: '16px', flexShrink: 0 }}>
                                <HandThumbUpIcon
                                    style={{ width: '16px', height: '16px', color: '#333', cursor: 'pointer', transition: 'color 0.2s' }}
                                    onClick={() => index > 0 && onUserFeedback?.([messages[index - 1], message], index, "like")}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#888'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                                />
                                <HandThumbDownIcon
                                    style={{ width: '16px', height: '16px', color: '#333', cursor: 'pointer', transition: 'color 0.2s' }}
                                    onClick={() => index > 0 && onUserFeedback?.([messages[index - 1], message], index, "dislike")}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#888'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                                />
                                <TrashIcon
                                    style={{ width: '16px', height: '16px', color: '#333', cursor: 'pointer', transition: 'color 0.2s' }}
                                    onClick={() => onDelete?.(message, index)}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#888'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                                />
                            </div>
                        </div>
                    );
                }
                return (
                    <div style={{ padding: '24px', display: 'flex', background: '#111', borderBottom: index === messages.length - 1 ? 'none' : '0.5px solid #1e1e1e' }} key={index}>
                        <div style={{ flexShrink: 0 }}>
                            <div style={{ width: '28px', height: '28px', background: '#1c1c1c', border: '0.5px solid #333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#555', fontWeight: 700 }}>U</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '24px' }}>
                            <p style={{ color: '#e8e8e8', fontSize: '13px', fontFamily: "'Space Grotesk', system-ui, sans-serif", margin: 0, fontWeight: 500 }}>{message.content}</p>
                        </div>
                        <div style={{ flexShrink: 0, paddingLeft: '16px' }}>
                            <TrashIcon
                                style={{ width: '16px', height: '16px', color: '#333', cursor: 'pointer', transition: 'color 0.2s' }}
                                onClick={() => onDelete?.(message, index)}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#888'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VizChat;
