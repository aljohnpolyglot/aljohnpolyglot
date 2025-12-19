export default {
	async fetch(request, env) {
	  // --- CORS Configuration ---
	  // Origins that are allowed to call this worker
	  const allowedOrigins = [
		'http://127.0.0.1:5500', // Your local dev server
		'http://localhost:5500',
		'https://aljohnpolyglot.github.io', // Your live website
		'http://aljohnpolyglot.com/',
		'https://aljohnpolyglot.com/',
		 'https://www.aljohnpolyglot.com'

	  ];
	  const origin = request.headers.get('Origin');
	  let corsHeaders = {};
  
	  if (origin && allowedOrigins.includes(origin)) {
		corsHeaders = {
		  'Access-Control-Allow-Origin': origin,
		  'Access-Control-Allow-Methods': 'POST, OPTIONS',
		  'Access-Control-Allow-Headers': 'Content-Type',
		};
	  }
  
	  // --- Preflight (OPTIONS) Request Handler ---
	  // The browser sends this automatically before a POST request to check permissions
	  if (request.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders });
	  }
  
	  // --- GET Request Handler ---
	  // Handles cases where someone just visits the worker URL in a browser
	  if (request.method === 'GET') {
		return new Response('This worker endpoint is for POST requests from the chatbot.', {
		  status: 405, // Method Not Allowed
		  headers: { 'Content-Type': 'text/plain' }
		});
	  }
  
	  // --- POST Request Handler (Main Logic) ---
	  if (request.method === 'POST') {
		const GEMINI_API_KEY = env.GEMINI_API_KEY;
		if (!GEMINI_API_KEY) {
		  console.error("FATAL: GEMINI_API_KEY secret not found.");
		  return Response.json({ error: "API key not configured on the server." }, { status: 500, headers: corsHeaders });
		}
  
		const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
		try {
		  const geminiResponse = await fetch(GEMINI_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: request.body,
		  });
  
		  // **IMPROVED DEBUGGING:** Check if Google returned an error
		  if (!geminiResponse.ok) {
			// Log the error status for debugging in Cloudflare
			console.error(`Gemini API returned an error: ${geminiResponse.status} ${geminiResponse.statusText}`);
			
			// Try to read the detailed error message from Google
			const errorBody = await geminiResponse.json();
			console.error("Gemini API Error Body:", JSON.stringify(errorBody, null, 2));
  
			// Send a clean, detailed error back to your website's console
			return Response.json({
			  error: "Failed to get response from Gemini API.",
			  details: errorBody,
			  status: geminiResponse.status
			}, {
			  status: geminiResponse.status, // Pass the original status code (e.g., 429)
			  headers: corsHeaders
			});
		  }
  
		  // If the request was successful, stream the response back with CORS headers
		  const response = new Response(geminiResponse.body, geminiResponse);
		  Object.entries(corsHeaders).forEach(([key, value]) => {
			response.headers.set(key, value);
		  });
		  return response;
  
		} catch (error) {
		  console.error("Error during fetch to Gemini API:", error);
		  return Response.json({ error: "Worker failed to connect to the Gemini API." }, { status: 500, headers: corsHeaders });
		}
	  }
  
	  // --- Fallback for other methods ---
	  return new Response('Method not allowed.', { status: 405, headers: corsHeaders });
	},
  };