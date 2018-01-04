import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import RulesInfo from 'modules/Evaluate/fragments/RulesInfo'

@Form.create()
class EnterpriseAccessModal extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object
  }

  render() {
    const { form, data } = this.props
    return (
      <Form>
        <RulesInfo vertical={true} data={data} editable={true} form={form} />
      </Form>
    )
  }
}

export default EnterpriseAccessModal
