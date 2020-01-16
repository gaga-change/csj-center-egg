<template>
  <div>
    <h4>主机内存&磁盘监控</h4>
    <span v-for="item in engine" :key="item.name">
      <div style="display: inline-block;text-align: center;">
        <el-progress type="dashboard" :percentage="item.memory" :color="colors">
        </el-progress>
        <div class="f12" :title="item.memoryHint">{{ item.name }}#内存</div>
      </div>
      <div style="display: inline-block;text-align: center;">
        <el-progress type="dashboard" :percentage="item.disk" :color="colors">
        </el-progress>
        <div class="f12" :title="item.diskHint">{{ item.name }}#磁盘</div>
      </div>
    </span>

    <h4>系统在线人员统计</h4>
    <el-row :gutter="20">
      <el-col  :xs="24" :sm="12" :md="12" :lg="8"  v-for="(clients, key) in roomClients" :key="key">
        <el-card
          class="mt20 tag-list-card"
        >
          <div slot="header" class="clearfix">
            <span>{{ key }}</span>
          </div>
          <template v-for="(client, index) in clients">
            <el-tooltip :key="client.clientId" placement="top" effect="light">
              <div slot="content">
                用户： {{ client.userId }}
                <br />
                连接时间： {{ client.connectTimeShow }}
                <br />
                活跃时间： {{ client.lastLiveTimeShow }}
              </div>
              <el-tag
                class="ml5 mr5 mt5"
                :type="
                  client.noLiveTime > 300000
                    ? 'info'
                    : client.noLiveTime > 180000
                    ? 'warning'
                    : 'success'
                "
                >{{ client.username }} - {{ client.version }}</el-tag
              >
            </el-tooltip>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import "moment/locale/zh-cn";
const API = "";
export default Vue.extend({
  data() {
    return {
      reload: false,
      rooms: [],
      roomClients: {},
      paddingTime: 0,
      engine: [],
      colors: [
        { color: "#6f7ad3", percentage: 40 },
        { color: "#1989fa", percentage: 60 },
        { color: "#5cb87a", percentage: 80 },
        { color: "#e6a23c", percentage: 90 },
        { color: "#f56c6c", percentage: 100 }
      ]
    };
  },
  created() {
    this.initEngine();
    const socket = this.$io(API + "/sys", {
      // 实际使用中可以在这里传递参数
      query: {
        room: "center",
        userId: `csj-center-egg_client_${Math.random()}`,
        username: "csj-center-egg"
      },
      transports: ["websocket"]
    });
    socket.on("user all online", msg => {
      const { clients, meta } = msg;
      this.paddingTime = Date.now() - meta.timestamp;
      let temp = new Set();
      let roomClients = {};
      clients.forEach(v => {
        v.connectTimeShow = this.fromNow(v.connectTime);
        v.lastLiveTimeShow = this.fromNow(v.lastLiveTime);
        v.noLiveTime =
          Date.now() - new Date(v.lastLiveTime).getTime() - this.paddingTime;

        temp.add(v.room);
        roomClients[v.room] = roomClients[v.room] || [];
        roomClients[v.room].push(v);
      });
      this.rooms = [...temp];
      this.roomClients = roomClients;
    });
    socket.on("user room online", msg => {
      const { room, clients, client, action } = msg;
      if (action === "join") {
        if (!this.roomClients[room]) {
          this.$set(this.roomClients, room, []);
        }
        client.connectTimeShow = this.fromNow(client.connectTime);
        client.lastLiveTimeShow = this.fromNow(client.lastLiveTime);
        client.noLiveTime =
          Date.now() -
          new Date(client.lastLiveTime).getTime() -
          this.paddingTime;

        this.roomClients[room].unshift(client);
      } else {
        this.roomClients[room].splice(
          this.roomClients[room].findIndex(v => v.clientId === client.clientId),
          1
        );
        if (this.roomClients[room].length === 0) {
          delete this.roomClients[room];
          this.roomClients = { ...this.roomClients };
        }
      }
    });
    socket.on("on living", client => {
      const { room, clientId } = client;
      client.connectTimeShow = this.fromNow(client.connectTime);
      client.lastLiveTimeShow = this.fromNow(client.lastLiveTime);
      client.noLiveTime =
        Date.now() - new Date(client.lastLiveTime).getTime() - this.paddingTime;

      this.roomClients[room].splice(
        this.roomClients[room].findIndex(v => v.clientId === clientId),
        1
      );
      this.roomClients[room].unshift(client);
    });
  },
  mounted() {
    this.reload = true;
    setInterval(() => {
      for (let room in this.roomClients) {
        this.roomClients[room].forEach(v => {
          v.connectTimeShow = this.fromNow(v.connectTime);
          v.lastLiveTimeShow = this.fromNow(v.lastLiveTime);
          v.noLiveTime =
            Date.now() - new Date(v.lastLiveTime).getTime() - this.paddingTime;
        });
      }
    }, 3000); // 3 秒更新一次用户上一次活跃
  },
  methods: {
    moment,
    fromNow(time) {
      let res = new Date(time).getTime() + this.paddingTime;
      return this.moment(res).fromNow();
    },
    initEngine() {
      const toG = num => (num / 1024 / 1024).toFixed(2);
      const _ = () => {
        this.$$.get(API + "/api/engineState?pageSize=999").then(res => {
          this.engine = res.list.map(v => {
            return {
              name: v.remark,
              ip: v.ip,
              memory: Math.round(
                Number((v.memoryUsed / v.memoryTotal).toFixed(2)) * 100
              ),
              disk: Math.round(
                Number((v.diskUsed / v.diskTotal).toFixed(2)) * 100
              ),
              memoryHint: `${v.ip} - 内存：${toG(v.memoryUsed)}G / ${toG(
                v.memoryTotal
              )}G`,
              diskHint: `${v.ip} - 磁盘：${toG(v.diskUsed)}G / ${toG(
                v.diskTotal
              )}G`
            };
          });
        });
      };
      _();
      setInterval(_, 30000); // 30秒更新一次
    }
  }
});
</script>