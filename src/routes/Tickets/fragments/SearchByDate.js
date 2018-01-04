import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, DatePicker } from 'antd'
import { pleaseSelect, inOutDate, searchAgain, checkout, checkin } from 'constants/TEXT'
import { rowGutter } from 'constants/Enum'

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item

@Form.create()
class SearchByDate extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    city_code: PropTypes.array,
    clearResult: PropTypes.func
  }

  searchByDate = e => {
    e.preventDefault()
    const { form, city_code } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        // TODO: 搜索结果
        console.log(values, city_code)
      }
    })
  }

  render() {
    const { form, clearResult } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 15
      }
    }
    return (
      <div>
        <Form onSubmit={this.searchByDate}>
          <Row gutter={rowGutter} type='flex'>
            <Col>
              <FormItem {...formItemLayout} label={inOutDate}>
                {getFieldDecorator('rangePicker', {
                  rules: [
                    {
                      required: true,
                      message: `${pleaseSelect}${inOutDate}`
                    }
                  ]
                })(<RangePicker onChange={clearResult} allowClear={false} placeholder={[checkin, checkout]} />)}
              </FormItem>
            </Col>
            <Col>
              <Button htmlType='submit' type='primary'>
                {searchAgain}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default SearchByDate
