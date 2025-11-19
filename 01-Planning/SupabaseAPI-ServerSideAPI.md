# Direct Supabase db Acess vs Server-side API Route Access

> Supabase auto-generates an API directly from your database schema allowing you to connect to your database through a restful interface, directly from the browser.

> The API is auto-generated from your database and is designed to get you building as fast as possible, without writing a single line of code.

```ts
const { data: userData, error } = await supabase
    .from("Profile")
    .select("name")
    .eq("id", supabaseUser?.id)
    .single();
```

Supabase handles authentication and RLS. Minimal boilerplate needed.

All database logic is client side! Even with RLS enabled, policy mistakes will expose data. 

---

Server-side API routes allow full control over access, and is easier to validate inputs and check authorisation. All on the server so no sensitive database keys at risk of being exposed. Service Role Key `.env` will bypass RLS wihtout exposing to client.

More boilerplate code needed. Adds a network hop (latency?).

Easier to implement data logic on server.

Can implement SwaggerDocs for API. Extendable to allow fully public RESTful API routes for custom data displays (e.g. club records on club website) 

---

Login / Signup can still use Supabase Auth, but all profile data will be fetched and updated on the server-side Prisma API.
