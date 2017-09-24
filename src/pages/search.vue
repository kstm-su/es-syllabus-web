<template>
  <div>
    <form @submit="search">
      <md-input-container md-inline>
        <md-icon>search</md-icon>
        <md-input v-model="query" ref="input" autofocus @input="search"></md-input>
      </md-input-container>
    </form>
    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>#</md-table-head>
          <md-table-head>授業名</md-table-head>
          <md-table-head>担当教員</md-table-head>
          <md-table-head>期間</md-table-head>
          <md-table-head>曜日・時限</md-table-head>
          <md-table-head>部局</md-table-head>
          <md-table-head>場所</md-table-head>
          <md-table-head>単位数</md-table-head>
          <md-table-head></md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body v-if="result">
        <md-table-row v-for="hit in result.hits.hits">
          <md-table-cell>{{ hit._source.code }}</md-table-cell>
          <md-table-cell>
            <div v-if="hit._source.title_ja">{{ hit._source.title_ja }}</div>
            <div v-if="hit._source.title_en">{{ hit._source.title_en }}</div>
          </md-table-cell>
          <md-table-cell>
            <div v-for="teacher in hit._source.teachers">{{ teacher.name }}</div>
          </md-table-cell>
          <md-table-cell>{{ hit._source.semester.description }}</md-table-cell>
          <md-table-cell>
            <div v-for="schedule in hit._source.schedules">{{ schedule.description }}</div>
          </md-table-cell>
          <md-table-cell>{{ hit._source.department.name }}</md-table-cell>
          <md-table-cell>
            <div v-for="room in hit._source.classrooms">{{ room.name }}</div>
          </md-table-cell>
          <md-table-cell md-numeric>{{ hit._source.credit }}</md-table-cell>
          <md-table-cell>
            <md-button class="md-icon-button" :href="`https://campus-2.shinshu-u.ac.jp/syllabus/syllabus.dll/Display${hit._source.query}`" target="_blank">
              <md-icon>launch</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </div>
</template>

<script>
  import axios from 'axios';

export default {
  data() {
    return {
      query: '',
      result: null,
      year: new Date().getFullYear(),
    };
  },
  methods: {
    search() {
      axios({
        method: 'post',
        url: `http://10.111.129.96:9200/syllabus/${this.year}/_search`,
        data: {
          query: {
            multi_match: {
              query: this.query,
              fields: [
                'title_*',
                'teachers.name*',
              ],
            },
          },
        },
      }).then(resp => {
        this.result = resp.data;
      });
    },
    focus() {
      this.$refs.input.$el.focus();
    },
    blur() {
      this.$refs.input.$el.blur();
    },
  },
  mounted() {
    window.addEventListener('keydown', e => {
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

<style scoped>
  form {
    margin: 30px 10%;
  }
</style>
