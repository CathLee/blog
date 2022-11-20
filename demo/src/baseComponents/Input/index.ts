/*
 * @Author: cathylee 447932704@qq.com
 * @Date: 2022-11-20 12:51:51
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-20 12:54:33
 * @FilePath: /demo/src/baseComponents/Input/index.ts
 * @Description: input组建验证规则
 *
 * Copyright (c) 2022 by cathylee 447932704@qq.com, All Rights Reserved.
 */
export type RuleType = 'required' | 'maxlength' | 'custom';
export interface RuleProp {
    type: RuleType;
    message: string;
    maxlength?: number;
    validator?: (value: string) => boolean;
}
// 验证规则集合
export type RulesProp = RuleProp[];
