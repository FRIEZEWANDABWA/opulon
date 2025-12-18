import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  try {
    const imagePath = path.join('/')
    const backendUrl = `http://backend:8000/${imagePath}`
    
    const response = await fetch(backendUrl, {
      headers: {
        'Accept': 'image/*'
      }
    })
    
    if (!response.ok) {
      console.log(`Image not found: ${backendUrl}`)
      return new NextResponse('Image not found', { status: 404 })
    }
    
    const imageBuffer = await response.arrayBuffer()
    let contentType = response.headers.get('content-type')
    
    // Determine content type from file extension if not provided
    if (!contentType) {
      const ext = imagePath.split('.').pop()?.toLowerCase()
      switch (ext) {
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg'
          break
        case 'png':
          contentType = 'image/png'
          break
        case 'webp':
          contentType = 'image/webp'
          break
        case 'avif':
          contentType = 'image/avif'
          break
        case 'gif':
          contentType = 'image/gif'
          break
        default:
          contentType = 'image/jpeg'
      }
    }
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return new NextResponse('Error loading image', { status: 500 })
  }
}