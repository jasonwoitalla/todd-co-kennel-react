'use client'

import { createRef, useEffect, useState } from "react"
import { z } from "zod";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface FormErrors{
    nameError: boolean;
    emailError: boolean;
    subjectError: boolean;
    bodyError: boolean;
    captchaError: boolean;
}

export default function ContactForm() {
    const schema = z.object({
        name: z.string().max(70).min(1),
        email: z.string().max(250).min(1).email(),
        subject: z.string().max(78).min(1),
        message: z.string().max(3000).min(1),
        sendCopy: z.boolean(),
        captchaToken: z.string().min(1),
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const [name, setName] = useState({ value: "", dirty: false });
    const [email, setEmail] = useState({ value: "", dirty: false });
    const [subject, setSubject] = useState({ value: "", dirty: false });
    const [body, setBody] = useState({ value: "", dirty: false });
    const [captchaValue, setCaptchaValue] = useState({ value: "", dirty: false });
    const [sendCopy, setSendCopy] = useState(false);
    const [errors, setErrors] = useState({} as FormErrors);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    
    const recaptchaRef = createRef<any>();

    useEffect(() => {
        setName({ value: "", dirty: false });
        setEmail({ value: "", dirty: false });
        setSubject({ value: "", dirty: false });
        setBody({ value: "", dirty: false });
        setCaptchaValue({ value: "", dirty: false })
        if(recaptchaRef.current != null) {
            recaptchaRef.current.reset();
        }

        if(searchParams.has("emailSent")) {
            setShowSuccess(true);
        }
        if(searchParams.has("emailError")) {
            setShowError(true);
        }
    }, [searchParams]);

    useEffect(() => {
        const formObject = {
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: body.value,
            sendCopy: sendCopy,
            captchaToken: captchaValue.value
        }
        const myErrors = {} as FormErrors;
        const result: any = schema.safeParse(formObject);
        if(!result.success) {
            const errors = result.error.flatten();
            myErrors.nameError = errors.fieldErrors.hasOwnProperty('name') && name.dirty;
            myErrors.emailError = errors.fieldErrors.hasOwnProperty('email') && email.dirty;
            myErrors.subjectError = errors.fieldErrors.hasOwnProperty('subject') && subject.dirty;
            myErrors.bodyError = errors.fieldErrors.hasOwnProperty('message') && body.dirty;
            myErrors.captchaError = errors.fieldErrors.hasOwnProperty('captchaToken') && captchaValue.dirty;
        }

        setErrors(myErrors);
        setIsFormValid(result.success);
    }, [name, email, subject, body, captchaValue]);

    const handleSubmit = async () => {
        if(isFormValid && !sendingEmail) {
            setSendingEmail(true);
            console.log("Form valid, sending email");
            const postForm: FormData = new FormData();
            postForm.append("name", name.value);
            postForm.append("email", email.value);
            postForm.append("subject", subject.value);
            postForm.append("message", body.value);
            postForm.append("captchaToken", captchaValue.value);
            if(sendCopy) {
                postForm.append("sendCopy", String(sendCopy));
            }

            try {
                const res: Response = await fetch("/app/api/contact-us-email", {
                    method: "POST",
                    body: postForm
                });
    
                const data = await res.json();
                console.log("Api results: " + JSON.stringify(data));

                if(data.hasOwnProperty("sendSuccesful")) {
                    router.push("/contact-us?emailSent=true");
                } else {
                    router.push("/contact-us?emailError=true");
                }
                
            } catch(e) {
                console.error("There was an error sending the email: " + e);
                router.push("/contact-us?emailError=true");
            }
            
            setSendingEmail(false);
        } else {
            console.log("Form invalid");
        }

        setName({ value: name.value, dirty: true });
        setEmail({ value: email.value, dirty: true });
        setSubject({ value: subject.value, dirty: true });
        setBody({ value: body.value, dirty: true });
        setCaptchaValue({ value: captchaValue.value, dirty: true });
    };

    return(
        <div className="content">
            <div className={`notification is-success ${showSuccess ? "" : "is-hidden"}`}>
                <button className="delete" onClick={() => setShowSuccess(false)}></button>
                Success! I've recieved your email. If you selected to recieve a copy you should have also gotten it in yor mailbox. Thanks again for reachingo out and I'll get back to you as soon as possible.
            </div>
            <div className={`notification is-danger ${showError ? "" : "is-hidden"}`}>
                <button className="delete" onClick={() => setShowError(false)}></button>
                Error! There was an issue with sending the email. Please check all the information provided is correct and you have a valid email address. Then check your internet connection, refresh the page and try again.
            </div>
            <h3 className="title is-3">Email Me</h3>
            <div className="field">
                <label className="label">Your Name</label>
                <div className="control">
                    <input 
                        className={`input ${errors.nameError ? "is-danger" : ""}`}
                        type="text" 
                        placeholder="Enter your name here"
                        maxLength={70}
                        value={name.value}
                        onChange={(e) => setName({ value: e.target.value, dirty: true })}
                    />
                    {errors.nameError && <p className="help is-danger">Name is a required field</p>}
                </div>
            </div>
            <div className="field">
                <label className="label">Email Address</label>
                <div className="control has-icons-left">
                    <input 
                        className={`input ${errors.emailError ? "is-danger" : ""}`}
                        type="email"
                        placeholder="Enter your email address"
                        maxLength={250}
                        value={email.value}
                        onChange={(e) => setEmail({ value: e.target.value, dirty: true })}
                    />
                    <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    {errors.emailError && <p className="help is-danger">A valid email is a required field</p>}
                </div>
            </div>
            <div className="field">
                <label className="label">Subject</label>
                <div className="control">
                    <input 
                        className={`input ${errors.subjectError ? "is-danger" : ""}`}
                        type="text" 
                        placeholder="Email subject line"
                        maxLength={78}
                        value={subject.value}
                        onChange={(e) => setSubject({ value: e.target.value, dirty: true })}
                    />
                    {errors.subjectError && <p className="help is-danger">Subject is a required field</p>}
                </div>
            </div>
            <div className="field">
                <label className="label">Message</label>
                <div className="control">
                    <textarea 
                        className={`textarea ${errors.bodyError ? "is-danger" : ""}`}
                        placeholder="Enter your email message"
                        maxLength={3000}
                        value={body.value}
                        onChange={(e) => setBody({ value: e.target.value, dirty: true })}
                    ></textarea>
                    {errors.bodyError && <p className="help is-danger">Message is a required field</p>}
                </div>
            </div>
            <div className="field">
                <label className="label">Would you like a copy of this email sent to you?</label>
                <div className="control">
                    <label className="radio">
                        <input type="radio" name="sendCopy" value="true" checked={sendCopy} onChange={(e) => setSendCopy(JSON.parse(e.target.value))}/>
                        Yes
                    </label>
                    <label className="radio">
                        <input type="radio" name="sendCopy" value="false" checked={!sendCopy} onChange={(e) => setSendCopy(JSON.parse(e.target.value))}/>
                        No
                    </label>
                </div>
            </div>
            {(name.dirty || email.dirty || subject.dirty || body.dirty) &&
                <div className="field">
                    <ReCAPTCHA 
                        ref={recaptchaRef}
                        sitekey="6LepZ-QoAAAAAN7UyDvd1h7W1sN0-N0VUJfZ8nnx"
                        onChange={(e) => setCaptchaValue({ value: e, dirty: captchaValue.dirty })}
                    />
                    {errors.captchaError && <p className="help is-danger">Captcha is a required field</p>}
                </div>
            }
            <div className="field">
                <div className="control">
                    <button className={`${sendingEmail ? "diviLoadingButton" : "diviButton"}`} onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}
