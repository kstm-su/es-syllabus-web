<template>
  <div>
    <form @submit.prevent="search">
      <md-input-container md-inline>
        <md-icon>search</md-icon>
        <md-input v-model="query" ref="input" autofocus @input="search"></md-input>
      </md-input-container>
    </form>
    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head class="only-large">#</md-table-head>
          <md-table-head class="title-column">授業名</md-table-head>
          <md-table-head>担当教員</md-table-head>
          <md-table-head class="only-large">期間</md-table-head>
          <md-table-head>曜日・時限</md-table-head>
          <md-table-head class="only-large">部局</md-table-head>
          <md-table-head class="only-large">場所</md-table-head>
          <md-table-head class="only-large">単位数</md-table-head>
          <md-table-head></md-table-head>
        </md-table-row>
      </md-table-header>
      <transition-group name="result" tag="md-table-body">
        <md-table-row v-for="(row, i) in rows" :key="i">
          <md-table-cell class="only-large">{{ row.code }}</md-table-cell>
          <md-table-cell>
            <div v-if="row.title_ja">{{ row.title_ja }}</div>
            <div v-if="row.title_en">{{ row.title_en }}</div>
          </md-table-cell>
          <md-table-cell>
            <div v-for="teacher in row.teachers">{{ teacher.name }}</div>
          </md-table-cell>
          <md-table-cell class="only-large">
            <span v-if="row.semester">{{ row.semester.description }}</span>
          </md-table-cell>
          <md-table-cell>
            <div v-for="schedule in row.schedules">{{ schedule.description }}</div>
          </md-table-cell>
          <md-table-cell class="only-large">{{ row.department.name }}</md-table-cell>
          <md-table-cell class="only-large">
            <div v-for="room in row.classrooms">{{ room.name }}</div>
          </md-table-cell>
          <md-table-cell class="only-large" md-numeric>{{ row.credit }}</md-table-cell>
          <md-table-cell class="only-large">
            <md-button class="md-icon-button" :href="`https://campus-2.shinshu-u.ac.jp/syllabus/syllabus.dll/Display${row.query}`" target="_blank">
              <md-icon>launch</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </transition-group>
    </md-table>
    <md-dialog ref="errorDialog">
      <md-dialog-content>{{ errorDialog.body }}</md-dialog-content>
      <md-dialog-actions v-for="action in errorDialog.actions">
        <md-button class="md-primary" @click="action.onclick">{{ action.label }}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <infinite-loading v-if="remain > 0" ref="loading" :distance="200" @infinite="scroll"></infinite-loading>
  </div>
</template>

<script>
import axios from 'axios';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      query: '',
      results: [],
      year: new Date().getFullYear(),
      errorDialog: {},
    };
  },
  computed: {
    rows() {
      return [].concat(...this.results.map(r => r.hits.hits.map(v => v._source)));
    },
    remain() {
      if (this.results.length === 0) {
        return 0;
      }
      return this.results[0].hits.total - this.rows.length;
    },
  },
  methods: {
    search() {
      axios({
        method: 'post',
        url: `//syllabus.kstm.cloud/es/syllabus/${this.year}/_search`,
        data: {
          query: {
            bool:{should:[{
            multi_match: {
              query: this.query,
              type: 'cross_fields',
              analyzer: 'whitespace',
              fields: [
                'code',
                'title_*',
                'teachers.name*',
                'schedules.description',
                'semester.description',
                'department.name',
              ],
              boost: 10
            },
            },{
            multi_match: {
              query: this.query,
              type: 'cross_fields',
              fields: [
                'code',
                'title_*',
                'teachers.name*',
                'schedules.description',
                'department.name',
                'text.*',
              ],
            },
            }]}
          },
        },
        params: {
          scroll: '1m',
        },
      }).then(resp => {
        this.results = [resp.data];
        this.scroll();
      }).catch(err => {
        console.error(err);
      });
    },
    scroll(e) {
      axios({
        method: 'post',
        url: `//syllabus.kstm.cloud/es/_search/scroll`,
        data: {
          scroll: '1m',
          scroll_id: this.results[0]._scroll_id,
        },
      }).then(resp => {
        this.results.push(resp.data);
        e && e.loaded();
      }).catch(err => {
        console.error(err);
        this.openErrorDialog('接続がタイムアウトしました', [
          {
            label: 'Reload',
            onclick: () => {
              this.results = [];
              this.search();
              this.closeErrorDialog();
            },
          },
        ]);
      });
    },
    openErrorDialog(body, actions) {
      this.errorDialog = {
        body,
        actions,
      };
      this.$refs.errorDialog.open();
    },
    closeErrorDialog(title, body, actions) {
      this.$refs.errorDialog.close();
    },
    focus() {
      this.$refs.input.$el.focus();
    },
    blur() {
      this.$refs.input.$el.blur();
    },
  },
  mounted() {
    this.search();
    window.addEventListener('keydown', e => {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }
      if (e.keyCode === 0x8 ||  e.keyCode === 0xa || e.keyCode == 0xd ||  // BS, LF, CR
        (0x30 <= e.keyCode && e.keyCode <= 0x5a) ||  // 0-9, A-Z, a-z
        (0x60 <= e.keyCode && e.keyCode <= 0x6f) ||  // numpad0-9, *+-./
        (0xba <= e.keyCode && e.keyCode <= 0xc0) ||  // ;=,-./`
        (0xdb <= e.keyCode && e.keyCode <= 0xde)) {  // [\]'
        this.focus();
      }
    }, false);
  },
};
</script>

<style lang="scss" scoped>
  form {
    margin: 20px 5%;
  }

  .md-table /deep/ {
    table {
      table-layout: fixed;
      th, td {
        width: 10%;
        overflow: hidden;
        transition: width ease .5s;
        @media (max-width: 900px) {
          &.only-large {
            width: 0;
          }

          &:not(.only-large) {
            width: 30%;
          }

          &.title-column {
            width: 40%;
          }
        }
      }
    }
  }

  .result-enter-active,
  .result-leave-active,
  .result-move {
    transition: opacity ease .2s, border-top ease .2s, transform ease .5s;
  }

  .result-enter,
  .result-leave-to {
    opacity: 0;
    border-top: 1px solid transparent;
  }
</style>
