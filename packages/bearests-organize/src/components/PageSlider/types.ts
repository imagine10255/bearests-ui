
export enum AfterType {
    icon = 'icon',
    text = 'text',
}
export interface IItem {
    text: string,
    desc?: string,
    path: string,
    after: {type: AfterType, prefix?: string, code?: string, color?: string},
    children?: IItem[]
}
