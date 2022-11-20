<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!--
 * @Author: cathylee 447932704@qq.com
 * @Date: 2022-11-20 11:57:04
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-20 16:57:42
 * @FilePath: /demo/src/components/LabelList/LabelList.vue
 * @Description: 标签列表组件
 * 
 * Copyright (c) 2022 by cathylee 447932704@qq.com, All Rights Reserved. 
-->
<template>
    <div class="label-list-box">
        <!-- 循环生成标签列表 -->
        <div
            v-for="(item, index) in labelList"
            :key="index"
            :draggable="editMode"
            class="label"
            :class="{
                currentClick: currentId === index,
                currentHover: state.currentHoverLabel === index,
                isDragging: index === dragState.newItemIndex,
            }"
            @dragend="dragendFn()"
            @dragstart="handleDragstart(index)"
            @drop.prevent="handleDrop()"
            @dragover.prevent="handleDragover(index)"
            @click.prevent="changeLabel(index, 'click')"
            @mouseenter="changeLabel(index, 'hover')"
            @mouseleave="changeLabel(-1, 'hover')"
        >
            <!-- 标签标题 -->
            <i class="iconfont">&#xe610;</i>
            <div :title="item.title" class="label-title">
                {{ item.title }}
            </div>
            <div
                v-if="state.currentHoverLabel === index && editMode"
                class="edit-icon"
            >
                <i class="iconfont" @click.stop="updateLabel(item.title, index)"
                    >&#xe623;</i
                >
                <i class="iconfont" @click.stop="deleteLabel(index)"
                    >&#xe60f;</i
                >
            </div>
        </div>
    </div>
    <!-- 添加单个标签的弹窗 -->
    <Dialog
        :dialog-visible="dialogState.isShowLabelDialog"
        :title="state.dialogTitle"
        @cancle="closeLabelDialog"
        @confirm="handleLabel(state.handleType)"
    >
        <wh-from ref="form">
            <wh-input
                v-model="dialogState.labelTitle"
                :rules="dialogState.rules"
                type="text"
                placeholder="请输入标签名称"
                padding="50px 30px"
                maxlength="10"
            ></wh-input>
        </wh-from>
    </Dialog>
</template>

<script setup lang="ts">
import WhFrom from '@/baseComponents/Form/Wh-form.vue';
import Dialog from '@/baseComponents/Dialog/Dialog.vue';
import WhInput from '@/baseComponents/Input/Wh-input.vue';
import { onUnmounted, PropType, reactive, ref } from 'vue';
import { LabelListProps } from '../BookMark';
import useDialog from 'coms/LabelList/useDialog';
import { HandleLabelType, LabelState } from '.';
import { computed } from 'vue';
import { emitter } from '@/hooks/useMitt';
import useDrag from '@/hooks/useDraggable';
// 初始化参数
const props = defineProps({
    labelList: {
        type: Array as PropType<LabelListProps>,
        required: true,
        default: () => [],
    },
    editMode: {
        type: Boolean,
        default: false,
    },
    currentId: {
        type: Number,
        default: 0,
    },
});
const emit = defineEmits([
    'change-label',
    'add-label',
    'delete-label',
    'update-label',
    'change-label-index',
]);

// dialog操作相关
// 不确定什么时候用unknow/any
const form = ref<any>(null);
const { dialogState, showLabelDialog, closeLabelDialog } = useDialog();
// 导出拖拽相关的方法
const {
    handleDragstart,
    handleDrop,
    handleDragover,
    handleDragend,
    dragState,
} = useDrag(emit, 'change-label-index');
// 标签操作相关
const initLabelState = () => {
    // 初始化标签状态
    const state: LabelState = reactive<LabelState>({
        handleType: 'add',
        currentClickLabel: 0,
        currentHoverLabel: -1,
        dialogTitle: computed(() => {
            return state.handleType === 'add' ? '添加标签' : '修改标签';
        }),
    });
    // 切换标签
    const changeLabel = (currentId: number, type: string) => {
        if (type === 'click') {
            state.currentClickLabel = currentId;
            emit('change-label', currentId);
        }
        if (type === 'hover') {
            state.currentHoverLabel = currentId;
        }
    };

    // 操作标签
    const handleLabel = (type: HandleLabelType) => {
        const result = form.value.submitForm();
        if (result) {
            if (type === 'add') {
                emit('add-label', dialogState.labelTitle);
                // 添加完成后,修改当前标签为新添加的这个
                changeLabel(props.labelList.length - 1, 'click');
            }
            if (type === 'update') {
                emit(
                    'update-label',
                    state.currentClickLabel,
                    dialogState.labelTitle,
                );
            }
        }
        closeLabelDialog();
    };

    // 添加标签
    const addLabel = () => {
        state.handleType = 'add';
        showLabelDialog();
    };
    // 修改标签
    const updateLabel = (value: string, index: number) => {
        state.handleType = 'update';
        state.currentClickLabel = index;
        showLabelDialog(value);
    };
    // 删除标签
    const deleteLabel = (index: number) => {
        state.currentClickLabel = index;
        emit('delete-label', state.currentClickLabel);
        emit('change-label', 0);
        changeLabel(0, 'click');
    };
    return {
        state,
        handleLabel,
        addLabel,
        deleteLabel,
        updateLabel,
        changeLabel,
    };
};

const { state, handleLabel, addLabel, deleteLabel, updateLabel, changeLabel } =
    initLabelState();

// 停止拖拽时触发
const dragendFn = () => {
    changeLabel(dragState.newItemIndex, 'click');
    handleDragend();
};
// 监听事件,打开添加标签弹窗
emitter.on('add-label', addLabel);
// 显式卸载
onUnmounted(() => {
    emitter.off('add-label', addLabel);
});
</script>

<style lang="scss">
.label-list-box {
    height: 100%;

    .currentHover {
        background: var(--color-label-title-hover);
        backdrop-filter: var(--glassmorphism-filter);
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        color: var(--color-label-color-hover);
    }
    .currentClick {
        background: var(--color-label-title-click);
        backdrop-filter: var(--glassmorphism-filter);
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    }

    .label {
        font-size: 14px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        color: var(--color-label-title);
        border: none;
        position: relative;
        padding: 10px 5px;

        .label-title {
            padding-left: 10px;
            width: 120px;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .edit-icon {
            display: flex;
            flex-direction: column;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);

            i {
                font-size: 12px;
                margin: 4px 8px 2px 0px;
            }
        }
    }
    .isDragging {
        position: relative;
        &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 3px;
            background-color: #8307ea;
            top: -1px;
            left: 0px;
            border-radius: 2px;
            box-shadow: 0px 5px 26px 2px #4646cc;
        }
    }
}
</style>
