import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export function sendResponse(c: Context, statusCode: ContentfulStatusCode, data?: object | string | null, message?: string) {
	return c.json(
		{
			success: false,
            data: data,
			message: message,
		},
		statusCode,
	);
}
