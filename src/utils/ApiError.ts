import { ContentfulStatusCode } from 'hono/utils/http-status';

export default class ApiError extends Error {
	statusCode: ContentfulStatusCode;
	errorCode: string;

	constructor(statusCode: ContentfulStatusCode, errorCode: string, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}
}
