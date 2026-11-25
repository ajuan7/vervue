import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { gradeSession } from "./grade.js";

const PORT = Number(process.env.PORT ?? 8080);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function send(res: ServerResponse, status: number, body: unknown) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
}

// Constant time compare so the secret can't be guessed from response timing
function authorised(header: string | undefined) {
    const secret = process.env.GRADER_SECRET;
    if (!secret || !header) return false;
    const a = Buffer.from(header);
    const b = Buffer.from(secret);
    return a.length === b.length && timingSafeEqual(a, b);
}

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
            if (data.length > 1024) {
                reject(new Error("Body too large"));
                req.destroy();
            }
        });
        req.on("end", () => resolve(data));
        req.on("error", reject);
    });
}

const server = createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/grade") {
        return send(res, 404, { error: "Not found" });
    }

    if (!authorised(req.headers["x-grader-secret"] as string | undefined)) {
        return send(res, 401, { error: "Unauthorised" });
    }

    let sessionId: unknown;
    try {
        sessionId = JSON.parse(await readBody(req)).sessionId;
    } catch {
        return send(res, 400, { error: "Invalid JSON" });
    }

    if (typeof sessionId !== "string" || !UUID.test(sessionId)) {
        return send(res, 400, { error: "sessionId must be a UUID" });
    }

    try {
        console.log("GRADING STARTED", sessionId);
        const result = await gradeSession(sessionId);
        console.log("GRADING DONE", sessionId, result);

        // non-200 makes the queue retry, and finished rows are skipped next time
        return send(res, result.failed > 0 ? 500 : 200, result);
    } catch (err) {
        console.error("GRADING ERROR", sessionId, err);
        return send(res, 500, { error: "Grading failed" });
    }
});

server.listen(PORT, () => console.log(`Grader listening on ${PORT}`));