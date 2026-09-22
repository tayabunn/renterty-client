import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const getBackendUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  return apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;
};

async function handler(req, { params }) {
  const backendBase = getBackendUrl();
  const slug = (await params).all?.join("/") || "";
  const url = `${backendBase}/auth/${slug}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body,
      redirect: "manual"
    });

    const responseHeaders = new Headers(res.headers);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders
    });
  } catch (err) {
    return NextResponse.json({ error: "Auth proxy error", message: err.message }, { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };