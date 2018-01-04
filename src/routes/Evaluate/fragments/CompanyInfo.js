// @ts-check
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Radio, Cascader } from 'antd'
// import AreaSelect from 'shared/Components/AreaSelect'
import {
  searchText,
  companyCode,
  pleaseInput,
  pleaseSelect,
  address,
  cooperateState,
  area,
  invalidFormat,
  businessOpportunity,
  yuan
} from 'constants/TEXT'
import { coporateType, coporateStatus, validateRegx } from 'constants/Enum'
import { jsonGet } from 'utils/http'
import { cityList } from 'constants/API'
import { getMatchedValue, enumTransform } from 'utils/listHelper'
const R = require('ramda')

const FormItem = Form.Item
const RadioGroup = Radio.Group

class CompanyInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      areaEnum: []
    }
    this.getCoporateType = getMatchedValue(coporateType)
    this.getCoporateStatus = getMatchedValue(coporateStatus)
  }
  componentDidMount() {
    jsonGet(cityList).subscribe(res => {
      this.setState({
        areaEnum: enumTransform(res.data, 'name', 'name')
      })
    })
  }

  render() {
    const { form, data, editable } = this.props
    const { areaEnum } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }
    const areaData = data.area
      ? data.area.split(';').length > 1
          ? {
              area: data.area.split(';')[0].split(' '),
              detailArea: data.area.split(';')[1]
            }
          : {
              area: undefined,
              detailArea: data.area
            }
      : {}

    return (
      <div>
        <Row type='flex'>
          <Col span={12}>
            <FormItem {...formItemLayout} label={searchText.companyName}>
              {editable
                ? getFieldDecorator(`companyName`, {
                    initialValue: data.companyName,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${searchText.companyName}`
                      }
                    ]
                  })(<Input />)
                : data.companyName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={companyCode}>
              {editable
                ? getFieldDecorator(`companyCode`, {
                    initialValue: data.companyCode,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${companyCode}`
                      }
                    ]
                  })(<Input />)
                : data.companyCode}

            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={`${pleaseSelect}${area}`}>
              {editable
                ? getFieldDecorator(`area`, {
                    initialValue: areaData.area,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${area}`
                      }
                    ]
                  })(
                    <Cascader
                      options={areaEnum}
                      placeholder={pleaseSelect}
                      showSearch
                    />
                  )
                : areaData.area}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={address}>
              {editable
                ? getFieldDecorator(`detailArea`, {
                    initialValue: areaData.detailArea,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${address}`
                      }
                    ]
                  })(<Input />)
                : areaData.detailArea}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={searchText.cooperatingModel}>
              {editable
                ? getFieldDecorator(`cooperatingModel`, {
                    initialValue: data.cooperatingModel
                      ? String(data.cooperatingModel)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${searchText.cooperatingModel}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {R.tail(coporateType).map((v, i) => (
                        <Radio key={v.key} value={v.key}>
                          {v.value}
                        </Radio>
                      ))}

                    </RadioGroup>
                  )
                : this.getCoporateType(String(data.cooperatingModel)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={cooperateState}>

              {editable
                ? getFieldDecorator(`cooperateState`, {
                    initialValue: data.cooperateState
                      ? String(data.cooperateState)
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: `${pleaseSelect}${cooperateState}`
                      }
                    ]
                  })(
                    <RadioGroup>
                      {R.tail(coporateStatus)
                        .filter(v => v.key !== '2' && v.key !== '3')
                        .map((v, i) => (
                          <Radio key={v.key} value={v.key}>
                            {v.value}
                          </Radio>
                        ))}

                    </RadioGroup>
                  )
                : this.getCoporateStatus(String(data.cooperateState)).value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={businessOpportunity}>
              {editable
                ? getFieldDecorator(`businessOpportunity`, {
                    initialValue: data.businessOpportunity &&
                      String(data.businessOpportunity),
                    rules: [
                      {
                        required: true,
                        message: `${pleaseInput}${businessOpportunity}`
                      },
                      {
                        type: 'string',
                        pattern: validateRegx.number,
                        message: `${invalidFormat}`
                      }
                    ]
                  })(<Input addonAfter={<span>{yuan}</span>} />)
                : data.businessOpportunity}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CompanyInfo
