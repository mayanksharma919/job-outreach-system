class TemplateEmailGenerator {

  static generate(application, context, options = {}) {

    if (options.followUp === true) {
        return this.generateFollowUp(application, context);
    }

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

    const candidate = context.candidate;

    return {

        subject: this.buildSubject(application),

        body: `Hi ${application.recipientName},

I recently applied for the ${application.jobTitle} position at ${application.company} and wanted to introduce myself as well.

Over the past ${candidate.experienceYears} years, I've been working on cloud-based data engineering projects involving ${context.matchedSkills.slice(0,3).join(", ")}. Several aspects of this role closely match the kind of work I've been doing, which is what encouraged me to apply.

${this.germanParagraph(candidate)}

If my background seems relevant, I'd be happy to have a conversation.

Thank you for your time.

Kind regards,

${candidate.name}`

    };

  }

static generateExecutive(application, context) {

    const candidate = context.candidate;

    return {

        subject: this.buildSubject(application),

        body: `Hi ${application.recipientName},

I recently applied for the ${application.jobTitle} opportunity at ${application.company} and thought I'd introduce myself directly.

Over the last ${candidate.experienceYears} years, I've worked on building and modernizing cloud data platforms that support large-scale analytics and business decision making. When I read the role, it felt closely aligned with the kind of challenges I've been solving.

${this.germanParagraph(candidate)}

If you think my background could be a good fit for your team, I'd be glad to have a conversation.

Thank you for your time.

Kind regards,

${candidate.name}`

    };

  }

  static generateReferral(application, context) {

    const candidate = context.candidate;

    return {

        subject: this.buildSubject(application),

        body: `Hi ${application.recipientName},

I recently applied for the ${application.jobTitle} position at ${application.company} and came across your profile while learning more about the team.

Over the last ${candidate.experienceYears} years, I've been working on cloud data engineering projects that seem closely related to the work your team does.

${this.germanParagraph(candidate)}

From your perspective, does my background seem like a good fit for the role? If so, I'd really appreciate any advice you might have.

Thanks for taking the time to read this.

Kind regards,

${candidate.name}`

    };

  }

}