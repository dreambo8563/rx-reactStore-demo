import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import {
    Button,
    List,
    InputItem,
    Toast,
    Tabs,
    WhiteSpace
} from 'antd-mobile';
import {createForm} from 'rc-form';
import {injectProps} from 'rx-reactstore'
import {changeHomeProps} from '../services'

const TabPane = Tabs.TabPane;
const selector = (state) => {
    return ({homeState: state.store.homeState})
};

@injectProps(selector)
class App extends Component {
    static propTypes = {
        children: PropTypes.node,
        form: PropTypes.any,
        homeState: PropTypes.object
    }
    constructor() {
        super()
        this.state = {
            currentTab: '1',
            showTabs: true
        }
    }

    callback(key) {
        if (key == '2') {
            const {flightTickets, hotelTickets, trainTickets, taxiTickets} = this.props.homeState
            this
                .props
                .form
                .setFieldsValue({flightTickets, hotelTickets, trainTickets, taxiTickets})
        }
        this.setState({
            ...this.state,
            currentTab: key
        });
    }
    failToast(content) {
        Toast.info(content, 1);
    }

    onChange(field, value) {
        const {homeState} = this.props

        changeHomeProps({
            ...homeState,
            [field]: value
        })
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
                    this.setState({
                        ...this.state,
                        currentTab: parseInt(this.state.currentTab) + 1
                    });
                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            currentTab: String(parseInt(this.state.currentTab) - 1)
                        });
                        errorRefs[Object.keys(errorRefs)[0]].focus()
                    }, 0)
                } else {
                    if (this.state.currentTab == '1') {
                        changeHomeProps({
                            ...value,
                            flightPrice: (parseFloat(value.flightConsume) / parseFloat(value.flightTickets)).toFixed(2),
                            hotelPrice: (parseFloat(value.hotelConsume) / parseFloat(value.hotelTickets)).toFixed(2),
                            trainPrice: (parseFloat(value.trainConsume) / parseFloat(value.trainTickets)).toFixed(2),
                            taxiPrice: (parseFloat(value.taxiConsume) / parseFloat(value.taxiTickets)).toFixed(2),
                            flightSingleSave: (parseFloat(value.flightConsume) / parseFloat(value.flightTickets) * 0.2).toFixed(2),
                            flightSaveCount: Math.round(parseFloat(value.flightTickets) * 0.05),
                            hotelSingleSave: (parseFloat(value.hotelConsume) / parseFloat(value.hotelTickets) * 0.2).toFixed(2),
                            hotelSaveCount: Math.round(parseFloat(value.hotelTickets) * 0.07),
                            trainSingleSave: (parseFloat(value.trainConsume) / parseFloat(value.trainTickets) * 0.3).toFixed(2),
                            trainSaveCount: Math.round(parseFloat(value.trainTickets) * 0.07),
                            taxiSingleSave: (parseFloat(value.taxiConsume) / parseFloat(value.taxiTickets) * 0.2).toFixed(2),
                            taxiSaveCount: Math.round(parseFloat(value.taxiTickets) * 0.05),
                            cheapReminderAffectCount: Math.round(parseFloat(value.flightTickets) * 0.25),
                            aheadReminderAffectCount: Math.round(parseFloat(value.flightTickets) * 0.25),
                            flightTimesLimitedSaveCount: Math.round(parseFloat(value.flightTickets) * 0.06),
                            taxiLocationSaveCount: Math.round(parseFloat(value.taxiTickets) * 0.15),
                            flightTimesLimitedSingleSave: (parseFloat(value.flightConsume) / parseFloat(value.flightTickets)).toFixed(2),
                            taxiLocationSingleSave: (parseFloat(value.taxiConsume) / parseFloat(value.taxiTickets)).toFixed(2)
                        })
                    } else {
                        changeHomeProps({
                            ...value,
                            flightTickets: Math.round(parseFloat(value.flightConsume) / parseFloat(value.flightPrice)),
                            hotelTickets: Math.round(parseFloat(value.hotelConsume) / parseFloat(value.hotelPrice)),
                            trainTickets: Math.round(parseFloat(value.trainConsume) / parseFloat(value.trainPrice)),
                            taxiTickets: Math.round(parseFloat(value.taxiConsume) / parseFloat(value.taxiPrice)).toFixed(2),
                            flightSingleSave: (parseFloat(value.flightPrice) * 0.2).toFixed(2),
                            flightSaveCount: Math.round(parseFloat(value.flightConsume) / parseFloat(value.flightPrice) * 0.05),
                            hotelSingleSave: (parseFloat(value.hotelPrice) * 0.2).toFixed(2),
                            hotelSaveCount: Math.round(parseFloat(value.hotelConsume) / parseFloat(value.hotelPrice) * 0.07),
                            trainSingleSave: (parseFloat(value.trainPrice) * 0.3).toFixed(2),
                            trainSaveCount: Math.round(parseFloat(value.trainConsume) / parseFloat(value.trainPrice) * 0.07),
                            taxiSingleSave: (parseFloat(value.taxiPrice) * 0.2).toFixed(2),
                            taxiSaveCount: Math.round(parseFloat(value.taxiConsume) / parseFloat(value.taxiPrice) * 0.05),
                            cheapReminderAffectCount: Math.round(parseFloat(value.flightConsume) / parseFloat(value.flightPrice) * 0.25),
                            aheadReminderAffectCount: Math.round(parseFloat(value.flightConsume) / parseFloat(value.flightPrice) * 0.25),
                            flightTimesLimitedSaveCount: Math.round(parseFloat(value.flightConsume) / parseFloat(value.flightPrice) * 0.06),
                            taxiLocationSaveCount: Math.round(parseFloat(value.taxiConsume) / parseFloat(value.taxiPrice) * 0.15),
                            flightTimesLimitedSingleSave: parseFloat(value.flightPrice).toFixed(2),
                            taxiLocationSingleSave: parseFloat(value.taxiPrice).toFixed(2)
                        })
                    }
                    // browserHistory.push('/control')
                    browserHistory.push('/calculator/control')
                }
            });
    }
    componentDidMount() {
        document.title = '省钱计算器'
    }
    render() {
        const {getFieldProps} = this.props.form
        // console.log(this.props.homeState);
        console.log(this.state);
        const {showTabs} = this.state
            const {homeState} = this.props
                let flightTickets,
                    hotelTickets,
                    trainTickets,
                    taxiTickets,
                    avgFlight,
                    avgHotel,
                    avgTrain,
                    avgTaxi
                if (homeState.travelerNum) {
                    const value = homeState.travelerNum
                    flightTickets = Math.round(Number(value) * 4.005)
                    hotelTickets = Math.round(Number(value) * 3.005)
                    trainTickets = Math.round(Number(value) * 3.005)
                }
                if (homeState.employeeNum) {
                    taxiTickets = Math.round(Number(homeState.employeeNum) * 22 * 0.0015)
                }
                if (homeState.flightConsume != undefined && !!flightTickets) {
                    avgFlight = Number(parseFloat(homeState.flightConsume) / parseFloat(flightTickets)).toFixed(2)
                }
                if (homeState.hotelConsume != undefined && !!hotelTickets) {
                    // console.log('object', avgHotel);
                    avgHotel = Number(parseFloat(homeState.hotelConsume) / parseFloat(hotelTickets)).toFixed(2)
                }
                if (homeState.trainConsume != undefined && !!trainTickets) {
                    avgTrain = Number(parseFloat(homeState.trainConsume) / parseFloat(trainTickets)).toFixed(2)
                }
                if (homeState.taxiConsume != undefined && !!taxiTickets) {
                    avgTaxi = Number(parseFloat(homeState.taxiConsume) / parseFloat(taxiTickets)).toFixed(2)
                }
                const total = (homeState.flightConsume && parseFloat(homeState.flightConsume) || 0) + (homeState.hotelConsume && parseFloat(homeState.hotelConsume) || 0) + (homeState.trainConsume && parseFloat(homeState.trainConsume) || 0) + (homeState.taxiConsume && parseFloat(homeState.taxiConsume) || 0)
                return (
                    <div>
                        <List renderHeader={() => '企业基本信息'}>
                            <InputItem {...getFieldProps('name')} placeholder='选填'>企业名称</InputItem>
                            <InputItem
                                type='number'
                                placeholder='输入企业人数'
                                value={homeState.employeeNum}
                                {...getFieldProps('employeeNum', { rules: [{required: true, message: '企业人数必填'}], onChange:(val) => this.onChange('employeeNum', val), initialValue:homeState.employeeNum })}>企业人数</InputItem>
                            <InputItem
                                type='number'
                                placeholder='输入单月出差人数'
                                {...getFieldProps('travelerNum', { rules: [{required: true, message: '出差人数必填'}], onChange:(val) => this.onChange('travelerNum', val), initialValue:homeState.travelerNum })}>出差人数</InputItem>
                        </List>
                        <List renderHeader={() => '单月平均消费信息'}>
                            <InputItem
                                labelNumber={8}
                                {...getFieldProps('flightConsume', {rules: [{required: true, message: '单月机票消费金额必填'}], onChange:(val) => this.onChange('flightConsume', val), initialValue:homeState.flightConsume })}
                                placeholder='单月机票消费金额'>机票消费(元)</InputItem>
                            <InputItem
                                labelNumber={8}
                                {...getFieldProps('hotelConsume', { rules: [{required: true, message: '单月酒店消费金额'}], onChange:(val) => this.onChange('hotelConsume', val), initialValue:homeState.hotelConsume })}
                                placeholder='单月酒店消费金额'>酒店消费(元)</InputItem>
                            <InputItem
                                labelNumber={8}
                                placeholder='单月火车消费金额'
                                {...getFieldProps('trainConsume', { rules: [{required: true, message: '单月火车消费金额'}], onChange:(val) => this.onChange('trainConsume', val), initialValue:homeState.trainConsume })}>火车消费(元)</InputItem>
                            <InputItem
                                labelNumber={8}
                                placeholder='单月用车消费金额'
                                {...getFieldProps('taxiConsume', { rules: [{required: true, message: '单月用车消费金额'}], onChange:(val) => this.onChange('taxiConsume', val), initialValue:homeState.taxiConsume })}>用车消费(元)</InputItem>
                            <InputItem value={total} editable={false}>月消费</InputItem>
                        </List>
                        <List renderHeader={() => '附加信息(选填)'}>
                            {showTabs
                                ? (
                                    <Tabs
                                        swipeable={false}
                                        defaultActiveKey={this.state.currentTab || '1'}
                                        onChange={:: this.callback}>

                                        <TabPane tab='填写票数/次数' key='1'>
                                            {this.state.currentTab == '1'
                                                ? (
                                                    <div>
                                                        <InputItem
                                                            labelNumber={8}
                                                            {...getFieldProps('flightTickets', { rules: [{required: true, message: '单月购买机票数必填'}], onChange:(val) => this.onChange('flightTickets', val), initialValue:homeState.flightTickets || flightTickets })}
                                                            placeholder='单月购买机票数'>机票张数</InputItem>
                                                        <InputItem
                                                            labelNumber={8}
                                                            {...getFieldProps('hotelTickets', { rules: [{required: true, message: '单月入住酒店间夜数必填'}], initialValue:homeState.hotelTickets || hotelTickets })}
                                                            placeholder='单月入住酒店间夜数'>酒店间夜价数</InputItem>
                                                        <InputItem
                                                            labelNumber={8}
                                                            placeholder='单月购买火车票张数'
                                                            {...getFieldProps('trainTickets', { rules: [{required: true, message: '单月购买火车票张数必填'}], initialValue:homeState.trainTickets || trainTickets })}>火车票张数</InputItem>
                                                        <InputItem
                                                            labelNumber={8}
                                                            placeholder='单月用车次数'
                                                            {...getFieldProps('taxiTickets', { rules: [{required: true, message: '单月用车次数必填'}], initialValue:homeState.taxiTickets || taxiTickets})}>用车次数</InputItem>
                                                    </div>
                                                )
                                                : undefined}

                                        </TabPane>
                                        <TabPane tab='填写平均价格' key='2'>
                                            {this.state.currentTab == '2'
                                                ? (
                                                    <div>
                                                        <InputItem
                                                            labelNumber={8}
                                                            {...getFieldProps('flightPrice', { rules: [{required: true, message: '机票单张平均票价必填'}], initialValue:homeState.flightPrice || avgFlight })}
                                                            placeholder='机票单张平均票价'>机票单价(元)</InputItem>
                                                        <InputItem
                                                            labelNumber={8}
                                                            {...getFieldProps('hotelPrice', { rules: [{required: true, message: '酒店间夜平均金额必填'}], initialValue:homeState.hotelPrice || avgHotel })}
                                                            placeholder='酒店间夜平均金额'>酒店单价(元)</InputItem>
                                                        <InputItem
                                                            labelNumber={8}
                                                            placeholder='火车单张平均票价'
                                                            {...getFieldProps('trainPrice', { rules: [{required: true, message: '火车单张平均票价必填'}], initialValue:homeState.trainPrice || avgTrain })}>火车单价(元)</InputItem>
                                                        <InputItem
                                                            labelNumber={8}
                                                            placeholder='用车单次平均金额'
                                                            {...getFieldProps('taxiPrice', { rules: [{required: true, message: '用车单次平均金额必填'}], initialValue:homeState.taxiPrice || avgTaxi })}>用车单价(元)</InputItem>
                                                    </div>
                                                )
                                                : undefined}

                                        </TabPane>
                                    </Tabs>
                                )
                                : undefined}

                        </List>
                        <WhiteSpace size='lg'/>
                        <Button onClick={:: this.submit} type='primary'>下一步</Button>
                        <WhiteSpace size='lg'/>
                    </div>
                );
            }
        }
        export default createForm()(App)
