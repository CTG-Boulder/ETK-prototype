export default class ApiException extends Error {
  constructor(msg, status = 500){
    super(msg)
    this.name = 'ApiException'

    this.status = 500
  }

  toJSON(){
    return {
      message: this.message
      , name: this.name
      , status: this.status
    }
  }
}
