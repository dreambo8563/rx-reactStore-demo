import React, {Component, PropTypes} from 'react';
import {
    WingBlank,
    List,
    InputItem,
    Slider,
    createTooltip,
    WhiteSpace,
    Button,
    Toast
} from 'antd-mobile';
import {browserHistory} from 'react-router';
import {createForm} from 'rc-form';
import s from './ControlSettings.css'
import {injectProps} from 'rx-reactstore'
import {changeHomeProps} from '../services'

const selector = (state) => {
    return ({homeState: state.store.homeState})
};

const SliderWithTooltip = createTooltip(Slider);

@injectProps(selector)
class Config extends Component {
    static propTypes = {
        form: PropTypes.any,
        homeState: PropTypes.object
    }
    log = (name) => {
        const {homeState} = this.props
        return (value) => {
            changeHomeProps({
                ...homeState,
                [name]: value
            })
        };
    }
    failToast(content) {
        Toast.info(content, 1);
    }
    submit() {
        this
            .props
            .form
            .validateFields((error, value) => {
                // console.log(value, 'value');
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
                    console.log(value, 'config');
                    changeHomeProps({
                        ...this.props.homeState,
                        ...value
                    })
                    browserHistory.goBack()
                }
            });
    }
    onChange(field, value) {
        const {homeState} = this.props

        changeHomeProps({
            ...homeState,
            [field]: value
        })
    }

    componentDidMount() {
        document.title = '管控节省参数设置'
    }

    componentWillReceiveProps(nextProps) {}

    render() {
        const {getFieldProps} = this.props.form
        const {homeState} = this.props
        return (
            <div>
                <div className={s.nav}>
                    请根据实际情况输入管控节省参数，不输入即按照默认值计算。
                </div>
                <WhiteSpace/>
                <List renderHeader={() => '机票 金额/等级限制节省'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('flightSingleSave', { rules: [{required: true, message: '飞机票单张节省数必填'}], onChange:(val) => this.onChange('flightSingleSave', val), initialValue:homeState.flightSingleSave })}>单张节省(元)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('flightSaveCount', { rules: [{required: true, message: '飞机票节省张数必填'}], onChange:(val) => this.onChange('flightSaveCount', val), initialValue:homeState.flightSaveCount })}>节省张数</InputItem>
                </List>
                <List renderHeader={() => '酒店 金额/等级限制节省'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('hotelSingleSave', { rules: [{required: true, message: '单间节省数必填'}], onChange:(val) => this.onChange('hotelSingleSave', val), initialValue:homeState.hotelSingleSave })}>单间节省(元)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('hotelSaveCount', { rules: [{required: true, message: '节省间数必填'}], onChange:(val) => this.onChange('hotelSaveCount', val), initialValue:homeState.hotelSaveCount })}>节省间数</InputItem>
                </List>
                <List renderHeader={() => '火车票 金额/等级限制节省'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('trainSingleSave', { rules: [{required: true, message: '火车票单张节省数必填'}], onChange:(val) => this.onChange('trainSingleSave', val), initialValue:homeState.trainSingleSave })}>单张节省(元)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('trainSaveCount', { rules: [{required: true, message: '火车票节省张数'}], onChange:(val) => this.onChange('trainSaveCount', val), initialValue:homeState.trainSaveCount })}>节省张数</InputItem>
                </List>
                <List renderHeader={() => '用车 金额/等级限制节省'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('taxiSingleSave', { rules: [{required: true, message: '用车单张节省数必填'}], onChange:(val) => this.onChange('taxiSingleSave', val), initialValue:homeState.taxiSingleSave })}>单张节省(元)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('taxiSaveCount', { rules: [{required: true, message: '用车节省张数'}], onChange:(val) => this.onChange('taxiSaveCount', val), initialValue:homeState.taxiSaveCount})}>节省张数</InputItem>
                </List>
                <List renderHeader={() => '机票 次数/时间限制节省'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('flightTimesLimitedSingleSave', { rules: [{required: true, message: '单张节省数必填'}], onChange:(val) => this.onChange('flightTimesLimitedSingleSave', val), initialValue:homeState.flightTimesLimitedSingleSave })}>单张节省(元)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('flightTimesLimitedSaveCount', { rules: [{required: true, message: '节省张数'}], onChange:(val) => this.onChange('flightTimesLimitedSaveCount', val), initialValue:homeState.flightTimesLimitedSaveCount })}>节省张数</InputItem>
                </List>
                <List renderHeader={() => '用车 时间/位置限制'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('taxiLocationSingleSave', { rules: [{required: true, message: '用车单张节省数必填'}], onChange:(val) => this.onChange('taxiLocationSingleSave', val), initialValue:homeState.taxiLocationSingleSave })}>单张节省(元)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('taxiLocationSaveCount', { rules: [{required: true, message: '用车节省张数'}], onChange:(val) => this.onChange('taxiLocationSaveCount', val), initialValue:homeState.taxiLocationSaveCount})}>节省张数</InputItem>
                </List>

                <List renderHeader={() => '最低价提醒节省'}>
                    <WingBlank
                        style={{
                        paddingBottom: 50
                    }}
                        size='lg'>
                        <div>
                            <p>最低价机票平均票价节省比例</p>
                            <SliderWithTooltip
                                defaultValue={15}
                                min={0}
                                max={100}
                                minimumTrackStyle={{
                                backgroundColor: '#F09A37'
                            }}
                                handleStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                                boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.20)'
                            }}
                                onChange={:: this.log('slideWithLowFlight')}/>
                        </div>

                    </WingBlank>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('cheapReminderAffectCount', { rules: [{required: true, message: '预定提醒影响张数'}], onChange:(val) => this.onChange('cheapReminderAffectCount', val), initialValue:homeState.cheapReminderAffectCount })}>影响张数</InputItem>
                </List>
                <List renderHeader={() => '提前预订提醒节省'}>
                    <WingBlank
                        style={{
                        paddingBottom: 50
                    }}
                        size='lg'>
                        <div>
                            <p>提前预订带来的票价节省比例</p>
                            <SliderWithTooltip
                                defaultValue={15}
                                min={0}
                                max={100}
                                minimumTrackStyle={{
                                backgroundColor: '#F09A37'
                            }}
                                handleStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                                boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.20)'
                            }}
                                onChange={:: this.log('slideWithAheadFlight')}/>
                        </div>

                    </WingBlank>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('aheadReminderAffectCount', { rules: [{required: true, message: '预定提醒影响张数'}], onChange:(val) => this.onChange('aheadReminderAffectCount', val), initialValue:homeState.aheadReminderAffectCount })}>影响张数</InputItem>
                </List>
                <List renderHeader={() => '价格优势'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('flightAd', { rules: [{required: true, message: '机票优势必填'}], onChange:(val) => this.onChange('flightAd', val), initialValue:'1' })}>机票优势(%)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('hotelAd', { rules: [{required: true, message: '酒店优势必填'}], onChange:(val) => this.onChange('hotelAd', val), initialValue:'1' })}>酒店优势(%)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('trainAd', {rules: [{required: true, message: '火车优势必填'}], onChange:(val) => this.onChange('trainAd', val), initialValue:'5'})}>火车优势(%)</InputItem>
                </List>
                <List renderHeader={() => '耗时设置'}>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('tieSaveTime', { rules: [{required: true, message: '贴票报销必填'}], onChange:(val) => this.onChange('tieSaveTime', val), initialValue:'5' })}>贴票报销(min)</InputItem>
                    <InputItem
                        labelNumber={8}
                        {...getFieldProps('finSaveTime', { rules: [{required: true, message: '财务审核必填'}], onChange:(val) => this.onChange('finSaveTime', val), initialValue:'8' })}>财务审核(min)</InputItem>

                </List>
                <List renderHeader={() => '其他参数'}>
                    <InputItem
                        labelNumber={8}
                        type='number'
                        {...getFieldProps('salary', { rules: [{required: true, message: '月人均工资必填'}], onChange:(val) => this.onChange('salary', val), initialValue:'14400' })}>月人均工资(元)</InputItem>
                </List>
                <WhiteSpace size='lg'/>
                <Button onClick={:: this.submit} type='primary'>保存</Button>
                <WhiteSpace size='lg'/>
            </div>
        );
    }
}

export default createForm()(Config)
