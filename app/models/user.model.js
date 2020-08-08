module.exports = mongoose => {
    
    var schemauser = mongoose.Schema(
        {
            name: String,
            address: String,
            date: {type: Date, default: Date.Now} 
        }
      );
    
      schemauser.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
  
    const user = mongoose.model("user", schemauser);
    return user;
  };