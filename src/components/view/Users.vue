<template>
  <div>
    <div>
      <!--  导航栏    -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--  用户列表区      -->
      <el-card>
        <!--     搜索框   -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable
                      @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!--用户信息展示区-->
        <el-table :data="userlist" border stripe width="180px">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="密码" prop="password"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role"></el-table-column>

          <el-table-column label="操作" prop="" width="180px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改角色" placement="top"
                          :enterable="false">
                <el-button @click="showEditDialog(scope.row.username)" type="primary" icon="el-icon-edit"
                           size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除角色" placement="top" :enterable="false">
                <el-button type="danger" @click="removeUserByName(scope.row.username)" icon="el-icon-delete"
                           size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"
                           @close="setRoleDialogClosed"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--        分页-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[1, 2, 3, 4]"
            :page-size="queryInfo.pagesize"
            :current-page="queryInfo.pagenum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </el-card>

      <!--      添加用户的对话框-->
      <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClosed"
      >
        <!-- 嵌套的表单-->
        <el-form :rules="addFormRules" :model="addForm" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--        底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
     </span>
      </el-dialog>
      <!--      修改用户的对话框-->
      <el-dialog
          title="修改用戶"
          :visible.sync="editDialogVisible"
          width="50%"
          @close="editDialogClosed"
      >
        <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
          <el-form-item label="用戶名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="editForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!--      分配角色-->
      <el-dialog
          title="分配角色"
          :visible.sync="setRoleDialogVisible"
          width="50%"
          @close="setRoleDialogClosed"
          :before-close="handleClose">
        <div>
          <p>当前的用户:{{ userInfo.username }}</p>
          <p>当前的角色:{{ userInfo.role }}</p>
          <p>分配新角色：
            <template>
              <el-select v-model="selectRoleId" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.name"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {

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

    return {
      options: [{
        value: '选项1',
        label: '普通用户'
      }, {
        value: '选项2',
        label: '管理员'
      }],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      roleslist: [],
      total: 0,
      selectRoleId: "",
      selectRole: "",
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      editForm: {},
      userInfo: {},
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [{required: true, message: "请输入用户名", trigger: 'blur'}, {
          min: 3,
          max: 10,
          message: '用户名的长度在3-10',
          trigger: 'blur'
        }],
        password: [{required: true, message: "请输入密码", trigger: 'blur'}, {
          min: 3,
          max: 20,
          message: '密码的长度在3-20',
          trigger: 'blur'
        }],
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

      },
      editFormRules: {
        email: [{required: true, message: "请输入邮箱", trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}],
        mobile: [{required: true, message: "请输入电话号码", trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}],
      }

    }
  },


  created() {
    this.getUserList()
  },

  name: "Users",

  methods: {

    setRoleDialogClosed() {
      this.selectRoleId = ""
      this.userInfo = {}
    },

    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择要分配的角色")
      }
      console.log(this.selectRoleId)
      if (this.selectRoleId == "选项1") this.selectRole = "普通用户"
      if (this.selectRoleId == "选项2") this.selectRole = "管理员"
      console.log(`updateuserbyname/${this.userInfo.username}/${this.selectRole}`)
      const {data: res} = await this.$http.put(`updateuserbyname/${this.userInfo.username}/${this.selectRole}`)
      console.log(res)
      if (res > 0) {
        this.$message.success("更新成功")
        this.getUserList()
        this.setRoleDialogVisible = false
      } else {
        return this.$message.error("更新角色失败")
        this.getUserList()
        this.setRoleDialogVisible = false
      }
    },

    async getUserList() {

      if (this.queryInfo.query == '') {
        console.log('---------------------------------------------')
        const {data: res} = await this.$http.get('usersall' + "/" + this.queryInfo.pagenum + "/" + this.queryInfo.pagesize)
        if (res == "error") return this.$message.error("获取用户列表失败")
        this.userlist = res
        const {data: res1} = await this.$http.get('usersalltotal/')
        this.total = res1
      } else {
        console.log('+++++++++++++++++++++++++++++++++++++++++')
        const {data: res} = await this.$http.get('users/' + this.queryInfo.query + "/" + this.queryInfo.pagenum + "/" + this.queryInfo.pagesize)
        if (res == "error") return this.$message.error("获取用户列表失败")
        this.userlist = res
        const {data: res1} = await this.$http.get('userstotal/' + this.queryInfo.query)
        if (res1 == -1) return this.$message.error("获取用户列表失败")
        this.total = res1
      }

    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val
      this.getUserList()
    },

    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
      console.log(`当前页: ${val}`);
    },
    //监听用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //发起添加用户的网路请求
        const {data: res} = await this.$http.post('register/' + this.addForm.username + "/" + this.addForm.password + "/" + this.addForm.password + "/" + this.addForm.email + "/" + this.addForm.mobile)
        if (res !== "注册成功") this.$message.error("添加用户失败")
        this.$message.success("添加用户成功")

        this.addDialogVisible = false
        this.getUserList()
      })
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      const {data: res} = await axios.get(("getuserbyname/" + this.userInfo.username))
      this.roleslist = res
      console.log(res)
      this.setRoleDialogVisible = true
    },
    //展示编辑对话框
    async showEditDialog(username) {

      const {data: res} = await this.$http.get('getuserbyname/' + username)
      this.editForm = res
      console.log(res)
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    //修改编辑表单的内容并提交给后端
    editUserInfo() {
      this.$refs.editFormRef.validate(
          async valid => {
            if (!valid) return
            const {data: res} = await this.$http.put('updateuserbyname/' + this.editForm.username + "/" + this.editForm.password + "/" + this.editForm.email + "/" + this.editForm.mobile)

            if (res !== 1) {
              return this.$message.error("更新用户失败")
            }

            this.editDialogVisible = false
            this.getUserList()
            this.$message.success("更新用户信息成功")
          }
      )
    },

    async removeUserByName(username) {
      const confirmResult = await this.$confirm(
          '此操作将永久删除该用户，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info("已取消删除")
      }
      console.log('deleteuserbyname/' + username + "/" + this.queryInfo.pagenum + "/" + this.queryInfo.pagesize)
      const {data: res} = await this.$http.delete('deleteuserbyname/' + username + "/" + this.queryInfo.pagenum + "/" + this.queryInfo.pagesize)

      this.$message.success("删除用户成功")
      console.log(res)
      this.userlist = res
      console.log("确认删除")
    }
  }
}

</script>

<style scoped>

</style>