<!--
 * @Author: cathylee 447932704@qq.com
 * @Date: 2022-11-23 22:34:30
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-27 21:36:25
 * @FilePath: /demo/src/components/MarkList/MarkList.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by cathylee 447932704@qq.com, All Rights Reserved. 
-->
<template>
    <div class="mark-list-box">
        <div
            v-for="(item, index) in markList"
            :key="index"
            :draggable="editMode"
            :class="{ isDragging: index === dragState.newItemIndex }"
            class="mark-item"
            @dragstart="handleDragstart(index)"
            @drop.prevent="handleDrop()"
            @dragover.prevent="handleDragover(index)"
            @dragend="handleDragend()"
            @click="inter(item.targetUrl)"
            @mouseenter="changeMark(index)"
            @mouseleave="changeMark(-1)"
        >
            <!-- 图标 -->
            <img
                :src="item.icon"
                class="item-icon"
                :onerror="state.defaultImg"
            />
            <!-- 标题 -->
            <div class="item-info">
                <p class="item-title" :title="item.title">{{ item.title }}</p>
                <p class="item-explain" :title="item.explain">
                    {{ item.explain }}
                </p>
            </div>
            <!-- 删除和编辑图标 -->
            <div
                v-if="state.currentMark === index && editMode"
                class="edit-icon"
            >
                <i class="iconfont" @click.stop="updateMark(item, index)"
                    >&#xe623;</i
                >
                <i class="iconfont" @click.stop="deleteMark(index)">&#xe60f;</i>
            </div>
        </div>
        <!-- 暂无书签提示语 -->
        <div v-if="markList.length < 1 && !editMode" class="no-marks">
            暂无书签
        </div>
        <!-- 添加书签 -->
        <transition name="base">
            <div v-if="editMode" class="mark-item-add" @click="addMark">+</div>
        </transition>
    </div>
    <!-- 添加单个书签的弹窗 -->
    <Dialog
        :dialog-visible="dialogState.isShowAddMarkDialog"
        title="添加书签"
        class="add-mark-dialog"
        @cancle="closeAddMarkDialog"
        @confirm="handleMark(state.handleType)"
    >
        <wh-from ref="form">
            <wh-input
                v-model="dialogFormState.targetUrl"
                :rules="dialogState.targetUrlRules"
                type="text"
                placeholder="请输入目标网址"
                padding="30px 30px 20px 30px"
            ></wh-input>
            <wh-input
                v-model="dialogFormState.title"
                :rules="dialogState.titleRules"
                type="text"
                placeholder="请输入书签名称"
                padding="0px 30px 20px 30px"
            ></wh-input>
            <wh-input
                v-model="dialogFormState.icon"
                :rules="dialogState.iconRules"
                type="text"
                placeholder="请输入图标地址"
                padding="0px 30px 20px 30px"
            ></wh-input>
            <wh-input
                v-model="dialogFormState.explain"
                type="text"
                placeholder="请输入网址简介"
                padding="0px 30px 20px 30px"
            ></wh-input>
            <div class="footer">
                <div>
                    <div class="auto-get-info">
                        <wh-button
                            title="自动获取网站名称"
                            class="auto-btn"
                            :use-animation="true"
                            :background-color="`rgba(199, 236, 7, 0.3)`"
                            @click="autoGetInfo('title')"
                        ></wh-button>
                        <i v-if="dialogState.loading1" class="iconfont loading"
                            >&#xe61c;</i
                        >
                    </div>
                    <div class="auto-get-info">
                        <wh-button
                            title="自动获取图标地址"
                            class="auto-btn"
                            :use-animation="true"
                            :background-color="`rgba(199, 236, 7, 0.3)`"
                            @click="autoGetInfo('icon')"
                        ></wh-button>
                        <i v-if="dialogState.loading2" class="iconfont loading"
                            >&#xe61c;</i
                        >
                    </div>
                </div>
                <div class="preview-icon">
                    <img
                        v-if="dialogFormState.icon"
                        :src="dialogFormState.icon"
                        :onerror="`this.src=&quot;//img10.360buyimg.com/imgzone/jfs/t1/189641/13/2583/4231/609a49e5Eecece40b/1c90e5625341897c.png&quot;`"
                    />
                    <p v-else class="preview-text">图标</p>
                </div>
            </div>
        </wh-from>
    </Dialog>
</template>

