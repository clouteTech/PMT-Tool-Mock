export const environment = {
    production: false,
    // baseUrl: 'http://192.168.1.17:2630/envision/api/v1/'
    baseUrl: 'http://localhost:2630/envision/api/v1/',

    // Demo mode: when true, every API call fails instantly (no network wait) so screens
    // load their mock/dummy fallback data immediately instead of waiting on a timeout
    // against an unreachable backend. Set to false once this build points at a real,
    // reachable backend.
    useMockData: true
};
