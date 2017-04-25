import React, {Component, PropTypes} from 'react';

import {Tabs, WhiteSpace} from 'antd-mobile';
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

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400
    }, {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210
    }, {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290
    }, {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000
    }, {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181
    }, {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500
    }, {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100
    }
];
class StackedBarChart extends Component {
    static propTypes = {
        width: PropTypes.number
    }
    render() {
        return (
            <BarChart
                width={this.props.width * 2}
                height={300}
                data={data}
                margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
            }}>
                <XAxis dataKey='name'/>
                <YAxis/>
                <CartesianGrid strokeDasharray='3 3'/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey='pv' stackId='a' fill='#8884d8'/>
                <Bar dataKey='uv' stackId='a' fill='#82ca9d'/>
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
        console.log(homeState);
        const flighRule = ((parseFloat(homeState.flightSingleSave) * parseFloat(homeState.flightSaveCount)) + (parseFloat(homeState.flightTimesLimitedSingleSave) * parseFloat(homeState.flightTimesLimitedSaveCount))).toFixed(2)
        const hotelRule = (parseFloat(homeState.hotelSingleSave) * parseFloat(homeState.hotelSaveCount)).toFixed(2)
        const trainRule = (parseFloat(homeState.trainSingleSave) * parseFloat(homeState.trainSaveCount)).toFixed(2)
        const taxiRule = ((parseFloat(homeState.taxiSingleSave) * parseFloat(homeState.taxiSaveCount)) + (parseFloat(homeState.taxiLocationSingleSave) * parseFloat(homeState.taxiLocationSaveCount))).toFixed(2)

        const flightReminder = ((parseFloat(homeState.cheapReminderAffectCount) * parseFloat(homeState.slideWithLowFlight) / 100) + (parseFloat(homeState.slideWithAheadFlight) * parseFloat(homeState.aheadReminderAffectCount) / 100)).toFixed(2)

        const flightAd = (parseFloat(homeState.flightTickets) * parseFloat(homeState.flightPrice) * parseFloat(homeState.flightAd) / 100).toFixed(2)
        const hotelAd = (parseFloat(homeState.hotelTickets) * parseFloat(homeState.hotelPrice) * parseFloat(homeState.hotelAd) / 100).toFixed(2)
        const trainAd = (parseFloat(homeState.trainTickets) * parseFloat(homeState.trainPrice) * parseFloat(homeState.trainAd) / 100).toFixed(2)

        const width = window.screen.width
        this.setState({
            ...this.state,
            width
        });
    }

    render() {
        console.log(this.props.homeState);
        return (
            <div>
                <Tabs
                    swipeable={false}
                    defaultActiveKey='1'
                    onChange={callback}
                    onTabClick={handleTabClick}>
                    <TabPane tab='单月节省' key='1'>

                        {this.state.width !== 0
                            ? (<StackedBarChart width={this.state.width}/>)
                            : undefined}

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
                                        1000000
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>管控节省</div>
                                    <div className={s.number}>60000</div>
                                </div>
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>节省人力</div>
                                    <div className={s.number}>400000</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>价格优势</div>
                                    <div className={s.number}>0</div>
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
                                        1000000
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>规则节省/元</div>
                                    <div className={s.number}>60000</div>
                                </div>
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>提醒节省/元</div>
                                    <div className={s.number}>400000</div>
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
                                        1000000
                                    </div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>人力节省/分钟</div>
                                    <div className={s.number}>60000</div>
                                </div>
                            </div>
                            <div className={s.flexContainer}>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>纸张节省/张</div>
                                    <div className={s.number}>400000</div>
                                </div>
                                <div className={cx(s.columnFlexContainer, s.flexItem, s.cell)}>
                                    <div className={s.tableItemHeader}>总节省/元</div>
                                    <div className={s.number}>0</div>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace size='lg'/>
                        <div>节省数据计算说明</div>
                        <WhiteSpace size='lg'/>
                    </TabPane>
                    <TabPane tab='全年节省' key='2'>
                        <div
                            style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '5rem',
                            backgroundColor: '#fff'
                        }}>
                            选项卡二内容
                        </div>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}

export default Summary
