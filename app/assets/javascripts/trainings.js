function Training(training) {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

$(function() {
  Training.createListener()
})