<script setup lang="ts">
import defaultImgUrl from '@/assets/vue.svg';
import { PropType, reactive, ref } from 'vue';
import { MarkListProps, MarkState, MarkProps, HandleMarkType } from './index';
import useDrag from '@/hooks/useDraggable';
import useDialog from './useDialog';
import createMessage from '@/baseComponents/Message';
const props = defineProps({
    editMode: {
        type: Boolean,
        default: false,
    },
    markList: {
        type: Array as PropType<MarkListProps>,
        required: true,
    },
});
const emit = defineEmits([
    'add-mark',
    'update-mark',
    'delete-mark',
    'change-mark-index',
]);
/**
 * @description: 初始化markList的state
 * @return {*}
 */

const state = reactive<MarkState>({
    // 标志当前是何种标签
    handleType: 'add',
    defaultImg: `this.src="${defaultImgUrl}"`,
    currentMark: -1,
});
const form = ref<any>(null);

// 导出有关Dialog的属性,方法
const {
    dialogState,
    dialogFormState,
    showAddMarkDialog,
    closeAddMarkDialog,
    autoGetInfo,
} = useDialog();

// 导出拖拽相关的方法
const {
    handleDragstart,
    handleDrop,
    handleDragover,
    handleDragend,
    dragState,
} = useDrag(emit, 'change-mark-index');

/**
 * @description: 对书签进行操作
 * @return {*}
 */

const useMarkList = () => {
    // 操作书签
    const handleMark = (type: HandleMarkType) => {
        const result = form.value.submitForm();
        if (result) {
            if (type === 'add') {
                emit('add-mark', dialogFormState);
            }
            if (type === 'update') {
                emit('update-mark', state.currentMark, dialogFormState);
            }
            closeAddMarkDialog();
        }
    };
    // 跳转到标签页面
    const inter = (targetUrl: string) => {
        if (!props.editMode) {
            window.open(targetUrl);
        } else {
            createMessage('请先退出编辑模式');
        }
    };
    const changeMark = (currentId: number) => {
        state.currentMark = currentId;
    };
    // 添加书签
    const addMark = () => {
        state.handleType = 'add';
        showAddMarkDialog();
    };
    const updateMark = (item: MarkProps, index: number) => {
        state.handleType = 'update';
        setTimeout(() => {
            state.currentMark = index;
        }, 500);
        showAddMarkDialog(item);
    };
    // 删除书签
    const deleteMark = (index: number) => {
        emit('delete-mark', index);
    };
    return { handleMark, inter, changeMark, updateMark, deleteMark, addMark };
};

// created阶段
const { handleMark, inter, changeMark, updateMark, deleteMark, addMark } =
    useMarkList();
</script>

<style lang="scss">
.mark-list-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    position: relative;

    .mark-item {
        min-height: 102px;
        cursor: pointer;
        width: 400px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: var(--glassmorphism-filter);
        border-radius: var(--glassmorphism-radius);
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 18px 0 rgba(31, 38, 135, 0.2);
        padding: 10px;
        margin: 7px 20px 7px 20px;
        position: relative;

        &:hover {
            background: var(--color-mark-title-hover);
        }
        .item-icon {
            width: 80px;
            max-height: 80px;
        }
        .item-info {
            padding: 0 20px;
            font-size: 14px;

            .item-title {
                font-weight: 700;
                margin: 0 0 10px 0;
                @extend .item-explain;
                color: var(--color-mark-title);
                font-size: 18px;
            }
            .item-explain {
                width: 255px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .edit-icon {
            display: flex;
            flex-direction: column;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);

            i {
                font-size: 14px;
                margin: 10px 10px 7px 10px;
            }
        }
    }
    .mark-item-add {
        @extend .mark-item;
        height: 100px;
        justify-content: center;
    }

    .no-marks {
        position: absolute;
        left: 50%;
        top: 200px;
        transform: translate(-50%);
        font-size: 14px;
        color: var(--theme-main);
    }

    .isDragging {
        position: relative;
        &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 3px;
            background-color: #4646cc;
            top: -1px;
            left: 0px;
            border-radius: 2px;
            box-shadow: 0px 5px 26px 2px blue;
        }
    }
}

.add-mark-dialog {
    .footer {
        display: flex;
        justify-content: space-between;

        .auto-get-info {
            display: flex;
            justify-content: flex-start;

            .auto-btn {
                margin: 0 20px 20px 30px;
            }

            .loading {
                height: 20px;
                position: relative;
                top: 5px;
            }
        }
        .preview-icon {
            width: 80px;
            height: 80px;
            margin-right: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            background: var(--glassmorphism-rgba);
            backdrop-filter: var(--glassmorphism-filter);
            border-radius: var(--glassmorphism-radius);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);

            img {
                width: 80px;
                height: 80px;
            }

            .preview-text {
                font-size: 15px;
            }
        }
    }
}
</style>
