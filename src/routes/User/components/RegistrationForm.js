import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Row,
    Col,
    Checkbox,
    Button
} from 'antd';
const FormItem = Form.Item

const residences = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake'
                    }
                ]
            }
        ]
    }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men'
                    }
                ]
            }
        ]
    }
];

class RegistrationForm extends Component {
    static propTypes = {
        form: PropTypes.object
    }
    state = {
        confirmDirty: false
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this
            .props
            .form
            .validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
            });
    }
    onField(e) {
        console.log('onchange', e.target.value);
        const form = this.props.form;
        form.setFieldsValue({'email': e.target.value})
          form.validateFields(['email'], {force: true});
    }
    change(e) {
        console.log('change', e.target.value);
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        console.log(value, 'onBlur');
        this.setState({
            confirmDirty: this.state.confirmDirty || !!value
        });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 14
            }
        }
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6
            }
        }

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label='E-mail' hasFeedback>
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!'
                            }, {
                                required: true,
                                message: 'Please input your E-mail!'
                            }
                        ]
                    })(<Input/>)}
                </FormItem>
                <FormItem {...formItemLayout} label='Password' hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!'
                            }, {
                                validator: this.checkConfirm
                            }
                        ]
                    })(<Input type='password'/>)}
                </FormItem>
                <FormItem {...formItemLayout} label='Confirm Password' hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!'
                            }, {
                                validator: this.checkPassword
                            }
                        ]
                    })(<Input
                        type='password'
                        onChange={:: this.onField}
                        onBlur={this.handleConfirmBlur}/>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                    <span>
                        Nickname&nbsp;
                        <Tooltip title='What do you want other to call you?'>
                            <Icon type='question-circle-o'/>
                        </Tooltip>
                    </span>
                )}
                    hasFeedback>
                    {getFieldDecorator('nickname', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your nickname!'
                            }
                        ]
                    })(<Input/>)}
                </FormItem>
                <FormItem {...formItemLayout} label='Habitual Residence'>
                    {getFieldDecorator('residence', {
                        initialValue: [
                            'zhejiang', 'hangzhou', 'xihu'
                        ],
                        rules: [
                            {
                                type: 'array',
                                required: true,
                                message: 'Please select your habitual residence!'
                            }
                        ]
                    })(<Cascader options={residences}/>)}
                </FormItem>
                <FormItem {...formItemLayout} label='Phone Number'>
                    <Input value={'good'} onChange={:: this.change}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='Captcha'
                    extra='We must make sure that your are a human.'>
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('captcha', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input the captcha you got!'
                                    }
                                ]
                            })(<Input size='large'/>)}
                        </Col>
                        <Col span={12}>
                            <Button size='large'>Get captcha</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                    style={{
                    marginBottom: 8
                }}>
                    {getFieldDecorator('agreement', {valuePropName: 'checked'})(
                        <Checkbox>I have read the
                            <a>agreement</a>
                        </Checkbox>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type='primary' htmlType='submit' size='large'>Register</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(RegistrationForm)
