import { backendUrl } from "../config";

function imageLiveUrl(documentPath) {
    if (typeof documentPath !== 'string' || !documentPath) return null;
    // Remove any leading slashes or backslashes from the document path
    const cleanedPath = documentPath.replace(/^\/|\\/, '/');

    // Combine the cleaned document path with the base URL
    const liveUrl = `${backendUrl}/${cleanedPath}`;

    return liveUrl;
}

export default imageLiveUrl;

