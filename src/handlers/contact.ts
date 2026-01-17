import { Request, Response } from "express";
import { validator } from "@/handlers/turnstile";
import ApiError from "@/utils/ApiError";
import { brevoService } from "@/email/brevo";
import { env } from "cloudflare:workers";
import {status} from 'http-status'

export async function handleContactEmail(req: Request, res: Response){
    const body = req.body

    //first check the turnstile thing
    const turnstileResult = await validator.validate(body.token, null, {})
    if (!turnstileResult.success) {
        console.error("Turnstile error: ", turnstileResult)
        throw new ApiError(status.FORBIDDEN, "turnstile captcha check failed")
    }
    
    const textContent = `New Message from your portfolio:
     Sender Name: ${req.body.name}
     Email: ${req.body.email}
     Message: ${req.body.message}`

    //then do the brevo send
    const brevoResult = await brevoService.sendEmail({
        recipientName: env.SENDER_NAME,
        recipientEmail: env.SENDER_EMAIL,
        subject: `New message from ${req.body.name}`,
        textContent: textContent
    })

    //then send back the response
   if(brevoResult.success){
    res.send(status.OK).send({
        success: true,
        data: brevoResult,
        message: "EMAIL SENT SUCCESSULLY"
    })
   } else {
    res.send(status.INTERNAL_SERVER_ERROR).send({
        success: false,
        data: brevoResult.error,
        message: "UNABLE TO SEND EMAIL"
    })
   }
}
