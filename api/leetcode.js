// Vercel serverless entry point for `GET /api/leetcode`.
// The implementation lives in ../server so the Vite dev server can reuse the
// exact same handler locally (see vite.config.js).
import leetcodeHandler from "../server/leetcodeHandler.js";

export default leetcodeHandler;
