<template>
  <v-dialog v-model="dialog" max-width="650px">
    <v-btn flat slot="activator" color="grey" @click="viewAction(board)">
      <v-icon small left>streetview</v-icon>
      <span>글 정보 보기</span>
    </v-btn>
    <v-card>
      <v-img class="black--text" height="200px" :src="board.boardImg">
        <v-container fill-height fluid>
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <span class="headline">{{board.title}}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-img>

      <v-card-title>
        <h2 class="center teal-text">{{board.Info.name}}</h2>
      </v-card-title>

      <v-card-text>
        <v-flex d-flex xs12 sm6 md4>
          <v-layout row wrap></v-layout>
        </v-flex>

        <!--show date-->

        <!---date and content--->
        <div>
          <span>{{board.location}}</span>
          <br>
          <span class="grey--text">{{board.startDate}}</span>
          <br>
          <span>{{board.content}}</span>
        </div>
        <div class="text-xs">
          <!-- <v-rating :value="board.difficulty" readonly></v-rating> -->
        </div>
      </v-card-text>
      <v-card-actions>
        <!--Notification button-->
        <v-btn
          :disabled="loading"
          slot="activator"
          color="success"
          @click="saveNotification(board.boardId)"
        >
          <v-icon small left>add</v-icon>
          <span>신청하기</span>
        </v-btn>

        <!--messager button-->
        <v-btn flat slot="activator" color="success" @click="messager(board.Info)">
          <v-icon small left>message</v-icon>
          <span>메신저</span>
        </v-btn>
        <v-btn @click="moveMyMap(board.boardId)" flat slot="activator" color="info">
          <v-icon small left>expand_more</v-icon>
          <span>상세보기</span>
        </v-btn>
        <v-btn flat slot="activator" color="error" @click="report(board)">
          <v-icon small left>report</v-icon>
          <span>신고하기</span>
        </v-btn>
      </v-card-actions>
    </v-card>
    <Chat v-bind:comments="'host'+board.boardId"/>
  </v-dialog>
</template>

<script>
import Chat from "../views/Chat";
export default {
  props: ["hostBoard"],
  components: {
    Chat,
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  data() {
    return {
      board: this.hostBoard,
      rating: 3,
      items: [1, 2, 3, 4, 5],
      workDays: "",
      chatId: "",
      loading: "",
      showDate: "2018-03-02",

      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      showCard: false,
      diff: "",
      role: null,
      chatRoomId: "",
      dialog: ""
    };
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    }
  },
  created() {
    console.log(this.board);
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    allowedDates: val => parseInt(val.split("-")[2], 10) % 2 === 0,
    messager(info) {
      console.log(info);
      this.chatRoomId = localStorage.username + info.userName;
      console.log(this.chatRoomId);
      this.axios
        .post(
          "http://ec2-15-164-103-237.ap-northeast-2.compute.amazonaws.com:3000/chatRoom/createChatRoom",
          {
            chatRoomId: this.chatRoomId,
            hostUserName: localStorage.username,
            guestUserName: info.userName
          }
        )
        .then(response => {
          if (response.data.state == -1) {
            console.log(response.data.msg);
          }
          console.log(response.data.msg);
          this.$router.push({
            name: "chatroom",
            params: { chatRoomId: this.chatRoomId }
          });
        });
    },
    saveNotification(id) {
      console.log(id);
      if (localStorage.role == 0) {
        this.axios
          .post(
            "http://ec2-15-164-103-237.ap-northeast-2.compute.amazonaws.com:3000/notifyRegister/host/registerNotification",
            {
              userName: localStorage.username,
              boardId: id
            }
          )
          .then(response => {
            console.log(response.data);
            if (response.data.state == 0) {
              alert(response.data.msg);
              this.$router.go();
            } else {
              alert(response.data.msg);
            }
          });
      } else if (localStorage.role == 1) {
        this.axios
          .post(
            "http://ec2-15-164-103-237.ap-northeast-2.compute.amazonaws.com:3000/notifyRegister/guest/registerNotification",
            {
              userName: localStorage.username,
              boardId: id
            }
          )
          .then(response => {
            console.log(response.data);
            if (response.data.state == 0) {
              alert(response.data.msg);
              this.$router.go();
            } else {
              alert(response.data.msg);
            }
          });
      }
    },
    report(board) {
      console.log(board.boardId);
      if (localStorage.role == 0) {
        this.axios
          .post(
            "http://ec2-15-164-103-237.ap-northeast-2.compute.amazonaws.com:3000/hostBoard/isReportHost/ban",
            {
              boardId: board.boardId,
              userName: localStorage.username
            }
          )
          .then(response => {
            if (response.data.state == -1) {
              alert(response.data.msg);
            } else {
              alert("report success !!");
              console.log(response.data.msg);
              location.reload();
            }
          });
      } else {
        this.axios
          .post(
            "http://ec2-15-164-103-237.ap-northeast-2.compute.amazonaws.com:3000/guestBoard/isReportGuest/ban",
            {
              boardId: board.boardId,
              userName: localStorage.username
            }
          )
          .then(response => {
            if (response.data.state == -1) {
              alert(response.data.msg);
            } else {
              console.log(response.data.msg);
              location.reload();
            }
          });
      }
    },
    viewAction(board) {
      var can = board.candidate;
      console.log(can);
      this.loading = false;
      for (let index = 0; index < can.length; index++) {
        console.log(can[index]);
        if (can[index] === localStorage.username) {
          console.log(can[index]);
          this.loading = true;
          break;
        }
      }
    },
    moveMyMap(id) {
      console.log(id);
      this.$router.push({
        name: "mymap",
        params: { boardId: id }
      });
    }
  }
};
</script>

<style>
</style>


