import React, { useCallback } from 'react';
import { Card, Tag } from 'antd';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Brigade } from '../../Store/BrigadesSlice';
import { ConnectionState } from '../../Store/ConnectionStatusSlice';
import '../../styles/Brigade/BrigadeList.css';

interface IBrigadeTileProps extends Omit<Brigade, "department" | "connectionStateId"> {
    departmentName: string;
    connectionState: ConnectionState;
}

const BrigadeTile: React.FC<IBrigadeTileProps> = React.memo((props) => {

    const getConnectionTagProps = useCallback((connectionStateId: number) => {
        switch (connectionStateId) {
            case 1:
                return { color: "success", icon: <CheckCircleOutlined /> };
            case 0:
                return { color: "error", icon: <StopOutlined /> };
            default:
                return { color: "default", icon: null };
        }
    }, []);

    const tagProps = getConnectionTagProps(props.connectionState.connectionStateId);

    return (
        <Card size="small" className='brigade-card' title={`Бригада №${props?.id}`} bordered={true} >
            <p>{props.departmentName}</p>
            <p>
                <Tag icon={tagProps.icon} color={tagProps.color}>
                    Соединение: {props.connectionState.name}
                </Tag>
            </p>
            <p>Кластер: {props.position.cluster}</p>
            <p>Поле: {props.position.field}</p>
            <p>Скважина: {props.position.well}</p>
        </Card>
    );
});

export default BrigadeTile;
