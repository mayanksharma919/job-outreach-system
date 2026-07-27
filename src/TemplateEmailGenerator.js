class TemplateEmailGenerator {

  static getLanguageSection() {

    return `I've worked primarily in English-speaking teams and I'm currently progressing from A2 toward B1/C1 German.`;

  }

  static getSignature() {

    return `

Kind regards,

Mayank Sharma`;

  }

  static generate(application, context, options = {}) {

    AppLogger.info(JSON.stringify(application));

    if (options.followUp === true) {
        return this.generateFollowUp(application, context);
    }
    
    AppLogger.info("Recipient Tag: " + application.recipientTag);
    const tag = (application.recipientTag || "").toUpperCase();

    switch (tag) {

        case CONSTANTS.RECIPIENT_TAG.RECRUITER.toUpperCase():
            return this.generateRecruiter(application, context);

        case CONSTANTS.RECIPIENT_TAG.EXECUTIVE.toUpperCase():
        case CONSTANTS.RECIPIENT_TAG.HIRING_MANAGER.toUpperCase():
            return this.generateExecutive(application, context);

        case CONSTANTS.RECIPIENT_TAG.REFERRAL.toUpperCase():
            return this.generateReferral(application, context);

        default:
            return this.generateRecruiter(application, context);

    }

}

  static buildSubject(application) {

    return `${application.jobTitle} at ${application.company}`;

}

  static germanParagraph(candidate) {

    if (!candidate.germanLevel) {
        return "";
    }

    return `

English has been my primary working language, and I'm currently at German level ${candidate.germanLevel}, actively working toward B1 and C1.
`;

}

  static generateFollowUp(application, context) {

    const candidate = context.candidate;

    const followUpNumber = application.followUpCount + 1;

    let body;

    switch (followUpNumber) {

      case 1:

        body = `Hi ${application.recipientName},

I wanted to briefly reach out again regarding my application for the ${application.jobTitle} position.

One additional point I wanted to mention is that much of my recent work has focused on building scalable cloud-based data platforms, which seems closely aligned with this opportunity.

If my background looks relevant, I'd be happy to have a conversation.

Thanks again for your time.

Kind regards,

${candidate.name}`;

        break;

      case 2:

        body = `Hi ${application.recipientName},

I thought I'd send one final follow-up regarding my application.

I remain genuinely interested in the opportunity and believe my experience delivering production data engineering solutions could allow me to contribute quickly.

If the position is still open, I'd be glad to chat whenever convenient.

Thank you again.

Kind regards,

${candidate.name}`;

        break;

      default:

        body = `Hi ${application.recipientName},

I know recruiting schedules can get busy, so I'll leave this as my final follow-up.

If this role has already been filled, I completely understand. If opportunities arise in the future where my background may be a fit, I'd be happy to reconnect.

Thank you for your time, and I wish you and the team all the best.

Kind regards,

${candidate.name}`;

    }

    return {
      subject: "",
      body
    };

  }

  static generateRecruiter(application, context) {

    const language =
      this.getLanguageSection();

    const signature =
      this.getSignature();

    return {

      subject:
        `Application for ${application.jobTitle}`,

      body:
  `Hi ${application.recipientName},

I recently applied for the ${application.jobTitle} position at ${application.company} and wanted to briefly introduce myself.

Over the past ${context.candidate.experienceYears} years, I've built cloud-based data platforms using technologies such as ${context.matchedSkills.join(", ")}. The responsibilities outlined in the role closely match the type of work I've been doing, which is what encouraged me to apply.

${language}

If my background aligns with what you're looking for, I'd really appreciate the opportunity to speak with the hiring team.

Thank you for your time.

${signature}`

    };

  }

  static generateExecutive(application, context) {

    const language =
      this.getLanguageSection();

    const signature =
      this.getSignature();

    return {

      subject:
        `${application.jobTitle} - Introduction`,

      body:
  `Hi ${application.recipientName},

I recently came across your team's ${application.jobTitle} opening at ${application.company}, and it immediately caught my attention because much of my recent work has involved solving similar data engineering challenges.

Over the past ${context.candidate.experienceYears} years, I've designed and modernized cloud data platforms across Azure and Snowflake, working closely with analytics and business teams to deliver scalable solutions.

${language}

The role genuinely feels like a strong match for my experience, so I wanted to introduce myself directly. If you have a few minutes, I'd be glad to connect.

Thank you for your time.

${signature}`

    };

  }

  static generateReferral(application, context) {

    const language =
      this.getLanguageSection();

    const signature =
      this.getSignature();

    return {

      subject:
        `Quick question about ${application.company}`,

      body:
  `Hi ${application.recipientName},

I recently applied for the ${application.jobTitle} role at ${application.company}, and while learning more about the team I came across your profile.

Over the past ${context.candidate.experienceYears} years, I've been working on cloud data engineering projects involving ${context.matchedSkills.join(", ")}, and the role seemed like a strong fit for my background.

${language}

Since you're already part of the team, I was curious whether my experience sounds like the kind that's valued there. I'd really appreciate any advice you might have about the role or the hiring process.

Thanks for taking the time to read my message.

${signature}`

    };

  }

}