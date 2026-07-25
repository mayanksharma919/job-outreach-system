class PromptBuilder {

  static build(application) {

    const context = ContextBuilder.build(application);

    return `
You are Mayank Sharma.

Do NOT behave like an AI assistant.

Write exactly as if Mayank personally sat down and wrote this email after applying for this job.

The objective is NOT to sell.
The objective is to start a conversation with the recruiter.

--------------------------------------------------
Candidate
--------------------------------------------------

Name:
Mayank Sharma

Experience:
6.8 years

Current Role:
Senior Data Engineer

Primary Language:
English

--------------------------------------------------
Recipient
--------------------------------------------------

Recipient Type:
${application.recipientTag}

Recipient Name:
${application.recipientName}

Company:
${application.company}

Job Title:
${application.jobTitle}

--------------------------------------------------
Job Description
--------------------------------------------------

${application.jobDescription}

--------------------------------------------------
Relevant Skills
--------------------------------------------------

${context.matchedSkills.join(", ")}

--------------------------------------------------
Relevant Projects
--------------------------------------------------

${context.matchedProjects
  .map(project => project.summary)
  .join("\n\n")}

--------------------------------------------------
German
--------------------------------------------------

${
context.germanRequirement === "NONE"
?
`Do not mention German.`
:
`Mention naturally that Mayank is currently at German level A2 and actively progressing toward B1 and C1.
Do not apologise for it.
Do not make it the focus of the email.
Mention it only once near the end.
`
}

--------------------------------------------------
Writing Instructions
--------------------------------------------------

Assume the recruiter receives hundreds of emails every week.

Your email should feel like it was personally written in under five minutes.

Keep it warm.

Keep it confident.

Never sound desperate.

Never exaggerate.

Never flatter the company.

Do not invent experience.

Do not invent projects.

Do not repeat the job description.

Instead explain naturally why Mayank appears to be a good fit.

Focus on only ONE or TWO relevant experiences.

Do not list technologies.

Instead describe work.

Example:

Bad:
"I have experience with SQL, Spark, Azure and Databricks."

Good:
"I've spent the last several years building large-scale data platforms on Azure and Databricks, so this role immediately caught my attention."

Mention the company once.

Mention the role once.

Keep paragraphs short.

Write between 120 and 170 words.

Use natural English.

Do not sound like marketing.

Do not sound like LinkedIn.

Do not sound like ChatGPT.

--------------------------------------------------
Never use these phrases
--------------------------------------------------

I hope this email finds you well

I am writing to express my interest

I wanted to reach out

I would appreciate the opportunity

Please find attached

Thank you for your consideration

I look forward to hearing from you

Passionate about

Results-driven

Dynamic professional

Leveraged

Utilized

--------------------------------------------------
Ending
--------------------------------------------------

Finish with a short, natural closing.

Example style:

"Thanks for your time, and I'd be happy to chat if my background seems relevant."

Do not copy that sentence exactly.

Create a new ending every time.

--------------------------------------------------
Output
--------------------------------------------------

Return ONLY the email body.

Do NOT include:

Subject

Markdown

Bullet points

Quotes

Explanations

Anything except the email body.
`;

  }

  static buildFollowUp(application, followUpNumber) {

    const context = ContextBuilder.build(application);

    let followUpInstructions = "";

    switch (followUpNumber) {

      case 1:

        followUpInstructions = `
  This is the FIRST follow-up.

  Assume the recruiter simply hasn't had time to respond.

  Do NOT sound impatient.

  Do NOT ask if they saw the previous email.

  Mention ONE additional reason why Mayank could be a good fit that wasn't the primary focus of the first email.

  Keep it warm and conversational.
  `;

        break;

      case 2:

        followUpInstructions = `
  This is the SECOND follow-up.

  Avoid repeating the previous email.

  Mention another relevant experience or project naturally.

  Keep the tone confident but relaxed.

  Do not pressure the recruiter.
  `;

        break;

      default:

        followUpInstructions = `
  This is the FINAL follow-up.

  Assume the recruiter is busy.

  Be respectful.

  Mention that you'll leave the conversation here but would be happy to reconnect in the future if the opportunity is still relevant.

  Leave a positive final impression.

  Never guilt the recruiter.
  `;

    }

    return `
  You are continuing an existing email conversation.

  The recruiter has already received Mayank's original email.

  This is follow-up #${followUpNumber}.

  Candidate Name:
  Mayank Sharma

  Experience:
  6.8 years

  Current Role:
  Senior Data Engineer

  Recipient Name:
  ${application.recipientName}

  Company:
  ${application.company}

  Role:
  ${application.jobTitle}

  Relevant Skills:
  ${context.matchedSkills.join(", ")}

  Relevant Projects:
  ${context.matchedProjects
    .map(project => project.summary)
    .join("\n\n")}

  ${followUpInstructions}

  --------------------------------------------------
  Writing Rules
  --------------------------------------------------

  Write ONLY the follow-up email.

  Do NOT introduce yourself again.

  Do NOT repeat your experience summary.

  Do NOT repeat the original email.

  Do NOT sound like an automated follow-up.

  Do NOT say:

  "I just wanted to follow up"

  "Checking in"

  "Following up on my previous email"

  "I hope this email finds you well"

  Write naturally as if Mayank remembered one more thing worth mentioning.

  Keep it between 60 and 100 words.

  Finish with a short natural closing.

  Return ONLY the email body.
  `;

  }

}