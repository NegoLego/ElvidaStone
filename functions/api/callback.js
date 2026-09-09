export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Verify CSRF state against the cookie
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );
  const savedState = cookies['oauth_state'];

  if (!state || state !== savedState) {
    return new Response('Invalid state parameter (CSRF detected)', { status: 403 });
  }

  // Exchange the temporary code for a GitHub access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });

  const data = await tokenResponse.json();

  if (data.error) {
    return new Response(`GitHub OAuth Error: ${data.error_description || data.error}`, {
      status: 400,
    });
  }

  // Post the token back to Decap CMS via postMessage protocol
  const script = `
    <!doctype html>
    <html>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({
                  token: data.access_token,
                  provider: 'github'
                })}',
                e.origin
              );
              window.removeEventListener('message', receiveMessage, false);
              window.close();
            }
            window.addEventListener('message', receiveMessage, false);
            window.opener.postMessage('authorizing:github', '*');
          })();
        </script>
      </body>
    </html>
  `;

  return new Response(script, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Set-Cookie': 'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0', // Clear cookie
    },
  });
}
