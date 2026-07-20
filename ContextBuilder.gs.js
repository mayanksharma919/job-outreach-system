class ContextBuilder {

  static build(application) {

    const knowledge = CandidateKnowledge.get();

    const jd = application.jobDescription.toLowerCase();

    const allSkills = CandidateKnowledge.getAllSkills();

    const matchedSkills = allSkills.filter(skill =>
      jd.includes(skill.toLowerCase())
    );

    const matchedProjects = knowledge.projects.filter(project =>

      matchedSkills.some(skill =>
        project.summary.toLowerCase().includes(skill.toLowerCase())
      )

    );

    return {

      candidate: knowledge.personal,

      matchedSkills,

      matchedProjects,

      strengths: knowledge.strengths,

      germanRequirement:
        this.detectGermanRequirement(jd)

    };

  }

  static detectGermanRequirement(jd) {

    if (
      jd.includes("german required") ||
      jd.includes("must speak german") ||
      jd.includes("fluent german")
    ) {

      return "REQUIRED";

    }

    if (
      jd.includes("german preferred") ||
      jd.includes("preferred german")
    ) {

      return "PREFERRED";

    }

    if (
      jd.includes("german")
    ) {

      return "NICE_TO_HAVE";

    }

    return "NONE";

  }

}