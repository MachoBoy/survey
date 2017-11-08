import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formField from './formField';

class SurveyForm extends Component {
  renderField() {
    return _.map(formField, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderField()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">chevron_right</i>
          </button>
        </form>
      </div>
    );
  }
}

// validate fields of form
function validate(values) {
  const errors = {};

  // validate email address
  errors.emails = validateEmails(values.emails || '');

  // if there is no value
  _.each(formField, ({ name, noValueError }) => {
    if (!values[name]) {
      errors[name] = noValueError;
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  // keep the value
  destroyOnUnmount: false
})(SurveyForm);
