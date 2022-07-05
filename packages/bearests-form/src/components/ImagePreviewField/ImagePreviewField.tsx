import React, {forwardRef, useState} from 'react';
import styled, {css} from 'styled-components/macro';
import {media} from 'bear-react-grid';
import {isEmpty, isNotEmpty} from 'bear-jsutils/equal';
import {FCProps} from '../../typings';

// Components
import {Icon} from 'bearests-backdesk-atom';


interface IProps extends FCProps {
    accept?: Array<'image/png'|'image/jpeg'>;
    value?: File;
    onChange?: (file: any|null) => void;
    onDelete?: () => void;
    currentImageUrl?: string;
    exampleSize?: {
        width: number,
        height: number;
    }
    maxFileSize?: number, // KB
    isVisibleMaxInfo?: boolean,
    isVisibleDropFileInfo?: boolean,
    isVisibleIcon?: boolean,
    onUpload?: (file: File, event: (event: ProgressEvent) => void) => void;
}

/**
 * 檔案上傳(含預覽圖)
 * @param style
 * @param className
 * @param accept
 * @param onChange
 * @param onDelete
 * @param value
 * @param currentImageUrl
 * @param exampleSize
 * @param maxFileSize
 * @param isVisibleMaxInfo
 * @param isVisibleDropFileInfo
 * @param isVisibleIcon
 */
const ImagePreviewField = forwardRef<HTMLInputElement, IProps>(({
    style,
    className,
    accept = ['image/png','image/jpeg'],
    onChange,
    onDelete,
    value,
    currentImageUrl,
    exampleSize,
    maxFileSize = 200,
    isVisibleMaxInfo = true,
    isVisibleDropFileInfo = true,
    isVisibleIcon = true,
    onUpload,
}, ref) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<FileReader['result']|null>('');

    const isVisiblePreview = (isNotEmpty(imagePreviewUrl) || isNotEmpty(currentImageUrl));
    const isPreviewOnly = (isNotEmpty(imagePreviewUrl) && isEmpty(currentImageUrl));
    const isVisibleDelete = typeof onDelete !== 'undefined' && isVisiblePreview;


    const handleUploadProcess = (event: ProgressEvent) => {
        console.log('stuff value', event);
        let percent = 0;
        if (event.lengthComputable) {
            percent = (event.loaded / event.total) * 100;
            console.log('percent', percent);
        }
    };

    /**
     * 處理選取檔案時 (切換預覽圖)
     * @param event
     */
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();


        const file = event.target.files ? event.target.files[0] : undefined;

        if(file) {
            const reader = new FileReader();
            // @ts-ignore
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);

                if(onUpload){
                    onUpload(file, handleUploadProcess);
                }

                // ajaxUpload({
                //     name: 'image',
                //     data: {id: 1},
                //     file: file,
                //     url: '/event/item/1/photo',
                //     onError: (status) => {console.log('status', status)},
                //     onSuccess: (response) => {console.log('success response', response)},
                //     onProgress: (percent) => {console.log('percent',percent)},
                // })
            };
        }else{
            setImagePreviewUrl(null);
        }


        if(onChange){
            onChange(file);
        }
    };


    /**
     * 取得檔案名稱
     */
    const getFileName = () => {
        return value?.name;
    };

    /**
     * 取得檔案名稱
     */
    const getImagePreviewUrl = (): string|undefined => {
        if(!isEmpty(imagePreviewUrl)){
            return (imagePreviewUrl) as string;
        }
        return currentImageUrl;
    };

    /**
     * 刪除圖片
     */
    const handleDelete = () => {
        setImagePreviewUrl(null);
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
        // setImagePreviewUrl(null);
        // @ts-ignore
        setImagePreviewUrl(null);
        if(onChange){
            onChange(undefined);
        }
    };

    const renderIconButton = () => {

        if(currentImageUrl && onDelete){
            // 刪除檔案並還原
            return (
                <div className="d-flex flex-row">
                    <HoverButton actionType="zoomIn" onClick={() => {}}>
                        <Icon code="zoom-in" size={28}/>
                    </HoverButton>
                    <HoverButton actionType="delete" onClick={() => handleDelete()}>
                        <Icon code="trash" size={28}/>
                    </HoverButton>
                </div>
            );

        }else if(imagePreviewUrl){
            // 取消預覽
            return (<HoverButton actionType="redo" onClick={handleRedo}>
                <Icon code="undo-alt" size={28}/>
            </HoverButton>);
        }

        return (
            <div className="d-flex flex-row">
                {isVisiblePreview && (
                    <HoverButton actionType="zoomIn" onClick={() => {}}>
                        <Icon code="zoom-in" size={28}/>
                    </HoverButton>
                )}
                <HoverButton>
                    <Icon code="image-upload" size={28}/>
                </HoverButton>
            </div>


        );
    };



    return <RootContainer
        style={style}
        className={className}
        imagePreviewUrl={getImagePreviewUrl()}
    >
        <FileUpload
            ref={ref}
            type="file"
            accept={accept.join(', ')}
            onChange={handleImageChange}
            disabled={isVisibleDelete}
            value="" // 必須加上空, 不然重設會異常(同檔案再次選擇時, 不會觸發onChange)
        />

        {isPreviewOnly && <Notice>Preview Not Upload</Notice>}

        {isVisibleDropFileInfo && (
            <Content>
                <PcMark className="d-none d-lg-block">
                    Drag files here
                </PcMark>
            </Content>
        )}

        <FooterInfo isVisible={isVisibleMaxInfo}>

            <FooterLeft>
                {getFileName()}
            </FooterLeft>
            <FooterRight>
                {accept.join('| ').replaceAll('image/','')}
                {exampleSize && `, ${exampleSize?.width}x${exampleSize?.height}`}
                , {maxFileSize}KB
            </FooterRight>

        </FooterInfo>

        <HoverBg/>
        <ButtonContent>
            {isVisibleIcon && renderIconButton()}
        </ButtonContent>
    </RootContainer>;
});

