# A Comparison of Next.js + Supabase with an AWS Stack (EC2/ECR/EBS/S3/RDS)

## Hosting and Deployment

Next.js and Supabase | AWS
--- | ---
Hosting and deployment would be fully managed through Vercel. There would be no (or minimal) DevOps overhead. | It would be a lot more self-managed. I would have to configure the setup, handle load balancing, backups, etc. HIGH DevOps overhead.

## CI/CD and DevOps

Next.js and Supabase | AWS
--- | ---
Git push to deploy with webhook | Pipeline setup required for GitHub Action -> ECR -> ECS/EC2

## Database

Next.js and Supabase | AWS
--- | ---
Supabase has a PostgreSQL database built in, and provides APIs and RBAC Auth methods to interact with the database. Postgres is open-source and FREE. Vercel hosting would be free upto a point. | AWS RDS with Postgres. Would require more initial setup, key management, etc.

## Scoresheet Storage

Next.js and Supabase | AWS
--- | ---
Supabase storage with S3 Compatible Object Store, integrates with Supabase Auth and Postgres easily | AWS S3 directly. Would have to handle IAM, permissions and policies.

## Auth

Next.js and Supabase | AWS
--- | ---
Superbase Auth built in: JWT-based auth with email or OAuth | Would probably be handled by NextAuth?

## Cost

Next.js and Supabase | AWS
--- | ---
Free or very low | Lots of AWS services that could add up quickly here

---

# Recommended Approach

Frontend: Next.js with React, host on Vercel <br>
Backend: Supabase (PostgreSQL + Auth + Storage) <br>
Computation: Python Microservice running Flask/FastAPI with archeryutils; seperate deployment?
