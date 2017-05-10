import React, {Component, PropTypes} from 'react';

import {Tabs, Icon, WhiteSpace} from 'antd-mobile';
import {injectProps} from 'rx-reactstore'
import cx from 'classnames'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts'
import s from './ControlSettings.css'
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log('onChange', key);
}
function handleTabClick(key) {
    console.log('onTabClick', key);
}

function moneyFormat(number) {
    return Array
        .from(String(number))
        .reverse()
        .map((v, i) => {
            if (i % 3 == 0 && i != 0) {
                return `${v},`
            }
            return v
        })
        .reverse()
        .join("")
}

class StackedBarChart extends Component {
    static propTypes = {
        width: PropTypes.number,
        data: PropTypes.array
    }
    render() {
        return (
            <BarChart
                barCategoryGap='25%'
                width={this.props.width * 2}
                height={400}
                data={this.props.data}
                margin={{
                top: 30,
                right: 0,
                left: 40,
                bottom: 30
            }}>
                <XAxis dataKey='name'/>
                <YAxis tickFormatter={(value) => `${parseFloat(value / 1000).toFixed(2)}K`}/>
                <CartesianGrid strokeDasharray='3 3'/>
                <Tooltip/>
                <Legend
                    wrapperStyle={{
                    bottom: 2,
                    fontSize:24
                }}
                    verticalAlign='bottom'/>
                <Bar dataKey='规则管控' stackId='a' fill='#EDBB55'/>
                <Bar dataKey='提醒推荐' stackId='a' fill='#57B493'/>
                <Bar dataKey='价格节省' stackId='a' fill='#92C6E4'/>
                <Bar dataKey='人力节省' stackId='a' fill='#6293D5'/>
            </BarChart>
        );
    }
}

const selector = (state) => {
    return ({homeState: state.store.homeState})
};

@injectProps(selector)
class Summary extends Component {
    static propTypes = {
        homeState: PropTypes.object
    }
    constructor() {
        super()
        this.state = {
            width: 0
        }
    }

    componentDidMount() {
        const {homeState} = this.props
        // console.log(homeState);
        const flighRule = ((parseFloat(homeState.flightSingleSave) * parseFloat(homeState.flightSaveCount)) + (parseFloat(homeState.flightTimesLimitedSingleSave) * parseFloat(homeState.flightTimesLimitedSaveCount))).toFixed(2)
        const hotelRule = (parseFloat(homeState.hotelSingleSave) * parseFloat(homeState.hotelSaveCount)).toFixed(2)
        const trainRule = (parseFloat(homeState.trainSingleSave) * parseFloat(homeState.trainSaveCount)).toFixed(2)
        const taxiRule = ((parseFloat(homeState.taxiSingleSave) * parseFloat(homeState.taxiSaveCount)) + (parseFloat(homeState.taxiLocationSingleSave) * parseFloat(homeState.taxiLocationSaveCount))).toFixed(2)

        const flightReminder = ((parseFloat(homeState.cheapReminderAffectCount) * parseFloat(homeState.slideWithLowFlight) * parseFloat(homeState.flightPrice) / 100) + (parseFloat(homeState.slideWithAheadFlight) * parseFloat(homeState.aheadReminderAffectCount) * parseFloat(homeState.flightPrice) / 100)).toFixed(2)

        const flightAd = (parseFloat(homeState.flightTickets) * parseFloat(homeState.flightPrice) * parseFloat(homeState.flightAd) / 100).toFixed(2)
        const hotelAd = (parseFloat(homeState.hotelTickets) * parseFloat(homeState.hotelPrice) * parseFloat(homeState.hotelAd) / 100).toFixed(2)
        const trainAd = (parseFloat(homeState.trainTickets) * parseFloat(homeState.trainAd)).toFixed(2)

        const flightTime = parseInt(parseFloat(homeState.flightTickets) * (parseFloat(homeState.tieSaveTime) + parseFloat(homeState.finSaveTime)))
        const hotelTime = parseInt(parseFloat(homeState.hotelTickets) * (parseFloat(homeState.tieSaveTime) + parseFloat(homeState.finSaveTime)))
        const trainTime = parseInt(parseFloat(homeState.trainTickets) * (parseFloat(homeState.tieSaveTime) + parseFloat(homeState.finSaveTime)))
        const taxiTime = parseInt(parseFloat(homeState.taxiTickets) * (parseFloat(homeState.tieSaveTime) + parseFloat(homeState.finSaveTime)))

        const width = window.screen.width - 40
        // console.log(homeState.trainTickets, homeState.trainAd, trainAd);
        const data = [
            {
                name: '机票',
                '规则管控': flighRule,
                '提醒推荐': flightReminder,
                '人力节省': flightTime,
                '价格节省': flightAd
            }, {
                name: '酒店',
                '规则管控': hotelRule,
                '提醒推荐': 0,
                '人力节省': hotelTime,
                '价格节省': hotelAd
            }, {
                name: '火车',
                '规则管控': trainRule,
                '提醒推荐': 0,
                '人力节省': trainTime,
                '价格节省': trainAd
            }, {
                name: '用车',
                '规则管控': taxiRule,
                '提醒推荐': 0,
                '人力节省': taxiTime,
                '价格节省': 0
            }
        ]
        const yearData = [
            {
                name: '机票',
                '规则管控': parseFloat(flighRule * 12).toFixed(2),
                '提醒推荐': (flightReminder * 12),
                '人力节省': (flightTime * 12),
                '价格节省': (flightAd * 12)
            }, {
                name: '酒店',
                '规则管控': parseFloat(hotelRule * 12).toFixed(2),
                '提醒推荐': 0,
                '人力节省': (hotelTime * 12),
                ad: (hotelAd * 12)
            }, {
                name: '火车',
                '规则管控': parseFloat(trainRule * 12).toFixed(2),
                '提醒推荐': 0,
                '人力节省': (trainTime * 12),
                '价格节省': (trainAd * 12)
            }, {
                name: '用车',
                '规则管控': parseFloat(taxiRule * 12).toFixed(2),
                '提醒推荐': 0,
                '人力节省': (taxiTime * 12),
                '价格节省': 0
            }
        ]
        this.setState({
            ...this.state,
            flighRule,
            hotelRule,
            trainRule,
            taxiRule,
            flightReminder,
            flightAd,
            hotelAd,
            trainAd,
            flightTime,
            trainTime,
            hotelTime,
            taxiTime,
            data,
            yearData,
            width
        })
        // console.log(flighRule, hotelRule, trainRule, taxiRule, flightReminder,
        // flightAd, hotelAd, trainAd, flightTime, trainTime, hotelTime, taxiTime);
    }

