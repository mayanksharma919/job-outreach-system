class TemplateEmailGenerator {

  static generate(application, context, options = {}) {

    if (options.followUp === true) {
      return this.generateFollowUp(application, context);
    }

    const candidate = context.candidate;

    const subject =
      `${application.jobTitle} Application - ${candidate.name}`;

    const body = `Hi ${application.recipientName},

I recently submitted my application for the ${application.jobTitle} position at ${application.company} and wanted to introduce myself.

I have ${candidate.experienceYears} years of experience as a Data Engineer, with hands-on experience in ${context.matchedSkills.join(", ")}.

My recent work includes:
${context.matchedProjects.map(p => "- " + p.summary).join("\n")}

I noticed your role mentions ${context.matchedSkills.slice(0,3).join(", ")}, which aligns closely with my experience.

I would appreciate the opportunity to be considered if my profile matches what your team is looking for.

English is my primary working language. I am currently at German level ${candidate.germanLevel} and actively progressing toward B1 and then C1.

Thank you for your time.

Kind regards,

${candidate.name}`;

    return {
      subject,
      body
    };

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

}