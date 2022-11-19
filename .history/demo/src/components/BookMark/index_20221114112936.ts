/*
 * @Author: CathyLee
 * @Date: 2022-11-14 11:22:27
 * @LastEditors: CathyLee
 * @LastEditTime: 2022-11-14 11:29:18
 * @Description:
 */
import { LabelsProps } from 'coms/LabelList/index';
export type LabelListProps = LabelsProps[];
// 书签的数据类型
export interface BookmarkState {
    warblerData: LabelListProps;
    editMode: boolean;
    motto: string;
}
