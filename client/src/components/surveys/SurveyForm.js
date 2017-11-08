import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';

const FIELDS = [
  {
    label: 'Survey Title',
    name: 'title',
    noValueError: 'Please provide a title'
  },
  {
    label: 'Subject Line',
    name: 'subject',
    noValueError: 'Please provide a subject'
  },
  {
    label: 'Email Body',
    name: 'body',
    noValueError: 'Please provide a body'
  },
  {
    label: 'Recipient List',
    name: 'emails',
    noValueError: 'Please provide a recipients'
  }
];

class SurveyForm extends Component {
  renderField() {
    return _.map(FIELDS, ({ label, name }) => {
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
        <form onSubmit={this.props.handleSubmit(values => console.log(values))}>
          {this.renderField()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
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
  _.each(FIELDS, ({ name, noValueError }) => {
    if (!values[name]) {
      errors[name] = noValueError;
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm'
})(SurveyForm);
