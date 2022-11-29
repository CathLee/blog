/*
 * @Author: cathylee 447932704@qq.com
 * @Date: 2022-11-27 21:12:41
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-27 21:36:03
 * @FilePath: /demo/src/components/BookMark/useMarks.ts
 * @Description: 收藏夹中与书签相关的操作
 *
 * Copyright (c) 2022 by cathylee 447932704@qq.com, All Rights Reserved.
 */
import { ComputedRef } from 'vue';
import { MarkProps } from '../MarkList';
import defaultImgUrl from '@/assets/vue.svg';
import createMessage from '@/baseComponents/Message';
const useMarks = (markList: ComputedRef<MarkProps[]>) => {
    const marks = markList;
    const addMark = (state: MarkProps) => {
        marks.value.push({
            icon: state.icon || defaultImgUrl,
            title: state.title,
            explain: state.explain,
            targetUrl: state.targetUrl,
        });
        createMessage({ type: 'success', message: '添加书签成功' });
    };
    const deleteMark = (index: number) => {
        marks.value.splice(index, 1);
        createMessage({ type: 'success', message: '删除书签成功' });
    };
    const updateMark = (index: number, state: MarkProps) => {
        marks.value[index] = { ...state };
        createMessage({ type: 'success', message: '修改书签成功 !' });
    };
    // 修改书签索引
    const changeMarkIndex = (oldItemIndex: number, newItemIndex: number) => {
        // 删除老的
        const changeItem = marks.value.splice(oldItemIndex, 1)[0];
        // 在列表中目标位置增加新的
        marks.value.splice(newItemIndex, 0, changeItem);
    };
    return {
        addMark,
        deleteMark,
        updateMark,
        changeMarkIndex,
    };
};
export default useMarks;
