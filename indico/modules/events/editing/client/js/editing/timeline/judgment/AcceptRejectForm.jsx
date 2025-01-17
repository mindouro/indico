// This file is part of Indico.
// Copyright (C) 2002 - 2023 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Form as FinalForm} from 'react-final-form';
import {useDispatch, useSelector} from 'react-redux';
import {Form} from 'semantic-ui-react';

import {FinalSubmitButton, FinalTextArea} from 'indico/react/forms';
import {Translate} from 'indico/react/i18n';

import {reviewEditable} from '../actions';
import {getLastRevision, getNonSystemTags} from '../selectors';

import FinalTagInput from './TagInput';

import './JudgmentBox.module.scss';

export default function AcceptRejectForm({action, setLoading}) {
  const lastRevision = useSelector(getLastRevision);
  const tagOptions = useSelector(getNonSystemTags);
  const dispatch = useDispatch();

  return (
    <FinalForm
      initialValues={{
        comment: '',
        tags: lastRevision.tags
          .filter(t => !t.system)
          .map(t => t.id)
          .sort(),
      }}
      initialValuesEqual={_.isEqual}
      onSubmit={async formData => {
        setLoading(true);
        const rv = await dispatch(reviewEditable(lastRevision, {...formData, action}));
        if (rv.error) {
          setLoading(false);
          return rv.error;
        }
      }}
      subscription={{}}
    >
      {({handleSubmit}) => (
        <>
          <Form id="judgment-form" onSubmit={handleSubmit}>
            <FinalTextArea
              name="comment"
              placeholder={Translate.string('Leave a comment...')}
              hideValidationError
              autoFocus
              required={action === 'reject'}
              /* otherwise changing required doesn't work properly if the field has been touched */
              key={action}
            />
            <FinalTagInput name="tags" options={tagOptions} />
          </Form>
          <div styleName="judgment-submit-button">
            <FinalSubmitButton
              form="judgment-form"
              label={Translate.string('Confirm')}
              disabledUntilChange={action === 'reject'}
            />
          </div>
        </>
      )}
    </FinalForm>
  );
}

AcceptRejectForm.propTypes = {
  action: PropTypes.oneOf(['accept', 'reject']).isRequired,
  setLoading: PropTypes.func.isRequired,
};
