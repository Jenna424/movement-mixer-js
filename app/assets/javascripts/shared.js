function errorHandler(jqXHR, textStatus, errorThrown) {
  var errorMessage = `The following error occurred: ${jqXHR.statusText} (status code ${jqXHR.status})`
  if (jqXHR.responseText.length) {
    errorMessage += `\nRead an in-depth description of the error below:\n${jqXHR.responseText}`
  }
  console.error(errorMessage)
}

function displaySuccessAlert(jsonObject) { // argument is JSON object representation of MovementRoutine instance or EquipmentRoutine instance
  let alertMessage = 'You successfully added an exercise movement to this workout routine!'
  if (jsonObject.constructor.name === 'EquipmentRoutine') {
    alertMessage = 'You successfully added a piece of equipment to use in this workout!'
  }
  $('div#success-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      ${alertMessage}
    </div>`
  )
  document.getElementById('success-container').scrollIntoView()
}