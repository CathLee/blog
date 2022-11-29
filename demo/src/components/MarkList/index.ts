/*
 * @Author: cathylee 447932704@qq.com
 * @Date: 2022-11-20 00:12:26
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-27 15:50:37
 * @FilePath: /demo/src/components/MarkList/index.ts
 * @Description:
 *
 * Copyright (c) 2022 by cathylee 447932704@qq.com, All Rights Reserved.
 */

import { RulesProp } from '@/baseComponents/Input';

// 单个书签
export interface MarkProps {
    icon?: string;
    title: string;
    targetUrl: string;
    explain?: string;
}

export type HandleMarkType = 'add' | 'update';
export interface MarkState {
    handleType: HandleMarkType;
    defaultImg: string;
    currentMark: number;
}

export type MarkListProps = MarkProps[];

// 弹窗
export interface DialogState {
    title: string;
    icon: string;
    targetUrl: string;
    explain: string;
}

export interface DialogFormState {
    targetUrlRules: RulesProp;
    titleRules: RulesProp;
    iconRules: RulesProp;
    isShowAddMarkDialog: boolean;
    loading1: boolean;
    loading2: boolean;
}