    render() {
        // console.log(this.props.homeState);
        const {
            flighRule,
            hotelRule,
            trainRule,
            taxiRule,
            flightReminder,
            flightAd,
            hotelAd,
            trainAd,
            flightTime,
            trainTime,
            hotelTime,
            taxiTime
        } = this.state
        const {homeState} = this.props

        return (
            <div>
                <Tabs
                    swipeable={false}
                    defaultActiveKey='1'
                    onChange={callback}
                    onTabClick={handleTabClick}>
                    <TabPane tab='单月节省' key='1'>

                        {this.state.width !== 0
                            ? (<StackedBarChart data={this.state.data} width={this.state.width}/>)
                            : undefined}
                        <WhiteSpace size='lg'/>
                        <div className={s.columnFlexContainer}>
                            <div className={s.tableTitle}>
                                节省总分析
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>
                                        总节省/元
                                    </div>
                                    <div className={s.number}>
                                        {moneyFormat(parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)) + parseInt(flightReminder) + parseInt((flightTime + hotelTime + trainTime + taxiTime) * homeState.salary / 22 / 8 / 60) + parseInt(parseFloat(flightAd) + parseFloat(hotelAd) + parseFloat(trainAd)))}
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>管控节省</div>
                                    <div className={s.number}>
                                        {moneyFormat(parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)) + parseInt(flightReminder))}</div>
                                </div>
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>节省人力</div>
                                    <div className={s.number}>
                                        {moneyFormat(parseInt((flightTime + hotelTime + trainTime + taxiTime) * homeState.salary / 22 / 8 / 60))}</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>价格优势</div>
                                    <div className={s.number}>{moneyFormat(parseInt(parseFloat(flightAd) + parseFloat(hotelAd) + parseFloat(trainAd)))}</div>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace size='lg'/>
                        <div className={s.columnFlexContainer}>
                            <div className={s.tableTitle}>
                                管控节省
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>
                                        管控总节省/元
                                    </div>
                                    <div className={s.number}>
                                        {moneyFormat(parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)) + parseInt(flightReminder))}
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>规则节省/元</div>
                                    <div className={s.number}>{moneyFormat(parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)))}
                                    </div>
                                </div >
                            </div>
                            < div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>提醒节省/元</div>
                                    <div className={s.number}>{moneyFormat(parseInt(flightReminder))}</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={cx(s.tableItemHeader, s.opacity)}>总节省/元</div>
                                    <div className={cx(s.number, s.opacity)}>0</div>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace size='lg'/>
                        <div className={s.columnFlexContainer}>
                            <div className={s.tableTitle}>
                                人力节省
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>
                                        人力总节省/元
                                    </div>
                                    <div className={s.number}>
                                        {moneyFormat(parseInt((flightTime + hotelTime + trainTime + taxiTime) * homeState.salary / 22 / 8 / 60))}
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>人力节省/分钟</div>
                                    <div className={s.number}>{parseInt(flightTime + hotelTime + trainTime + taxiTime)}</div>
                                </div>
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>纸张节省/张</div>
                                    <div className={s.number}>{parseInt((parseFloat(homeState.flightTickets) + parseFloat(homeState.hotelTickets) + parseFloat(homeState.trainTickets) + parseFloat(homeState.taxiTickets)) * 0.25)}</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={cx(s.tableItemHeader, s.opacity)}>总节省/元</div>
                                    <div className={cx(s.number, s.opacity)}>0</div>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace size='lg'/>
                        <div className={s.explain}>
                            节省数据计算说明
                            <Icon type='right'/>
                        </div>
                        <WhiteSpace size='lg'/>
                    </TabPane>
                    <TabPane tab='全年节省' key='2'>

                        {this.state.width !== 0
                            ? (<StackedBarChart data={this.state.yearData} width={this.state.width}/>)
                            : undefined}
                        <WhiteSpace size='lg'/>
                        <div className={s.columnFlexContainer}>
                            <div className={s.tableTitle}>
                                节省总分析
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>
                                        总节省/元
                                    </div>
                                    <div className={s.number}>
                                        {moneyFormat((parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)) + parseInt(flightReminder) + parseInt((flightTime + hotelTime + trainTime + taxiTime) * homeState.salary / 22 / 8 / 60)) * 12)}
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>管控节省</div>
                                    <div className={s.number}>
                                        {moneyFormat((parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)) + parseInt(flightReminder)) * 12)}</div>
                                </div>
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>节省人力</div>
                                    <div className={s.number}>
                                        {moneyFormat(parseInt((flightTime + hotelTime + trainTime + taxiTime) * homeState.salary / 22 / 8 / 60) * 12)}</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>价格优势</div>
                                    <div className={s.number}>{moneyFormat(parseInt(parseFloat(flightAd) + parseFloat(hotelAd) + parseFloat(trainAd)) * 12)}</div>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace size='lg'/>
                        <div className={s.columnFlexContainer}>
                            <div className={s.tableTitle}>
                                管控节省
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>
                                        管控总节省/元
                                    </div>
                                    <div className={s.number}>
                                        {moneyFormat((parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)) + parseInt(flightReminder)) * 12)}
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>规则节省/元</div>
                                    <div className={s.number}>{moneyFormat(parseInt(parseFloat(flighRule) + parseFloat(hotelRule) + parseFloat(trainRule) + parseFloat(taxiRule)) * 12)}
                                    </div>
                                </div >
                            </div>
                            < div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>提醒节省/元</div>
                                    <div className={s.number}>{moneyFormat(parseInt(flightReminder) * 12)}</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={cx(s.tableItemHeader, s.opacity)}>总节省/元</div>
                                    <div className={cx(s.number, s.opacity)}>0</div>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace size='lg'/>
                        <div className={s.columnFlexContainer}>
                            <div className={s.tableTitle}>
                                人力节省
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>
                                        人力总节省/元
                                    </div>
                                    <div className={s.number}>
                                        {moneyFormat(parseInt((flightTime + hotelTime + trainTime + taxiTime) * homeState.salary / 22 / 8 / 60) * 12)}
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>人力节省/分钟</div>
                                    <div className={s.number}>{parseInt(flightTime + hotelTime + trainTime + taxiTime) * 12}</div>
                                </div>
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>纸张节省/张</div>
                                    <div className={s.number}>{parseInt((parseFloat(homeState.flightTickets) + parseFloat(homeState.hotelTickets) + parseFloat(homeState.trainTickets) + parseFloat(homeState.taxiTickets)) * 0.25) * 12}</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={cx(s.tableItemHeader, s.opacity)}>总节省/元</div>
                                    <div className={cx(s.number, s.opacity)}>0</div>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace size='lg'/>
                        <div className={s.explain}>
                            节省数据计算说明
                            <Icon type='right'/>
                        </div>
                        <WhiteSpace size='lg'/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Summary
