import { getSecretsByFolder } from "$lib/server/secretsApi";
import { json } from "@sveltejs/kit";
export async function GET({ fetch, cookies, params }) {
  const { folderId } = params;
  const token = String(cookies.get("token"));
  const response = await getSecretsByFolder(fetch, folderId, token);
  return json({ data: response.data });
}

// export async function PUT(req) {
//   const { secretId } = req.params;
//   const { request } = req;
//   const token = String(req.cookies.get("token"));
//   const secret = await request.json();
//   delete secret.id;
//   await updateSecret(secretId, secret, token);
//   // Code to update the secret in your database
//   // e.g., using fetch to make a request to your backend service

//   return json({ success: true });
// }