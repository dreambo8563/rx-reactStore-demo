import React, {PureComponent} from 'react';
import {Breadcrumb} from 'antd';
import s from 'shared/title.css'
import {navTree} from 'constants/TEXT'

class EvaluateListTitle extends PureComponent {
    render() {
        return (
            <div className={s.title}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <span>{navTree.uc.evaluate.title}</span>
                    </Breadcrumb.Item>
                </Breadcrumb>

            </div>
        );
    }
}

export default EvaluateListTitle
