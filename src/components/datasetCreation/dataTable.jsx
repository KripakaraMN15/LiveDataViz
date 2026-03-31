import { useMemo, useState } from "react";
import styled from "styled-components";
import Pagination from "./pagination";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import DropdownContext from "../dropdownContext";

const Container = styled.div`
    overflow-x: auto;
    max-height: 660px;
    overflow-y: auto;
    table {
        box-sizing: content-box;
        border-collapse: collapse;
        font-size: 12px;
    }
`;

const SEMANTIC_TYPE_LIST = ["nominal", "ordinal", "quantitative", "temporal"];

function getHeaderType(field) {
    return field.semanticType !== "quantitative" ? "text" : "number";
}

function getHeaderClassNames(field) {
    return field.semanticType !== "quantitative"
        ? "border-t-2 border-blue-500"
        : "border-t-2 border-cyan-500";
}

function getSemanticColors(field) {
    switch (field.semanticType) {
        case "nominal": return "border border-transparent bg-blue-50 text-blue-700 font-medium";
        case "ordinal": return "border border-transparent bg-indigo-50 text-indigo-700 font-medium";
        case "quantitative": return "border border-transparent bg-cyan-50 text-cyan-700 font-medium";
        case "temporal": return "border border-transparent bg-slate-50 text-slate-700 font-medium";
        default: return "border border-transparent bg-slate-100 text-slate-600";
    }
}

const DataTable = ({ size = 10, data, metas, onMetaChange }) => {
    const [pageIndex, setPageIndex] = useState(0);

    const semanticTypeList = useMemo(() =>
        SEMANTIC_TYPE_LIST.map((st) => ({ value: st, label: st })),
        []);

    const from = pageIndex * size;
    const to = Math.min((pageIndex + 1) * size, data.length);

    return (
        <Container style={{ borderRadius: '4px', border: '0.5px solid #333', background: '#111' }}>
            <Pagination
                total={data.length}
                from={from + 1}
                to={to + 1}
                onNext={() => setPageIndex(Math.min(Math.ceil(data.length / size) - 1, pageIndex + 1))}
                onPrev={() => setPageIndex(Math.max(0, pageIndex - 1))}
            />
            <table style={{ minWidth: '100%', borderCollapse: 'collapse', fontSize: '12px', background: '#111' }}>
                <thead style={{ background: '#0f0f0f' }}>
                    <tr style={{ borderBottom: '0.5px solid #333' }}>
                        {metas.map((field, fIndex) => (
                            <th key={field.fid} style={{ borderRight: '0.5px solid #333', padding: '12px 16px', textAlign: 'left' }}>
                                <div style={Object.assign({}, { whiteSpace: 'nowrap', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#e8e8e8', fontFamily: "'Space Mono', monospace" })}>
                                    <b>{field.fid}</b>
                                    <div>
                                        <DropdownContext
                                            options={semanticTypeList}
                                            onSelect={(value) => onMetaChange(field.fid, fIndex, { semanticType: value })}
                                        >
                                            <span style={{ cursor: 'pointer', display: 'inline-flex', padding: '4px 8px', fontSize: '11px', fontWeight: 600, marginTop: '8px', borderRadius: '4px', alignItems: 'center', gap: '4px', ...{ "border": "border-transparent", "background-color": getSemanticColors(field).split(" ")[1], "color": getSemanticColors(field).split(" ")[2] } }}>
                                                {field.semanticType}
                                                <ChevronUpDownIcon style={{ width: '12px', marginLeft: '4px' }} />
                                            </span>
                                        </DropdownContext>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ borderTop: '0.5px solid #333', background: '#111' }}>
                    {data.slice(from, to).map((row, index) => (
                        <tr style={{ borderBottom: '0.5px solid #222', background: index % 2 ? '#0f0f0f' : 'transparent', borderRight: '0.5px solid #333' }} key={index}>
                            {metas.map((field) => (
                                <td
                                    key={field.fid + index}
                                    style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: '12px', color: '#888', fontFamily: "'Space Grotesk', system-ui, sans-serif", borderRight: '0.5px solid #333' }}
                                >
                                    {`${row[field.fid]}`}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );
};

export default DataTable;
