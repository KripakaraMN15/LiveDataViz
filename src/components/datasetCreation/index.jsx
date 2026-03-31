import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import { FileReader } from "@kanaries/web-data-loader";
import { inferDatasetMeta } from "../../utils/inferType";
import Modal from "../modal";
import DataTable from "./dataTable";
import Spinner from "../spinner";

export default function DatasetCreation({ onDatasetCreated }) {
    const fileRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [tmpDataset, setTmpDataset] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileUpload = useCallback((e) => {
        const files = e.target.files;
        if (files !== null) {
            const file = files[0];
            // Validate file type
            if (!file.name.toLowerCase().endsWith('.csv')) {
                alert('Please upload a CSV file');
                return;
            }
            setLoading(true);
            FileReader.csvReader({
                file,
                config: { type: "reservoirSampling", size: Infinity },
                encoding: "utf-8",
            }).then((data) => {
                const dataset = inferDatasetMeta(data);
                setModalOpen(true);
                setTmpDataset(dataset);
            }).catch((error) => {
                alert('Failed to parse CSV file: ' + error.message);
                console.error('CSV parsing error:', error);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, []);

    return (
        <div>
            <button
                type="button"
                disabled={loading}
                style={{
                    background: 'transparent',
                    border: '0.5px solid #444',
                    color: '#888',
                    padding: '10px 12px',
                    fontSize: '11px',
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    if (!loading) {
                        e.target.style.borderColor = '#666';
                        e.target.style.color = '#ccc';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.borderColor = '#444';
                    e.target.style.color = '#888';
                }}
                onClick={() => !loading && fileRef.current?.click()}
            >
                {loading ? <Spinner /> : '↑ Upload CSV'}
            </button>
            <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={fileUpload} />
            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                {tmpDataset && (
                    <DataTable
                        data={tmpDataset.dataSource}
                        metas={tmpDataset.fields}
                        onMetaChange={(fid, fIndex, meta) => {
                            setTmpDataset(produce(tmpDataset, (draft) => {
                                draft.fields[fIndex] = { ...draft.fields[fIndex], ...meta };
                            }));
                        }}
                    />
                )}
                <div>
                    <button
                        type="button"
                        className="ml-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        onClick={() => {
                            if (tmpDataset) onDatasetCreated(tmpDataset);
                            setModalOpen(false);
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </Modal>
        </div>
    );
}
