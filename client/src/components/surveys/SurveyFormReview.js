import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formField from './formField';

const SurveyFormReview = ({ onCancel, formValues }) => {
  const reviewFields = _.map(formField, ({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });
  return (
    <div>
      <h5> please confirm your entries </h5>
      {reviewFields}
      <button className="yellow darken-3 btn-flat" onClick={onCancel}>
        Back
      </button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    formValues: state.form.surveyForm.values
  };
};

export default connect(mapStateToProps)(SurveyFormReview);
