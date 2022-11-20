import { reactive } from 'vue';

/*
 * @Author: cathylee 447932704@qq.com
 * @Date: 2022-11-20 15:46:46
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-20 15:50:54
 * @FilePath: /demo/src/hooks/useDraggable.ts
 * @Description: 拖拽的hooks
 *
 * Copyright (c) 2022 by cathylee 447932704@qq.com, All Rights Reserved.
 */
export interface DragState {
    oldItemIndex: number;
    newItemIndex: number;
}

const useDraggable = (emit: any, emitName: string) => {
    const dragState = reactive<DragState>({
        // 当前正在拖拽的元素索引
        oldItemIndex: -1,
        // 将插入的目标位置索引
        newItemIndex: -1,
    });
    // 开始拖拽时触发
    const handleDragstart = (index: number) => {
        dragState.oldItemIndex = index;
    };
    const handleDrop = () => {
        // 如果位置没有发生改变 什么也不做
        if (dragState.newItemIndex === dragState.oldItemIndex) {
            return;
        }
        // 如果位置发生了改变
        emit(emitName, dragState.oldItemIndex, dragState.newItemIndex);
    };
    // 拖拽经过其他元素时触发
    const handleDragover = (index: number) => {
        dragState.newItemIndex = index;
    };
    // 拖拽结束时触发
    const handleDragend = () => {
        dragState.newItemIndex = -1;
        dragState.oldItemIndex = -1;
    };
    return {
        dragState,
        handleDragstart,
        handleDrop,
        handleDragover,
        handleDragend,
    };
};
export default useDraggable;
