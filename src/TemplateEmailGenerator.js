class TemplateEmailGenerator {

  static generate(application, context) {

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

}