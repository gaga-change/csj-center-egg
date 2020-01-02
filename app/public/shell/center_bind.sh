#!/bin/bash
# 动态配置
remark="备注"
# 以下为统一配置
mem_total=`free | awk '/Mem/ {print $2}'`
mem_used=`free | awk '/Mem/ {print $3}'`

disk_total=`df / | awk '/dev/ {print $2}'`
disk_used=`df / | awk '/dev/ {print $3}'`

ip=`ifconfig | grep '192.168' | awk '{print $2}'`

echo "mem_total" : ${mem_total},
echo "mem_used" : "${mem_used}",
echo "disk_total" : ${disk_total},
echo "disk_used" : "${disk_used}",
echo "ip" : ${ip}

curl "192.168.2.117:7001/api/engineState/save?ip=${ip}&memoryTotal=${mem_total}&memoryUsed=${mem_used}&diskTotal=${disk_total}&diskUsed=${disk_used}&remark=${remark}"
