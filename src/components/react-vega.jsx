import { useEffect, useRef } from "react";
import embed, { vega } from "vega-embed";

const ReactVega = ({ spec, data }) => {
    const container = useRef(null);

    useEffect(() => {
        if (container.current && data) {
            const specCopy = { ...spec, data: { name: "dataSource" } };
            const darkThemeConfig = {
                actions: false,
                config: {
                    background: "transparent",
                    axis: {
                        gridColor: "#1e1e1e",
                        domainColor: "#333",
                        tickColor: "#333",
                        labelColor: "#555",
                        titleColor: "#555",
                        labelFont: "'Space Mono', monospace",
                        titleFont: "'Space Mono', monospace",
                        labelFontSize: 9
                    },
                    // Default chart colors (unless user sets explicit colors in spec)
                    range: {
                        category: ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb", "#1d4ed8", "#0ea5e9"],
                    },
                    bar: { fill: "#3b82f6" },
                    line: { stroke: "#3b82f6", strokeWidth: 2 },
                    point: { filled: true, fill: "#3b82f6" },
                    area: { color: "#3b82f6", opacity: 0.35 },
                    view: { stroke: "transparent" },
                    title: { color: "#555", font: "'Space Mono', monospace", fontSize: 10 }
                }
            };
            embed(container.current, specCopy, darkThemeConfig).then((res) => {
                res.view.change("dataSource", vega.changeset().remove(() => true).insert(data));
                res.view.resize();
                res.view.runAsync();
            });
        }
    }, [spec, data]);

    return <div ref={container}></div>;
};

export default ReactVega;
