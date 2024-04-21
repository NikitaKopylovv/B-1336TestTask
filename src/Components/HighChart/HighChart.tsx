import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { InputNumber, Button, Spin, Alert } from 'antd';
import { fetchPoints } from '../../Store/HighChartClice'
import { useAppDispatch, useAppSelector } from '../../redux';
import '../../styles/HighChart/HighChart.css';

const HighChart: React.FC = () => {
    const [inputValue, setInputValue] = useState<number | null>(100);
    const dispatch = useAppDispatch();
    const { status, error, points } = useAppSelector(state => state.highChartReducer);
    const handleFetchPoints = () => {
        dispatch(fetchPoints(inputValue));
    };



    const options = {
        chart: {
            type: 'line'
        },
        accessibility: {
            enabled: false // Отключает модуль доступности и предупреждение (по тз нет требования по взаимодействию с людьми с ограниченными возможностями)
        },
        title: {
            text: 'График точек'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e %b %Y',
                week: '%e %b %Y',
                month: '%b \'%y',
                year: '%Y'
            }
        },
        plotOptions: {
            series: {
                turboThreshold: 10000 // ограничение кол-ва отрисовываемых точек для производительности
            }
        },
        series: [{
            data: points.map(point => ({ ...point })), // Создание копий точек, так как redux задает иммутабельность для данных
            step: 'left',
            name: 'Point value'
        }]
    };


    useEffect(() => {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    }, []); // чтобы отображать реально полученные данные, без преобразования к местному времени
    // по умолчанию получается в UTC и преобразовывается в -5 от полученного

    if (status === 'failed') {
        return (
            <Alert
                message="Error"
                description={error || "Failed to fetch data from the server."}
                type="error"
            />
        );
    }

    return (
        <div>
            <InputNumber
                min={1}
                max={10000}
                defaultValue={100}
                onChange={value => setInputValue(value)}
            />
            <Button onClick={handleFetchPoints}>Загрузить точки</Button>
            {status === 'loading' ? <Spin className='preloader-highChart' /> : null}
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default HighChart;
