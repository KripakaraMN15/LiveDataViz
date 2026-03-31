import React, { useRef } from "react";
import styled from "styled-components";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Background = styled.div({
    position: "fixed",
    left: 0,
    top: 0,
    width: "100vw",
    height: "100vh",
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
});

const Container = styled.div`
    width: 98%;
    @media (min-width: 600px) { width: 80%; }
    @media (min-width: 1100px) { width: 880px; }
    max-height: 800px;
    overflow: auto;
    > div.container { padding: 0.5em 1em 1em 1em; }
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    z-index: 1000;
`;

const Modal = ({ onClose, title, show, children }) => {
    const prevMouseDownTimeRef = useRef(0);
    return (
        <Background
            className={show ? "block" : "hidden"}
            onMouseDown={() => (prevMouseDownTimeRef.current = Date.now())}
            onMouseOut={() => (prevMouseDownTimeRef.current = 0)}
            onMouseUp={() => {
                if (Date.now() - prevMouseDownTimeRef.current < 1000) onClose?.();
            }}
        >
            <Container
                role="dialog"
                style={{ background: '#111', border: '0.5px solid #333' }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', display: 'block' }}>
                    <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.target.style.color = '#888'}
                        onMouseLeave={(e) => e.target.style.color = '#555'}
                        onClick={() => onClose?.()}
                    >
                        <span style={{ display: 'none' }}>Close</span>
                        <XMarkIcon style={{ width: '24px', height: '24px' }} />
                    </button>
                </div>
                <div style={{ padding: '24px', fontSize: '16px', fontWeight: 600, color: '#e8e8e8', fontFamily: "'Space Mono', monospace" }}>{title}</div>
                <div className="container">{children}</div>
            </Container>
        </Background>
    );
};

export default Modal;
