let ElasticEmail = require('@elasticemail/elasticemail-client');

export async function SendEmail(html, email: string, subject: string, sendCopy: boolean): Promise<boolean> {
    // console.log("Trying to send email: " + name + ", " + email + ", " + subject + ", " + message);
    var emailSent = false;
    let defaultClient = ElasticEmail.ApiClient.instance;
    let apiKey = defaultClient.authentications['apikey'];
    apiKey.apiKey = process.env.EMAIL_API_KEY;

    let api = new ElasticEmail.EmailsApi();

    let recipientsArray = [
        new ElasticEmail.EmailRecipient("no-reply@toddcokennel.com")
    ];
    if(sendCopy) {
        recipientsArray.push(new ElasticEmail.EmailRecipient(email));
    }

    let sentEmail = ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: recipientsArray,
        Content: {
            Body: [
                ElasticEmail.BodyPart.constructFromObject({
                    ContentType: "HTML",
                    Content: html
                })
            ],
            Subject: subject,
            From: "no-reply@toddcokennel.com"
        }
    });

    var callback = (error, data, res) => {
        if(error) {
            console.error(error);
        } else {
            console.log('Api called succesfully');
            emailSent = true;
        }
    };

    await api.emailsPost(sentEmail, callback);
    return emailSent;
}
