import { logger } from '@/utils/logger';
import { env } from 'cloudflare:workers';

export type TurnstileValidatorOptionsType = {
	idempotencyKey?: string;
	expectedAction?: string;
	expectedHostname?: string;
};

export type TurnstileValidationResponse = {
	success: boolean;
	challenge_ts?: string;
	hostname?: string;
	'error-codes': string[];
	action?: string;
	cdata?: string;
	metadata?: Record<string, unknown>;
};

class TurnstileValidator {
	private secretKey: string;
	private timeout: number;

	constructor(secretKey: string, timeout = 10000) {
		this.secretKey = secretKey;
		this.timeout = timeout;
	}

	async validate(token: string, remoteip: string | null, options: TurnstileValidatorOptionsType) {
		// Input validation
		if (!token || typeof token !== 'string') {
			return { success: false, error: 'Invalid token format' };
		}

		if (token.length > 2048) {
			return { success: false, error: 'Token too long' };
		}

		try {
			const body = new URLSearchParams({
				secret: this.secretKey,
				response: token,
			});

			if (remoteip) {
				body.append('remoteip', remoteip);
			}

			if (options.idempotencyKey) {
				body.append('idempotency_key', options.idempotencyKey);
			}

			const response = await fetch(env.TURNSTILE_SITEVERIFY_HOST, {
				method: 'POST',
				body: body,
			});

			const result: TurnstileValidationResponse = await response.json();

			// Additional validation
			if (result.success) {
				if (options.expectedAction && result.action !== options.expectedAction) {
					return {
						success: false,
						error: 'Action mismatch',
						expected: options.expectedAction,
						received: result.action,
					};
				}

				if (options.expectedHostname && result.hostname !== options.expectedHostname) {
					return {
						success: false,
						error: 'Hostname mismatch',
						expected: options.expectedHostname,
						received: result.hostname,
					};
				}
			}

			return result;
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				logger.error(`Turnstile validation error: ${error}`);
				return { success: false, error: 'Validation timeout' };
			}
			logger.error(`Turnstile internal error: ${error}`);
			return { success: false, error: 'Internal error' };
		}
	}
}

//Singleton Usage
export const validator = new TurnstileValidator(env.TURNSTILE_SECRET_KEY);
