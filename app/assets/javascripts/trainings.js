const Training = (training) => {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

const bindEventListeners = () => {
  Training.createListener()
  Training.indexListener()
  Training.destroyListener()
}