export interface EmailService<TPayload, TResult> {
	sendEmail(payload: TPayload): Promise<TResult>;
}
