import React, {Children} from 'react';
import {SettingContextProvider, IIConSvg} from './context';


interface IProps{
    iconSvg: IIConSvg
    loadingImage: string
    children: JSX.Element
}

const SettingProvider = ({
    iconSvg,
    loadingImage,
    children
}: IProps) => {
    
    const providerParam = {iconSvg, loadingImage};

    return <SettingContextProvider value={providerParam}>
        {Children.only(children)}
    </SettingContextProvider>;
};

export default SettingProvider;
