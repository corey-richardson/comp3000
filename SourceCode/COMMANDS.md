```sh
cd SourceCode/
npx supabase init
npm install supabase
npx supabase start
# http://localhost:54323 -> Supabase Studio
pnpm create vite frontend --template react-ts
cd frontend
pnpm install @supabase/supabase-js
# http://localhost:5173/
pnpm dev

docker build -t frontend-app .
docker run -d -p 8080:80 --name frontend-container frontend-app
docker stop frontend-container
docker rm frontend-container

docker build -t frontend-app .
docker restart frontend-container
