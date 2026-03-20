export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="#1e3a5f"/>
  <rect x="40" y="56" width="112" height="16" rx="8" fill="white" opacity="0.9"/>
  <rect x="40" y="88" width="88" height="16" rx="8" fill="white" opacity="0.7"/>
  <rect x="40" y="120" width="100" height="16" rx="8" fill="white" opacity="0.5"/>
</svg>`
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  })
}
