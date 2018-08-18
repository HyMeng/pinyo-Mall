<template>
  <div class="goodAdd">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" icon="el-icon-edit" description="基本信息"></el-step>
      <el-step title="步骤 2" icon="el-icon-picture" description="商品图片"></el-step>
      <el-step title="步骤 3" icon="el-icon-upload" description="商品内容"></el-step>
    </el-steps>
    <!-- 插入tabs标签栏 -->
    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="goodForm" :rules="Rules" :model="goodForm" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodForm.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
             <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodForm.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
             <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodForm.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
             <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodForm.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              clearable
              :options="options"
              v-model="goodForm.goods_cat"
              change-on-select
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="goodForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="goodForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
         <!-- 下一步 -->
        <el-button type="primary" @click="next(1, 'picture')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="picture">
        <!-- action图片上传的地址 -->
        <el-upload
          class="uploadPic"
          :headers="headers"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :file-list="files"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <!-- 下一步 -->
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor
          v-model="goodForm.goods_introduce">
        </quill-editor>
        <el-button type="primary" @click="addGood">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: 'basic',
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      goodForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        is_promote: true,
        goods_introduce: '',
        pics: []
      },
      files: [],
      // 用于给图片上传组件的ajax设置token
      headers: {
        Authorization: localStorage.getItem('userToken')
      },
      Rules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
          {pattern: /^\d+$/, message: '请填写一个数字', trigger: ['blur', 'change']}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'},
          {pattern: /^\d+$/, message: '请填写一个数字', trigger: ['blur', 'change']}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'},
          {pattern: /^\d+$/, message: '请填写一个数字', trigger: ['blur', 'change']}
        ]
      }
    }
  },
  methods: {
    // tab栏切换
    handleClick (tab) {
      this.active = +tab.index
    },
    // 下一步
    // 参数1：步骤条的下标
    // 参数2：tab栏的name属性
    next (active, activeName) {
      this.$refs.goodForm.validate(async valid => {
        if (!valid) {
          this.$message.error('请填写正确的表单格式')
          return false
        } else {
          this.active = active
          this.activeName = activeName
        }
      })
    },
    handleSuccess (res, file, fileList) {
      const {meta: {status}, data} = res
      if (status === 200) {
        this.goodForm.pics.push({pic: data.tmp_path})
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      // 先通过file获取删除的图片的临时路径
      let temPath = file.response.data.tmp_path
      let picsIndex = this.goodForm.pics.findIndex(item => item.pic === temPath)
      // 根据获取的下标删除对应的数据
      this.goodForm.pics.splice(picsIndex, 1)
    },
    addGood () {
      this.$refs.goodForm.validate(async valid => {
        if (!valid) {
          this.$message.error('请填写正确的表单格式')
          return false
        } else {
          const res = await this.axios.post('goods', {
            ...this.goodForm,
            goods_cat: this.goodForm.goods_cat.join()
          })
          console.log(res.data, 'addform')
          const {meta: {status, msg}} = res.data
          if (status === 201) {
            this.$message.success(msg)
            this.$router.push('/goods')
            this.$refs.goodForm.resetFields()
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  async created () {
    // 获取所有的商品分类数据
    const res = await this.axios.get('categories?type=3')
    const {meta: {status}, data} = res.data
    console.log(res.data, 'options')
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style>
.el-step__icon.is-icon {
  background: #eaeef1;
}
.uploadPic {
  min-height: 200px;
}
.quill-editor {
  background-color: #fff;
}
.ql-editor {
  height: 300px;
  background-color: #fff;
}

</style>
