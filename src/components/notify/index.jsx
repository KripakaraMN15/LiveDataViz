import { Fragment, useState, createContext, useCallback, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

export const NotificationContext = createContext(null);

function getNotificationIcon(type) {
    switch (type) {
        case "success":
            return <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#27ae60' }} />;
        case "error":
            return <XMarkIcon style={{ width: '24px', height: '24px', color: '#c0392b' }} />;
        case "info":
            return <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#3b82f6' }} />;
        case "warning":
            return <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#f59e0b' }} />;
        default:
            return null;
    }
}

const NotificationWrapper = ({ children }) => {
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const notify = useCallback((not, t) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShow(true);
        setNotification(not);
        timeoutRef.current = setTimeout(() => setShow(false), t);
    }, []);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            {notification && (
                <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <Transition
                            show={show}
                            as={Fragment}
                            enter="transform ease-out duration-300 transition"
                            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '448px', overflowHidden: 'hidden', borderRadius: '4px', background: '#1a1a1a', border: '0.5px solid #333' }}>
                                <div style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ flexShrink: 0 }}>{getNotificationIcon(notification.type)}</div>
                                        <div style={{ marginLeft: '12px', flex: 1, paddingTop: '4px' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0, fontFamily: "'Space Mono', monospace" }}>{notification.title}</p>
                                            <p style={{ marginTop: '4px', fontSize: '13px', color: '#888', margin: 0, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>{notification.message}</p>
                                        </div>
                                        <div style={{ marginLeft: '16px', display: 'flex', flexShrink: 0 }}>
                                            <button
                                                type="button"
                                                style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
                                                onMouseEnter={(e) => e.target.style.color = '#888'}
                                                onMouseLeave={(e) => e.target.style.color = '#555'}
                                                onClick={() => setShow(false)}
                                            >
                                                <span style={{ display: 'none' }}>Close</span>
                                                <XMarkIcon style={{ width: '18px', height: '18px' }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export default NotificationWrapper;
