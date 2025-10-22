/**
 * Utility functions for secure job URL handling
 */

/**
 * Encode a job ID for use in URLs (simple base64 encoding for now)
 * In production, use proper encryption or UUIDs
 */
export function encodeJobId(jobId: string | number): string {
    const idString = jobId.toString();
    return Buffer.from(idString).toString("base64url");
}

/**
 * Decode a job ID from URL parameter
 */
export function decodeJobId(encodedId: string): string {
    try {
        return Buffer.from(encodedId, "base64url").toString();
    } catch {
        throw new Error("Invalid job ID");
    }
}
