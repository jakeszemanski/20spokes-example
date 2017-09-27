const initialState = {
  fields: {
        firstName: { name: 'First Name', value: '', invalid: false, validators:['_isPresent'] },
        lastName: { name: 'Last Name', value: '', invalid: false, validators:['_isPresent'] },
        email: { name: 'Email', value: '', invalid: false, validators:['_isPresent', '_isEmailValid'] },
        message: { name: 'Message', value: '', invalid: false, validators:['_isPresent'] }    
      }
}

var ContactForm = React.createClass({ 
  displayName: "ContactForm",
  getInitialState: function() {
    console.log("initialState", initialState)
    return initialState
  },

  handleSubmit: function(event){
    event.preventDefault();
    console.warn('submit has been triggered', this.state);
    this._validateFields(function(){
      $.ajax({
      url: '/contact',
      type: 'POST',
      data: { 
        contact: { 
          first_name: this.state.fields.firstName.value,
          last_name: this.state.fields.lastName.value,
          email: this.state.fields.email.value,
          message: this.state.fields.message.value
        }
      },
      success: function (response) {
        this._resetAllFields()
        alert("Success! Contact Created")
      }.bind(this),
      error: function (response) {
        alert(response.responseJSON.errors)
      }
    });  

    }.bind(this))      
  },

  _resetAllFields: function() {
    this.setState(initialState)
    console.log("fields after clear", this.state)
  },

  _isPresent: function(value) {
      return !!value;
  },

  _isEmailValid: function(value) {
    let rx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return rx.test(value);
  },

  _setAndValidateField: function(key, value) {
    let field = this.state.fields[key];
    let validators = field.validators || [];
    let invalid = validators.some(validator => !this[validator](value));

    return { ...field, value, invalid };
  },

  _onFieldChange: function(key, value) {
    this.setState({
      fields: {
        ...(this.state.fields),
        [key]: this._setAndValidateField(key, value)
      }
    });
  },

  _validateFields: function(callback) {
    let fields = {};
    let firstInvalidKey = null;
    Object.keys(this.state.fields).forEach(key => {
      let field = this.state.fields[key];
      fields[key] = field = this._setAndValidateField(key, field.value);
      if (!firstInvalidKey && field.invalid)
        firstInvalidKey = key;
    });

    this.setState({ fields }, () => {
      if (firstInvalidKey)
        window.alert("Please enter " + firstInvalidKey);
      else if (callback)
        callback();
    });
  },

  _renderInputFields: function() {
    return (
      Object.keys(this.state.fields).map(function(key) {
        return (
          <div key={key}>
            <input
              className="form-control"
              placeholder={this.state.fields[key].name}
              value={this.state.fields[key].value}
              onChange={value => this._onFieldChange(key, value.target.value)}
            /><br />
          </div>
        )
      }.bind(this))
    )
  },

  render: function(){
    return (
      <div className="container">
        <div className="col-sm-12">
          <div>
          { this._renderInputFields()}
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="actions">
              <button className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
})
