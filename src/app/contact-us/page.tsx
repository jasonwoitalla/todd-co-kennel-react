import ContactForm from "@/components/forms/contact-form";
import { getPageContent } from "@/lib/fetcher";
import { sanitize } from "isomorphic-dompurify";

export default async function ContactMePage() {
    const contentDirty = await getPageContent("/contact-us");
    const contentClean = sanitize(contentDirty);

    return (
        <section className="section">
            <h1 className="title is-1">Contact Us</h1>
            <div className="content" dangerouslySetInnerHTML={{ __html: contentClean }}></div>
            <ContactForm />
        </section>
    );
}
