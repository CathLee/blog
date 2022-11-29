<!--
 * @Author: CathyLee
 * @Date: 2022-11-14 10:43:29
 * @LastEditors: cathylee 447932704@qq.com
 * @LastEditTime: 2022-11-29 21:19:41
 * @Description: 收藏夹组件
-->

<template>
    <!-- 组件根节点 -->
    <div class="my-book-mark">
        <!-- 左侧标签栏 -->
        <div class="left-part">
            <div class="left-top-part">
                <img src="../../assets/vue.svg" class="logo" />
            </div>
            <div class="left-middle-part">
                <label-list
                    :current-id="currentId"
                    :label-list="state.warblerData"
                    :edit-mode="state.editMode"
                    @change-label-index="changeLabelIndex"
                    @change-label="changeLabel"
                    @add-label="addLabel"
                    @delete-label="deleteLabel"
                    @update-label="updateLabel"
                ></label-list>
            </div>
            <!-- <div class="left-bottom-part">
                <action-bar v-model="editMode"></action-bar>
            </div> -->
        </div>
        <!-- 右侧详情栏 搜索栏 -->
        <div class="right-part">
            <!-- 上方搜索栏部分 -->
            <div class="right-top-part">
                <Search />
            </div>
            <!-- 下方列表详情部分 -->
            <div class="right-middle-part">
                <mark-list
                    :mark-list="markList"
                    @add-mark="addMark"
                    @delete-mark="deleteMark"
                    @update-mark="updateMark"
                    :edit-mode="state.editMode"
                    @change-mark-index="changeMarkIndex"
                ></mark-list>
            </div>
            <div class="right-bottom-part">
                <div
                    class="quit-edit-mode"
                    v-if="state.editMode"
                    @click="editModeFn"
                >
                    退出编辑模式
                </div>
                <div class="motto-text">「 {{ state.motto }} 」</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, watch, reactive, onUnmounted, computed } from 'vue';
import {
    LabelListProps,
    BookmarkState,
    getMotto,
    initData,
} from 'coms/BookMark/index';
// import { emitter } from 'hooks/useMitt';
import LabelList from 'coms/LabelList/LabelList.vue';
import MarkList from 'coms/MarkList/MarkList.vue';
import useLabels from './useLabels';
import useMarks from './useMarks';
import createMessage from '@/baseComponents/Message/index';
// import ActionBar from 'coms/ActionBar/ActionBar.vue';
// import Search from 'coms/Search/Search.vue';
// import Theme from '../Theme/Theme.vue';
import localforage from 'localforage';
/**
 * @description: 初始化state
 * @return {*}
 */
const useState = () => {
    const state = reactive<BookmarkState>({
        // 整个项目需要的数据
        warblerData: [],
        // 是否启用编辑模式
        editMode: false,
        // 格言
        motto: getMotto(),
    });

    // 如果localFroge里面有就用  没有就用初始值  (getItem('WARBLER_DATA') as unknown as LabelListProps) || initData
    localforage.getItem('WARBLER_DATA').then((val) => {
        // 查询数据库  如果存在数据 使用库里的数据  否则使用初始默认数据
        if (val) {
            const res = JSON.parse(val as string) as LabelListProps;
            state.warblerData = res;
        } else {
            state.warblerData = initData;
        }
    });
    watch(
        () => state,
        () => {
            localforage.setItem(
                'WARBLER_DATA',
                JSON.stringify(state.warblerData),
            );
        },
        { immediate: true, deep: true },
    );
    // 退出编辑模式
    const editModeFn = () => {
        state.editMode = false;
        createMessage('已退出编辑模式 !');
    };
    return {
        state,
        editModeFn,
    };
};
/**
 * @description: 初始化labelList
 * @return {*}
 */
const useLableList = () => {
    const currentId = ref(0);
    const changeLabel = (id: number) => {
        currentId.value = id;
    };
    const { addLabel, deleteLabel, updateLabel, changeLabelIndex } =
        useLabels(state);
    return {
        currentId,
        changeLabelIndex,
        addLabel,
        deleteLabel,
        updateLabel,
        changeLabel,
    };
};

/**
 * @description: 初始化MarkList
 * @return {*}
 */
const useMarkList = () => {
    // 获取当前标签下的所有书签
    const markList = computed(
        () => state.warblerData[currentId.value]?.marks || [],
    );
    // 导出useMarks相关内容
    const { addMark, deleteMark, updateMark, changeMarkIndex } =
        useMarks(markList);
    return {
        markList,
        addMark,
        deleteMark,
        updateMark,
        changeMarkIndex,
    };
};

// created阶段
const { state, editModeFn } = useState();
const {
    currentId,
    changeLabel,
    changeLabelIndex,
    addLabel,
    deleteLabel,
    updateLabel,
} = useLableList();
const { markList, addMark, deleteMark, updateMark, changeMarkIndex } =
    useMarkList();
</script>
<style lang="scss" scoped>
.my-book-mark {
    position: absolute;
    left: 50%;
    top: 10vh;
    transform: translateX(-50%);
    height: calc(80vh);
    background: var(--glassmorphism-rgba);
    backdrop-filter: var(--glassmorphism-filter);
    border-radius: var(--glassmorphism-radius);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    display: flex;

    .left-part {
        width: 200px;
        height: 100%;
        background: var(--glassmorphism-rgba);
        backdrop-filter: var(--glassmorphism-filter);
        border-radius: var(--glassmorphism-radius) 0 0
            var(--glassmorphism-radius);
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        position: relative;
        .left-top-part {
            width: 100%;
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            .logo {
                width: 120px;
            }
        }
        .left-middle-part {
            max-height: calc(100% - 190px);
            overflow: auto;
            //隐藏滚动条
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .left-bottom-part {
            width: 100%;
            height: 40px;
            position: absolute;
            bottom: 0;
        }
    }

    .right-part {
        width: 920px;
        .right-top-part {
            width: 100%;
            height: 100px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.18);
            position: relative;
        }
        .right-middle-part {
            height: calc(100% - 140px);
            overflow: auto;
            padding: 23px 20px;
            //隐藏滚动条
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .right-bottom-part {
            position: relative;
            width: 100%;
            height: 40px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .quit-edit-mode {
                position: relative;
                z-index: 1;
                font-size: 14px;
                color: var(--theme-main);
                cursor: pointer;
            }
            .motto-text {
                width: 100%;
                text-align: center;
                position: absolute;
                bottom: 10px;
                color: rgba(0, 0, 0, 0.8);
                font-size: 14px;
                text-shadow: 0 0 10px rgb(0 0 0 / 60%);
            }
        }
    }
}
</style>
