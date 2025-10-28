# Backend (deprecated)

The standalone Express backend has been removed. The site now runs browser-only and talks directly to AWS services (AppSync/Lambda URLs). Existing Lambda-related assets and docs remain under `backend/lambdas` and the specific `README.*.md` files.

If you still need a server in the future, restore from git history or create a new minimal function/API and point the frontend to it with environment variables.