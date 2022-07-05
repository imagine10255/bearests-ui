import React from 'react';


/** -----------------------------------------
 |               Interface                   |
 /** ---------------------------------------*/
export interface IIConSvg {
    idPrefix?: string,
    symbolsPath: string
}

export interface IParams {
    iconSvg: IIConSvg
    loadingImage: string
}

/** -----------------------------------------
 |            Initial State                 |
 /** ---------------------------------------*/
const params: IParams = {
    iconSvg: {
        symbolsPath: '/static/plugins/iconsvg/index.svg',
    },
    loadingImage: '/static/images/loading.gif',
};

const SettingContext = React.createContext<IParams>(params);
SettingContext.displayName = 'SettingProvider';
const SettingContextConsumer = SettingContext.Consumer;
const SettingContextProvider = SettingContext.Provider;


export {
    SettingContext,
    SettingContextConsumer,
    SettingContextProvider,
};
