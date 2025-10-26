// ═══════════════════════════════════════════════════════════════
// 🚀 DomAdvisor Backend Mock - Production Ready
// ═══════════════════════════════════════════════════════════════

const http = require('http');
const url = require('url');

// Port z environment variables (Railway/Heroku) lub 3000 lokalnie
const PORT = process.env.PORT || 3000;

// CORS headers - pozwól na requesty z domadvisor.pl
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Mock data generator
function generateMockListing(urlString) {
  const domain = urlString.includes('otodom') ? 'otodom' :
                 urlString.includes('olx') ? 'olx' :
                 urlString.includes('morizon') ? 'morizon' :
                 urlString.includes('gratka') ? 'gratka' : 'unknown';

  const basePrice = 500000;
  const randomPrice = basePrice + Math.floor(Math.random() * 100000);
  const baseArea = 50;
  const randomArea = baseArea + Math.floor(Math.random() * 30);

  return {
    source: domain,
    title: `Mieszkanie ${randomArea}m² - Warszawa, Mokotów (${domain})`,
    price: randomPrice,
    currency: 'PLN',
    pricePerM2: Math.round(randomPrice / randomArea),
    areaM2: randomArea,
    rooms: 2 + Math.floor(Math.random() * 3),
    floor: Math.floor(Math.random() * 10),
    buildYear: 2010 + Math.floor(Math.random() * 14),
    location: {
      city: 'Warszawa',
      district: 'Mokotów',
      street: 'ul. Puławska',
      fullAddress: 'Warszawa, Mokotów, ul. Puławska 123'
    },
    offerType: 'sprzedaz',
    propertyType: 'mieszkanie',
    images: [
      'https://ireland.apollo.olxcdn.com/v1/files/example1.jpg',
      'https://ireland.apollo.olxcdn.com/v1/files/example2.jpg'
    ],
    parseConfidence: 0.85 + Math.random() * 0.1,
    description: '⚠️ To są MOCK DATA z quick backend. W produkcji będzie prawdziwy scraping z portalu ' + domain + '.',
    features: ['balkon', 'parking', 'winda', 'piwnica'],
    metadata: {
      scrapedAt: new Date().toISOString(),
      originalUrl: urlString,
      processingTime: '2.3s',
      mode: 'mock',
      environment: process.env.NODE_ENV || 'development'
    }
  };
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Log request
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${pathname}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Root endpoint - info
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      service: 'DomAdvisor Backend Mock',
      version: '1.0.0',
      status: 'online',
      endpoints: {
        health: '/api/health',
        ingest: '/api/ingest (POST)'
      },
      message: 'Mock backend for testing. Use /api/health to check status.'
    }));
    return;
  }

  // Health check endpoint
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      mode: 'mock',
      environment: process.env.NODE_ENV || 'development'
    }));
    return;
  }

  // Ingest endpoint
  if (pathname === '/api/ingest' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { url: listingUrl, survey } = data;

        console.log('  → URL:', listingUrl);

        if (!listingUrl) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({
            success: false,
            error: 'URL is required'
          }));
          return;
        }

        // Check if supported domain
        const supportedDomains = ['otodom.pl', 'olx.pl', 'morizon.pl', 'gratka.pl'];
        const isSupported = supportedDomains.some(d => listingUrl.toLowerCase().includes(d));

        if (!isSupported) {
          console.log('  ❌ Unsupported domain');
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({
            success: false,
            error: 'Unsupported domain. Use: Otodom, OLX, Morizon, or Gratka'
          }));
          return;
        }

        // Generate mock listing
        const listing = generateMockListing(listingUrl);
        console.log('  ✅ Generated mock listing');

        // Simulate processing time
        setTimeout(() => {
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify({
            success: true,
            data: {
              listing,
              survey: survey || {},
              scores: {
                overall: 0.85,
                emotional: 0.90,
                practical: 0.80,
                location: 0.88
              }
            },
            meta: {
              processingTime: '2.3s',
              mode: 'mock',
              message: '⚠️ To są MOCK DATA. Dla prawdziwego scrapingu użyj pełnego backendu z Playwright.',
              environment: process.env.NODE_ENV || 'development'
            }
          }));
        }, 1000); // 1 second delay

      } catch (error) {
        console.log('  ❌ Error:', error.message);
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({
    error: 'Not found',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/ingest'
    ]
  }));
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.clear();
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                                                               ║');
  console.log('║  🚀 DomAdvisor Backend Mock - PRODUCTION                     ║');
  console.log('║                                                               ║');
  console.log('║  ✅ Server running on port ' + PORT.toString().padEnd(31) + '║');
  console.log('║                                                               ║');
  console.log('║  Available endpoints:                                        ║');
  console.log('║  • GET  /            - Service info                          ║');
  console.log('║  • GET  /api/health  - Health check                          ║');
  console.log('║  • POST /api/ingest  - Ingest listing URL                    ║');
  console.log('║                                                               ║');
  console.log('║  ⚠️  UWAGA: To jest MOCK backend z fake data!                ║');
  console.log('║                                                               ║');
  console.log('║  Environment: ' + (process.env.NODE_ENV || 'development').padEnd(47) + '║');
  console.log('║                                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📝 Request logs:');
  console.log('');
});

// Error handling
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('');
    console.error('❌ ════════════════════════════════════════════════════════════');
    console.error('❌ Port ' + PORT + ' is already in use!');
    console.error('❌ ════════════════════════════════════════════════════════════');
    console.error('');
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('');
  console.log('👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('');
  console.log('👋 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

console.log('🚀 Starting DomAdvisor Backend Mock...');
