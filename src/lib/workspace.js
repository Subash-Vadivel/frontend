// App pages live under /w/:businessId so a reload or shared link opens the same workspace.
export const workspacePath = (businessId, path = '/dashboard') => `/w/${businessId}${path.startsWith('/') ? path : `/${path}`}`;

// "/w/<id>/reports/abc" -> "/reports/abc"
export const stripWorkspace = (pathname) => pathname.replace(/^\/w\/[^/]+/, '') || '/';
