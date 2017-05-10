import React, {Component, PropTypes} from 'react';
import {
    Button,
    List,
    Switch,
    WhiteSpace,
    WingBlank,
    Icon
} from 'antd-mobile';
import {browserHistory} from 'react-router';
import {createForm} from 'rc-form';
import s from './ControlSettings.css'
import settingIcon from '../img/setting.png'

class ControlSettings extends Component {
    static propTypes = {
        form: PropTypes.any
    }
    goConfig() {
        // browserHistory.push('/calculator/config')
        browserHistory.push('/config')
    }
    submit() {
        this
            .props
            .form
            .validateFields((error, value) => {
                if (error) {
                    const keys = Object.keys(error)
                    this.failToast(error[keys[0]].errors[0].message)
                    const field = error[Object.keys(error)[0]].errors[0].field
                    const errorRefs = this
                        .props
                        .form
                        .getFieldInstance(field)
                        .refs

                    errorRefs[Object.keys(errorRefs)[0]].focus()
                } else {
                    // console.log(value);
                    browserHistory.push('/summary')
                    // browserHistory.push('/calculator/summary')
                }
            });
    }
    componentDidMount() {
        document.title = '选择管控配置'
    }
    render() {
        const {getFieldProps} = this.props.form
        return (
            <div>
                <WingBlank>

                    <div onClick={:: this.goConfig} className={s.nav}>
                        <div className={s.flexContainer}>
                            <img className={s.rightSpace} src={settingIcon} alt='settingIcon'/>
                            管控节省参数设置
                        </div>
                        <Icon type='right'/>
                    </div>
                </WingBlank>
                <WhiteSpace/>

                <List renderHeader={() => '机票管控'}>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('flightCabinLevel', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>限制舱位级别</List.Item>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('flightDiscount', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>限制最高折扣/价格</List.Item>
                </List>
                <List renderHeader={() => '酒店管控'}>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('hotelNightPriceLimit', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>限制间夜价金额</List.Item>
                </List>
                <List renderHeader={() => '火车管控'}>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('trainSeatLevel', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>限制席别</List.Item>
                </List>
                <List renderHeader={() => '用车管控'}>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('taxiAvailabelTime', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>设置可用时间</List.Item>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('taxiAvailabelLocation', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>限制上车位置</List.Item>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('taxiAvailabelType', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>限制用车车型</List.Item>
                </List>
                <List renderHeader={() => '提醒设置'}>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('cheapReminder', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>最低价提醒</List.Item>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('aheadReminder', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>提前预订天数提醒

                    </List.Item>

                </List>
                <div className={s.note}>提前天数判定开启后，如用户未按提前天数预订，将弹出提醒
                </div>
                <WhiteSpace size='lg'/>
                <List renderHeader={() => '其他管控'}>
                    <List.Item
                        extra={< Switch {
                        ...getFieldProps('highWaySuggest', {
                            initialValue: true,
                            valuePropName: 'checked'
                        })
                    } />}>高铁推荐

                    </List.Item>
                </List>
                <div className={s.note}>开启后将推荐预订高铁
                </div>

                <WhiteSpace size='lg'/>
                <Button onClick={:: this.submit} type='primary'>开始计算</Button>
                <WhiteSpace size='lg'/>
            </div>
        );
    }
}

export default createForm()(ControlSettings)
