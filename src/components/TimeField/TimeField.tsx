import React, {useState, useCallback, useMemo} from 'react';
import styled, {css} from 'styled-components/macro';
import {media} from 'bear-react-grid';
import {checkIsMobile} from 'bear-jsutils/browser';
import {isEmpty} from 'bear-jsutils/equal';
import {FCProps} from '../../typings';

// Components
import {Timepicker} from 'bear-react-datepicker';
import {Icon} from 'bearests-backdesk-atom';
import TextField from '../TextField';



interface IProps extends FCProps{
    label: string;
    value?: string;
    position?: 'top'|'bottom';
    onChange?: (value: string) => void;
    disabled?: boolean;

}

/**
 * Time Input 時間選擇輸入控制項
 *
 * @param className
 * @param style
 * @param label
 * @param value
 * @param position 方向
 * @param onChange
 * @param disabled
 */
const TimeField = ({
    className,
    style,
    label,
    value= '',
    position= 'bottom',

    onChange,
    disabled = false,
}: IProps) => {

    // const [selectedTime, setSelectedTime] = useState<string>(value);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState<boolean>(false);
    const isMobile = useMemo(() => checkIsMobile(), []);
    const isVisiblePicker = useMemo(() => !isMobile && !disabled, [disabled, isMobile]);

    /**
     * 處理控制 Picker顯示隱藏
     */
    const handleTimePickerVisible = useCallback((isVisible: boolean) => {
        setIsTimePickerVisible(isVisible);
    }, []);

    /**
     * 處理值改變
     */
    const handleOnChange = useCallback((currentValue: string) => {
        if(onChange){
            onChange(currentValue);
        }

    }, []);


    /**
     * 處理清除內容
     */
    const handleClearDate = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        handleOnChange('');
    }, [handleOnChange]);




    return (
        <InputContainer
            className={className}
            style={style}
            isSelected={!isEmpty(value)}
        >
            <FakeInput onClick={() => handleTimePickerVisible(true)}>

                <CustomInput
                    value={value}
                    placeholder={label}
                    // isVisibleCleanButton={false}
                    onChange={handleOnChange}
                    disabled={disabled}
                />


                {!disabled &&
                <AfterIconGroup>
                    <CalendarIcon>
                        {/*// @ts-ignore*/}
                        <Icon code="clock" color="#c3c3c3" size={20}/>
                    </CalendarIcon>

                    <ClearIcon onClick={handleClearDate}>
                        {/*// @ts-ignore*/}
                        <Icon code="times-circle" color="#c3c3c3" size={20}/>
                    </ClearIcon>
                </AfterIconGroup>
                }

            </FakeInput>

            {isVisiblePicker && (
                <React.Fragment>
                    <TimePickerContainer isVisible={isTimePickerVisible} position={position}>
                        <Timepicker
                            value={value}
                            onChange={handleOnChange}
                            onClickOk={() => handleTimePickerVisible(false)}
                        />
                    </TimePickerContainer>
                    <CloseArea isVisible={isTimePickerVisible} onClick={() => handleTimePickerVisible(false)}/>
                </React.Fragment>
            )}

        </InputContainer>
    );
};

export default TimeField;


const CustomInput = styled(TextField)<{
    disabled?: boolean;
}>`
    pointer-events: auto;
    cursor: pointer;

    ${props => props.disabled && css`
        pointer-events: none;
        cursor: default;
    `}
`;


const CloseArea= styled.div<{
    isVisible: boolean
}>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: ${props => (props.isVisible ? 0 : -1)};
`;

const CustomIcon = styled.div`
    width: 30px;
    height: 30px;
    transition: opacity .3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;

    ${media.lg`
        width: 25px;
        height: 25px;
        margin-right: 12px;

        i {
            font-size: 25px;
        }
    `}
`;

const ClockIcon = styled(CustomIcon)``;


const FakeInput = styled.div`
    color: #8d8d8d;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;


const CalendarIcon = styled(CustomIcon)``;

const ClearIcon = styled(CustomIcon)<any>`
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    opacity: 0;
    pointer-events: none;

    ${media.lg`
        right: 0;
    `}
`;

const AfterIconGroup = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TimePickerContainer= styled.div<{
    isVisible: boolean,
    position: 'top'|'bottom',
}>`
    position: absolute;
    left: 50%;
    visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
    opacity: ${props => (props.isVisible ? 1 : 0)};
    z-index: ${props => (props.isVisible ? 1 : -1)};
    transform: translateX(-50%);
    transition: opacity .5s ease;

    ${props => props.position === 'top' && css`
        bottom: calc(100% - 1px);
    `}
    ${props => props.position === 'bottom' && css`
        top: calc(100% - 1px);
    `}
`;

const InputContainer= styled.div<{
    isSelected: boolean,
}>`
    width: 100%;
    height: 44px;
    cursor: pointer;
    position: relative;

    ${(props) => props.isSelected && css`

        &:hover {
            ${ClearIcon} {
                opacity: 1;
                pointer-events: auto;
                z-index: 1;
            }

            ${ClockIcon} {
                opacity: 0;
            }
        }
    `}


    ${media.lg`
        height: 50px;
    `}

`;
