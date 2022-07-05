import React from 'react';
import styled, {css} from 'styled-components/macro';
import {media} from 'bear-react-grid';
import {isNotEmpty} from 'bear-jsutils/equal';
import {FCProps} from '../../typings';

// Components
import {Icon} from 'bearests-backdesk-atom';
import TextField from '../TextField';


interface IProps extends FCProps {
    label: string;
    value?: File;
    currentFileUrl?: string;
    onChange?: (file: any) => void;
    disabled?: boolean;
    onDelete?: () => void;
    accept?: string[];
}

/**
 * File Input 時間選擇輸入控制項
 *
 * @param className
 * @param style
 * @param label
 * @param value
 * @param position 方向
 * @param onChange
 * @param disabled
 */
const FileField = ({
    className,
    style,
    label,
    value,
    accept = [],
    currentFileUrl,

    onChange,
    onDelete,
    disabled = false,
}: IProps) => {

    const fileName = value?.name || currentFileUrl;

    /**
     * 處理選取檔案時
     * @param event
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const file = event.target.files ? event.target.files[0] : undefined;

        if(onChange){
            onChange(file);
        }
    };


    /**
     * 刪除圖片
     */
    const handleDelete = () => {
        if(onDelete){
            // @ts-ignore
            onDelete();
        }
        if(onChange){
            onChange(undefined);
        }
    };




    /**
     * 復原
     */
    const handleRedo = () => {
        if(onChange){
            onChange(undefined);
        }
    };

    const renderIconButton = () => {

        if(currentFileUrl && onDelete){
            // 刪除檔案並還原
            return (
                <AfterIconGroup>

                    <FileIcon onClick={handleDelete}>
                        <Icon code="trash" color="#bd2c00" size={20}/>
                    </FileIcon>

                    <FileIcon onClick={() => window.open(currentFileUrl)}>
                        <Icon code="download" color="#c3c3c3" size={20}/>
                    </FileIcon>
                </AfterIconGroup>
            );

        }else if(isNotEmpty(fileName)){
            // 取消預覽
            return (
                <AfterIconGroup>
                    <FileIcon onClick={handleRedo}>
                        <Icon code="undo-alt" size={28}/>
                    </FileIcon>
                </AfterIconGroup>);
        }

        return (
            <AfterIconGroup>
                <FileIcon>
                    <Icon code="file-upload" size={28}/>
                </FileIcon>
            </AfterIconGroup>


        );
    };





    return (
        <InputContainer
            className={className}
            style={style}
        >

            <FileUpload
                type="file"
                accept={accept.join(', ')}
                disabled={disabled}
                onChange={handleFileChange}
                value="" // 必須加上空, 不然重設會異常(同檔案再次選擇時, 不會觸發onChange)
            />

            <CustomInput
                type="text"
                placeholder={label}
                value={fileName}
                // isVisibleCleanButton={false}
                disabled={disabled}
            />


            <AfterIconGroup>

                {renderIconButton()}

            </AfterIconGroup>


        </InputContainer>
    );
};

export default FileField;



const FileUpload = styled.input`
    cursor: pointer;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
`;


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
        margin-right: 5px;
        margin-left: 5px;

        i {
            font-size: 25px;
        }
    `}
`;





const FileIcon = styled(CustomIcon)``;


const AfterIconGroup = styled.div`
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    display: flex;
    z-index: 2;
    align-items: center;
    justify-content: center;
    background-color: #272c31;
`;


const InputContainer= styled.div`
    cursor: pointer;
    position: relative;
    width: 100%;
    
`;
