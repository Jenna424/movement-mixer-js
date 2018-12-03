function errorHandler(jqXHR, textStatus, errorThrown) {
  var errorMessage = `The following error occurred: ${jqXHR.statusText} (status code ${jqXHR.status})`
  if (jqXHR.responseText.length) {
    errorMessage += `\nRead an in-depth description of the error below:\n${jqXHR.responseText}`
  }
  console.error(errorMessage)
}