class FollowUpGenerator {

  static generate(application) {

    const subject =
      "Following up regarding my application";

    const body =
`Hi ${application.recipientName},

I hope you're doing well.

I wanted to follow up regarding my application for the ${application.jobTitle} position at ${application.company}.

I'm still very interested in the opportunity and wanted to check whether you've had a chance to review my application.

If you need any additional information, I'd be happy to provide it.

Looking forward to hearing from you.

Best regards,
Mayank Sharma`;

    return {
      subject,
      body
    };

  }

}