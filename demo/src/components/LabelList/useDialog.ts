/*
 * @Author: cathylee 447932704@qq.com
 * @Date: 2022-11-20 12:46:57
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-20 14:26:15
 * @FilePath: /demo/src/components/LabelList/useDialog.ts
 * @Description: 控制标签组建的dialog状态
 *
 * Copyright (c) 2022 by cathylee 447932704@qq.com, All Rights Reserved.
 */
// 标签标题验证规则
import { RulesProp } from 'base/Input/index';
import { reactive } from 'vue';
import { DialogState } from '.';
const rules: RulesProp = [
    {
        type: 'maxlength',
        message: '标签名称最多10个字符!',
        maxlength: 10,
    },
    {
        type: 'required',
        message: '请输入标签名称!',
    },
];

const useDialog = () => {
    const dialogState = reactive<DialogState>({
        isShowLabelDialog: false,
        labelTitle: '',
        rules: rules,
    });
    const showLabelDialog = (value?: string) => {
        dialogState.isShowLabelDialog = true;
        if (value) {
            dialogState.labelTitle = value;
        }
    };

    const closeLabelDialog = () => {
        dialogState.isShowLabelDialog = false;
        dialogState.labelTitle = '';
    };
    return {
        dialogState,
        showLabelDialog,
        closeLabelDialog,
    };
};

export default useDialog;
