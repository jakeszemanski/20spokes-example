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
    return initialState
  },

  handleSubmit: function(event){
    event.preventDefault();
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
    let invalid = null;
    Object.keys(this.state.fields).forEach(key => {
      let field = this.state.fields[key];
      fields[key] = field = this._setAndValidateField(key, field.value);
      if (!invalid && field.invalid) {
        invalid = field.name;
      }
    });

    this.setState({ fields }, () => {
      if (invalid) {
        window.alert("Please enter fill out all fields");
      }
      else if (callback) {
        callback();
      }
    });
  },

  _renderInputFields: function() {
    return (
      Object.keys(this.state.fields).map(function(key) {
        return (
          <div key={key}>
            <input
              className={this.state.fields[key].invalid ? "form-invalid" : "form-invalid"}
              type="text"
              placeholder={this.state.fields[key].name}
              value={this.state.fields[key].value}
              onChange={value => this._onFieldChange(key, value.target.value)}
            />
            <p className="field-invalid">{this.state.fields[key].invalid ? this.state.fields[key].name + ` is required` : null}</p>
            <br />
          </div>
        )
      }.bind(this))
    )
  },

  render: function(){
    return (
      <div className="container">
        <div className="form-style-8">
          <form className="form-group">
          { this._renderInputFields()}
          <button type="submit" onClick={this.handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
})
