const setLoggedOutLinks = () => {
  $('ul.nav').html(
    `<li><a href='/signup'>Register Now!</a></li>
    <li><a href='/login'>Log In</li>`
  )
}

const handleError = (jqXHR, textStatus, errorThrown) => {
  let errorMessage = `The following error occurred: ${jqXHR.statusText} (status code ${jqXHR.status})`
  if (jqXHR.responseText.length) {
    errorMessage += `\nRead an in-depth description of the error below:\n${jqXHR.responseText}`
  }
  console.error(errorMessage)
}

const manyToManyModificationMessage = (jsonObject) => { // argument is JSON object representation of MovementRoutine instance or EquipmentRoutine instance
  let alertMessage = 'You successfully modified the exercise movements that comprise this workout routine!' // an existing exercise was updated, or a new exercise was added
  if (jsonObject.constructor.name === 'EquipmentRoutine') {
    alertMessage = 'You successfully modified the equipment requirements of this workout routine!' // an existing piece of equipment was updated, or a new piece of equipment was added
  }
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      ${alertMessage}
    </div>`
  )
  document.getElementById('message-container').scrollIntoView()
}

const checkValidityOfJoinTableAttrs = (jqXhrObject) => {
  if (jqXhrObject.status === 422 && jqXhrObject.responseJSON && jqXhrObject.responseJSON.errors.length) {
    let errorsArray = jqXhrObject.responseJSON.errors
    let errorsString = errorsArray.join('\n') // join array elements (string validation error messages) with a line break
    let attributeName = errorsArray[0].split(' ')[0]
    let objectType = 'exercise movement'
    if (attributeName === 'Quantity' || attributeName === 'Weight') {
      objectType = 'piece of equipment'
    }
    alert(`Your attempt to edit this ${objectType} was unsuccessful:\n${errorsString}`)
  } else {
    console.error(`The following error was detected: ${jqXhrObject.statusText} (status code ${jqXhrObject.status})`)
  }
}