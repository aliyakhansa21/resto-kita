export function getImageUrl(path: string | null | undefined): string | null {
    if (!path) return null; 
    
    if (path.startsWith("http")) return path;
    
    const backendUrl = "https://resto-kita-production-1fa0.up.railway.app";
    return `${backendUrl}/storage/${path.replace(/^\//, '')}`;
}