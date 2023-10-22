This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploment needs

Requests on my domain go to different places, since this is stiched with a wordpress website.

- Requests to `/` are proxied to the WordPress site
- Requests to `/app/` are proxied to the next.js site
- Requests to `/api/` are proxied to the next.js api routes

The next.js app is configured to expect all requests come from `https://domain-name/app/`. This proxy can be done with the following proxy configuration:
```
<VirtualHost *:80>
    ServerName yourdomain.com

    # WordPress
    DocumentRoot /path/to/wordpress
    <Directory /path/to/wordpress>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Next.js application
    ProxyPass /app/ http://localhost:3000/
    ProxyPassReverse /app/ http://localhost:3000/

    # Next.js API route
    ProxyPass /app/api/ http://localhost:3000/api/
    ProxyPassReverse /app/api/ http://localhost:3000/api/

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
