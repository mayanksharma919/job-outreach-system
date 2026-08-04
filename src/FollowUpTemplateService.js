class FollowUpTemplateService {

  static generate(application) {

    switch (application.followUpCount) {

      case 0:
        return this.first(application);

      case 1:
        return this.second(application);

      case 2:
        return this.third(application);

      default:
        throw new Error(
          `No follow-up template for count ${application.followUpCount}`
        );

    }

  }

  static first(application) {

    return {

      body:
`Hi ${application.recipientName},

I hope you're doing well.

I wanted to follow up regarding my application for the ${application.jobTitle} position at ${application.company}.

I'm still very interested in the opportunity and wanted to check whether you've had a chance to review my application.

If you need any additional information, I'd be happy to provide it.

Thank you for your time, and I look forward to hearing from you.

Best regards,

Mayank Sharma`

    };

  }

  static second(application) {

    return {

      body:
`Hi ${application.recipientName},

I hope you're having a great week.

I wanted to check in once more regarding my application for the ${application.jobTitle} role.

I remain very interested in joining ${application.company}. If the position is still open, I'd be grateful if you could keep my profile in consideration.

Thank you again for your time.

Best regards,

Mayank Sharma`

    };

  }

  static third(application) {

    return {

      body:
`Hi ${application.recipientName},

I just wanted to send one final follow-up regarding my application for the ${application.jobTitle} position.

I completely understand how busy recruitment can be, and I appreciate the time you've taken to consider my application.

If there is an opportunity to discuss how I could contribute to your team, I'd be happy to connect.

Thank you again, and I wish you and your team continued success.

Best regards,

Mayank Sharma`

    };

  }

}