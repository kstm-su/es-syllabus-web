<template>
  <md-sidenav class="md-left md-fixed" md-swipeable ref="sidenav">
    <md-list class="md-dense">
      <md-list-item md-expand-multiple>
        <span style="flex:1">年度</span>
        <md-select value="2017" style="flex:0">
          <md-option value="2017">2017</md-option>
          <md-option value="2016">2016</md-option>
          <md-option value="2015">2015</md-option>
          <md-option value="2014">2014</md-option>
        </md-select>
      </md-list-item>
      <md-list-item md-expand-multiple>
        <span style="flex:1">検索項目</span>
        <md-select :value="['title_*', 'teachers.*']" multiple style="flex:0">
          <md-option value="title_*">授業名</md-option>
          <md-option value="teachers.*">担当教員</md-option>
          <md-option value="text">全文</md-option>
        </md-select>
      </md-list-item>
      <md-list-item md-expand-multiple>
        <span style="flex:1">開講部局</span>
        <md-select :value="['E','K','G','SA','TA','FA','TM','SS','L','J','MS','MH','MK','SM','FM','AA','BS','R1','S','M','MZ','FS','AS','JH','TH','R','T','A','F','LA','EA','KA','TS','ST']" multiple style="flex:0">
          <md-option value="E">教育学部</md-option>
          <md-option value="K">経済学部</md-option>
          <md-option value="G">共通教育(全学教育機構)</md-option>
          <md-option value="SA">工学系研究科[理学]</md-option>
          <md-option value="TA">工学系研究科[工学]</md-option>
          <md-option value="FA">工学系研究科[繊維]</md-option>
          <md-option value="TM">理工学系研究科[工学]</md-option>
          <md-option value="SS">総合理工学研究科[理学専攻]</md-option>
          <md-option value="L">人文学部</md-option>
          <md-option value="J">経法学部</md-option>
          <md-option value="MS">医学系研究科(修士課程)</md-option>
          <md-option value="MH">医学系研究科(博士課程)</md-option>
          <md-option value="MK">医学系研究科(博士後期課程)</md-option>
          <md-option value="SM">理工学系研究科[理学]</md-option>
          <md-option value="FM">理工学系研究科[繊維]</md-option>
          <md-option value="AA">農学研究科</md-option>
          <md-option value="BS">総合理工学研究科[生命医工学専攻]</md-option>
          <md-option value="R1">グローバル教育推進センター</md-option>
          <md-option value="S">理学部</md-option>
          <md-option value="M">医学部</md-option>
          <md-option value="MZ">医学系研究科(博士前期課程)</md-option>
          <md-option value="FS">総合理工学研究科[繊維学専攻]</md-option>
          <md-option value="AS">総合理工学研究科[農学専攻]</md-option>
          <md-option value="JH">法曹法務研究科</md-option>
          <md-option value="TH">工学系研究科(博士後期課程)</md-option>
          <md-option value="R">国際交流センター</md-option>
          <md-option value="T">工学部</md-option>
          <md-option value="A">農学部</md-option>
          <md-option value="F">繊維学部</md-option>
          <md-option value="LA">人文科学研究科</md-option>
          <md-option value="EA">教育学研究科</md-option>
          <md-option value="KA">経済・社会政策科学研究科</md-option>
          <md-option value="TS">総合理工学研究科[工学専攻]</md-option>
          <md-option value="ST">総合工学系研究科</md-option>
        </md-select>
      </md-list-item>
    </md-list>
  </md-sidenav>
</template>

<script>
  export default {
    methods: {
      toggle() {
        this.$refs.sidenav.toggle();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../node_modules/vue-material/src/core/stylesheets/variables.scss';
  @import '../config.scss';

  .md-sidenav /deep/ {
    .md-sidenav-content {
      width: $sizebar-size;
      display: flex;
      flex-flow: column;
      overflow: hidden;

      @media (min-width: 1281px) {
        top: 0;
        pointer-events: auto;
        transform: translate3d(0, 0, 0) !important;
        box-shadow: $material-shadow-2dp;
      }

      .md-list {
        padding: 0;
      }
    }

    .md-backdrop {
      @media (min-width: 1281px) {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
</style>
