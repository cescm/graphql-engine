import React from 'react';
import Editor from './Editor';
import DropdownButton from '../../../Common/DropdownButton/DropdownButton';
import {
  setWebhookUrl,
  setWebhookUrlType,
  showValidationError,
} from './Actions';
import Tooltip from './Tooltip';

class WebhookEditor extends React.Component {
  setValues = () => {
    const { webhook, env, dispatch } = this.props;
    dispatch(setWebhookUrl(webhook));
    dispatch(setWebhookUrlType(env ? 'env' : 'url'));
  };

  handleSelectionChange = e => {
    const { dispatch } = this.props;
    dispatch(setWebhookUrlType(e.target.getAttribute('value')));
    dispatch(setWebhookUrl(''));
  };

  validateAndSave = () => {
    const { modifyTrigger, dispatch } = this.props;
    if (modifyTrigger.webhookUrlType === 'url') {
      let tempUrl = false;
      try {
        tempUrl = new URL(modifyTrigger.webhookURL);
      } catch (e) {
        console.error(e);
      }
      if (!tempUrl) {
        dispatch(showValidationError('Invalid URL'));
        return;
      }
    }
    this.props.save();
  };

  render() {
    const { webhook, modifyTrigger, env, dispatch, styles } = this.props;
    const collapsed = toggleButton => (
      <div className={styles.modifyWebhookCollapsed}>
        {toggleButton('Edit')}
        <div className={styles.modifyProperty}>
          <p>
            {webhook}
            &nbsp;
          </p>
          <i>{env && '- from env'}</i>
        </div>
      </div>
    );

    const expanded = (toggleButton, saveButton) => (
      <div className={styles.modifyWebhookExpanded}>
        {toggleButton('Close')}
        <div className={styles.modifyWhDropdownWrapper}>
          <DropdownButton
            dropdownOptions={[
              { display_text: 'URL', value: 'url' },
              { display_text: 'From env var', value: 'env' },
            ]}
            title={
              modifyTrigger.webhookUrlType === 'env' ? 'From env var' : 'URL'
            }
            dataKey={modifyTrigger.webhookUrlType === 'env' ? 'env' : 'url'}
            onButtonChange={this.handleSelectionChange}
            onInputChange={e => dispatch(setWebhookUrl(e.target.value))}
            required
            bsClass={styles.dropdown_button}
            inputVal={modifyTrigger.webhookURL}
            id="webhook-url"
            inputPlaceHolder={
              modifyTrigger.webhookUrlType === 'env'
                ? 'MY_WEBHOOK_URL'
                : 'http://httpbin.org/post'
            }
            testId="webhook"
          />
        </div>
        {saveButton(this.validateAndSave)}
      </div>
    );

    return (
      <div className={`${styles.container} ${styles.borderBottom}`}>
        <div className={styles.modifySection}>
          <h4 className={styles.modifySectionHeading}>
            Webhook URL <Tooltip message="Edit your webhook URL" />
          </h4>
          <Editor
            editorCollapsed={collapsed}
            editorExpanded={expanded}
            toggleCallback={this.setValues}
            property="webhook"
            ongoingRequest={modifyTrigger.ongoingRequest}
            styles={styles}
          />
        </div>
      </div>
    );
  }
}

export default WebhookEditor;
