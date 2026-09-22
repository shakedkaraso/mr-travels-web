import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

// Dev-only bridge for the Visual Editor's /__ve/* contract. Every handler
// below refuses outright when NODE_ENV isn't "development" — in a
// production deploy this route still technically ships (it's server-only
// code, never sent to the browser as JS either way), but it behaves as if
// it doesn't exist: 404 for everything, no client files served, no save
// endpoint reachable.

const PROJECT_ROOT = path.resolve(process.cwd());
const CLIENT_DIR = path.join(PROJECT_ROOT, ".visual-editor", "client");

const CONTENT_TYPES: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function notFoundInProd() {
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

function isDev() {
  return process.env.NODE_ENV === "development";
}

// Lazily required (CommonJS) so this whole bridge — and its dependency on
// @babel/parser/@babel/traverse in .visual-editor/node_modules — is never
// touched by webpack/the production bundle analysis. A *static* relative
// path is required here (not a runtime-computed one): Turbopack statically
// analyzes `require()` call sites and refuses to resolve a computed path
// ("server relative imports are not implemented yet").
function loadBridge() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createBridge } = require("../../../../.visual-editor/server/index.js");
  return createBridge(PROJECT_ROOT);
}

export async function GET(req: NextRequest, ctx: RouteContext<"/__ve/[...ve]">) {
  if (!isDev()) return notFoundInProd();
  const { ve } = await ctx.params;
  const segments = ve || [];

  if (segments[0] === "client") {
    const rel = segments.slice(1).join("/");
    const abs = path.join(CLIENT_DIR, rel);
    if (!abs.startsWith(CLIENT_DIR) || !fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const ext = path.extname(abs);
    const body = fs.readFileSync(abs);
    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: { "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream" },
    });
  }

  if (segments[0] === "locate") {
    try {
      const bridge = loadBridge();
      const targetId = req.nextUrl.searchParams.get("targetId") || "";
      return NextResponse.json(bridge.handleLocate({ targetId }));
    } catch (err) {
      const e = err as { status?: number; message: string };
      return NextResponse.json({ error: e.message }, { status: e.status || 400 });
    }
  }

  if (segments[0] === "verify") {
    const bridge = loadBridge();
    return NextResponse.json(bridge.handleVerify());
  }

  return NextResponse.json({ error: "Unknown Visual Editor endpoint" }, { status: 404 });
}

export async function POST(req: NextRequest, ctx: RouteContext<"/__ve/[...ve]">) {
  if (!isDev()) return notFoundInProd();
  const { ve } = await ctx.params;
  const segments = ve || [];

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const bridge = loadBridge();

  if (segments[0] === "save") {
    try {
      return NextResponse.json(bridge.handleSave(body));
    } catch (err) {
      const e = err as { status?: number; message: string; details?: unknown };
      return NextResponse.json({ error: e.message, details: e.details || null }, { status: e.status || 500 });
    }
  }

  if (segments[0] === "rollback") {
    try {
      return NextResponse.json(bridge.handleRollback(body));
    } catch (err) {
      const e = err as { status?: number; message: string };
      return NextResponse.json({ error: e.message }, { status: e.status || 400 });
    }
  }

  return NextResponse.json({ error: "Unknown Visual Editor endpoint" }, { status: 404 });
}