export default ImagePreviewField;

const Notice = styled.div`
  position: absolute;
  z-index: 5;
  left: 5px;
  top: 5px;
  color: crimson;
  background-color: rgba(39,44,49,.8);
  padding: 5px;
  border-radius: 6px;
`;


const ButtonContent = styled.div`
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
`;

const FooterRight = styled.div`
    overflow: hidden;
    white-space: nowrap;
    padding: 0 5px;
`;
const FooterLeft = styled.div`
    overflow: hidden;
    white-space: nowrap;
    padding: 0 5px;
`;

const FooterInfo = styled.div<{
    isVisible?: boolean;
}>`
    height: 25px;
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
    padding-left: 10px;
    font-size: 12px;

    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #272c31;
    opacity: .8;
    color: #fff;
    z-index: 2;

    ${props => props.isVisible === false && css`
        display: none;
    `}
`;


const HoverButton = styled.div<any>`
    font-size: 14px;
    font-weight: 900;
    background-color: rgba(0, 0, 0, 0.6);
    border: 2px solid #63a35c;
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 99em;
    align-items: center;
    justify-content: center;
    margin: 8px;

    transition: opacity .3s ease;
    opacity: 0;
    pointer-events: none;

    svg{
      color: #63a35c;
    }

    ${props => props.actionType === 'zoomIn' && css`
       pointer-events: auto;

       border-color: #5781bd;
       svg{
         color: #5781bd;
       }
    `}

    ${props => props.actionType === 'delete' && css`
       pointer-events: auto;

       border-color: #bd2c00;
       svg{
         color: #bd2c00;
       }
    `}

    ${props => props.actionType === 'redo' && css`
       pointer-events: auto;

       border-color: #bda005;

       svg{
          color: #bda005;
       }
    `}

    ${media.lg`
        display: flex;
    `}
`;

const HoverBg = styled.div`
    width: 100%;
    height: 100%;
    //background-color: #000;
    background: hsl(0deg 0% 0% / 75%);
    opacity: 0;
    transition: opacity .3s, backdrop-filter .2s;
    position:absolute;
    top: 0;
    left: 0;
`;

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

const PcMark = styled.div`

    font-size: 16px;
    font-weight: 900;
    padding: 0;
    margin-bottom: 5px;

    >span {
        font-size: 12px;
    }
`;

const Content = styled.div`
    text-align: center;
`;

const RootContainer = styled.div<{
    imagePreviewUrl?: any
    exampleWidth?: string;
    exampleHeight?: string;
}>`
    height: 160px;
    width: 100%;
    cursor: pointer;
    background-color: #272c31;
    background-image: url(${props => props.imagePreviewUrl});
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    border-radius: 4px;
    //border: dashed ${props => (props.imagePreviewUrl ? '0' : '2px')} #d8d8d8;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    ${media.lg`
        max-width: 670px;
        height: 160px;

        &:hover {
            ${HoverButton} {
                opacity: 1;
                z-index: 2;
            }
            ${HoverBg}{
                opacity: .6;
                backdrop-filter: blur(2px);
            }
        }
    `}

    ${props => props.imagePreviewUrl && css`
        ${Content} {
            display: none;
        }

    `}
`;
