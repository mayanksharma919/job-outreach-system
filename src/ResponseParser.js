class ResponseParser {

  static parse(text) {

    const subjectMatch = text.match(/SUBJECT:\s*([\s\S]*?)BODY:/i);

    const bodyMatch = text.match(/BODY:\s*([\s\S]*)/i);

    if (!subjectMatch || !bodyMatch) {

      throw new Error(
        "Gemini output format invalid.\n\n" + text
      );

    }

    return {

      subject: subjectMatch[1].trim(),

      body: bodyMatch[1].trim()

    };

  }

}