import { ContentfulStatusCode } from 'hono/utils/http-status';

export default class ApiError extends Error {
	statusCode: ContentfulStatusCode;

	constructor(statusCode: ContentfulStatusCode, message: string) {
		super(message);
		this.statusCode = statusCode;
	}
}
