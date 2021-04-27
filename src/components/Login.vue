<template>
  <div class="addColor">
    <div class="login_box">

      <el-form ref="loginFormRef" :model="loginForm" label-width="85px" class="login_form" :rules="loginFormRules">
        <!--用户名     -->
        <el-form-item prop="username" label="用户名:">
          <el-input placeholder="用户名" id="username" v-model="loginForm.username"
                    prefix-icon="el-icon-user-solid">
          </el-input>
        </el-form-item>
        <!--密码     -->
        <el-form-item prop="password" label="密码:">
          <el-input placeholder="密码" id="password" v-model="loginForm.password" type="password"
                    prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>

        <!--按钮     -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
        <el-form-item>

          <router-link :to="{ path: '/Register' }">还没账号？去注册</router-link>

        </el-form-item>
      </el-form>

    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {

    return {
      loginForm: {
        username: '',
        password: '',

      },
      loginFormRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}],
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = await axios.post("login/" + this.loginForm.username + "/" + this.loginForm.password)
        console.log(res)
        if (res == 0) return this.$message.error("登入失败,请检查你的用户名和密码")
        this.$message.success("登入成功，欢迎你" + this.loginForm.username)
        window.sessionStorage.setItem("token", 1)
        this.$router.push("/Home")
      });
    }
  }
}
</script>

<style scoped>
.addColor {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  background-color: white;
  height: 350px;
  width: 450px;

  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

img {
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 50%;
}

.btn {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
}
</style>