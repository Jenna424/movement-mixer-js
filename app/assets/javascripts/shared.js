function handleError(jqXHR, textStatus, errorThrown) {
  var errorMessage = `The following error occurred: ${jqXHR.statusText} (status code ${jqXHR.status})`
  if (jqXHR.responseText.length) {
    errorMessage += `\nRead an in-depth description of the error below:\n${jqXHR.responseText}`
  }
  console.error(errorMessage)
}

function displaySuccessAlert(jsonObject) { // argument is JSON object representation of MovementRoutine instance or EquipmentRoutine instance
  let alertMessage = 'You successfully modified the exercise movements that comprise this workout routine!' // an existing exercise was updated, or a new exercise was added
  if (jsonObject.constructor.name === 'EquipmentRoutine') {
    alertMessage = 'You successfully modified the fitness equipment requirements of this workout!' // an existing piece of equipment was updated, or a new piece of equipment was added
  }
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      ${alertMessage}
    </div>`
  )
  document.getElementById('success-container').scrollIntoView()
}

function checkValidityOfJoinTableAttrs(jqXhrObject) {
  if (jqXhrObject.status === 422 && jqXhrObject.responseJSON) {
    var errorsArray = jqXhrObject.responseJSON.errors
    var errorsString = errorsArray.join('\n') // join array elements (string validation error messages) with a line break
    var attributeName = errorsArray[0].split(' ')[0]
    var objectType = 'exercise movement'
    if (attributeName === 'Quantity' || attributeName === 'Weight') {
      objectType = 'piece of equipment'
    }
    alert(`Your attempt to edit this ${objectType} was unsuccessful:\n${errorsString}`)
  } else {
    console.error(`The following error was detected: ${jqXhrObject.statusText} (status code ${jqXhrObject.status})`)
  }
}