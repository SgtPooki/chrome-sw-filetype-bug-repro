/* service-worker.ts
   A minimal Service Worker that intercepts requests to "/get".
   it fetches it and returns it with all original headers intact.
*/

const IMAGE_URLS = [
  'http://localhost:8080/ipfs/bafybeifiugn3zaj67dh6zqlgqpnzkbykbec3iur6wpb2zaz44ekcazyew4/image.jpeg', // run local ipfs node with `npx kubo@latest daemon`
  'http://bafybeifiugn3zaj67dh6zqlgqpnzkbykbec3iur6wpb2zaz44ekcazyew4.ipfs.dweb.link/image.jpeg',
  'https://ipfs.io/ipfs/bafybeifiugn3zaj67dh6zqlgqpnzkbykbec3iur6wpb2zaz44ekcazyew4/image.jpeg'
]

// ---------------------------------------
// Handle the "/get" request
// ---------------------------------------
async function handleGetRequest() {

  try {
    const originalResponse = await fetchFirstSuccessfulImage(IMAGE_URLS);
    
    // Create a new response with the same body and headers
    const responseInit = {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers: new Headers()
    };
    
    // Copy all headers from the original response
    originalResponse.headers.forEach((value, key) => {
      responseInit.headers.set(key, value);
    });

    // log all headers
    for (const [key, value] of responseInit.headers.entries()) {
      console.log('--------------------------------');
      console.log('Headers:');
      console.log(`${key}: ${value}`);
      console.log('--------------------------------');
    }
    
    // Create a new response with same body and copied headers
    const clonedBody = await originalResponse.blob(); // or .arrayBuffer() or other body method
    return new Response(clonedBody, responseInit);
    
  } catch (error) {
    // Handle error case
    console.error('Failed to fetch any image:', error);
    return new Response('All image fetches failed', { status: 500 });
  }
}

async function fetchFirstSuccessfulImage(IMAGE_URLS) {
  let lastError = null;
  
  for (const url of IMAGE_URLS) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}: ${response.status} ${response.statusText}`);
      }
      
      // This returns the complete response object with all original headers intact
      return response;
    } catch (error) {
      lastError = error;
      console.log(`Failed to fetch from ${url}: ${error.message}`);
      // Continue to the next URL
    }
  }
  
  // If we reach here, all URLs failed
  console.error('All image URLs failed to fetch:', lastError);
  throw lastError; // Rethrow the last error
}

// ---------------------------------------
// Service Worker: Fetch Event
// ---------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Intercept ONLY requests to "/get"
  if (url.pathname === '/get') {
    event.respondWith(handleGetRequest());
  }

  // ignore other requests
  return;
});
