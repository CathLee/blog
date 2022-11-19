/*
 * @Author: CathyLee
 * @Date: 2022-11-14 11:25:10
 * @LastEditors: CathyLee
 * @LastEditTime: 2022-11-14 11:28:26
 * @Description: 标签组件的一些基础配置,数据,接口等
 */
import { MarkProps } from 'coms/MarkList/index';
// 单个标签
export interface LabelsProps {
    title: string;
    marks: MarkProps[];
}