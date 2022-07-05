import React, {useCallback, useState, useMemo} from 'react';
import styled, {css} from 'styled-components/macro';
import {media} from 'bear-react-grid';
import {checkIsMobile} from 'bear-jsutils/browser';
import {isEmpty} from 'bear-jsutils/equal';
import {FCProps} from '../../typings';

// Component
import {Datepicker} from 'bear-react-datepicker';
import {Icon} from 'bearests-backdesk-atom';
import TextField from '../TextField';

interface IProps extends FCProps{
    placeholder?: string;
    value?: string;
    position?: 'top'|'bottom';
    onChange?: (value: string) => void;
    disabled?: boolean;

    isVisibleSetToday?: boolean;
}

/**
 * 日期輸入控件
 *
 * 手機版使用原生輸入框, 電腦版使用自製的Picker選擇
 * supper control & unControl
 *
 * @param className
 * @param style
 * @param placeholder
 * @param value
 * @param position 方向
 * @param isVisibleSetToday
 * @param disabled
 * @param value
 * @param onChange
 */
const DateField: React.FC<IProps> = ({
    className,
    style,

    placeholder,
    value,
    position= 'bottom',
    onChange,
    disabled = false,

    isVisibleSetToday = false,
}) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const isMobile = useMemo(() => checkIsMobile(), []);
    const isVisiblePicker = useMemo(() => !isMobile && !disabled, [disabled, isMobile]);


    /**
     * 處理控制 Picker顯示隱藏
     */
    const handleDatePickerVisible = useCallback((isVisible = false) => {
        setIsDatePickerVisible(isVisible);


    }, []);

    /**
     * 處理值改變
     */
    const handleOnChange = useCallback((currentValue: string) => {
        handleDatePickerVisible(false);
        if(onChange){
            onChange(currentValue);
        }


    }, [onChange]);


    /**
     * 處理清除內容
     */
    const handleClearDate = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        handleOnChange('');


    }, [handleOnChange]);



    // @ts-ignore
    // @ts-ignore
    return (
        <InputContainer
            className={className}
            style={style}
            isSelected={!isEmpty(value)}
        >
            <FakeInput onClick={() => handleDatePickerVisible(true)}>
                <CustomInput
                    value={value}
                    placeholder={placeholder}
                    // isVisibleCleanButton={false}
                    onChange={handleOnChange}
                    disabled={disabled}
                />


                {!disabled &&
                    <AfterIconGroup>
                        <CalendarIcon>
                            <Icon code="calendar-alt" color="#c3c3c3" size={20}/>
                        </CalendarIcon>

                        <ClearIcon onClick={handleClearDate}>
                            <Icon code="times-circle-alt" color="#c3c3c3" size={20}/>
                        </ClearIcon>
                    </AfterIconGroup>
                }

            </FakeInput>

            {isVisiblePicker && (
                <React.Fragment>
                    <DatePickerContainer isVisible={isDatePickerVisible} position={position}>
                        <Datepicker
                            value={value}
                            onChange={handleOnChange}
                            isVisibleSetToday={isVisibleSetToday}
                        />
                    </DatePickerContainer>
                    <CloseArea isVisible={isDatePickerVisible} onClick={() => handleDatePickerVisible(false)}/>
                </React.Fragment>
            )}


        </InputContainer>
    );
};

export default DateField;


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


const CloseArea = styled.div<any>`
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
    position: absolute;
    right: 0;

    ${media.lg`
        width: 25px;
        height: 25px;
        margin-right: 12px;

        i {
            font-size: 25px;
        }
    `}
`;

const CalendarIcon = styled(CustomIcon)``;

const ClearIcon = styled(CustomIcon)<any>`
    //position: absolute;
    //right: 0;
    //top: 0;
    //bottom: 0;
    //margin: auto;
    opacity: 0;
    pointer-events: none;
    
`;

const AfterIconGroup = styled.div`
    position: absolute;
    right: 0;
    //top: 0;
    //bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const DatePickerContainer = styled.div<{
    isVisible: boolean,
    position: 'top'|'bottom';
}>`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
    opacity: ${props => (props.isVisible ? 1 : 0)};
    z-index: ${props => (props.isVisible ? 10 : -1)};
    transition: opacity .5s ease;

    ${props => props.position === 'top' && css`
        bottom: calc(100% - 1px);
    `}
    ${props => props.position === 'bottom' && css`
        top: calc(100% - 1px);
    `}
`;

const FakeInput = styled.div`
    color: #8d8d8d;
    //height: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const InputContainer = styled.div<any>`
    width: 100%;
    //height: 44px;
    margin: 0;
    position: relative;


    ${props => props.isSelected && css`
        ${AfterIconGroup}{
            &:hover {
                ${ClearIcon} {
                    opacity: 1;
                    pointer-events: auto;
                    z-index: 1;
                }

                ${CalendarIcon} {
                    opacity: 0;
                }
            }
        }

    `};


`;

