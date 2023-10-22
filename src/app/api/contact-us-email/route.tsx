import ContactEmail from "@/components/emails/contact-email";
import { SendEmail } from "@/lib/send-email";
import { render } from "@react-email/render";
import { zfd } from "zod-form-data";

const contactFormSchema = zfd.formData({
    name: zfd.text().refine((s) => s.length <= 70),
    email: zfd.text().refine((s) => s.length <= 250 && /\S+@\S+\.\S+/.test(s)),
    subject: zfd.text().refine((s) => s.length <= 78),
    message: zfd.text().refine((s) => s.length <= 3000),
    sendCopy: zfd.checkbox({ trueValue: "true" }),
    captchaToken: zfd.text(),
});

const verifyEndpoint = "https://www.google.com/recaptcha/api/siteverify";

export async function POST(request: Request) {
    console.log("Attempting to send an email");
    const formData = await request.formData();
    const { name, email, subject, message, sendCopy, captchaToken } = contactFormSchema.parse(formData);

    console.log("Checking to see if captcha passed");
    const captchaRes = await fetch(verifyEndpoint, {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            secret: process.env.CAPTCHA_SECRET_KEY,
            response: captchaToken,
        }),
    });
    const captchaJson = await captchaRes.json();
    if(!captchaJson.success) {
        return Response.json({ "captchaError": "true" }, { status: 409 });
    }

    const html = render(<ContactEmail name={name} email={email} body={message}/>, {
        pretty: true,
    });

    let sendSuccesful = SendEmail(html, email, subject, sendCopy);
    if(sendSuccesful) {
        console.log("My api has sent the email succesfully");
    } else {
        console.log("There was an error on the backend of the email being sent");
    }

    return Response.json({ sendSuccesful }, { status: 200 });
}

export async function GET() {
    return Response.json({ "endpointRunning": "true" }, { status: 200 });
}
