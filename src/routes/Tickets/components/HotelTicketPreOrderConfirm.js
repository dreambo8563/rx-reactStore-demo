import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { Steps, Row, Col, Form, Button, Icon } from 'antd'
import { navTree } from 'constants/TEXT'
import s from './HotelTicketPreOrderFill.css'
// import { certificateType, sexEnum, costAttributeTypeEnum } from 'constants/Enum'

const Step = Steps.Step
const FormItem = Form.Item

class HotelTicketPreOrderConfirm extends PureComponent {
  //   constructor(props) {
  //     super(props)
  //   }

  componentDidMount() {
    document.title = navTree.tickets.hotel.pre.confirmOrder.title
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 3 }
    }
    return (
      <div>
        <Row>
          <Col>
            <Steps current={1}>
              <Step title='填写订单' />
              <Step title='确认订单' />
              <Step title='订单完成' />
            </Steps>
          </Col>
        </Row>
        <br />
        <Row type='flex'>
          <Col span={24}>
            <div className='paddingContainer'>
              <Row type='flex' gutter={8}>
                <Col span={2}>房间信息</Col>
                <Col span={20}>
                  <Row type='flex' gutter={8}>
                    <Col span={2}>
                      <div style={{ textAlign: 'right' }}>
                        <h3>到达酒店</h3>
                      </div>
                    </Col>
                    <Col>但创房</Col>
                  </Row>
                  <div className='row_space' />
                  <Row type='flex' gutter={8}>
                    <Col span={24}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 2 },
                          wrapperCol: { span: 10 }
                        }}
                        label={'入离日期'}
                      >
                        <div>2017-07-12 至 2017-07-15 3晚</div>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type='flex' gutter={8}>
                    <Col span={24}>
                      <FormItem colon={false} {...formItemLayout} label={'房间数量'}>
                        <div>2</div>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type='flex' justify='space-between'>
                    <Col span={12}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 4 },
                          wrapperCol: { span: 6 }
                        }}
                        label={'到店时间'}
                      >
                        19:09
                      </FormItem>
                    </Col>
                    <Col>¥127319823</Col>
                  </Row>
                </Col>
              </Row>
              <hr />
              <div className='row_space' />
              <Row type='flex' gutter={8}>
                <Col span={2}>预定信息</Col>
                <Col span={20}>
                  <Row type='flex' gutter={8}>
                    <Col span={24}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 2 },
                          wrapperCol: { span: 10 }
                        }}
                        label={'企业名称'}
                      >
                        分贝金服
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type='flex' gutter={8}>
                    <Col span={8}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 6 },
                          wrapperCol: { span: 16 }
                        }}
                        label={'姓名'}
                      >
                        姓名
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 7 },
                          wrapperCol: { span: 16 }
                        }}
                        label={'预订人电话'}
                      >
                        226387123
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 7 },
                          wrapperCol: { span: 16 }
                        }}
                        label={'预订人部门'}
                      >
                        部门1
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
              <div className='row_space' />
              <Row type='flex' gutter={8}>
                <Col span={2}>审批信息</Col>
                <Col span={20}>
                  <FormItem>请填写预定人信息后查看审批信息</FormItem>
                </Col>
              </Row>
              <hr />
              <div className='row_space' />
              <Row type='flex' gutter={8}>
                <Col span={2}>入住信息</Col>
                <Col span={20}>
                  <Row type='flex' gutter={8}>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label={'姓名1'}
                      >
                        name1
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 4 },
                          wrapperCol: { span: 20 }
                        }}
                        label={'手机号1'}
                      >
                        phon1
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
              <div className='row_space' />
              <Row type='flex' gutter={8}>
                <Col span={2}>保险</Col>
                <Col span={20}>
                  <Row type='flex' justify='space-between'>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label=' '
                      >
                        有 酒店取消险
                      </FormItem>
                    </Col>
                    <Col>
                      ¥ <span className={s.redText}>2938982340</span>
                    </Col>
                  </Row>
                  <Row type='flex' gutter={8}>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label={'姓名'}
                      >
                        name1
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 4 },
                          wrapperCol: { span: 20 }
                        }}
                        label={'电话'}
                      >
                        11phonSubmit
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type='flex' gutter={8}>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label={'证件类型'}
                      >
                        身份证12
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 4 },
                          wrapperCol: { span: 20 }
                        }}
                        label={'证件号码'}
                      >
                        2387sdks
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type='flex' gutter={8}>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label={'性别'}
                      >
                        nna
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 4 },
                          wrapperCol: { span: 20 }
                        }}
                        label={'生日'}
                      >
                        23423-234-34-
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
              <div className='row_space' />
              <Row type='flex' gutter={8}>
                <Col span={2}>联系信息</Col>
                <Col span={20}>
                  <Row type='flex' gutter={8}>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label={'姓名'}
                      >
                        mind d
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label={'电话'}
                      >
                        8uweoruwoe
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
              <div className='row_space' />
              <Row type='flex' gutter={8}>
                <Col span={2}>费用归属</Col>
                <Col span={20}>
                  <Row type='flex' gutter={8}>
                    <Col span={10}>
                      <FormItem
                        colon={false}
                        {...{
                          labelCol: { span: 5 },
                          wrapperCol: { span: 19 }
                        }}
                        label={'费用归属'}
                      >
                        部门23 <span style={{ marginLeft: 8 }}>xxx科技部</span>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <div className='row_space' />
        <div className='row_space' />
        <Row type='flex'>
          <Col span={8}>
            <div className='linkLikeText'>
              <Icon type='left' />返回修改订单
            </div>
          </Col>
          <Col span={8}>
            <Row type='flex' align='center'>
              <Col>
                <Button size='large' type='primary'>
                  下一步,完成订单
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default HotelTicketPreOrderConfirm
