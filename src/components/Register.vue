<template>
  <div class="addColor">
    <div class="login_box">

      <el-form ref="loginFormRef" :model="loginForm" label-width="100px" class="login_form" :rules="loginFormRules">
        <!--用户名     -->
        <el-form-item prop="username" label="用户名：">
          <el-input  label="用户名" placeholder="用户名"  v-model="loginForm.username"
                     prefix-icon="el-icon-user-solid">
          </el-input>
        </el-form-item>
        <!--密码     -->
        <el-form-item prop="password" label="密码：">
          <el-input label="密码" placeholder="密码"   v-model="loginForm.password" type="password"
                    prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item prop="password1" label="确认密码：">
          <el-input label="确认密码" placeholder="确认密码"   v-model="loginForm.password1" type="password"
                    prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱:">
          <el-input placeholder="邮箱" id="email" v-model="loginForm.email"
                    prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话号码:">
          <el-input placeholder="电话号码" id="mobile" v-model="loginForm.mobile"
                    prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!--按钮     -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">注册</el-button>
          <el-button type="info" @click="resetLoginForm" >重置</el-button>
        </el-form-item >
        <el-form-item>
          <router-link :to="{ path: '/Login' }">已有账号？去登入</router-link>
        </el-form-item>
      </el-form>

    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "Register",

  data(){
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error("请输入合法邮箱"))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error("请输入正确的手机号"))
    }
    return{
      loginForm:{
        username:'',
        password:'',
        password1:'',
        email: '',
        mobile: '',
      },
      loginFormRules: {
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [ { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password1: [ { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        email: [{required: true, message: "请输入邮箱", trigger: 'blur'}, {
          min: 6,
          max: 28,
          message: '邮箱的长度在6-28',
          trigger: 'blur'
        }, {validator: checkEmail, trigger: 'blur'}],
        mobile: [{required: true, message: "请输入电话号码", trigger: 'blur'}, {
          min: 3,
          max: 18,
          message: '电话号码的长度在6-18',
          trigger: 'blur'
        }, {validator: checkMobile, trigger: 'blur'}],
      }
    }
  },

  methods:{
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        const {data:res} = await axios.post("register/"+this.loginForm.username+"/"+this.loginForm.password+"/"+this.loginForm.password1+"/"+this.loginForm.email+"/"+this.loginForm.mobile)
        console.log("register/"+this.loginForm.username+"/"+this.loginForm.password+"/"+this.loginForm.password1)
        console.log(res)
        if(!(res === "注册成功")) return this.$message.error(res)
        this.$message.success(res)
        this.$refs.loginFormRef.resetFields();
      });
    }
  }

}
</script>

<style scoped  >
.addColor{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  background-color: white;
  height: 500px;
  width: 550px;

  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
img{
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 50%;
}
.btn{
  display: flex;
  justify-content: flex-end;
}
.login_form{
  position: absolute;
  bottom: -10px;
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
}
</style>