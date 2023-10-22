import { Html } from "@react-email/html";
import { Head } from '@react-email/head';
import { Preview } from "@react-email/preview";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Container } from "@react-email/container";
import { Img } from "@react-email/img";
import { Section } from "@react-email/section";
import { Font } from "@react-email/font";
import { Button } from "@react-email/button";

const buttonStyle = {
    color: "#1e73be",
    fontSize: "20px",
    padding: "1em 1.25em",
    lineHeight: "2em",
    backgroundColor: "transparent",
    border: "2px solid",
    borderRadius: "3px",
}

export default function ContactEmail({name, email, body}) {
    return (
    <Html lang="en" dir="ltr">
        <Head>
            <title>{name} has reached out to you from toddcokennel.com</title>
            <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                    format: 'woff2',
                }}
                fontWeight={400}
                fontStyle="normal"
            />
        </Head>
        <Preview>[toddcokennel.com] You have recieved a new message from {name}</Preview>
        <Container>
            <Img src="https://toddcokennel.com/wp-content/uploads/2018/12/Logo-main.png" alt="toddcokennel.com logo" width="164" height="46" style={{margin: "auto"}}/>
            <Section>
                <Heading as="h2">You have recieved a new message from {name}</Heading>
                <Text style={{fontWeight: "bold"}}>Email from: {email}</Text>
                <Text>{body}</Text>
                <Text style={{color: "red"}}>Note: please don't reply to this email, it will not go to person who sent this message. To reply click the button below.</Text>
                <Button href={`mailto:${email}`} style={buttonStyle}>
                    Click here to reply
                </Button>
            </Section>
        </Container>
    </Html>
    );
}
