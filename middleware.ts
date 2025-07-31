// middleware.ts (create this file in your root directory)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const wpSiteUrl = 'https://jimowers.infy.uk'
    const response = await fetch(`${wpSiteUrl}/wp-json/myplugin/v1/maintenance-mode`)
    
    if (response.ok) {
      const data = await response.json()
      if (data.maintenance_mode) {
        // Return maintenance page HTML directly
        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head><title>Under Maintenance</title></head>
            <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui">
              <div style="text-align:center">
                <h1>Under Maintenance</h1>
                <p>Website is currently under maintenance. Please check back later....</p>
              </div>
            </body>
          </html>`,
          { status: 503, headers: { 'Content-Type': 'text/html' } }
        )
      }
    }
  } catch (error) {
    console.error('Maintenance check failed:', error)
  }
  
  return NextResponse.next()
}