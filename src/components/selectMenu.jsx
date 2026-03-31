import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function SelectMenu({ label, items, selectedKey, onChange }) {
    const selectedItem = items.find((item) => item.key === selectedKey);

    return (
        <Listbox value={selectedKey} onChange={onChange}>
            {({ open }) => (
                <>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: "'Space Mono', monospace", fontWeight: 600, color: '#e8e8e8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {label}
                    </label>
                    <div style={{ position: 'relative', minWidth: '200px' }}>
                        <Listbox.Button style={{
                            position: 'relative',
                            width: '100%',
                            padding: '10px 12px',
                            background: '#111',
                            border: '0.5px solid #333',
                            borderRadius: '4px',
                            color: '#ccc',
                            fontSize: '13px',
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'left'
                        }} onFocus={(e) => e.target.style.outline = '1px solid #c0392b'} onBlur={(e) => e.target.style.outline = 'none'}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', background: '#27ae60', borderRadius: '50%', flexShrink: 0 }} />
                                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedItem?.name}</span>
                            </span>
                            <ChevronUpDownIcon style={{ width: '16px', height: '16px', color: '#555', flexShrink: 0, pointerEvents: 'none' }} />
                        </Listbox.Button>
                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options style={{
                                position: 'absolute',
                                zIndex: 10,
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: '4px',
                                background: '#111',
                                border: '0.5px solid #333',
                                borderRadius: '4px',
                                maxHeight: '240px',
                                overflowY: 'auto',
                                outline: 'none'
                            }}>
                                {items.map((item) => (
                                    <Listbox.Option key={item.key} value={item.key} as={Fragment}>
                                        {({ selected, active }) => (
                                            <div
                                                style={{
                                                    padding: '10px 12px',
                                                    fontSize: '12px',
                                                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                                                    color: active ? 'white' : '#666',
                                                    background: active ? '#1a1a1a' : 'transparent',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <span style={{ width: '8px', height: '8px', background: '#27ae60', borderRadius: '50%', flexShrink: 0 }} />
                                                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: selected ? 600 : 400 }}>
                                                    {item.name}
                                                </span>
                                                {selected && <CheckIcon style={{ width: '14px', marginLeft: 'auto', color: '#c0392b', flexShrink: 0 }} />}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
}
