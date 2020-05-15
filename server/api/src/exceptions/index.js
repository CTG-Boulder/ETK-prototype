export class ApiException extends Error {
  constructor(msg, status = 500){
    super(msg)
    this.name = 'ApiException'

    this.status = status
  }

  toJSON(){
    return {
      message: this.message
      , name: this.name
      , status: this.status
    }
  }
}

export class InvalidRequestException extends ApiException {
  constructor(msg){
    super(msg, 400)
  }
}
