import { useCallback, useEffect, useState } from "react";
import { chatCompletion } from "./services/llm";
import { matchQuote, extractTextAndSpec } from "./utils";
import VizChat from "./components/vizChat";
import SelectMenu from "./components/selectMenu";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/20/solid";
import Spinner from "./components/spinner";
import DatasetCreation from "./components/datasetCreation";
import DataTable from "./components/datasetCreation/dataTable";
import { produce } from "immer";
import { useNotification } from "./components/notify/useNotification";
import { WelcomePrompt } from "./components/welcomePrompt";

const EXAMPLE_DATASETS = [
    { key: "cars", name: "Cars Dataset", url: "/datasets/cars.json", type: "demo" },
    { key: "students", name: "Students Dataset", url: "/datasets/students.json", type: "demo" },
];

const HomePage = function HomePage() {
    const [userQuery, setUserQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataset, setDataset] = useState(null);
    const [dsList, setDsList] = useState(EXAMPLE_DATASETS);
    const [pivotKey, setPivotKey] = useState("viz");
    const [datasetKey, setDatasetKey] = useState(EXAMPLE_DATASETS[0].key);
    const [chat, setChat] = useState([]);
    const { notify } = useNotification();

    useEffect(() => {
        const currentDatasetInfo = dsList.find((ds) => ds.key === datasetKey) ?? dsList[0];
        if (currentDatasetInfo.type === "demo") {
            fetch(currentDatasetInfo.url)
                .then((res) => res.json())
                .then((res) => setDataset(res))
                .catch(() => notify({ title: "Error", message: "Dataset not found", type: "error" }, 3000));
        } else {
            setDataset(currentDatasetInfo.dataset);
        }
    }, [datasetKey, dsList, notify]);

    // Clear chat history when dataset changes to avoid mismatched field references
    useEffect(() => {
        setChat([]);
    }, [datasetKey]);

    const startQuery = useCallback(() => {
        setLoading(true);
        const latestQuery = { role: "user", content: userQuery };
        const fields = dataset?.fields ?? [];
        chatCompletion([...chat, latestQuery], fields)
            .then((res) => {
                if (res.choices.length > 0) {
                    const { text, spec } = extractTextAndSpec(res.choices[0].message.content);
                    const assistantMessage = {
                        role: "assistant",
                        content: text || res.choices[0].message.content,
                        vegaSpec: spec
                    };
                    setChat([...chat, latestQuery, assistantMessage]);
                }
            })
            .catch((err) => notify({ title: "Error", message: err.message, type: "error" }, 3000))
            .finally(() => {
                setLoading(false);
                setUserQuery("");
            });
    }, [userQuery, chat, dataset, notify]);

    const clearChat = useCallback(() => setChat([]), []);

    const feedbackHandler = useCallback((messages, mIndex, action) => {
        notify({ title: "Feedback", message: "Thanks for your feedback!", type: "success" }, 1000);
    }, [notify]);

    return (
        <div style={{ background: '#0d0d0d', minHeight: '100vh' }} className="px-4">
            <div style={{ paddingTop: '32px', paddingBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                <h1 className="logo">
                    <span className="logo-live">Live</span><span className="logo-data">Data</span><span className="logo-viz">Viz</span><span className="logo-dot">·</span>
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <SelectMenu
                        label="DATASET"
                        items={dsList}
                        selectedKey={datasetKey}
                        onChange={(dsKey) => setDatasetKey(dsKey)}
                    />
                </div>
                <DatasetCreation
                    onDatasetCreated={(ds) => {
                        const k = "custom" + dsList.length;
                        setDsList((l) => [...l, { name: "Custom Dataset " + l.length, key: k, dataset: ds, type: "custom" }]);
                        setDatasetKey(k);
                    }}
                />
                <div style={{ flex: 1 }} />
                <div style={{ border: '0.5px solid #333', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                    <button
                        type="button"
                        style={{
                            background: pivotKey === "viz" ? "#1a1a1a" : "#111",
                            color: pivotKey === "viz" ? "#e8e8e8" : "#d6cfcf",
                            border: 'none',
                            borderRight: pivotKey === "viz" ? '0.5px solid #333' : 'none',
                            padding: '10px 16px',
                            fontSize: '11px',
                            fontFamily: "'Space Mono', monospace",
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => setPivotKey("viz")}
                    >
                        Chat To Viz
                    </button>
                    <button
                        type="button"
                        style={{
                            background: pivotKey === "data" ? "#1a1a1a" : "#111",
                            color: pivotKey === "data" ? "#e8e8e8" : "#d6cfcf",
                            border: 'none',
                            borderLeft: pivotKey === "data" ? '0.5px solid #333' : 'none',
                            padding: '10px 16px',
                            fontSize: '11px',
                            fontFamily: "'Space Mono', monospace",
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => setPivotKey("data")}
                    >
                        Data
                    </button>
                </div>
            </div>

            {pivotKey === "viz" && (
                <div className="flex flex-col space-between">
                    {dataset && chat.length === 0 && (
                        <WelcomePrompt metas={dataset.fields} onPromptClick={(p) => setUserQuery(p)} />
                    )}
                    {dataset && chat.length > 0 && (
                        <VizChat
                            dataset={dataset}
                            messages={chat}
                            onDelete={(message, mIndex) => {
                                setChat((c) => {
                                    const newChat = [...c];
                                    newChat.splice(message.role === "user" ? mIndex : mIndex - 1, 2);
                                    return newChat;
                                });
                            }}
                            onUserFeedback={feedbackHandler}
                        />
                    )}
                    <div style={{ display: 'flex', border: '0.5px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden', marginTop: '32px', marginBottom: '32px' }}>
                        <button
                            type="button"
                            style={{
                                background: '#111',
                                border: 'none',
                                borderRight: '0.5px solid #2a2a2a',
                                color: '#444',
                                padding: '12px 16px',
                                fontSize: '10px',
                                fontFamily: "'Space Mono', monospace",
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.4 : 1,
                                transition: 'all 0.2s'
                            }}
                            disabled={loading}
                            onClick={clearChat}
                        >
                            Clear {!loading && <TrashIcon className="w-3 ml-2" style={{ display: 'inline' }} />}
                        </button>
                        <input
                            type="text"
                            style={{
                                flex: 1,
                                background: '#0f0f0f',
                                color: '#777',
                                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                                fontSize: '14px',
                                border: 'none',
                                padding: '12px 16px',
                                outline: 'none'
                            }}
                            placeholder="What visualization do you want to draw from the dataset?"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !loading && userQuery.length > 0) startQuery(); }}
                        />
                        <button
                            type="button"
                            style={{
                                background: loading || userQuery.length === 0 ? 'rgba(192, 57, 43, 0.4)' : '#e21e08',
                                color: 'white',
                                border: 'none',
                                padding: '12px 16px',
                                fontSize: '11px',
                                fontFamily: "'Space Mono', monospace",
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                cursor: loading || userQuery.length === 0 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                            disabled={loading || userQuery.length === 0}
                            onClick={startQuery}
                            onMouseEnter={(e) => !loading && userQuery.length > 0 && (e.target.style.background = '#d12717')}
                            onMouseLeave={(e) => !loading && userQuery.length > 0 && (e.target.style.background = '#e21e08')}
                        >
                            Visualize
                            {!loading && <PaperAirplaneIcon className="w-3 ml-2" style={{ display: 'inline' }} />}
                            {loading && <Spinner />}
                        </button>
                    </div>
                </div>
            )}

            {pivotKey === "data" && dataset && (
                <div>
                    <DataTable
                        data={dataset.dataSource}
                        metas={dataset.fields}
                        onMetaChange={(fid, fIndex, meta) => {
                            setDataset(produce(dataset, (draft) => {
                                draft.fields[fIndex] = { ...draft.fields[fIndex], ...meta };
                            }));
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
