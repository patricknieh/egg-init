module.exports = {
  getModelOptions() {
    return {
      toJSON: {
        virtuals: true,
        versionKey: false,
        transform(doc, ret) {
          delete ret._id
          return ret
        }
      }
    }
  },
  async action(){

  }
}
