import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from 'cloudflare:workers';
import status from 'http-status/cloudflare';

import { handleContactEmail } from '@/handlers/contact';
import ApiError from '@/utils/ApiError';
import { codes, messages } from '@/utils/constants';
import { sendResponse } from '@/utils/responses';

const app = new Hono();

app.use(logger());

app.use(
	'*',
	cors({
		origin: env.ALLOWED_ORIGINS.split(','),
		allowMethods: ['GET', 'POST'],
	}),
);

// Routes
app.get('/', (c) => {
	return sendResponse(c, status.OK, codes.Success, null, messages.Success);
});

app.post('/send-contact-email', handleContactEmail);

app.get('/healthz', (c) => {
	return sendResponse(c, status.OK, codes.Success, null, messages.Success);
});

// 404 handler
app.notFound((c) => {
	return sendResponse(c, status.NOT_FOUND, codes.NotFound, null, messages.NotFound);
});

// Error handler
app.onError((err, c) => {
	if (err instanceof ApiError) return sendResponse(c, err.statusCode, err.errorCode, err, err.message);
	return sendResponse(c, status.INTERNAL_SERVER_ERROR, codes.InternalServerError, err, err.message);
});

export default app;
