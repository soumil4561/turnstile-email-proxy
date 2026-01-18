[![continuous-integration](https://github.com/soumil4561/turnstile-email-proxy/actions/workflows/merge-request-workflow.yml/badge.svg)](https://github.com/soumil4561/turnstile-email-proxy/actions/workflows/merge-request-workflow.yml)
# Serverless Email Proxy
This project is a serverless email proxy that handles email sending through a contact form (future use cases to be explored, ex: newsletters), utilizing Turnstile for validation and Brevo for email delivery. Primarily designed for developers looking to implement a secure and efficient email handling solution in their applications. The proxy validates user submissions using Cloudflare's Turnstile CAPTCHA to prevent spam and abuse, then forwards the validated emails through Brevo's transactional email service.

The project is built using Cloudflare Workers, a serverless platform that allows running code at the edge, ensuring low latency and high availability. The use of Hono as the web framework provides a lightweight and efficient way to handle HTTP requests and responses in this serverless environment.

## Environment Variables

Refer to [.env.example](.env.example) file for the required environment variables.

## Run Locally

Clone the project

```bash
git clone https://github.com/soumil4561/turnstile-email-proxy
```

Go to the project directory

```bash
cd turnstile-email-proxy
```

Install dependencies

```bash
npm install
```

Set up environment variables by copying `.env.example` to `.env` and filling in the required values.

Start the development server using Wrangler

```bash
npm run dev
```

## Deployment

This project is deployed on Cloudflare Workers. Wrangler CLI is the primary tool used for all configuration and deployment tasks in the project.

To deploy this project, one can simply run the below command:
```bash
npm run deploy
```
and after Cloudflare authentication, the project should be deployed successully.

Make sure to setup the secrets in the project or using `wrangler secret put <SECRET_NAME>` command before deploying.

## Authors

- [@soumil4561](https://www.github.com/soumil4561)
