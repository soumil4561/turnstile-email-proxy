import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export function sendResponse(c: Context, statusCode: ContentfulStatusCode, code: string, data?: object | string | null, message?: string) {
	return c.json(
		{
			success: statusCode < 300 ? true : false,
			code: code,
			data: data,
			message: message,
		},
		statusCode,
	);
}
