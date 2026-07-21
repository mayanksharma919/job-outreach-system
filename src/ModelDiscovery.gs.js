function listGeminiModels() {

  const apiKey = Config.getGeminiApiKey();

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  const response = UrlFetchApp.fetch(url);

  Logger.log(response.getContentText());

}