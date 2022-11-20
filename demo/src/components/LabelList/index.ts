/*
 * @Author: CathyLee
 * @Date: 2022-11-14 11:25:10
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-20 14:00:53
 * @Description: 标签组件的一些基础配置,数据,接口等
 */
import { RulesProp } from '@/baseComponents/Input';
import { MarkProps } from 'coms/MarkList/index';
import { ComputedRef } from 'vue';

// 操作标签的类型
export type HandleLabelType = 'add' | 'update';

// 单个标签
export interface LabelsProps {
    title: string;
    marks: MarkProps[];
}

// 弹窗相关操作数据
export interface DialogState {
    isShowLabelDialog: boolean;
    labelTitle: string;
    rules: RulesProp;
}

export interface LabelState {
    handleType: HandleLabelType;
    currentClickLabel: number;
    currentHoverLabel: number;
    dialogTitle: ComputedRef;
}
