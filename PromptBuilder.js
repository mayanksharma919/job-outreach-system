class PromptBuilder {

  static build(application) {

    const context = ContextBuilder.build(application);

    return `
You are writing a professional networking email.

The candidate has already applied.

Recipient Type:
${application.recipientTag}

Recipient Name:
${application.recipientName}

Company:
${application.company}

Job Title:
${application.jobTitle}

Job Description:
${application.jobDescription}

Relevant Skills:
${context.matchedSkills.join(", ")}

Relevant Projects:
${context.matchedProjects.map(p => p.title).join(", ")}

Candidate:
- 7 years experience
- Senior Data Engineer
- Fluent English

${
context.germanRequirement === "NONE"
?
"Do not mention German."
:
`Mention:
- German level A2
- Currently progressing toward B1 then C1
- Ask whether candidates actively improving German can still be considered if engineering work is primarily in English.`
}

Write a concise professional email.

Do NOT use markdown.

Output EXACTLY in this format.

Write only the email body.

Do not write a subject.

Do not use markdown.

Return plain text only.

Do not output anything else.
`;
  }

}