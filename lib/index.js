function successValidator (ret) {
  console.error('dentro ret')
  console.error(ret)
  return true
}

const req = require('fetchival')
req.fetch = require('node-fetch')

class Owsync {

  constructor (options = {backend: 'http://storefinder.depalop.com', successValidator}) {
    console.error('dentro il costruttore')
    this.atoms = new Map()
    this.backend = options.backend
    this.successValidator = options.successValidator
  }

  add (id, data) {
    this.atoms.set(id, data)
  }

  get (id) {
    return this.atoms.get(id)
  }

  gets () {
    return this.atoms
  }

  send (id) {
    console.error('sending ', id)
    let data = this.atoms.get(id)
    return req(this.backend).post(data)
      .then(successValidator)
      .then(ret => {
        console.error('dovrebbe essere ok!')
        if (ret) { // success validator
          // remove this id from Map
          this.atoms.delete(id)
          console.error("cancello l'elemento !", id)
          return true
        }
        return false
      })
      .catch(e => {
        console.error(e)
        return false
      })
  }

  sync () {
    console.error('devo mandare ', this.atoms.size)
    let proms = []
    for (let atom of this.atoms) {
      console.error('mando ', atom)
      proms.push(this.send(atom))
    }
    return Promise.all(proms)
  }

}

export default Owsync
