<template>
  <nav>
    <v-toolbar color="cyan" app dark>
      <v-toolbar-side-icon class="white--text" @click="drawer= !drawer" v-if="user"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white-text" router>
        <span class="font-weight-light">Farm</span>
        <span>Road</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--add board btn-->
      <GuestBoard v-if="role && user"/>
      
      <Popup v-if="!role && user"/>

      <li v-if="user">
        <a class="white--text subheading mt-1">{{user}}</a>
      </li>

      <v-btn flat color="white" @click="signOut" v-if="user">
        <span>로그아웃</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
      <v-btn flat color="white" router :to="{name: 'Signin'}" v-if="!user">
        <v-icon left>account_circle</v-icon>
        <span>로그인</span>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" class="primary" disable-resize-watcher>
      <!--menu item-->
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{link.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{link.text}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import Popup from "./Popup";
import GuestBoard from "./GuestBoard";
export default {
  components: {
    Popup,
    GuestBoard
  },
  data() {
    return {
      drawer: false,

      links: [
        { icon: "home", text: "홈 화면", route: "/home" },
        { icon: "dashboard", text: "게시판", route: "/about" },
        { icon: "dashboard", text: "내가 쓴 글", route: "/myboards" },
        { icon: "person", text: "내 정보", route: "/userInfo" }
      ],
      user: null,
      role: null
    };
  },
  methods: {
    signOut() {
      (localStorage.username = ""),
        (localStorage.role = ""),
        (this.user = ""),
        (this.drawer = false),
        this.$store.dispatch("UserSignout")
      this.$router.push({ name: "Signin" })
    }
  },
  created() {
    if (localStorage.username) {
      this.user = localStorage.username;
      if (localStorage.role == 1) {
        this.role = false;
      } else {
        this.role = true;
      }
    } else {
      this.user = false;
    }
  }
};
</script>

