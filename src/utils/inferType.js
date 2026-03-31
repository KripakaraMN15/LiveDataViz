const COMMON_TIME_FORMAT = [
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{4}\/\d{2}\/\d{2}$/,
    /^\d{4}\.\d{2}\.\d{2}$/,
    /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
];

export function isDateTimeArray(data) {
    return data.every((d) => COMMON_TIME_FORMAT.some((r) => r.test(d)));
}

export function isNumericArray(data) {
    return data.every((item) => {
        if (typeof item === "number") return true;
        const number = parseFloat(item);
        return !isNaN(number) && isFinite(number);
    });
}

export function inferSemanticType(data, fid) {
    const values = data.map((row) => row[fid]);
    let st = isNumericArray(values) ? "quantitative" : "nominal";
    if (st === "nominal" && isDateTimeArray(data.map((row) => `${row[fid]}`))) {
        st = "temporal";
    }
    return st;
}

export function inferDatasetMeta(data) {
    if (data.length === 0) return { fields: [], dataSource: data };
    const keys = Object.keys(data[0]);
    const fields = keys.map((key) => ({
        fid: key,
        name: key,
        semanticType: inferSemanticType(data, key),
    }));
    return { fields, dataSource: data };
}
